// Upload the skills pack zip to the private Supabase Storage bucket the skills-request
// Edge Function signs links from, then download it back through a 60-second signed URL
// and check the bytes match.
//
// Usage (PowerShell or bash, from the project root):
//   node scripts/upload-skills-pack.mjs --dry-run      checks the zip against SHA256SUMS.txt, no network
//   node scripts/upload-skills-pack.mjs                needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env
//
// The service key is read from the environment only. It is never printed or written anywhere.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUCKET = process.env.SKILLS_BUCKET || 'skills-pack';
const OBJECT = process.env.SKILLS_OBJECT || 'anthropic-marketing-skills.zip';
const zipPath = path.join(root, 'skills', 'downloads', 'anthropic-marketing-skills.zip');
const sumsPath = path.join(root, 'skills', 'downloads', 'SHA256SUMS.txt');
const dryRun = process.argv.includes('--dry-run');

const sha = buf => createHash('sha256').update(buf).digest('hex');
const die = (msg, code = 1) => { console.error(`upload-skills-pack: ${msg}`); process.exit(code); };

const zip = await readFile(zipPath).catch(() => die(`missing ${path.relative(root, zipPath)}`));
const sums = await readFile(sumsPath, 'utf8').catch(() => die(`missing ${path.relative(root, sumsPath)}`));
const expected = sums.split(/\r?\n/).map(l => l.trim().split(/\s+/)).find(([, name]) => name === 'anthropic-marketing-skills.zip')?.[0];
const actual = sha(zip);
if (!expected) die('SHA256SUMS.txt has no line for anthropic-marketing-skills.zip');
if (expected !== actual) die(`checksum mismatch: SHA256SUMS.txt says ${expected}, file is ${actual}. Rebuild with scripts/build-skills-zip.mjs.`);
console.log(`zip ok: ${zip.length} bytes, sha256 ${actual}`);
if (dryRun) { console.log('dry run: no network calls made'); process.exit(0); }

const base = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!/^https:\/\/[a-z0-9.-]+$/i.test(base)) die('set SUPABASE_URL to https://<project-ref>.supabase.co');
if (!key) die('set SUPABASE_SERVICE_ROLE_KEY in this shell (Supabase dashboard > Project Settings > API keys)');
const auth = { authorization: `Bearer ${key}`, apikey: key };
const host = new URL(base).host;

async function call(method, url, { headers = {}, body } = {}) {
  const res = await fetch(url, { method, headers: { ...auth, ...headers }, body, signal: AbortSignal.timeout(60000) });
  const text = await res.text();
  return { status: res.status, ok: res.ok, text };
}

const bucket = await call('GET', `${base}/storage/v1/bucket/${BUCKET}`);
if (bucket.ok) {
  if (JSON.parse(bucket.text).public) die(`bucket ${BUCKET} is public. Make it private in the dashboard (Storage > ${BUCKET} > Edit) and run this again.`);
  console.log(`bucket ${BUCKET}: exists, private`);
} else {
  const made = await call('POST', `${base}/storage/v1/bucket`, { headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false, file_size_limit: 5242880, allowed_mime_types: ['application/zip'] }) });
  if (!made.ok) die(`could not create bucket ${BUCKET} on ${host}: HTTP ${made.status} ${made.text.slice(0, 200)}`);
  console.log(`bucket ${BUCKET}: created, private`);
}

const up = await call('POST', `${base}/storage/v1/object/${BUCKET}/${OBJECT}`, { headers: { 'content-type': 'application/zip', 'x-upsert': 'true', 'cache-control': '3600' }, body: zip });
if (!up.ok) die(`upload failed on ${host}: HTTP ${up.status} ${up.text.slice(0, 200)}`);
console.log(`uploaded ${BUCKET}/${OBJECT} to ${host}`);

const sign = await call('POST', `${base}/storage/v1/object/sign/${BUCKET}/${OBJECT}`, { headers: { 'content-type': 'application/json' }, body: JSON.stringify({ expiresIn: 60 }) });
if (!sign.ok) die(`could not sign a test link: HTTP ${sign.status} ${sign.text.slice(0, 200)}`);
const signedPath = JSON.parse(sign.text).signedURL || JSON.parse(sign.text).signedUrl;
const back = await fetch(`${base}/storage/v1${signedPath.startsWith('/') ? '' : '/'}${signedPath}`, { signal: AbortSignal.timeout(60000) });
const backBytes = Buffer.from(await back.arrayBuffer());
if (!back.ok || sha(backBytes) !== actual) die(`signed download check failed: HTTP ${back.status}, ${backBytes.length} bytes`);
console.log(`signed download check ok: HTTP ${back.status}, ${backBytes.length} bytes, sha256 matches`);
