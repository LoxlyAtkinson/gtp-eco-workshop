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
  insertRequest: (row: { name: string; email: string; consent: true }) => Promise<string>;
  signUrl: (bucket: string, path: string, seconds: number) => Promise<string>;
  sendEmail: (message: OutgoingEmail, idempotencyKey: string) => Promise<string>;
  markDelivery: (id: string, status: 'sent' | 'failed', messageId?: string) => Promise<void>;
  log: (event: string, fields: Record<string, unknown>) => void;
  now?: () => number;
};

export type OutgoingEmail = { from: string; to: string[]; subject: string; text: string; html: string; reply_to?: string };
export type Valid = { name: string; email: string; honeypot: boolean };

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
  return { ok: true, value: { name, email, honeypot } };
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

// Plain text has no markdown. HTML uses inline styles on every element, no <style> block, contrast above 4.5:1.
export function emailContent(name: string, link: string, guideUrl: string) {
  const subject = 'Your marketing skills pack';
  const text = [
    `Hi ${name},`,
    '',
    'Here is your marketing skills pack from the GTP ECO workshop:',
    link,
    '',
    'The link works for 7 days. The pack is a zip with eight free marketing skills written by Anthropic.',
    '',
    'The 7-day guide shows where to install them and what to try each day:',
    guideUrl,
    '',
    'You get this email because you asked for the pack. We will not send you anything else.',
    '',
    'GTP ECO workshop',
  ].join('\n');
  const n = escapeHtml(name), l = escapeHtml(link), g = escapeHtml(guideUrl);
  const font = "font-family:Arial,Helvetica,sans-serif;";
  const html = `<!doctype html><html lang="en"><body style="margin:0;padding:0;background-color:#f6f0e4;">`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f0e4;border-collapse:collapse;">`
    + `<tr><td align="center" style="padding:24px 12px;">`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#fffaf1;border-collapse:collapse;border:1px solid #e3d8c6;">`
    + `<tr><td style="padding:28px 24px 8px 24px;${font}font-size:12px;line-height:16px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#8a4413;">GTP ECO workshop</td></tr>`
    + `<tr><td style="padding:4px 24px 12px 24px;${font}font-size:26px;line-height:32px;font-weight:bold;color:#1e1a17;">Your marketing skills pack</td></tr>`
    + `<tr><td style="padding:0 24px 16px 24px;${font}font-size:16px;line-height:24px;color:#1e1a17;">Hi ${n}, here is the pack you asked for: eight free marketing skills written by Anthropic, in one zip.</td></tr>`
    + `<tr><td style="padding:4px 24px 20px 24px;"><a href="${l}" style="display:inline-block;padding:14px 22px;background-color:#a8541a;color:#ffffff;${font}font-size:16px;line-height:20px;font-weight:bold;text-decoration:none;border-radius:999px;">Download the pack</a></td></tr>`
    + `<tr><td style="padding:0 24px 16px 24px;${font}font-size:14px;line-height:21px;color:#5c544b;">The link works for 7 days. If the button does not work, copy this address into your browser:<br><a href="${l}" style="color:#1e1a17;text-decoration:underline;word-break:break-all;">${l}</a></td></tr>`
    + `<tr><td style="padding:0 24px 20px 24px;${font}font-size:16px;line-height:24px;color:#1e1a17;">Not sure where to start? <a href="${g}" style="color:#1e1a17;font-weight:bold;text-decoration:underline;">Read the 7-day guide</a>. It shows where to install the skills and what to try each day.</td></tr>`
    + `<tr><td style="padding:16px 24px 24px 24px;border-top:1px solid #e3d8c6;${font}font-size:13px;line-height:19px;color:#5c544b;">You get this email because you asked for the pack. We will not send you anything else.</td></tr>`
    + `</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

async function sha256(value: string) {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export function missingConfig(env: (k: string) => string) {
  const from = env('SKILLS_MAIL_FROM') || env('MAIL_FROM');
  const missing = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'RATE_LIMIT_SALT'].filter(k => !env(k));
  if (!from) missing.push('SKILLS_MAIL_FROM');
  return missing;
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
  const { name, email, honeypot } = checked.value;
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
    const id = await deps.insertRequest({ name, email, consent: true });
    let link: string;
    try {
      link = await deps.signUrl(env('SKILLS_BUCKET') || 'skills-pack', env('SKILLS_OBJECT') || 'anthropic-marketing-skills.zip', LINK_SECONDS);
    } catch (cause) {
      await deps.markDelivery(id, 'failed').catch(() => {});
      deps.log('skills_request_sign_failed', { requestId, id, reason: cause instanceof Error ? cause.message : 'unknown' });
      return fail('SIGN_FAILED', 'We could not make your download link. Download the pack on this page instead.', 502, h);
    }
    const content = emailContent(name, link, env('SKILLS_GUIDE_URL') || DEFAULT_GUIDE);
    const message: OutgoingEmail = { from: env('SKILLS_MAIL_FROM') || env('MAIL_FROM'), to: [email], ...content };
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
    return fail('SERVER', 'Something went wrong on our side. Download the pack on this page instead.', 500, h);
  }
}
