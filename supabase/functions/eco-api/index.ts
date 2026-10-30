import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
// @deno-types="npm:@types/nodemailer@6"
import nodemailer from 'npm:nodemailer@8';
import { buildAssessment, cleanText, extractPage, publicUrl } from '../../../api/analysis.js';
import { samplePublicSocial } from '../../../api/social.js';

const jsonHeaders = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
const day = 86_400_000;
const stamp = () => new Date().toISOString();
const expires = () => new Date(Date.now() + 30 * day).toISOString();
const env = (key: string) => Deno.env.get(key) || '';
const answer = (body: unknown, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { ...jsonHeaders, ...headers } });
const error = (message: string, status = 400, headers = {}) => answer({ error: message }, status, headers);
const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), x => x.toString(16).padStart(2, '0')).join('');
const secret = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), x => x.toString(16).padStart(2, '0')).join('');
const need = (...keys: string[]) => keys.every(key => !!env(key));
const db = () => createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });

async function bodyOf(req: Request) {
  if (Number(req.headers.get('content-length') || 0) > 12_000) throw new Error('Request is too large.');
  const raw = await req.text();
  if (raw.length > 12_000) throw new Error('Request is too large.');
  try { return JSON.parse(raw); } catch { throw new Error('Please send valid JSON.'); }
}

function inputOf(value: any) {
  if (!value || typeof value !== 'object') return null;
  for (const field of ['businessName', 'website', 'location', 'businessType', 'mainGoal']) if (typeof value[field] !== 'string' || !value[field].trim()) return null;
  const website = publicUrl(value.website);
  if (!website || !['more-inquiries', 'more-sales', 'better-visibility', 'consistent-content'].includes(value.mainGoal)) return null;
  const socialProfiles = (Array.isArray(value.socialProfiles) ? value.socialProfiles : []).slice(0, 3).filter((p: any) => p && ['instagram', 'facebook', 'tiktok'].includes(p.platform) && publicUrl(p.url)).map((p: any) => ({ platform: p.platform, url: publicUrl(p.url)!.href }));
  return { businessName: cleanText(value.businessName, 100), website: website.href, location: cleanText(value.location, 100), businessType: cleanText(value.businessType, 180), mainGoal: value.mainGoal, socialProfiles };
}

function contactOf(value: any) {
  const name = cleanText(value?.name, 100), email = String(value?.email || '').trim().toLowerCase();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return null;
  return { name, email, marketingConsent: value?.marketingConsent === true };
}

const esc = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const goals: Record<string, string> = { 'more-inquiries': 'More qualified inquiries', 'more-sales': 'More sales from inquiries', 'better-visibility': 'Better search visibility', 'consistent-content': 'More consistent content' };

