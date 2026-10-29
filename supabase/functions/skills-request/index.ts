// Supabase Edge Function: POST /functions/v1/skills-request
// Body: {firstName, email, consent: true, company: ''}  (company is a hidden honeypot field)
// Email goes out over the same SMTP account as the Smart AI Solutions website (project secrets
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_FROM_NAME). Also needs RATE_LIMIT_SALT.
// Optional: SKILLS_MAIL_FROM, SKILLS_ALLOWED_ORIGINS, SKILLS_BUCKET, SKILLS_OBJECT, SKILLS_GUIDE_URL, SKILLS_REPLY_TO.
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by the platform. Nothing here logs secrets or addresses.
import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
// @deno-types="npm:@types/nodemailer@6"
import nodemailer from 'npm:nodemailer@8';
import { handle, type Deps } from './handler.ts';

const env = (key: string) => Deno.env.get(key) || '';
const db = () => createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });

const deps: Deps = {
  env,
  async claimIpLimit(key, bucket, limit) {
    const { data, error } = await db().rpc('gtp_eco_claim_rate_limit', { p_key: key, p_bucket: bucket, p_limit: limit });
    if (error) throw new Error(`Rate limit storage unavailable (${error.code || 'no code'}).`);
    return data === true;
  },
  async recentCount(email, sinceIso) {
    const { count, error } = await db().from('skills_requests').select('id', { count: 'exact', head: true }).eq('email', email).gte('created_at', sinceIso);
    if (error) throw new Error(`Request history lookup failed (${error.code || 'no code'}).`);
    return count ?? 0;
  },
  async insertRequest(row) {
    const { data, error } = await db().from('skills_requests').insert(row).select('id').single();
    if (error || !data) throw new Error(`Could not save the request (${error?.code || 'no row'}).`);
    return data.id as string;
  },
  async signUrl(bucket, path, seconds) {
    const { data, error } = await db().storage.from(bucket).createSignedUrl(path, seconds, { download: 'gtp-workshop-skills.zip' });
    if (error || !data?.signedUrl) throw new Error('Storage could not sign the pack link.');
    return data.signedUrl;
  },
  async sendEmail(message, idempotencyKey) {
    const port = Number(env('SMTP_PORT') || 465);
    const transport = nodemailer.createTransport({
      host: env('SMTP_HOST'), port, secure: port === 465,
      auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    });
    const info = await transport.sendMail({
      from: message.from, to: message.to, subject: message.subject, text: message.text, html: message.html,
      replyTo: message.reply_to, messageId: `<${idempotencyKey.replace(/[^\w.-]/g, '-')}@gtp-skills>`,
    }).catch(() => { throw new Error('SMTP send failed.'); });
    return String(info?.messageId || '');
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
