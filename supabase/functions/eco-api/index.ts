import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
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

async function limited(req: Request, kind: string, max: number) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = await hash(`${env('RATE_LIMIT_SALT')}:${ip}:${kind}`);
  const bucket = new Date(Math.floor(Date.now() / 3_600_000) * 3_600_000).toISOString();
  const { data, error } = await db().rpc('gtp_eco_claim_rate_limit', { p_key: key, p_bucket: bucket, p_limit: max });
  if (error) throw new Error('Rate limit storage unavailable.');
  return data === true;
}

async function websitePage(url: string) {
  const res = await fetch('https://api.firecrawl.dev/v2/scrape', { method: 'POST', headers: { authorization: `Bearer ${env('FIRECRAWL_API_KEY')}`, 'content-type': 'application/json' }, body: JSON.stringify({ url, formats: ['rawHtml', 'markdown'], timeout: 20000 }), signal: AbortSignal.timeout(25000) });
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
  if (!need('FIRECRAWL_API_KEY', 'RATE_LIMIT_SALT', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY')) return error('The scan service is not fully configured.', 503, headers);
  if (!await limited(req, 'scan', 5)) return error('Scan limit reached for this hour. Please try later.', 429, headers);
  const input = inputOf(await bodyOf(req));
  if (!input) return error('Check the business name, public website, location, offer and goal.', 400, headers);
  let page;
  try { page = await websitePage(input.website); } catch (e) { return error(`The website could not be read: ${e instanceof Error ? e.message : 'unknown error'}`, 422, headers); }
  const [candidateResult, socialResult] = await Promise.allSettled([
    competitorCandidates(input),
    samplePublicSocial(input.socialProfiles, { APIFY_ENABLED: env('APIFY_ENABLED'), APIFY_API_TOKEN: env('APIFY_API_TOKEN'), APIFY_MAX_CHARGE_USD: env('APIFY_MAX_CHARGE_USD') })
  ]);
  const competitors = candidateResult.status === 'fulfilled' ? candidateResult.value : [];
  const social = socialResult.status === 'fulfilled' ? socialResult.value : { samples: [], status: 'The public social sample was unavailable.' };
  const report = buildAssessment(input, page, { competitors, socialStatus: social.status, socialSamples: social.samples });
  const id = crypto.randomUUID();
  const { error: dbError } = await db().from('gtp_eco_scans').insert({ id, input_json: input, report_json: report, expires_at: expires() });
  if (dbError) throw new Error('Could not save scan.');
  return answer({ scanId: id, summary: report.summary, findings: report.findings.slice(0, 4), unknowns: report.unknowns, checkedAt: report.createdAt }, 200, headers);
}

async function reportRequest(req: Request, headers: object) {
  if (!need('RESEND_API_KEY', 'MAIL_FROM', 'NOTICE_VERSION', 'FRONTEND_REPORT_URL')) return error('Report delivery is not yet available.', 503, headers);
  if (!await limited(req, 'report', 8)) return error('Report request limit reached for this hour. Please try later.', 429, headers);
  const value = await bodyOf(req);
  const name = cleanText(value?.name, 100), email = String(value?.email || '').trim().toLowerCase();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || typeof value?.marketingConsent !== 'boolean' || value?.noticeVersion !== env('NOTICE_VERSION') || !/^[0-9a-f-]{36}$/.test(value?.scanId || '')) return error('Check your name, email and notice version.', 400, headers);
  const { data: scan, error: lookupError } = await db().from('gtp_eco_scans').select('id,expires_at').eq('id', value.scanId).maybeSingle();
  if (lookupError) throw new Error('Scan lookup failed.');
  if (!scan || scan.expires_at < stamp()) return error('This scan has expired. Please run it again.', 410, headers);
  const id = crypto.randomUUID(), token = secret();
  const link = `${env('FRONTEND_REPORT_URL').replace(/#.*$/, '')}#${token}`;
  const { error: insertError } = await db().from('gtp_eco_contacts').insert({ id, scan_id: value.scanId, name, email, marketing_consent: value.marketingConsent, notice_version: env('NOTICE_VERSION'), expires_at: expires(), report_hash: await hash(token), delivery_status: 'pending' });
  if (insertError) throw new Error('Could not save report request.');
  try {
    const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env('RESEND_API_KEY')}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: env('MAIL_FROM'), to: [email], subject: 'Your GTP ECO business report', text: `Hello ${name},\n\nYour ECO report is ready. Open this private link within 30 days:\n${link}\n\nYou requested this report after scanning your business. This email does not subscribe you to marketing.\n\nIf you did not request it, ignore this message.` }) });
    if (!res.ok) throw new Error(`Email provider returned HTTP ${res.status}.`);
    const sent = await res.json();
    const { error: updateError } = await db().from('gtp_eco_contacts').update({ delivery_status: 'sent', provider_message_id: String(sent.id || '') }).eq('id', id);
    if (updateError) throw new Error('Delivery state could not be saved.');
  } catch {
    await db().from('gtp_eco_contacts').delete().eq('id', id);
    return error('The report email could not be sent. Please try again later.', 502, headers);
  }
  return answer({ message: 'We sent a private report link to the address you entered. Please check your inbox.' }, 200, headers);
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
    if (['/v1/reports/read', '/v1/reports/opt-out', '/v1/reports/delete'].includes(path) && req.method === 'POST') return await reportAction(req, path, headers);
    if (path === '/v1/admin/contacts' && req.method === 'GET') return await admin(req, headers);
    return error('Route not found.', 404, headers);
  } catch (cause) {
    console.error('GTP request failed', cause instanceof Error ? cause.name : 'unknown');
    return error('The service could not complete this request. Please try again.', 500, headers);
  }
});