// Plain HTML with inline styles only, so mail clients keep the layout.
function reportEmail(name: string, report: any, link: string) {
  const b = report.business || {};
  const plan = [['First 30 days', report.plan?.days30], ['Days 31 to 60', report.plan?.days60], ['Days 61 to 90', report.plan?.days90]] as [string, string[]][];
  const text = [
    `Hello ${name},`, '',
    `Here is the ECO scan for ${b.name} (${b.website}).`, `Goal: ${goals[b.goal] || b.goal}`, '',
    'WHAT WE FOUND',
    ...(report.findings || []).map((f: any, i: number) => `${i + 1}. [${f.area}] ${f.title}\n   ${f.observation}\n   Next step: ${f.nextStep}\n   Source: ${f.sourceUrl}`), '',
    'YOUR 30/60/90-DAY PLAN',
    ...plan.flatMap(([label, items]) => [label, ...(items || []).map(x => `- ${x}`), '']),
    'KEYWORD IDEAS TO CHECK', ...(report.keywordIdeas || []).map((k: any) => `- ${k.query}`), '',
    'WHAT THIS SCAN CANNOT SEE', ...(report.unknowns || []).map((u: string) => `- ${u}`), '',
    `Open the report online (private link, valid 30 days): ${link}`, '',
    'You asked for this report on the GTP ECO workshop tool. This email does not subscribe you to marketing.'
  ].join('\n');
  const p = 'margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1d1b16;';
  const h = 'margin:28px 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:2px;color:#8a5a00;';
  const findings = (report.findings || []).map((f: any) => `<div style="margin:0 0 14px 0;padding:14px 16px;border:1px solid #e3dccb;border-radius:8px;background-color:#ffffff;"><p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#8a5a00;">${esc(String(f.area).toUpperCase())} · ${esc(String(f.confidence).toUpperCase())}</p><p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#1d1b16;">${esc(f.title)}</p><p style="${p}">${esc(f.observation)}</p><p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1d1b16;"><b>Next step:</b> ${esc(f.nextStep)} <a href="${esc(f.sourceUrl)}" style="color:#8a5a00;">Source</a></p></div>`).join('');
  const planHtml = plan.map(([label, items]) => `<p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#1d1b16;">${label}</p><ul style="margin:0 0 16px 0;padding-left:20px;">${(items || []).map(x => `<li style="${p}">${esc(x)}</li>`).join('')}</ul>`).join('');
  const list = (items: string[]) => `<ul style="margin:0 0 16px 0;padding-left:20px;">${items.map(x => `<li style="${p}">${esc(x)}</li>`).join('')}</ul>`;
  const html = `<div style="margin:0;padding:24px 12px;background-color:#f5f1e8;"><div style="max-width:620px;margin:0 auto;"><p style="${p}">Hello ${esc(name)},</p><p style="${p}">Here is the ECO scan for <b>${esc(b.name)}</b> (<a href="${esc(b.website)}" style="color:#8a5a00;">${esc(b.website)}</a>). Goal: ${esc(goals[b.goal] || b.goal)}.</p><p style="${h}">WHAT WE FOUND</p>${findings}<p style="${h}">YOUR 30/60/90-DAY PLAN</p>${planHtml}<p style="${h}">KEYWORD IDEAS TO CHECK</p>${list((report.keywordIdeas || []).map((k: any) => k.query))}<p style="${h}">WHAT THIS SCAN CANNOT SEE</p>${list(report.unknowns || [])}<p style="margin:24px 0;"><a href="${esc(link)}" style="display:inline-block;padding:12px 20px;background-color:#1d1b16;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;text-decoration:none;border-radius:6px;">Open the report online</a></p><p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#5c574c;">The online link is private and works for 30 days. You asked for this report on the GTP ECO workshop tool. This email does not subscribe you to marketing.</p></div></div>`;
  return { subject: `Your ECO report for ${b.name}`, text, html };
}

async function sendMail(to: string, content: { subject: string; text: string; html?: string; attachments?: { filename: string; content: Uint8Array; contentType: string }[] }) {
  const port = Number(env('SMTP_PORT') || 465);
  const transport = nodemailer.createTransport({ host: env('SMTP_HOST'), port, secure: port === 465, auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000 });
  const from = env('ECO_MAIL_FROM') || `"${env('SMTP_FROM_NAME') || 'Smart AI Solutions'}" <${env('SMTP_FROM') || env('SMTP_USER')}>`;
  const info = await transport.sendMail({ from, to, ...content });
  return String(info?.messageId || '');
}

// Saves the contact, emails the full report and records the outcome. Returns true when the email went out.
async function deliver(scanId: string, who: { name: string; email: string; marketingConsent: boolean }, report: any) {
  const id = crypto.randomUUID(), token = secret();
  const link = `${env('FRONTEND_REPORT_URL').replace(/#.*$/, '')}#${token}`;
  const { error: insertError } = await db().from('gtp_eco_contacts').insert({ id, scan_id: scanId, name: who.name, email: who.email, marketing_consent: who.marketingConsent, notice_version: env('NOTICE_VERSION'), expires_at: expires(), report_hash: await hash(token), delivery_status: 'pending' });
  if (insertError) throw new Error('Could not save report request.');
  try {
    const messageId = await sendMail(who.email, reportEmail(who.name, report, link));
    await db().from('gtp_eco_contacts').update({ delivery_status: 'sent', provider_message_id: messageId }).eq('id', id);
    return true;
  } catch {
    await db().from('gtp_eco_contacts').update({ delivery_status: 'failed' }).eq('id', id);
    return false;
  }
}

