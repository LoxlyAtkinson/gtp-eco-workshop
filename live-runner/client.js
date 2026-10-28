// GTP live-run client: a small browser module the deck imports.
//
// ONE FALLBACK CONTRACT (owner decision G4b, coordinator 2026-10-27):
//  - no consent         -> no run (phase "consent-required"); nothing is sent.
//  - error / unreachable / runner lost -> cached run, tagged, within 1 s.
//  - deadline: if the COMPLETE live result has not rendered 20 s after the scene
//    reveal, the cached run shows, tagged, even while progress is still streaming.
//    A spinner or progress line is not a result.
//
// Usage:
//   import { createLiveRun } from './live-runner/client.js';
//   const run = createLiveRun({ kind: 'content', request: {...}, consent: true,
//     cachedUrl: './assets/cached-runs/content.json', mount: element });
//   run.start();   // at the chapter opener (G02-Q2) or on the presenter's click
//   run.reveal();  // when the scene is revealed: starts the 20 s deadline

export const RUNNER_URL = 'http://127.0.0.1:8790';
export const DEADLINE_MS = 20_000;

export function createLiveRun({
  kind,
  request,
  consent = false,
  cachedUrl,
  runnerUrl = RUNNER_URL,
  deadlineMs = DEADLINE_MS,
  mount = null,
  onUpdate = () => {},
}) {
  const t0 = performance.now();
  const state = {
    kind,
    phase: 'idle', // idle | consent-required | running | live | cached
    reason: null, // error | unreachable | runner-lost | deadline | blocked | held
    progress: [],
    result: null,
    source: null,
    startedAtMs: null,
    revealedAtMs: null,
    settledAtMs: null,
    detail: null,
  };
  const ac = new AbortController();
  let cachedPromise = null;
  let deadlineTimer = null;
  const view = mount ? renderInto(mount) : null;
  const since = () => Math.round(performance.now() - t0);
  const update = () => { if (view) view(state); onUpdate({ ...state, progress: [...state.progress] }); };

  function loadCached() {
    if (!cachedPromise) {
      cachedPromise = cachedUrl
        ? fetch(cachedUrl, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
        : Promise.resolve(null);
    }
    return cachedPromise;
  }

  async function fallback(reason, detail = null) {
    if (state.phase === 'live' || state.phase === 'cached') return;
    clearTimeout(deadlineTimer);
    ac.abort(); // stop the stream; the runner then stops the skill run
    state.phase = 'cached';
    state.reason = reason;
    state.detail = detail;
    state.settledAtMs = since();
    // Show the tag at once; fill the cached body when it arrives (prefetched).
    state.source = { tag: 'cached run' };
    update();
    const cached = await loadCached();
    state.result = cached || { text: 'Cached run not recorded yet.' };
    state.source = { tag: 'cached run', business: cached && cached.business, recorded_at: cached && cached.recorded_at, label: cached && cached.label };
    update();
  }

  function onEvent(type, data) {
    if (state.phase !== 'running') return;
    if (type === 'progress') {
      state.progress.push(data.text);
      update();
    } else if (type === 'result') {
      clearTimeout(deadlineTimer);
      state.phase = 'live';
      state.result = data;
      state.settledAtMs = since();
      state.source = { tag: 'live', business: data.business, at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), skill: data.skill };
      update();
    } else if (type === 'error') {
      // BLOCKED_KEY, BLOCKED_REVIEW and BLOCKED_HIGGSFIELD (stage-ad-video) all read as "blocked".
      const reason = String(data.code || '').startsWith('BLOCKED_') ? 'blocked' : data.code === 'HELD_SPEND' ? 'held' : 'error';
      fallback(reason, data.message);
    }
  }

  async function stream() {
    let res;
    try {
      res = await fetch(`${runnerUrl}/run/${encodeURIComponent(kind)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...request, consent: true }),
        signal: ac.signal,
      });
    } catch (err) {
      return fallback('unreachable', String(err && err.message));
    }
    if (!res.ok || !res.body) {
      let msg = `HTTP ${res.status}`;
      try { msg = (await res.json()).error || msg; } catch { /* keep status */ }
      return fallback('error', msg);
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let cut;
        while ((cut = buf.indexOf('\n\n')) >= 0) {
          const block = buf.slice(0, cut);
          buf = buf.slice(cut + 2);
          let type = 'message';
          let data = '';
          for (const line of block.split('\n')) {
            if (line.startsWith('event:')) type = line.slice(6).trim();
            else if (line.startsWith('data:')) data += line.slice(5).trim();
          }
          if (data) { try { onEvent(type, JSON.parse(data)); } catch { /* ignore bad frame */ } }
        }
      }
    } catch (err) {
      return fallback('runner-lost', String(err && err.message));
    }
    // Stream closed without a result: the runner died or gave up.
    if (state.phase === 'running') fallback('runner-lost', 'stream ended without a result');
  }

  function armDeadline() {
    clearTimeout(deadlineTimer);
    deadlineTimer = setTimeout(() => fallback('deadline', `no complete result ${deadlineMs / 1000} s after reveal`), deadlineMs);
  }

  return {
    state,
    start({ reveal = false } = {}) {
      if (state.phase !== 'idle') return this;
      if (consent !== true) { state.phase = 'consent-required'; update(); return this; }
      state.phase = 'running';
      state.startedAtMs = since();
      loadCached(); // prefetch so the fallback renders instantly
      update();
      stream();
      if (reveal) this.reveal();
      return this;
    },
    reveal() {
      if (state.revealedAtMs !== null) return this;
      state.revealedAtMs = since();
      if (state.phase === 'running') armDeadline();
      update();
      return this;
    },
    cancel() { fallback('error', 'cancelled'); return this; },
  };
}

// Why the cached run is showing, in words the room can read. Each reason has its
// own text so an unreachable runner never looks like a runner error.
export const REASON_TEXT = {
  unreachable: 'Live runner not reachable',
  error: 'Live run failed',
  'runner-lost': 'Live runner stopped mid-run',
  deadline: 'Live run not finished in time',
  blocked: 'Live run blocked',
  held: 'Live run held: spend ceiling reached',
};

export function reasonLine(st) {
  if (st.phase !== 'cached' || !st.reason) return '';
  const head = REASON_TEXT[st.reason] || `Live run unavailable (${st.reason})`;
  return st.detail ? `${head}: ${st.detail}` : head;
}

// Minimal default view. The deck can replace it with its own via onUpdate.
function renderInto(root) {
  root.classList.add('lr');
  root.innerHTML = '<div class="lr-head"><span class="lr-skill"></span><span class="lr-tag" hidden></span></div>'
    + '<p class="lr-reason" hidden></p><ol class="lr-progress"></ol><div class="lr-result"></div><p class="lr-source"></p>';
  const $ = (s) => root.querySelector(s);
  return (st) => {
    root.dataset.phase = st.phase;
    root.dataset.reason = st.reason || '';
    $('.lr-skill').textContent = st.phase === 'consent-required' ? 'Consent needed before a live run' : `${st.kind}${st.phase === 'running' ? ' · running' : ''}`;
    const tag = $('.lr-tag');
    tag.hidden = !(st.phase === 'cached' || st.phase === 'live');
    tag.textContent = st.phase === 'cached' ? 'cached run' : 'live';
    tag.className = `lr-tag lr-tag-${st.phase}`;
    const why = $('.lr-reason');
    why.textContent = reasonLine(st);
    why.hidden = !why.textContent;
    $('.lr-progress').innerHTML = '';
    for (const line of st.progress.slice(-6)) {
      const li = document.createElement('li');
      li.textContent = line;
      $('.lr-progress').append(li);
    }
    const r = st.result;
    $('.lr-result').textContent = r ? (r.text || (r.rows ? r.rows.map((x) => `${x.name} · ${x.address || ''}`).join('\n') : '')) : '';
    const src = st.source;
    $('.lr-source').textContent = !src ? ''
      : src.tag === 'live' ? `Live: ${src.business} · ${src.at} · skill ${src.skill}`
        : `Cached run${src.business ? ` of ${src.business}` : ''}${src.label ? ` · ${src.label}` : ''}`;
  };
}
