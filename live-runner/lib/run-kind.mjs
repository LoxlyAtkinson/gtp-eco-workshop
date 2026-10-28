// Runs one allow-listed kind and reports events: started, progress, result, error.
// Claude Code is spawned directly (no shell) with a fixed args array; the prompt
// goes on stdin. Every line that leaves this module passes through redact().
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { CLAUDE_EXE, FIRECRAWL_ENTRY, claudeArgs, missingEnv } from './kinds.mjs';
import { spendAllowed, logSpend } from './spend.mjs';

const SECRET_ENV = /(KEY|TOKEN|SECRET|PASSWORD)/i;
const SECRET_PATTERNS = [
  /fc-[A-Za-z0-9]{16,}/g,          // Firecrawl
  /sk-ant-[A-Za-z0-9_-]{16,}/g,    // Anthropic
  /apify_api_[A-Za-z0-9]{16,}/g,   // Apify
  /sk-[A-Za-z0-9]{32,}/g,          // generic OpenAI-style
  /sb_secret_[A-Za-z0-9_-]{16,}/g, // Supabase secret key
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g, // JWT (Supabase service role)
];

export function redact(text) {
  let out = String(text);
  for (const [name, value] of Object.entries(process.env)) {
    if (SECRET_ENV.test(name) && value && value.length >= 8) out = out.split(value).join('[redacted]');
  }
  for (const re of SECRET_PATTERNS) out = out.replace(re, '[redacted]');
  return out;
}

function clip(s, n = 140) {
  const one = String(s).replace(/\s+/g, ' ').trim();
  return one.length > n ? `${one.slice(0, n - 1)}…` : one;
}

// Turn one stream-json message into zero or more human progress lines.
export function describe(msg) {
  const lines = [];
  if (msg.type === 'system' && msg.subtype === 'init') {
    lines.push({ step: 'session', text: `Claude Code session ready (${msg.model})` });
  } else if (msg.type === 'user' && msg.message && Array.isArray(msg.message.content)) {
    for (const c of msg.message.content) {
      const t = typeof c.text === 'string' ? c.text : '';
      const m = t.match(/<command-name>\/?([\w:-]+)<\/command-name>/) || t.match(/^Base directory for this skill: .*[\\/]([\w-]+)\s*$/m);
      if (m) lines.push({ step: 'skill', text: `Skill loaded: ${m[1]}` });
    }
  } else if (msg.type === 'assistant' && msg.message && Array.isArray(msg.message.content)) {
    for (const c of msg.message.content) {
      if (c.type === 'tool_use') {
        const i = c.input || {};
        if (c.name === 'Skill') lines.push({ step: 'tool', text: `Loading skill: ${i.skill || i.command || '?'}` });
        else if (c.name === 'WebSearch') lines.push({ step: 'search', text: `Searching the web: ${clip(i.query || '', 90)}` });
        else if (c.name === 'WebFetch') lines.push({ step: 'fetch', text: `Reading: ${clip(i.url || '', 90)}` });
        else if (c.name === 'Bash') lines.push({ step: 'tool', text: `Running: ${clip(i.command || '', 90)}` });
        else lines.push({ step: 'tool', text: `Using ${c.name}` });
      } else if (c.type === 'text' && c.text && c.text.trim()) {
        lines.push({ step: 'note', text: clip(c.text, 120) });
      }
    }
  }
  return lines;
}

/**
 * Run a kind. onEvent(type, data) receives started|progress|result|error.
 * onRaw(line) receives every redacted raw stdout line (for evidence logs).
 * Returns { cancel(), done: Promise<summary> }.
 */
