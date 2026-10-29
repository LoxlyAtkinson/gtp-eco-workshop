// Smart AI Social Assistant (rebranded Postiz) for the giveaway beat 14-12b.
// GET  /smart-ai/open  -> a small "starting" page (open it as http://localhost:8790/...).
// POST /smart-ai/start -> starts Docker Desktop if needed, `docker compose up -d`, waits for
//                         http://localhost:4007, signs in the demo account (creates it on first
//                         run) and passes Postiz's auth cookie to the browser. The cookie is
//                         host-only for "localhost", so it also applies to localhost:4007.
import { execFile, spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const APP = 'http://localhost:4007';
const DOCKER_DESKTOP = 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe';

// The app folder: SMART_AI_DIR, else a "smart-ai-social-assistant" clone next to this project,
// else the main PC's Git-repos copy.
function appDir() {
  const candidates = [process.env.SMART_AI_DIR, join(ROOT, '..', 'smart-ai-social-assistant'),
    'D:\\Projects\\Loxly - Resources\\Git-repos\\Self-Hosted Business Apps\\postiz-app'].filter(Boolean);
  return candidates.find(d => existsSync(join(d, 'gtp-brand', 'demo-login.json')));
}

const run = (cmd, args, cwd) => new Promise(res => execFile(cmd, args, { cwd, windowsHide: true, timeout: 600_000 },
  (err, stdout, stderr) => res({ ok: !err, out: `${stdout}${stderr}`.trim() })));
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitFor(check, seconds) {
  for (let i = 0; i < seconds; i += 3) { if (await check()) return true; await sleep(3000); }
  return false;
}

async function ensureDocker() {
  if ((await run('docker', ['info', '--format', '{{.ServerVersion}}'])).ok) return;
  if (!existsSync(DOCKER_DESKTOP)) throw new Error('Docker Desktop is not installed');
  spawn(DOCKER_DESKTOP, [], { detached: true, stdio: 'ignore' }).unref();
  if (!await waitFor(async () => (await run('docker', ['info', '--format', '{{.ServerVersion}}'])).ok, 240)) throw new Error('Docker Desktop did not start within 4 minutes');
}

// The backend answering is the real "ready": the frontend comes up first and proxies 502s until then.
const appUp = async () => { try { return (await fetch(`${APP}/api/auth/can-register`, { signal: AbortSignal.timeout(10_000) })).ok; } catch { return false; } };

async function post(path, body) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${APP}/api${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(90_000) }).catch(() => null);
    if ((res && res.status < 500) || attempt === 5) return res || { ok: false, status: 0, headers: new Headers() };
    await sleep(5000);
  }
}

// Postiz cookies, re-issued host-only (no Domain) so they cover every localhost port.
const hostOnly = res => res.headers.getSetCookie().filter(c => /^(auth|showorg)=/.test(c)).map(c => c.replace(/;\s*domain=[^;]*/i, ''));

async function start() {
  const dir = appDir();
  if (!dir) throw new Error('Smart AI Social Assistant folder not found (set SMART_AI_DIR)');
  const login = JSON.parse(readFileSync(join(dir, 'gtp-brand', 'demo-login.json'), 'utf8'));
  if (!await appUp()) {
    await ensureDocker();
    const up = await run('docker', ['compose', 'up', '-d'], dir);
    if (!up.ok) throw new Error(`docker compose up failed: ${up.out.split('\n').slice(-3).join(' ')}`);
    if (!await waitFor(appUp, 600)) throw new Error('the app did not answer on localhost:4007 within 10 minutes');
  }
  const creds = { email: login.email, password: login.password, provider: 'LOCAL' };
  let res = await post('/auth/login', creds);
  if (!res.ok) res = await post('/auth/register', { ...creds, company: login.company });
  if (!res.ok) throw new Error(`sign-in failed (${res.status})`);
  const cookies = hostOnly(res);
  if (!cookies.some(c => c.startsWith('auth='))) throw new Error('sign-in returned no auth cookie');
  return cookies;
}

const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Starting Smart AI Social Assistant</title><style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0e1212;color:#f5f1e8;font:16px/1.5 system-ui,sans-serif}
main{max-width:30rem;padding:2rem;text-align:center}.logo{width:64px;height:64px;margin:0 auto 1rem;border-radius:16px;background:#087f78;display:grid;place-items:center;font:800 24px Arial}
h1{font-size:1.5rem;margin:.2rem 0}p{opacity:.8}.err{color:#e07a4a;opacity:1}</style></head><body><main>
<div class="logo">AI</div><h1>Smart AI Social Assistant</h1><p id="s" role="status">Starting the app and signing in. The first start after a reboot can take up to 10 minutes.</p></main>
<script>window.opener=null; // Postiz closes pages that have an opener (its OAuth popups)
fetch('/smart-ai/start',{method:'POST'}).then(r=>r.json()).then(j=>{if(j.ok)location.replace('${APP}/launches');else throw new Error(j.error)})
.catch(e=>{const s=document.getElementById('s');s.className='err';s.textContent='Could not open it: '+e.message+'. Reload this page to try again.'})</script></body></html>`;

let pending = null; // one start at a time; repeat clicks wait for the same run

export async function handleSmartAiRoute(req, res, url) {
  const origin = req.headers.origin;
  if (origin && origin !== `http://${req.headers.host}`) { res.writeHead(403, { 'content-type': 'application/json' }); return res.end('{"error":"origin not allowed"}'); }
  if (req.method === 'GET' && url.pathname === '/smart-ai/open') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    return res.end(PAGE);
  }
  if (req.method === 'POST' && url.pathname === '/smart-ai/start') {
    try {
      pending ||= start().finally(() => { pending = null; });
      const cookies = await pending;
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store', 'set-cookie': cookies });
      return res.end('{"ok":true}');
    } catch (e) {
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      return res.end(JSON.stringify({ ok: false, error: e.message }));
    }
  }
  res.writeHead(404, { 'content-type': 'application/json' });
  res.end('{"error":"not found"}');
}
