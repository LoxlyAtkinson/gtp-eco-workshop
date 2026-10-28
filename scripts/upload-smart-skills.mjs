#!/usr/bin/env node
// Upload the Smart skills pack (build/smart-skills/gtp-smart-skills.zip) to its own
// private Supabase Storage bucket, sign the special download link, then download the
// pack back through that link and check the bytes match.
//
// Usage: node scripts/upload-smart-skills.mjs [--days 30]
// Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local (git-ignored). The key is
// never printed. The signed link is written to build/smart-skills/link.txt (git-ignored).
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (existsSync(path.join(root, '.env.local'))) process.loadEnvFile(path.join(root, '.env.local'));
const pick = (...names) => names.map((n) => process.env[n]).find((v) => v && v.trim())?.trim() || '';
const base = pick('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '');
const key = pick('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_KEY', 'SUPABASE_SECRET_KEY');
const BUCKET = process.env.SMART_SKILLS_BUCKET || 'smart-skills';
const OBJECT = 'gtp-smart-skills.zip';
const daysArg = process.argv.indexOf('--days');
const days = daysArg > 0 ? Number(process.argv[daysArg + 1]) : 30;
const die = (msg) => { console.error(`upload-smart-skills: ${msg}`); process.exit(1); };

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(base)) die('no Supabase project URL in .env.local');
if (!key) die('no Supabase service-role key in .env.local');
if (!(days > 0 && days <= 365)) die('--days must be 1 to 365');
const zip = await readFile(path.join(root, 'build', 'smart-skills', OBJECT)).catch(() => die('build the pack first: node scripts/build-smart-skills.mjs'));
const sha = (b) => createHash('sha256').update(b).digest('hex');
const auth = { authorization: `Bearer ${key}`, apikey: key };
const call = async (method, p, body, headers = {}) => {
  const res = await fetch(`${base}/storage/v1${p}`, { method, headers: { ...auth, ...headers }, body, signal: AbortSignal.timeout(60_000) });
  const text = await res.text();
  let json = null; try { json = JSON.parse(text); } catch { /* not json */ }
  return { ok: res.ok, status: res.status, json, text: text.slice(0, 200) };
};

// 1. Private bucket of its own (created once; an existing bucket is fine).
const mk = await call('POST', '/bucket', JSON.stringify({ id: BUCKET, name: BUCKET, public: false, file_size_limit: 20 * 1024 * 1024, allowed_mime_types: ['application/zip'] }), { 'content-type': 'application/json' });
if (!mk.ok && !/already exists|Duplicate/i.test(mk.text)) die(`bucket: HTTP ${mk.status} ${mk.text}`);
console.log(mk.ok ? `bucket ${BUCKET}: created (private)` : `bucket ${BUCKET}: already there`);
const info = await call('GET', `/bucket/${BUCKET}`);
if (!info.ok || info.json?.public !== false) die(`bucket ${BUCKET} must be private (got ${info.status}, public=${info.json?.public})`);

// 2. Upload (overwrite).
const up = await call('POST', `/object/${BUCKET}/${OBJECT}`, zip, { 'content-type': 'application/zip', 'x-upsert': 'true' });
if (!up.ok) die(`upload: HTTP ${up.status} ${up.text}`);
console.log(`uploaded ${OBJECT}: ${zip.length} bytes, sha256 ${sha(zip)}`);

// 3. The special link: a signed URL that expires.
const sign = await call('POST', `/object/sign/${BUCKET}/${OBJECT}`, JSON.stringify({ expiresIn: Math.round(days * 86400) }), { 'content-type': 'application/json' });
const signed = sign.json?.signedURL || sign.json?.signedUrl;
if (!sign.ok || !signed) die(`sign: HTTP ${sign.status} ${sign.text}`);
const link = `${base}/storage/v1${signed.startsWith('/') ? '' : '/'}${signed}&download=${OBJECT}`;

// 4. Prove it: no key, just the link, and the bytes must match.
const back = await fetch(link, { signal: AbortSignal.timeout(60_000) });
const got = Buffer.from(await back.arrayBuffer());
if (!back.ok || sha(got) !== sha(zip)) die(`download check failed: HTTP ${back.status}, ${got.length} bytes`);
const expires = new Date(Date.now() + days * 86400_000).toISOString().slice(0, 10);
await writeFile(path.join(root, 'build', 'smart-skills', 'link.txt'), `${link}\n# expires ${expires} (${days} days)\n`);
console.log(`download through the signed link: OK (${got.length} bytes, same sha256)`);
console.log(`special link (expires ${expires}): written to build/smart-skills/link.txt`);