const mailReady = () => need('SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'NOTICE_VERSION', 'FRONTEND_REPORT_URL');

// JOBS_MODE: off = basic email only; owner = PDF jobs only for JOBS_OWNER_EMAILS; all = PDF jobs for everyone.
function pdfJobFor(email: string) {
  const mode = env('JOBS_MODE');
  if (mode === 'all') return true;
  return mode === 'owner' && env('JOBS_OWNER_EMAILS').toLowerCase().split(',').map(x => x.trim()).includes(email);
}

// Records the contact and queues the PDF job. The worker builds the PDF; /v1/jobs/complete emails it.
async function queuePdf(scanId: string, who: { name: string; email: string; marketingConsent: boolean }) {
  const contactId = crypto.randomUUID();
  const { error: contactError } = await db().from('gtp_eco_contacts').insert({ id: contactId, scan_id: scanId, name: who.name, email: who.email, marketing_consent: who.marketingConsent, notice_version: env('NOTICE_VERSION'), expires_at: expires(), report_hash: await hash(secret()), delivery_status: 'queued' });
  if (contactError) throw new Error('Could not save report request.');
  const { data: job, error: jobError } = await db().from('gtp_eco_jobs').insert({ scan_id: scanId, contact_id: contactId }).select('id,created_at').single();
  if (jobError || !job) throw new Error('Could not queue the report.');
  const [{ count }, { data: worker }] = await Promise.all([
    db().from('gtp_eco_jobs').select('id', { count: 'exact', head: true }).in('status', ['queued', 'running']).lt('created_at', job.created_at),
    db().from('gtp_eco_worker').select('seen_at').order('seen_at', { ascending: false }).limit(1).maybeSingle()
  ]);
  return { jobsAhead: count ?? 0, workerSeenAt: worker?.seen_at || null };
}

// Worker hands back a finished (or failed) job. Emails the PDF once, then deletes the stored file.
async function completeJob(req: Request, headers: object) {
  const supplied = (req.headers.get('authorization') || '').replace(/^Bearer /, '');
  if (!env('WORKER_TOKEN') || !supplied || await hash(supplied) !== await hash(env('WORKER_TOKEN'))) return error('Unauthorized.', 401, headers);
  const value = await bodyOf(req);
  if (!/^[0-9a-f-]{36}$/.test(value?.jobId || '')) return error('Missing job id.', 400, headers);
  const { data: job, error: jobError } = await db().from('gtp_eco_jobs').select('id,status,attempts,scan_id,contact_id,gtp_eco_contacts(name,email),gtp_eco_scans(input_json)').eq('id', value.jobId).maybeSingle();
  if (jobError) throw new Error('Job lookup failed.');
  if (!job) return error('Job not found.', 404, headers);
  if (job.status === 'done') return answer({ status: 'done', alreadySent: true }, 200, headers);
  const contact: any = Array.isArray(job.gtp_eco_contacts) ? job.gtp_eco_contacts[0] : job.gtp_eco_contacts;
  const input: any = (Array.isArray(job.gtp_eco_scans) ? job.gtp_eco_scans[0] : job.gtp_eco_scans)?.input_json || {};
  const path = `${job.id}.pdf`;
  if (value.ok !== true) {
    const final = job.attempts >= 3;
    await db().from('gtp_eco_jobs').update({ status: final ? 'failed' : 'queued', error: cleanText(value.error, 500) || 'unknown', finished_at: final ? stamp() : null }).eq('id', job.id);
    if (final) {
      await db().from('gtp_eco_contacts').update({ delivery_status: 'failed' }).eq('id', job.contact_id);
      const owner = env('OWNER_ALERT_EMAIL') || env('SMTP_FROM') || env('SMTP_USER');
      await sendMail(owner, { subject: `GTP report job failed: ${input.businessName || job.id}`, text: `Job ${job.id} for ${input.website || 'unknown site'} failed after ${job.attempts} attempts.\nLast error: ${cleanText(value.error, 500)}\nThe participant was not emailed.` }).catch(() => {});
    }
    return answer({ status: final ? 'failed' : 'requeued' }, 200, headers);
  }
  const { data: file, error: fileError } = await db().storage.from('gtp-eco-reports').download(path);
  if (fileError || !file) return error('PDF not found in storage.', 409, headers);
  const pdf = new Uint8Array(await file.arrayBuffer());
  if (pdf.length < 2000 || String.fromCharCode(...pdf.slice(0, 5)) !== '%PDF-') return error('Stored file is not a valid PDF.', 422, headers);
  const name = cleanText(input.businessName, 80) || 'your business';
  const filename = `${name.replace(/[^\w -]/g, '').trim().replace(/\s+/g, '-') || 'ECO'}-ECO-report.pdf`;
  try {
    const messageId = await sendMail(contact.email, {
      subject: `Your ECO report for ${name}`,
      text: `Hello ${contact.name},\n\nYour ECO report for ${name} is attached as a PDF. It covers what your website says today, how you compare with similar businesses, and what to work on first.\n\nYou asked for this report on the GTP workshop scanner. This email does not subscribe you to marketing.\n\nLoxly\nSmart AI Solutions`,
      attachments: [{ filename, content: pdf, contentType: 'application/pdf' }]
    });
    await db().from('gtp_eco_contacts').update({ delivery_status: 'sent', provider_message_id: messageId }).eq('id', job.contact_id);
    await db().from('gtp_eco_jobs').update({ status: 'done', finished_at: stamp(), error: null }).eq('id', job.id);
  } catch {
    return error('The PDF email could not be sent.', 502, headers);
  }
  await db().storage.from('gtp-eco-reports').remove([path]);
  return answer({ status: 'done' }, 200, headers);
}

async function limited(req: Request, kind: string, max: number) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = await hash(`${env('RATE_LIMIT_SALT')}:${ip}:${kind}`);
  const bucket = new Date(Math.floor(Date.now() / 3_600_000) * 3_600_000).toISOString();
  const { data, error } = await db().rpc('gtp_eco_claim_rate_limit', { p_key: key, p_bucket: bucket, p_limit: max });
  if (error) throw new Error('Rate limit storage unavailable.');
  return data === true;
}

