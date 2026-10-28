// Run: deno test --no-remote supabase/functions/skills-request/handler.test.ts
// Test fixtures only: fake Supabase and fake Resend. No network.
import { handle, validate, emailContent, LINK_SECONDS, type Deps, type OutgoingEmail } from './handler.ts';

function assert(cond: unknown, msg: string) { if (!cond) throw new Error(msg); }
function eq(a: unknown, b: unknown, msg: string) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); }

const CONFIG: Record<string, string> = {
  SUPABASE_URL: 'https://fixture.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'fixture-service', RESEND_API_KEY: 'fixture-resend',
  SKILLS_MAIL_FROM: 'GTP <skills@example.test>', RATE_LIMIT_SALT: 'fixture-salt',
};

function fakeDeps(over: Partial<Deps> = {}, envOver: Record<string, string> = {}) {
  const calls = { inserted: [] as unknown[], sent: [] as { message: OutgoingEmail; key: string }[], marks: [] as unknown[], signed: [] as unknown[], logs: [] as { event: string; fields: Record<string, unknown> }[] };
  const env = { ...CONFIG, ...envOver };
  const deps: Deps = {
    env: k => env[k] ?? '',
    claimIpLimit: async () => true,
    recentCount: async () => 0,
    insertRequest: async row => { calls.inserted.push(row); return 'row-1'; },
    signUrl: async (bucket, path, seconds) => { calls.signed.push({ bucket, path, seconds }); return 'https://fixture.supabase.co/storage/v1/object/sign/skills-pack/anthropic-marketing-skills.zip?token=t'; },
    sendEmail: async (message, key) => { calls.sent.push({ message, key }); return 'msg-1'; },
    markDelivery: async (id, status, messageId) => { calls.marks.push({ id, status, messageId }); },
    log: (event, fields) => { calls.logs.push({ event, fields }); },
    ...over,
  };
  return { deps, calls };
}

