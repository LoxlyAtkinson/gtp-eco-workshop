// Supabase Edge Function: POST /functions/v1/skills-request
// Body: {firstName, email, consent: true, company: ''}  (company is a hidden honeypot field)
// Secrets (supabase secrets set): RESEND_API_KEY, SKILLS_MAIL_FROM, RATE_LIMIT_SALT.
// Optional: SKILLS_ALLOWED_ORIGINS, SKILLS_BUCKET, SKILLS_OBJECT, SKILLS_GUIDE_URL, SKILLS_REPLY_TO.
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by the platform. Nothing here logs secrets or addresses.
import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
import { handle, type Deps } from './handler.ts';

const env = (key: string) => Deno.env.get(key) || '';
const db = () => createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });

const deps: Deps = {
  env,
  async claimIpLimit(key, bucket, limit) {
    const { data, error } = await db().rpc('gtp_eco_claim_rate_limit', { p_key: key, p_bucket: bucket, p_limit: limit });
    if (error) throw new Error('Rate limit storage unavailable.');
    return data === true;
  },
  async recentCount(email, sinceIso) {
    const { count, error } = await db().from('skills_requests').select('id', { count: 'exact', head: true }).eq('email', email).gte('created_at', sinceIso);
    if (error) throw new Error('Request history lookup failed.');
    return count ?? 0;
  },
  async insertRequest(row) {
    const { data, error } = await db().from('skills_requests').insert(row).select('id').single();
    if (error || !data) throw new Error('Could not save the request.');
    return data.id as string;
  },
  async signUrl(bucket, path, seconds) {
    const { data, error } = await db().storage.from(bucket).createSignedUrl(path, seconds, { download: 'anthropic-marketing-skills.zip' });
    if (error || !data?.signedUrl) throw new Error('Storage could not sign the pack link.');
    return data.signedUrl;
  },
  async sendEmail(message, idempotencyKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env('RESEND_API_KEY')}`, 'content-type': 'application/json', 'idempotency-key': idempotencyKey },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Email provider returned HTTP ${res.status}.`);
    const sent = await res.json().catch(() => ({}));
    return String(sent?.id || '');
  },
  async markDelivery(id, status, messageId) {
    const { error } = await db().from('skills_requests').update({ delivery_status: status, provider_message_id: messageId || null }).eq('id', id);
    if (error) throw new Error('Delivery state could not be saved.');
  },
  log(event, fields) {
    console.log(JSON.stringify({ event, ...fields }));
  },
};

Deno.serve(req => handle(req, deps));