async function dailyBudget() {
  const configured = Number(env('DAILY_SCAN_LIMIT'));
  if (!Number.isInteger(configured) || configured < 1 || configured > 1000) throw new Error('Daily scan budget is not configured.');
  const bucket = `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`;
  const key = await hash(`${env('RATE_LIMIT_SALT')}:global-scan-budget`);
  const { data, error } = await db().rpc('gtp_eco_claim_rate_limit', { p_key: key, p_bucket: bucket, p_limit: configured });
  if (error) throw new Error('Daily budget storage unavailable.');
  return data === true;
}

async function websitePage(url: string, timeout = 20000) {
  const res = await fetch('https://api.firecrawl.dev/v2/scrape', { method: 'POST', headers: { authorization: `Bearer ${env('FIRECRAWL_API_KEY')}`, 'content-type': 'application/json' }, body: JSON.stringify({ url, formats: ['rawHtml', 'markdown'], timeout }), signal: AbortSignal.timeout(timeout + 5000) });
  if (!res.ok) throw new Error(`Website reader returned HTTP ${res.status}.`);
  const response = await res.json();
  if (!response.success || !response.data) throw new Error('The website reader could not read the page.');
  const source = publicUrl(response.data.metadata?.sourceURL || url);
  if (!source) throw new Error('The website reader returned an invalid source.');
  const page = extractPage(response.data.rawHtml || response.data.html || '', source.href);
  page.title ||= cleanText(response.data.metadata?.title, 240);
  page.description ||= cleanText(response.data.metadata?.description, 240);
  page.text ||= cleanText(response.data.markdown, 30000);
  page.source = 'firecrawl-v2';
  return page;
}

async function competitorCandidates(input: any) {
  const host = new URL(input.website).hostname;
  const res = await fetch('https://api.firecrawl.dev/v2/search', { method: 'POST', headers: { authorization: `Bearer ${env('FIRECRAWL_API_KEY')}`, 'content-type': 'application/json' }, body: JSON.stringify({ query: `${input.businessType} ${input.location}`, limit: 5, sources: [{ type: 'web' }], excludeDomains: [host], safe: true, timeout: 12000 }), signal: AbortSignal.timeout(15000) });
  if (!res.ok) return [];
  const response = await res.json();
  return (response.data?.web || []).filter((row: any) => publicUrl(row.url) && new URL(row.url).hostname !== host).slice(0, 2).map((row: any) => ({ title: cleanText(row.title, 100), description: cleanText(row.description, 180), url: publicUrl(row.url)!.href, checkedAt: stamp(), status: 'candidate-needs-owner-confirmation' }));
}

