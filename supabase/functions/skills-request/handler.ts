// Skills pack email request: validate -> rate limit -> save -> sign a 7-day link -> email it.
// Pure request logic with injected dependencies, so it is testable without Supabase or Resend.
// index.ts wires the real Supabase client and the Resend API.

export const LINK_SECONDS = 7 * 24 * 60 * 60;
export const IP_LIMIT_PER_HOUR = 10;
export const EMAIL_LIMIT_PER_DAY = 3;
const MAX_BODY = 4000;

export type Deps = {
  env: (key: string) => string;
  claimIpLimit: (key: string, bucket: string, limit: number) => Promise<boolean>;
  recentCount: (email: string, sinceIso: string) => Promise<number>;
  insertRequest: (row: { name: string; email: string; consent: true } & Feedback) => Promise<string>;
  signUrl: (bucket: string, path: string, seconds: number) => Promise<string>;
  sendEmail: (message: OutgoingEmail, idempotencyKey: string) => Promise<string>;
  markDelivery: (id: string, status: 'sent' | 'failed', messageId?: string) => Promise<void>;
  log: (event: string, fields: Record<string, unknown>) => void;
  now?: () => number;
};

export type OutgoingEmail = { from: string; to: string[]; subject: string; text: string; html: string; reply_to?: string };
export type Feedback = { feedback_takeaway?: string; feedback_change?: string; feedback_value?: string };
export type Valid = { name: string; email: string; honeypot: boolean; feedback: Feedback };
export const VALUE_CHOICES = ['yes-both', 'yes-business', 'yes-me', 'some', 'no'];
export const HELP_URL = 'https://www.smartaisolutions.co.za/contact';

