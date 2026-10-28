// Loads the git-ignored .env.local (owner keys) into process.env. Imported first
// by server.mjs so every other module sees the keys. Values are never logged.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const ENV_FILE = process.env.LIVE_RUNNER_ENV_FILE || join(ROOT, '.env.local');

// Other common spellings of the names the runner reads.
const ALIASES = {
  SUPABASE_URL: ['NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL', 'PUBLIC_SUPABASE_URL'],
  SUPABASE_SERVICE_ROLE_KEY: ['SUPABASE_SERVICE_KEY', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE'],
  APIFY_API_TOKEN: ['APIFY_TOKEN', 'APIFY_API_KEY'],
  DATAFORSEO_LOGIN: ['DATAFORSEO_USERNAME', 'DATAFORSEO_USER', 'DATA_FOR_SEO_LOGIN'],
  DATAFORSEO_PASSWORD: ['DATAFORSEO_PASS', 'DATA_FOR_SEO_PASSWORD'],
};

export const envFileLoaded = existsSync(ENV_FILE);
if (envFileLoaded) {
  process.loadEnvFile(ENV_FILE);
  for (const [name, alts] of Object.entries(ALIASES)) {
    if (process.env[name]) continue;
    const alt = alts.find((a) => process.env[a]);
    if (alt) process.env[name] = process.env[alt];
  }
}
console.log(envFileLoaded ? 'env: loaded .env.local' : `env: no .env.local at ${ENV_FILE} (using the shell environment only)`);