async function scan(req: Request, headers: object) {
  if (!need('FIRECRAWL_API_KEY', 'RATE_LIMIT_SALT', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'DAILY_SCAN_LIMIT') || !mailReady()) return error('The scan service is not fully configured.', 503, headers);
  if (!await limited(req, 'scan', 5)) return error('Scan limit reached for this hour. Please try later.', 429, headers);
  const body = await bodyOf(req);
  const input = inputOf(body);
  if (!input) return error('Check the business name, public website, location, offer and goal.', 400, headers);
  const who = contactOf(body);
  if (!who) return error('Enter your name and a valid email address so we can send the report.', 400, headers);
  if (!await dailyBudget()) return error('Today’s scan capacity is full. Please try again tomorrow.', 429, headers);
  let page;
  try { page = await websitePage(input.website); } catch (e) { return error(`The website could not be read: ${e instanceof Error ? e.message : 'unknown error'}`, 422, headers); }
  const secondaryUrls = (page.internalUrls || []).filter((url): url is string => typeof url === 'string').filter((url) => /\/(service|product|menu|shop|pricing|faq|blog|about|contact)/i.test(new URL(url).pathname)).slice(0, 2);
  const [candidateResult, socialResult, pageResult] = await Promise.allSettled([
    competitorCandidates(input),
    samplePublicSocial(input.socialProfiles, { APIFY_ENABLED: env('APIFY_ENABLED'), APIFY_API_TOKEN: env('APIFY_API_TOKEN'), APIFY_MAX_CHARGE_USD: env('APIFY_MAX_CHARGE_USD') }),
    Promise.allSettled(secondaryUrls.map((url: string) => websitePage(url, 12000)))
  ]);
  const competitors = candidateResult.status === 'fulfilled' ? candidateResult.value : [];
  const social = socialResult.status === 'fulfilled' ? socialResult.value : { samples: [], status: 'The public social sample was unavailable.' };
  const pages = pageResult.status === 'fulfilled' ? pageResult.value.filter((item: PromiseSettledResult<any>) => item.status === 'fulfilled').map((item: PromiseFulfilledResult<any>) => item.value) : [];
  const report = buildAssessment(input, page, { pages, competitors, socialStatus: social.status, socialSamples: social.samples });
  const id = crypto.randomUUID();
  const { error: dbError } = await db().from('gtp_eco_scans').insert({ id, input_json: input, report_json: report, expires_at: expires() });
  if (dbError) throw new Error('Could not save scan.');
  const preview = { scanId: id, summary: report.summary, findings: report.findings.slice(0, 4), unknowns: report.unknowns, checkedAt: report.createdAt, email: who.email };
  if (pdfJobFor(who.email)) return answer({ ...preview, emailed: false, pdfQueued: true, ...await queuePdf(id, who) }, 200, headers);
  const emailed = await deliver(id, who, report);
  return answer({ ...preview, emailed }, 200, headers);
}

// Re-sends the full report for an existing scan, for when the first email did not arrive.
async function reportRequest(req: Request, headers: object) {
  if (!mailReady()) return error('Report delivery is not yet available.', 503, headers);
  if (!await limited(req, 'report', 8)) return error('Report request limit reached for this hour. Please try later.', 429, headers);
  const value = await bodyOf(req);
  const who = contactOf(value);
  if (!who || !/^[0-9a-f-]{36}$/.test(value?.scanId || '')) return error('Check your name and email.', 400, headers);
  const { data: scan, error: lookupError } = await db().from('gtp_eco_scans').select('id,expires_at,report_json').eq('id', value.scanId).maybeSingle();
  if (lookupError) throw new Error('Scan lookup failed.');
  if (!scan || scan.expires_at < stamp()) return error('This scan has expired. Please run it again.', 410, headers);
  if (!await deliver(scan.id, who, scan.report_json)) return error('The report email could not be sent. Please try again later.', 502, headers);
  return answer({ message: 'We sent the full report to the address you entered. Please check your inbox.' }, 200, headers);
}

