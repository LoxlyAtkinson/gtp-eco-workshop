#!/usr/bin/env node
// Writes join/config.js (public) from the git-ignored .env.local: the Supabase
// project URL and the anon/publishable key ONLY. Refuses any key that is not
// public by design (service role, secret). Prints no key values.
// Usage: node scripts/write-join-config.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
process.loadEnvFile(join(ROOT, '.env.local'));
const pick = (...names) => names.map((n) => process.env[n]).find((v) => v && v.trim())?.trim() || '';

const url = pick('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL', 'PUBLIC_SUPABASE_URL').replace(/\/+$/, '');
const key = pick('SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY', 'PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) { console.error('No usable Supabase project URL in .env.local'); process.exit(1); }
let kind = '';
if (/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(key)) kind = 'publishable';
else if (/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(key)) {
  let role = '';
  try { role = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString('utf8')).role; } catch { /* not a JWT */ }
  if (role === 'anon') kind = 'anon JWT';
}
if (!kind) { console.error('No public anon/publishable key in .env.local (refusing to write anything else to a public file)'); process.exit(1); }

const out = `// Live-stage join form (deck popup and join/ page). Written by scripts/write-join-config.mjs
// from .env.local: the Supabase project URL and its anon (public) key ONLY.
// RLS lets the anon key INSERT into stage_submissions and nothing else.
// Never put the service-role key here: this file is public.
window.GTP_JOIN_CONFIG = { supabaseUrl: ${JSON.stringify(url)}, anonKey: ${JSON.stringify(key)} };
`;
writeFileSync(join(ROOT, 'join', 'config.js'), out);
console.log(`wrote join/config.js (${new URL(url).hostname}, ${kind} key)`);