const post = (body: unknown, origin = 'https://loxlyatkinson.github.io') =>
  new Request('https://fixture.supabase.co/skills-request', { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const good = { firstName: 'Thandi', email: ' Thandi@Example.CO.ZA ', consent: true, company: '' };

Deno.test('valid request saves, signs a 7-day link, emails it and marks it sent', async () => {
  const { deps, calls } = fakeDeps();
  const res = await handle(post(good), deps);
  eq(res.status, 200, 'status');
  eq(await res.json(), { ok: true, sent: true }, 'body');
  eq(res.headers.get('access-control-allow-origin'), 'https://loxlyatkinson.github.io', 'cors');
  eq(calls.inserted, [{ name: 'Thandi', email: 'thandi@example.co.za', consent: true }], 'insert');
  eq(calls.signed, [{ bucket: 'skills-pack', path: 'anthropic-marketing-skills.zip', seconds: LINK_SECONDS }], 'signed');
  eq(LINK_SECONDS, 604800, '7 days');
  eq(calls.sent.length, 1, 'one email');
  eq(calls.sent[0].message.to, ['thandi@example.co.za'], 'to');
  eq(calls.sent[0].message.from, 'GTP <skills@example.test>', 'from is configurable');
  eq(calls.sent[0].key, 'skills-request/row-1', 'idempotency key');
  eq(calls.marks, [{ id: 'row-1', status: 'sent', messageId: 'msg-1' }], 'marked sent');
  const logged = JSON.stringify(calls.logs);
  assert(!logged.includes('thandi') && !logged.includes('fixture-resend'), 'logs carry no address or secret');
});

Deno.test('missing config returns 503 NOT_CONFIGURED and touches nothing', async () => {
  const { deps, calls } = fakeDeps({}, { RESEND_API_KEY: '' });
  const res = await handle(post(good), deps);
  eq(res.status, 503, 'status');
  eq((await res.json()).code, 'NOT_CONFIGURED', 'code');
  eq(calls.inserted.length + calls.sent.length, 0, 'no side effects');
  assert(!JSON.stringify(calls.logs).includes('fixture'), 'log names missing keys, never values');
});

Deno.test('origin outside the allow list is refused', async () => {
  const { deps, calls } = fakeDeps();
  const res = await handle(post(good, 'https://evil.example'), deps);
  eq(res.status, 403, 'status');
  eq(calls.inserted.length, 0, 'no insert');
});

Deno.test('OPTIONS preflight from the allowed origin returns 204 with CORS', async () => {
  const { deps } = fakeDeps();
  const res = await handle(new Request('https://fixture.supabase.co/skills-request', { method: 'OPTIONS', headers: { origin: 'https://loxlyatkinson.github.io' } }), deps);
  eq(res.status, 204, 'status');
  eq(res.headers.get('access-control-allow-methods'), 'POST, OPTIONS', 'methods');
});

Deno.test('validation rejects bad name, bad email and missing consent', async () => {
  eq(validate({ ...good, firstName: '' }).ok, false, 'empty name');
  eq(validate({ ...good, firstName: 'http://spam.example' }).ok, false, 'url in name');
  eq(validate({ ...good, firstName: 'A'.repeat(41) }).ok, false, 'long name');
  eq(validate({ ...good, email: 'not-an-email' }).ok, false, 'bad email');
  eq(validate({ ...good, email: 'a@b.c<script>' }).ok, false, 'markup in email');
  eq(validate({ ...good, consent: 'yes' }).ok, false, 'consent must be true');
  eq(validate({ ...good, firstName: "Zoë-Mari O'Neil" }).ok, true, 'accents, hyphen, apostrophe');
  const { deps, calls } = fakeDeps();
  const res = await handle(post({ ...good, consent: false }), deps);
  eq(res.status, 400, 'status');
  eq((await res.json()).field, 'consent', 'field');
  eq(calls.inserted.length, 0, 'no insert');
  const bad = await handle(post('{not json'), deps);
  eq(bad.status, 400, 'bad json');
});

Deno.test('honeypot answers like success but saves and sends nothing', async () => {
  const { deps, calls } = fakeDeps();
  const res = await handle(post({ ...good, company: 'Spam Co' }), deps);
  eq(res.status, 200, 'status');
  eq(calls.inserted.length + calls.sent.length, 0, 'no side effects');
});

Deno.test('rate limits by network and by address', async () => {
  const ip = fakeDeps({ claimIpLimit: async () => false });
  eq((await handle(post(good), ip.deps)).status, 429, 'ip limit');
  eq(ip.calls.inserted.length, 0, 'no insert on ip limit');
  const addr = fakeDeps({ recentCount: async () => 3 });
  const res = await handle(post(good), addr.deps);
  eq(res.status, 429, 'email limit');
  eq(addr.calls.inserted.length, 0, 'no insert on email limit');
});

Deno.test('email provider failure marks the row failed and returns 502 with a fallback message', async () => {
  const { deps, calls } = fakeDeps({ sendEmail: async () => { throw new Error('Email provider returned HTTP 422.'); } });
  const res = await handle(post(good), deps);
  eq(res.status, 502, 'status');
  const body = await res.json();
  eq(body.code, 'SEND_FAILED', 'code');
  assert(/Download the pack on this page/.test(body.error), 'fallback named');
  eq(calls.marks, [{ id: 'row-1', status: 'failed', messageId: undefined }], 'marked failed');
});

Deno.test('signing failure marks failed and sends no email', async () => {
  const { deps, calls } = fakeDeps({ signUrl: async () => { throw new Error('Object not found'); } });
  const res = await handle(post(good), deps);
  eq(res.status, 502, 'status');
  eq(calls.sent.length, 0, 'no email');
  eq((calls.marks[0] as { status: string }).status, 'failed', 'marked failed');
});

Deno.test('email content: plain text has no markdown; HTML is inline-styled and escapes the name', () => {
  const c = emailContent('<b>Thandi</b>', 'https://x.test/pack?a=1&b=2', 'https://guide.test/');
  assert(!/[*_#`]|\]\(/.test(c.text), 'no markdown in text');
  assert(c.text.includes('https://x.test/pack?a=1&b=2'), 'link in text');
  assert(!/<style/i.test(c.html), 'no style block');
  assert(!c.html.includes('<b>Thandi</b>') && c.html.includes('&lt;b&gt;Thandi&lt;/b&gt;'), 'name escaped');
  assert(c.html.includes('a=1&amp;b=2'), 'link escaped in attribute');
  const tags = c.html.match(/<(td|a|table)\b[^>]*>/g) || [];
  assert(tags.length > 0 && tags.every(t => /style="/.test(t)), 'every td, a and table carries an inline style');
  assert(!/[–—]/.test(c.text + c.html), 'no em or en dashes');
});