async function contact(token: string) {
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  const { data, error } = await db().from('gtp_eco_contacts').select('id,scan_id,name,email,marketing_consent,expires_at,delivery_status,gtp_eco_scans(report_json)').eq('report_hash', await hash(token)).maybeSingle();
  if (error) throw new Error('Report lookup failed.');
  return data;
}

async function reportAction(req: Request, path: string, headers: object) {
  const value = await bodyOf(req), row = await contact(String(value?.token || ''));
  if (!row || row.expires_at < stamp()) return error('The private report link is invalid or expired.', 404, headers);
  if (path === '/v1/reports/read') {
    if (row.delivery_status !== 'sent') return error('The report is not ready yet.', 404, headers);
    const scan = Array.isArray(row.gtp_eco_scans) ? row.gtp_eco_scans[0] : row.gtp_eco_scans;
    return answer({ report: scan?.report_json, contact: { name: row.name, marketingConsent: row.marketing_consent }, expiresAt: row.expires_at }, 200, headers);
  }
  if (path === '/v1/reports/opt-out') {
    const { error: updateError } = await db().from('gtp_eco_contacts').update({ marketing_consent: false }).eq('id', row.id);
    if (updateError) throw new Error('Preference update failed.');
    return answer({ message: 'Marketing preference turned off.' }, 200, headers);
  }
  const { error: deleteError } = await db().from('gtp_eco_scans').delete().eq('id', row.scan_id);
  if (deleteError) throw new Error('Deletion failed.');
  return answer({ message: 'Your report and contact record were deleted.' }, 200, headers);
}

async function admin(req: Request, headers: object) {
  if (!env('ADMIN_TOKEN')) return error('Admin access is not configured.', 503, headers);
  const supplied = (req.headers.get('authorization') || '').replace(/^Bearer /, '');
  if (!supplied || await hash(supplied) !== await hash(env('ADMIN_TOKEN'))) return error('Unauthorized.', 401, headers);
  const { data, error: queryError } = await db().from('gtp_eco_contacts').select('id,scan_id,name,email,marketing_consent,notice_version,created_at,expires_at,delivery_status').order('created_at', { ascending: false }).limit(200);
  if (queryError) throw new Error('Admin lookup failed.');
  return answer({ contacts: (data || []).map((row: any) => ({ ...row, marketingConsent: row.marketing_consent })) }, 200, headers);
}

Deno.serve(async req => {
  const origin = req.headers.get('origin');
  const allowed = env('FRONTEND_ORIGIN');
  const headers: Record<string, string> = origin && origin === allowed ? { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type, authorization', vary: 'Origin' } : {};
  if (origin && origin !== allowed) return error('Origin not allowed.', 403, headers);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  const path = new URL(req.url).pathname.replace(/^\/eco-api/, '');
  if (path === '/health' && req.method === 'GET') return answer({ status: 'ok', version: '0.2', collection: env('DATA_COLLECTION_ENABLED') === 'true' }, 200, headers);
  if (env('DATA_COLLECTION_ENABLED') !== 'true') return error('The live scan is not accepting submissions yet.', 503, headers);
  try {
    if (path === '/v1/scans' && req.method === 'POST') return await scan(req, headers);
    if (path === '/v1/reports/request' && req.method === 'POST') return await reportRequest(req, headers);
    if (path === '/v1/jobs/complete' && req.method === 'POST') return await completeJob(req, headers);
    if (['/v1/reports/read', '/v1/reports/opt-out', '/v1/reports/delete'].includes(path) && req.method === 'POST') return await reportAction(req, path, headers);
    if (path === '/v1/admin/contacts' && req.method === 'GET') return await admin(req, headers);
    return error('Route not found.', 404, headers);
  } catch (cause) {
    console.error('GTP request failed', cause instanceof Error ? cause.name : 'unknown');
    return error('The service could not complete this request. Please try again.', 500, headers);
  }
});