const json = (body: unknown, status: number, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
const fail = (code: string, error: string, status: number, headers: Record<string, string>) => json({ ok: false, code, error }, status, headers);

export const DEFAULT_ORIGINS = 'https://loxlyatkinson.github.io';
export const DEFAULT_GUIDE = 'https://loxlyatkinson.github.io/gtp-eco-workshop/skills/guide/';

export function corsHeaders(origin: string | null, allowedList: string): { allowed: boolean; headers: Record<string, string> } {
  const allowed = allowedList.split(',').map(s => s.trim()).filter(Boolean);
  if (!origin) return { allowed: true, headers: {} };
  if (!allowed.includes(origin)) return { allowed: false, headers: {} };
  return { allowed: true, headers: { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type', 'access-control-max-age': '600', vary: 'Origin' } };
}

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]{0,39}$/u;
const EMAIL_RE = /^[^\s@<>"',;:()[\]\\]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

export function validate(value: unknown): { ok: true; value: Valid } | { ok: false; field: string; error: string } {
  if (!value || typeof value !== 'object') return { ok: false, field: 'body', error: 'Send the form as JSON.' };
  const v = value as Record<string, unknown>;
  const honeypot = typeof v.company === 'string' && v.company.trim() !== '';
  const name = typeof v.firstName === 'string' ? v.firstName.normalize('NFC').replace(/\s+/g, ' ').trim() : '';
  if (!name || name.length > 40 || !NAME_RE.test(name)) return { ok: false, field: 'firstName', error: 'Type your first name, using letters only.' };
  const email = typeof v.email === 'string' ? v.email.trim().toLowerCase() : '';
  if (email.length < 6 || email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, field: 'email', error: 'That email address does not look right.' };
  if (v.consent !== true) return { ok: false, field: 'consent', error: 'Tick the box so we may email you the link.' };
  // Session feedback is optional. Long answers are refused, not cut.
  const text = (k: string) => typeof v[k] === 'string' ? (v[k] as string).normalize('NFC').trim() : '';
  const feedback: Feedback = {};
  for (const [k, col] of [['takeaway', 'feedback_takeaway'], ['change', 'feedback_change']] as const) {
    const t = text(k);
    if (t.length > 600) return { ok: false, field: k, error: 'Please keep this under 600 characters.' };
    if (t) feedback[col] = t;
  }
  const worth = text('value');
  if (worth && !VALUE_CHOICES.includes(worth)) return { ok: false, field: 'value', error: 'Pick one of the options.' };
  if (worth) feedback.feedback_value = worth;
  return { ok: true, value: { name, email, honeypot, feedback } };
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

// The how-to guide that travels in every email: install once, then the stage demo as copy-paste prompts.
export const INSTALL_STEPS = [
  'Open claude.ai on a computer and sign in. The free plan works.',
  'Go to Settings, then Capabilities. Switch on "Code execution and file creation".',
  'Go to Customize, then Skills. Click +, then "Create skill", then "Upload a skill".',
  "Open the upload-to-claude folder in your zip. Upload one zip at a time. Don't unzip them.",
];
export const DEMO_PROMPTS: [string, string][] = [
  ['Know your website', "Use the seo-audit skill on [yourwebsite.co.za]. Tell me what I sell, who it's for, and the 5 things to fix first so people in South Africa find me on Google."],
  ['Know your competitors', "Use the competitive-brief skill. Find the businesses in South Africa that sell what I sell to the same people. For each one: what they say, what they charge, and one thing they do that I don't."],
  ['Know what people are saying', 'Use the smart-ai-trends skill on [your product]. What are people asking about this month?'],
  ['Make a 30-day plan', 'Use the campaign-plan skill. Using my website, my competitors and what people are saying, make a 30-day plan. 5 steps. One platform. One number to check every Friday.'],
  ['Get ad ideas', 'Use the smart-ai-ad-ideas skill. Give me 5 ad ideas for [one product]. Each one needs a hook, the words on the ad, and why it beats the competitors above.'],
  ['Make it sound like you', 'Use the smart-ai-unslop skill on idea number [2]. Take out anything that sounds like AI wrote it. Keep the facts.'],
  ['Write the ad and the follow-up', 'Use the draft-content skill to write the final ad for Instagram. Then use the email-sequence skill to write 3 follow-up emails for people who reply.'],
  ['Build your follow-up funnel', 'Use the smart-ai-funnels skill. Map my sales funnel and my support funnel, then write every WhatsApp and email message in order.'],
];

// Plain text has no markdown. HTML uses inline styles on every element, no <style> block, contrast above 4.5:1.
export function emailContent(name: string, link: string, guideUrl: string) {
  const subject = 'Your free marketing skills, and how to use them';
  const text = [
    `Hi ${name},`,
    '',
    'Here are your free skills from the GTP ECO workshop: 4 Smart AI Solutions skills from the live demo, plus 8 by Anthropic.',
    '',
    'Download them here (the link works for 7 days):',
    link,
    '',
    'PUT THE SKILLS INTO CLAUDE (once, about 3 minutes per skill)',
    ...INSTALL_STEPS.map((s, i) => `${i + 1}. ${s}`),
    '',
    'RUN THE STAGE DEMO ON YOUR OWN BUSINESS',
    'Do these in one chat, in this order. Swap the words in [brackets] for your own.',
    '',
    ...DEMO_PROMPTS.flatMap(([title, prompt], i) => [`Step ${i + 1}. ${title}`, `"${prompt}"`, '']),
    'The same guide is in the zip as HOW-TO-USE.txt. More ideas for each day:',
    guideUrl,
    '',
    'Need help installing the skills or setting this up for your business? Contact us:',
    HELP_URL,
    '',
    'You get this email because you asked for the skills. We will not send you anything else.',
    '',
    'Smart AI Solutions, for the GTP ECO workshop',
  ].join('\n');
  const n = escapeHtml(name), l = escapeHtml(link), g = escapeHtml(guideUrl);
  const font = "font-family:Arial,Helvetica,sans-serif;";
  const row = (inner: string, pad = '0 28px 16px 28px') => `<tr><td style="padding:${pad};${font}font-size:16px;line-height:24px;color:#1e1a17;">${inner}</td></tr>`;
  const heading = (s: string) => `<tr><td style="padding:24px 28px 10px 28px;border-top:1px solid #e3d8c6;${font}font-size:13px;line-height:18px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#8a4413;">${s}</td></tr>`;
  const install = INSTALL_STEPS.map((s, i) => `<tr><td style="padding:0 28px 10px 28px;${font}font-size:15px;line-height:22px;color:#1e1a17;"><span style="display:inline-block;width:22px;font-weight:bold;color:#8a4413;">${i + 1}.</span>${escapeHtml(s)}</td></tr>`).join('');
  const prompts = DEMO_PROMPTS.map(([title, prompt], i) =>
    `<tr><td style="padding:0 28px 14px 28px;">`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:#f6f0e4;border-left:3px solid #a8541a;">`
    + `<tr><td style="padding:12px 14px 4px 14px;${font}font-size:14px;line-height:20px;font-weight:bold;color:#1e1a17;">Step ${i + 1}. ${escapeHtml(title)}</td></tr>`
    + `<tr><td style="padding:0 14px 12px 14px;${font}font-size:14px;line-height:21px;color:#3d3630;">"${escapeHtml(prompt)}"</td></tr>`
    + `</table></td></tr>`).join('');
  const html = `<!doctype html><html lang="en"><body style="margin:0;padding:0;background-color:#f6f0e4;">`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f0e4;border-collapse:collapse;">`
    + `<tr><td align="center" style="padding:24px 12px;">`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#fffaf1;border-collapse:collapse;border:1px solid #e3d8c6;">`
    + `<tr><td style="padding:28px 28px 8px 28px;${font}font-size:12px;line-height:16px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#8a4413;">Smart AI Solutions · GTP ECO workshop</td></tr>`
    + `<tr><td style="padding:4px 28px 12px 28px;${font}font-size:26px;line-height:32px;font-weight:bold;color:#1e1a17;">Your free marketing skills</td></tr>`
    + row(`Hi ${n}, here they are: 4 Smart AI Solutions skills from the live demo, plus 8 by Anthropic, in one zip.`)
    + `<tr><td style="padding:4px 28px 12px 28px;"><a href="${l}" style="display:inline-block;padding:14px 24px;background-color:#a8541a;color:#ffffff;${font}font-size:16px;line-height:20px;font-weight:bold;text-decoration:none;border-radius:999px;">Download the skills</a></td></tr>`
    + `<tr><td style="padding:0 28px 8px 28px;${font}font-size:13px;line-height:19px;color:#5c544b;">The link works for 7 days. Button not working? Copy this address into your browser:<br><a href="${l}" style="color:#1e1a17;text-decoration:underline;word-break:break-all;">${l}</a></td></tr>`
    + heading('Put the skills into Claude')
    + install
    + heading('Run the stage demo on your own business')
    + row('Do these in one chat, in this order. Swap the words in [brackets] for your own.', '0 28px 14px 28px')
    + prompts
    + row(`The same guide is in the zip as HOW-TO-USE.txt. <a href="${g}" style="color:#1e1a17;font-weight:bold;text-decoration:underline;">More ideas for each day</a>.`, '6px 28px 20px 28px')
    + row(`Need help installing the skills or setting this up for your business? <a href="${HELP_URL}" style="color:#1e1a17;font-weight:bold;text-decoration:underline;">Contact Smart AI Solutions</a>.`, '0 28px 20px 28px')
    + `<tr><td style="padding:16px 28px 24px 28px;border-top:1px solid #e3d8c6;${font}font-size:13px;line-height:19px;color:#5c544b;">You get this email because you asked for the skills. We will not send you anything else.</td></tr>`
    + `</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

async function sha256(value: string) {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export function missingConfig(env: (k: string) => string) {
  return ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'RATE_LIMIT_SALT'].filter(k => !env(k));
}

// Same sender as the Smart AI Solutions website: SMTP_FROM (else SMTP_USER) and SMTP_FROM_NAME. SKILLS_MAIL_FROM overrides.
export function mailFrom(env: (k: string) => string) {
  return env('SKILLS_MAIL_FROM') || `"${env('SMTP_FROM_NAME') || 'Smart AI Solutions'}" <${env('SMTP_FROM') || env('SMTP_USER')}>`;
}

export async function handle(req: Request, deps: Deps): Promise<Response> {
  const requestId = crypto.randomUUID();
  const { env } = deps;
  const now = deps.now ?? Date.now;
  const cors = corsHeaders(req.headers.get('origin'), env('SKILLS_ALLOWED_ORIGINS') || DEFAULT_ORIGINS);
  const h = { ...cors.headers, 'x-request-id': requestId };
  if (!cors.allowed) return fail('ORIGIN', 'This site may not use the form.', 403, h);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
  const path = new URL(req.url).pathname;
  if (req.method === 'GET' && path.endsWith('/health')) return json({ ok: true, configured: missingConfig(env).length === 0 }, 200, h);
  if (req.method !== 'POST') return fail('METHOD', 'Use POST.', 405, h);
  const missing = missingConfig(env);
  if (missing.length) {
    deps.log('skills_request_not_configured', { requestId, missing });
    return fail('NOT_CONFIGURED', 'Email delivery is not switched on yet. Download the pack on this page instead.', 503, h);
  }
  if (Number(req.headers.get('content-length') || 0) > MAX_BODY) return fail('TOO_LARGE', 'The request is too large.', 413, h);
  const raw = await req.text();
  if (raw.length > MAX_BODY) return fail('TOO_LARGE', 'The request is too large.', 413, h);
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return fail('BAD_JSON', 'Send the form as JSON.', 400, h); }
  const checked = validate(body);
  if (!checked.ok) return json({ ok: false, code: 'INVALID', field: checked.field, error: checked.error }, 400, h);
  const { name, email, honeypot, feedback } = checked.value;
  if (honeypot) {
    deps.log('skills_request_honeypot', { requestId });
    return json({ ok: true, sent: true }, 200, h);
  }
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const hourBucket = new Date(Math.floor(now() / 3_600_000) * 3_600_000).toISOString();
    if (!await deps.claimIpLimit(await sha256(`${env('RATE_LIMIT_SALT')}:${ip}:skills-request`), hourBucket, IP_LIMIT_PER_HOUR)) {
      deps.log('skills_request_ip_limited', { requestId });
      return fail('RATE_LIMIT', 'Too many requests from this network. Download the pack on this page instead.', 429, h);
    }
    if (await deps.recentCount(email, new Date(now() - 86_400_000).toISOString()) >= EMAIL_LIMIT_PER_DAY) {
      deps.log('skills_request_email_limited', { requestId });
      return fail('RATE_LIMIT', 'This address already asked for the pack today. Check your inbox, or download it on this page.', 429, h);
    }
    const id = await deps.insertRequest({ name, email, consent: true, ...feedback });
    let link: string;
    try {
      link = await deps.signUrl(env('SKILLS_BUCKET') || 'skills-pack', env('SKILLS_OBJECT') || 'gtp-workshop-skills.zip', LINK_SECONDS);
    } catch (cause) {
      await deps.markDelivery(id, 'failed').catch(() => {});
      deps.log('skills_request_sign_failed', { requestId, id, reason: cause instanceof Error ? cause.message : 'unknown' });
      return fail('SIGN_FAILED', 'We could not make your download link. Download the pack on this page instead.', 502, h);
    }
    const content = emailContent(name, link, env('SKILLS_GUIDE_URL') || DEFAULT_GUIDE);
    const message: OutgoingEmail = { from: mailFrom(env), to: [email], ...content };
    if (env('SKILLS_REPLY_TO')) message.reply_to = env('SKILLS_REPLY_TO');
    try {
      const messageId = await deps.sendEmail(message, `skills-request/${id}`);
      await deps.markDelivery(id, 'sent', messageId);
      deps.log('skills_request_sent', { requestId, id });
      return json({ ok: true, sent: true }, 200, h);
    } catch (cause) {
      await deps.markDelivery(id, 'failed').catch(() => {});
      deps.log('skills_request_send_failed', { requestId, id, reason: cause instanceof Error ? cause.message : 'unknown' });
      return fail('SEND_FAILED', 'We could not send the email. Download the pack on this page instead.', 502, h);
    }
  } catch (cause) {
    deps.log('skills_request_error', { requestId, reason: cause instanceof Error ? cause.message : 'unknown' });
    return fail('SERVER', 'Something went wrong on our side. Please try again in a minute.', 500, h);
  }
}
