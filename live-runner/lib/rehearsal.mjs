// Rehearsal recorder (owner, 2026-10-28): while the owner wings the talk slide by slide,
// the deck (?rehearse=1) sends his mic audio in chunks plus a log of slides and heard words.
// Everything is stored locally under live-runner/.stage/rehearsal/<id>/ (git-ignored):
//   audio.webm    the recording, chunks appended in order
//   events.jsonl  {t, type: start|slide|speech|stop, scene, hash, text}
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { STAGE_DIR } from './stage.mjs';

const ROOT = join(STAGE_DIR, 'rehearsal');
const ID_RE = /^r-\d{8}-\d{6}$/;
const MAX_AUDIO = 5 * 1024 * 1024;
const MAX_EVENT = 8 * 1024;

function body(req, max) {
  return new Promise((resolve, reject) => {
    const parts = [];
    let size = 0;
    req.on('data', (c) => { size += c.length; if (size > max) { reject(new Error('too large')); req.destroy(); } else parts.push(c); });
    req.on('end', () => resolve(Buffer.concat(parts)));
    req.on('error', reject);
  });
}

/** POST /rehearsal/start, POST /rehearsal/<id>/audio, POST /rehearsal/<id>/event, GET /rehearsal/<id>. */
export async function handleRehearsalRoute(req, url, reply) {
  try {
    if (req.method === 'POST' && url.pathname === '/rehearsal/start') {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      const id = `r-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
      mkdirSync(join(ROOT, id), { recursive: true });
      writeFileSync(join(ROOT, id, 'meta.json'), JSON.stringify({ id, startedAt: d.toISOString() }, null, 2));
      return reply(200, { ok: true, id });
    }
    const m = url.pathname.match(/^\/rehearsal\/(r-\d{8}-\d{6})(?:\/(audio|event))?$/);
    if (!m || !ID_RE.test(m[1]) || !existsSync(join(ROOT, m[1]))) return reply(404, { error: 'unknown rehearsal' });
    const dir = join(ROOT, m[1]);
    if (req.method === 'POST' && m[2] === 'audio') {
      const buf = await body(req, MAX_AUDIO);
      appendFileSync(join(dir, 'audio.webm'), buf);
      return reply(200, { ok: true, bytes: buf.length });
    }
    if (req.method === 'POST' && m[2] === 'event') {
      const ev = JSON.parse((await body(req, MAX_EVENT)).toString('utf8') || '{}');
      const line = { t: Number(ev.t) || 0, at: new Date().toISOString(), type: String(ev.type || '').slice(0, 20), scene: String(ev.scene || '').slice(0, 4), hash: String(ev.hash || '').slice(0, 12), text: String(ev.text || '').slice(0, 2000) };
      appendFileSync(join(dir, 'events.jsonl'), `${JSON.stringify(line)}\n`);
      return reply(200, { ok: true });
    }
    if (req.method === 'GET' && !m[2]) {
      const ev = existsSync(join(dir, 'events.jsonl')) ? readFileSync(join(dir, 'events.jsonl'), 'utf8').split('\n').filter(Boolean).length : 0;
      return reply(200, { ok: true, id: m[1], events: ev, audio: existsSync(join(dir, 'audio.webm')) });
    }
    return reply(404, { error: 'not found' });
  } catch (e) {
    return reply(400, { error: String(e.message).slice(0, 120) });
  }
}