export function runKind({ kindName, kind, request, cwd, onEvent, onRaw = () => {} }) {
  const t0 = Date.now();
  const marks = { first_event_ms: null, init_ms: null, skill_marker_ms: null, first_tool_ms: null, result_ms: null };
  const skillMarkers = [];
  const emit = (type, data) => onEvent(type, JSON.parse(redact(JSON.stringify({ ...data, t_ms: Date.now() - t0 }))));

  // A review hold wins over keys: the kind stays refused even with every key set.
  if (kind.disabledUntilReview) {
    emit('error', { code: 'BLOCKED_REVIEW', message: `Blocked until review: ${kind.disabledUntilReview}`, kind: kindName, skill: kind.skill });
    return { cancel() {}, done: Promise.resolve({ kind: kindName, blocked: ['REVIEW'], wall_ms: 0 }) };
  }

  const missing = missingEnv(kind);
  if (missing.length) {
    emit('error', { code: 'BLOCKED_KEY', message: `Blocked: ${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} not set on this laptop, so this run cannot start`, kind: kindName, skill: kind.skill, label: kind.label, missing });
    return { cancel() {}, done: Promise.resolve({ kind: kindName, blocked: missing, wall_ms: 0 }) };
  }

  const spend = spendAllowed(kind.class);
  if (!spend.ok) {
    const unit = kind.class === 'firecrawl' ? 'Firecrawl credits' : 'claude -p runs';
    emit('error', { code: 'HELD_SPEND', message: `Held: the overnight ceiling of ${spend.max} ${unit} is reached`, kind: kindName });
    return { cancel() {}, done: Promise.resolve({ kind: kindName, held: true, wall_ms: 0 }) };
  }
  emit('started', { kind: kindName, skill: kind.skill, label: kind.label, business: request.business, target: request.target });

  if (kind.type === 'apify') { logSpend({ event: 'start', kind: kindName, class: kind.class, skill: kind.skill, target: request.target }); }
  if (kind.type === 'apify') return runApify({ kindName, kind, request, emit, t0 });
  // Stage kinds (lib/stage.mjs) bring their own run(); they log their own spend.
  if (typeof kind.run === 'function') return runCustom({ kindName, kind, request, emit, t0 });

  let finished = false;
  let cancelled = false;
  let child = null;
  let resultMsg = null;
  let stderrTail = '';
  let buf = '';
  let scan = null;
  let toolsOffered = null; // the `tools` list of the init event: what the model was offered

  const killTree = () => {
    if (!child || child.exitCode !== null) return;
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true, shell: false });
    else child.kill('SIGTERM');
  };
  const timer = setTimeout(() => {
    if (finished) return;
    finished = true;
    emit('error', { code: 'TIMEOUT', message: `Run timed out after ${Math.round(kind.timeoutMs / 1000)} s`, kind: kindName });
    killTree();
  }, kind.timeoutMs);

  const done = (async () => {
    // 1. Site scan with the Firecrawl CLI, when a Website is given.
    if (request.url && kind.scrape !== false) {
      emit('progress', { step: 'scan', text: `Scanning ${request.url} with the Firecrawl CLI` });
      scan = await firecrawlScan(request.url, kindName);
      if (scan.markdown) emit('progress', { step: 'scan', text: `Firecrawl scan done (${Math.round(scan.markdown.length / 1024)} KB${scan.cached ? ', reused' : ''})` });
      else emit('progress', { step: 'scan', text: `Firecrawl scan unavailable (${scan.error}); the skill will use web fetch` });
    }
    if (cancelled || finished) { clearTimeout(timer); return { kind: kindName, cancelled: true, wall_ms: Date.now() - t0 }; }

    // 2. The named skill, headless.
    // Logged only when Claude Code really starts, so a run cancelled during the scan costs no run.
    const again = spendAllowed(kind.class);
    if (!again.ok) {
      finished = true; clearTimeout(timer);
      emit('error', { code: 'HELD_SPEND', message: `Held: the overnight ceiling of ${again.max} claude -p runs is reached`, kind: kindName });
      return { kind: kindName, held: true, wall_ms: Date.now() - t0 };
    }
    logSpend({ event: 'start', kind: kindName, class: kind.class, skill: kind.skill, target: request.target });
    mkdirSync(cwd, { recursive: true });
    child = spawn(CLAUDE_EXE, claudeArgs(kind), {
      cwd,
      shell: false,
      windowsHide: true,
      env: { ...process.env, CLAUDE_CODE_ENTRYPOINT: 'live-runner' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    // If Claude Code dies before reading its prompt, the pipe error must surface as
    // RUN_FAILED on close, not crash the runner.
    child.stdin.on('error', () => {});
    child.stdin.end(kind.prompt(request, scan && scan.markdown));

    child.stdout.on('data', (chunk) => {
      buf += chunk.toString('utf8');
      let nl;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        onRaw(redact(line));
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }
        const now = Date.now() - t0;
        if (marks.first_event_ms === null) marks.first_event_ms = now;
        if (msg.type === 'system' && msg.subtype === 'init' && marks.init_ms === null) { marks.init_ms = now; toolsOffered = Array.isArray(msg.tools) ? msg.tools : null; }
        if (msg.type === 'result') { resultMsg = msg; marks.result_ms = now; continue; }
        for (const p of describe(msg)) {
          if (p.step === 'skill') { skillMarkers.push({ text: p.text, t_ms: now }); if (marks.skill_marker_ms === null) marks.skill_marker_ms = now; }
          if (['search', 'fetch', 'tool'].includes(p.step) && marks.first_tool_ms === null) marks.first_tool_ms = now;
          if (!finished) emit('progress', p);
        }
      }
    });
    child.stderr.on('data', (c) => { stderrTail = (stderrTail + c.toString('utf8')).slice(-2000); });

    return new Promise((resolve) => {
      child.on('error', (err) => {
        clearTimeout(timer);
        if (!finished) { finished = true; emit('error', { code: 'SPAWN', message: `Could not start Claude Code: ${err.code || err.message}`, kind: kindName }); }
        resolve({ kind: kindName, error: 'spawn', wall_ms: Date.now() - t0 });
      });
      child.on('close', (code) => {
        clearTimeout(timer);
        const wall_ms = Date.now() - t0;
        if (!finished) {
          finished = true;
          if (resultMsg && !resultMsg.is_error && resultMsg.result) {
            emit('result', { kind: kindName, skill: kind.skill, business: request.business, target: request.target, text: resultMsg.result, duration_ms: resultMsg.duration_ms, num_turns: resultMsg.num_turns, skills_seen: [...new Set(skillMarkers.map((x) => x.text))], firecrawl_scan: !!(scan && scan.markdown) });
          } else {
            emit('error', { code: 'RUN_FAILED', message: `Run ended without a result (exit ${code})`, kind: kindName, detail: clip(stderrTail || (resultMsg && resultMsg.result) || '', 300) });
          }
        }
        const u = resultMsg && resultMsg.usage ? resultMsg.usage : {};
        logSpend({ event: 'end', kind: kindName, class: kind.class, exit_code: code, wall_ms,
          cost_usd: resultMsg ? resultMsg.total_cost_usd : null,
          tokens: { input: u.input_tokens, output: u.output_tokens, cache_write: u.cache_creation_input_tokens, cache_read: u.cache_read_input_tokens } });
        resolve({
          kind: kindName,
          skill: kind.skill,
          exit_code: code,
          wall_ms,
          firecrawl_scan: scan ? { ok: !!scan.markdown, cached: !!scan.cached, ms: scan.ms, bytes: scan.markdown ? scan.markdown.length : 0, error: scan.error || null } : null,
          ...marks,
          tools_offered: toolsOffered,
          skill_markers: skillMarkers,
          result_is_error: resultMsg ? !!resultMsg.is_error : null,
          result_duration_ms: resultMsg ? resultMsg.duration_ms : null,
          num_turns: resultMsg ? resultMsg.num_turns : null,
          total_cost_usd: resultMsg ? resultMsg.total_cost_usd : null,
          permission_denials: resultMsg && resultMsg.permission_denials ? resultMsg.permission_denials.map((d) => d.tool_name) : [],
          stderr_tail: redact(stderrTail.slice(-500)),
        });
      });
    });
  })();

  return { cancel: () => { cancelled = true; finished = true; clearTimeout(timer); killTree(); }, done };
}

