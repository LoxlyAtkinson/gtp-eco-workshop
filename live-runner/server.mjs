#!/usr/bin/env node
// GTP live runner: a dependency-free local server for in-scene live runs.
// Binds to 127.0.0.1 only. POST /run/<kind> streams Server-Sent Events.
import './lib/load-env.mjs'; // first: the owner's keys from .env.local
import { createServer } from 'node:http';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { KINDS, validateRequest, blockedOn } from './lib/kinds.mjs';
import { runKind } from './lib/run-kind.mjs';
import { claudeRunsInWindow, MAX_CLAUDE_RUNS, firecrawlCreditsInWindow, MAX_FIRECRAWL_CREDITS } from './lib/spend.mjs';
import { isStageKind, validateStageRequest, handleStageRoute, stageHealth } from './lib/stage.mjs';
import { handleRehearsalRoute } from './lib/rehearsal.mjs';

const HOST = '127.0.0.1';
const PORT = Number(process.env.LIVE_RUNNER_PORT || 8790);
const ALLOWED_ORIGINS = new Set(['http://localhost:8765', 'http://127.0.0.1:8765']);
const MAX_CONCURRENT = 3;
const MAX_BODY = 4096;
const MAX_STAGE_BODY = 16_384; // stage kinds may carry a scan brief as context
let active = 0;

function corsHeaders(origin) {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    vary: 'Origin',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-private-network': 'true',
    'access-control-max-age': '600',
  };
}

function sendJson(res, status, obj, origin) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...corsHeaders(origin) });
  res.end(JSON.stringify(obj));
}

const server = createServer((req, res) => {
  const origin = req.headers.origin;
  // DNS-rebinding guard: only our own host names.
  const host = String(req.headers.host || '');
  if (host !== `${HOST}:${PORT}` && host !== `localhost:${PORT}`) return sendJson(res, 421, { error: 'bad host' });
  // Browsers always send Origin on cross-origin requests; refuse unknown ones.
  if (origin && !ALLOWED_ORIGINS.has(origin)) return sendJson(res, 403, { error: 'origin not allowed' });

  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  if (req.method === 'OPTIONS') { res.writeHead(204, corsHeaders(origin)); return res.end(); }

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, {
      ok: true,
      active,
      claude_runs_in_window: claudeRunsInWindow(),
      claude_run_ceiling: MAX_CLAUDE_RUNS,
      firecrawl_credits_in_window: firecrawlCreditsInWindow(),
      firecrawl_credit_ceiling: MAX_FIRECRAWL_CREDITS,
      kinds: { ...Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [k, { skill: v.skill, ready: blockedOn(v).length === 0, blocked_on: blockedOn(v) }])), ...stageHealth() },
    }, origin);
  }

  // Stage chapter: the audience's websites (lib/stage.mjs).
  if (url.pathname.startsWith('/stage/')) return handleStageRoute(req, url, (status, obj) => sendJson(res, status, obj, origin));
  // Rehearsal recorder: the owner's practice run (audio + slide log), stored locally.
  if (url.pathname.startsWith('/rehearsal/')) return void handleRehearsalRoute(req, url, (status, obj) => sendJson(res, status, obj, origin));

  const m = url.pathname.match(/^\/run\/([a-z0-9-]{1,32})$/);
  if (req.method !== 'POST' || !m) return sendJson(res, 404, { error: 'not found' }, origin);
  const stage = isStageKind(m[1]);
  if (!stage && !Object.prototype.hasOwnProperty.call(KINDS, m[1])) return sendJson(res, 404, { error: 'unknown kind' }, origin);
  const maxBody = stage ? MAX_STAGE_BODY : MAX_BODY;
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return sendJson(res, 415, { error: 'json only' }, origin);

  let body = '';
  let tooBig = false;
  req.on('data', (c) => { body += c; if (body.length > maxBody) { tooBig = true; req.destroy(); } });
  req.on('end', () => {
    if (tooBig) return;
    let parsed;
    try { parsed = JSON.parse(body || '{}'); } catch { return sendJson(res, 400, { error: 'invalid json' }, origin); }
    const v = stage ? validateStageRequest(m[1], parsed) : validateRequest(m[1], parsed);
    if (v.error) return sendJson(res, 400, { error: v.error, code: v.code || 'BAD_REQUEST' }, origin);
    if (active >= MAX_CONCURRENT) return sendJson(res, 429, { error: 'runner busy' }, origin);

    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
      ...corsHeaders(origin),
    });
    res.write(': gtp live runner\n\n');
    active += 1;
    let closed = false;
    const send = (type, data) => { if (!closed) res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`); };
    const heartbeat = setInterval(() => { if (!closed) res.write(': ping\n\n'); }, 10_000);
    const stamp = Date.now().toString(36);
    const run = runKind({
      kindName: m[1],
      kind: v.kind,
      request: v.request,
      cwd: join(tmpdir(), 'gtp-live-runner', `${m[1]}-${stamp}`),
      onEvent: (type, data) => {
        send(type, data);
        if (type === 'result' || type === 'error') { closed = true; clearInterval(heartbeat); res.end(); }
      },
    });
    run.done.finally(() => { active -= 1; clearInterval(heartbeat); if (!closed) { closed = true; res.end(); } });
    // Presenter closed the page or the client gave up: stop the run.
    res.on('close', () => { if (!closed) { closed = true; clearInterval(heartbeat); run.cancel(); } });
    console.log(`${new Date().toISOString()} run ${m[1]} for "${v.request.business}"`);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') console.error(`Port ${PORT} is in use. Pick a free port: LIVE_RUNNER_PORT=<port> node live-runner/server.mjs`);
  else console.error(err.message);
  process.exit(1);
});
server.listen(PORT, HOST, () => console.log(`GTP live runner on http://${HOST}:${PORT} (allowed origins: ${[...ALLOWED_ORIGINS].join(', ')})`));