// Firecrawl CLI scan, spawned directly with node (no shell). One credit per page;
// results are reused for 30 minutes so parallel kinds on one site cost one credit.
const scanCache = new Map();
const SCAN_TTL_MS = 30 * 60_000;
const MAX_SCAN_CHARS = 24_000;
export function firecrawlScan(url, kindName) {
  const hit = scanCache.get(url);
  if (hit && Date.now() - hit.at < SCAN_TTL_MS) return hit.promise.then((r) => ({ ...r, cached: true }));
  const budget = spendAllowed('firecrawl');
  if (!budget.ok) return Promise.resolve({ error: `held: Firecrawl ceiling of ${budget.max} credits reached` });
  const t = Date.now();
  const promise = new Promise((resolve) => {
    const p = spawn(process.execPath, [FIRECRAWL_ENTRY, 'scrape', url], { shell: false, windowsHide: true, env: process.env });
    let out = '';
    let err = '';
    const kill = setTimeout(() => p.kill(), 60_000);
    p.stdout.on('data', (c) => { out += c.toString('utf8'); });
    p.stderr.on('data', (c) => { err = (err + c.toString('utf8')).slice(-500); });
    p.on('error', (e) => { clearTimeout(kill); resolve({ error: e.code || e.message, ms: Date.now() - t }); });
    p.on('close', (code) => {
      clearTimeout(kill);
      logSpend({ event: 'firecrawl', kind: kindName, class: 'firecrawl', credits: 1, url, exit_code: code, wall_ms: Date.now() - t });
      if (code === 0 && out.trim()) resolve({ markdown: redact(out).slice(0, MAX_SCAN_CHARS), ms: Date.now() - t });
      else resolve({ error: `firecrawl exit ${code}: ${clip(redact(err), 120)}`, ms: Date.now() - t });
    });
  });
  scanCache.set(url, { at: Date.now(), promise });
  return promise;
}

// A kind with its own run({ kindName, kind, request, emit, signal, t0 }). It emits
// progress and exactly one result; a thrown error (with .code) becomes the error
// event. Timeout and cancel abort the signal; run() must stop its child work then.
function runCustom({ kindName, kind, request, emit, t0 }) {
  const ac = new AbortController();
  let settled = false;
  let reason = null;
  const once = (type, data) => {
    if (settled) return;
    if (type === 'result' || type === 'error') settled = true;
    emit(type, data);
  };
  const timer = setTimeout(() => { reason = 'TIMEOUT'; ac.abort(); }, kind.timeoutMs);
  const done = (async () => {
    try {
      const summary = await kind.run({ kindName, kind, request, emit: once, signal: ac.signal, t0 });
      if (!settled) once('error', { code: 'RUN_FAILED', message: 'Run ended without a result', kind: kindName });
      return { kind: kindName, wall_ms: Date.now() - t0, ...(summary || {}) };
    } catch (err) {
      const code = reason || err.code || 'RUN_FAILED';
      const message = reason === 'TIMEOUT' ? `Run timed out after ${Math.round(kind.timeoutMs / 1000)} s` : String(err.message || err);
      once('error', { code, message, kind: kindName, ...(err.data ? { data: err.data } : {}) });
      return { kind: kindName, wall_ms: Date.now() - t0, error: code };
    } finally { clearTimeout(timer); }
  })();
  return { cancel: () => { reason = reason || 'CANCELLED'; settled = true; ac.abort(); }, done };
}

// B2B find: Apify Google Maps Scraper, called on Apify's API with the token in a
// header (never in the URL). UNTESTED until APIFY_API_TOKEN exists (OG-KEYS).
function runApify({ kindName, kind, request, emit, t0 }) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), kind.timeoutMs);
  emit('progress', { step: 'tool', text: `Starting Apify actor ${kind.actor.replace('~', '/')}` });
  const done = (async () => {
    try {
      const res = await fetch(`https://api.apify.com/v2/acts/${kind.actor}/run-sync-get-dataset-items?timeout=150`, {
        method: 'POST',
        signal: ac.signal,
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.APIFY_API_TOKEN}` },
        body: JSON.stringify({ searchStringsArray: [`${request.category} ${request.area}`], maxCrawledPlacesPerSearch: 10, language: 'en' }),
      });
      if (!res.ok) throw new Error(`Apify HTTP ${res.status}`);
      const items = await res.json();
      const rows = items.slice(0, 10).map((p) => ({ name: p.title, address: p.address, website: p.website || null, maps_url: p.url, rating: p.totalScore ?? null }));
      emit('result', { kind: kindName, skill: kind.skill, business: request.business, rows });
      return { kind: kindName, wall_ms: Date.now() - t0, rows: rows.length };
    } catch (err) {
      emit('error', { code: err.name === 'AbortError' ? 'TIMEOUT' : 'RUN_FAILED', message: String(err.message || err), kind: kindName });
      return { kind: kindName, wall_ms: Date.now() - t0, error: String(err.message || err) };
    } finally { clearTimeout(timer); }
  })();
  return { cancel: () => ac.abort(), done };
}
