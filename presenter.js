// Presenter screen for two-screen presenting (owner item 21, 2026-10-28). Local only:
// .github/workflows/pages.yml does not copy presenter.html, presenter.js or presenter.css.
//
// The laptop shows the cue cards of the current scene, the mic, a live copy of the
// audience screen and Next/Back. The audience screen (/?audience=1, on the projector)
// is driven over a BroadcastChannel ('gtp-presenter-v1'); chapters/presenter-link.js on
// that page glides the deck through each beat at the script's pace.
// Speech recognition runs here only. Matching: chapters/voice-match.js (shared).
// Cue map: chapters/voice-cues.json, or ?cues=<url> for a test map. ?listen=1 turns the
// mic on at load (the launcher allows the mic first).
// Test hook without a mic: window.gtpPresenter.hear('words'), .next(), .back(), .state.
(() => {
  'use strict';
  const M = window.GTPVoiceMatch;
  const params = new URLSearchParams(location.search);
  const CUES_URL = params.get('cues') || './chapters/voice-cues.json?v=2';
  const AUDIENCE_URL = './?audience=1', AUDIENCE_NAME = 'gtp-audience';
  const PACES = [0.75, 1, 1.25, 1.5];
  const $ = (s) => document.querySelector(s);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const bc = new BroadcastChannel('gtp-presenter-v1');

  const S = { cues: [], loaded: false, loadError: '', cur: -1, speed: 1, lockUntil: 0, sent: null, aud: null, audAt: 0, audSeen: {}, synced: false, lastMove: null, lastResult: null, built: '' };
  try { const v = Number(localStorage.getItem('gtp-presenter-pace')); if (PACES.includes(v)) S.speed = v; } catch (e) { /* storage blocked */ }

  const ear = M.createEar({ onStatus: renderMic, onHeard: (text, source) => { if (source === 'mic') evaluate('mic'); else renderHeard(); } });

  // ---- voice ----
  function evaluate(source) {
    const win = ear.window();
    const { pick, scored } = M.choose(S.cues, S.cur, win);
    const r = { source, heard: win.join(' '), current: S.cues[S.cur]?.id || null, candidates: scored.map(({ id, score, hit, pass }) => ({ id, score: Number(score.toFixed(2)), hit, pass })), moved: false, id: pick?.id || null };
    if (pick) {
      if (performance.now() < S.lockUntil) r.reason = 'just moved';
      else { playBeat(pick.i, 'voice'); r.moved = true; ear.consume(); S.lockUntil = performance.now() + M.LOCK_MS; }
    }
    S.lastResult = r;
    renderHeard();
    return r;
  }

  // ---- driving the audience screen ----
  function playBeat(i, how) {
    const c = S.cues[i];
    if (!c) return null;
    const msg = { type: 'play', beat: c.id, scene: c.scene, p0: c.p0, lead: c.lead, p1: c.p1, seconds: c.glideSeconds ?? c.seconds, speed: S.speed };
    // Going back (or replaying) starts that beat again from its start.
    if (i <= S.cur) msg.from = c.p0;
    bc.postMessage(msg);
    S.cur = i;
    S.sent = { i, at: performance.now(), total: Math.max(3, msg.seconds) / S.speed };
    S.lastMove = { id: c.id, how, at: new Date().toLocaleTimeString() };
    if (how !== 'voice') ear.consume();
    render();
    return msg;
  }
  const next = () => (S.cur + 1 < S.cues.length ? playBeat(S.cur + 1, 'next') : null);
  const back = () => (S.cur >= 0 ? playBeat(Math.max(0, S.cur - 1), 'back') : null);
  function hold() { bc.postMessage({ type: 'stop' }); if (S.sent) S.sent.held = performance.now(); render(); }

  // ---- audience screen ----
  const fresh = (t) => performance.now() - t < 1500;
  const audienceCount = () => Object.values(S.audSeen).filter(fresh).length;
  bc.onmessage = (event) => {
    const m = event.data || {};
    if (m.type === 'state' && m.role === 'audience') {
      S.aud = m; S.audAt = performance.now(); S.audSeen[m.id] = S.audAt;
      // First contact: pick up where the audience screen already is.
      if (!S.synced && S.loaded) {
        S.synced = true;
        if (!S.sent) { S.cur = m.beat ? S.cues.findIndex((c) => c.id === m.beat) : M.beatAt(S.cues, m.scene, m.p); render(); }
      }
      sizePreview(m.w, m.h);
    } else if (m.type === 'bye') delete S.audSeen[m.id];
  };
  function openAudience() {
    // Already open: bring it forward without reloading it.
    if (audienceCount()) { const w = window.open('', AUDIENCE_NAME); if (w) w.focus(); return; }
    const w = window.open(AUDIENCE_URL, AUDIENCE_NAME, 'popup=yes,width=1280,height=760,left=80,top=60');
    if (w) w.focus();
  }

  // ---- live preview: a muted copy of the deck at the audience screen's size ----
  const box = $('#previewBox'), frame = $('#preview');
  let pw = 1920, ph = 1080;
  function sizePreview(w, h) {
    if (w > 200 && h > 200 && (w !== pw || h !== ph)) { pw = w; ph = h; }
    const scale = box.clientWidth / pw;
    frame.style.width = pw + 'px'; frame.style.height = ph + 'px';
    frame.style.transform = `scale(${scale})`;
    box.style.height = Math.round(ph * scale) + 'px';
  }
  new ResizeObserver(() => sizePreview(pw, ph)).observe(box);
  // The copy must never keep the keyboard (the deck focuses a heading after a move);
  // otherwise Next/Back keys would move the copy instead of the show.
  function reclaimFocus() { if (document.activeElement === frame) { frame.blur(); document.body.focus(); } }
  addEventListener('blur', () => setTimeout(reclaimFocus, 0));
  setInterval(reclaimFocus, 500);

  // ---- rendering ----
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  function cueHtml(c) {
    if (c.silent) return '<p class="card__cue card__cue--none">No cue word</p>';
    return `<p class="card__cue${String(c.cue).length > 18 ? ' is-long' : ''}">${esc(c.cue)}</p>`;
  }
  function textHtml(c) {
    if (c.card) return `<p class="card__text">${esc(c.card)}</p>`;
    const t = c.text || '';
    if (c.cueSpan) return `<p class="card__text card__text--long">${esc(t.slice(0, c.cueSpan[0]))}<mark>${esc(t.slice(c.cueSpan[0], c.cueSpan[1]))}</mark>${esc(t.slice(c.cueSpan[1]))}</p>`;
    return `<p class="card__text">${esc(t)}</p>`;
  }
  function cardHtml(c, i, extra = '') {
    return `<li class="card${c.silent ? ' is-silent' : ''}${extra}" data-i="${i}">
  <button type="button" class="card__go" aria-label="Play ${esc(c.id)}"></button>
  <div class="card__meta"><span>${esc(c.label || c.id)}</span><span>${fmt(c.glideSeconds ?? c.seconds)}</span><b class="card__badge"></b></div>
  ${cueHtml(c)}
  ${textHtml(c)}
  <div class="card__bar" aria-hidden="true"><i></i></div>
</li>`;
  }
  function sceneOfView() {
    const c = S.cues[S.cur] || S.cues[0];
    return c ? c.scene : '';
  }
  function render() {
    if (!S.loaded) return;
    const scene = sceneOfView();
    const key = `${scene}`;
    const list = $('#cards');
    if (S.built !== key) {
      S.built = key;
      const idx = S.cues.map((c, i) => i).filter((i) => S.cues[i].scene === scene);
      const first = S.cues[idx[0]];
      $('#sceneTitle').textContent = first ? `Scene ${first.scene} · ${first.sceneTitle}` : '';
      const after = idx.length ? idx[idx.length - 1] + 1 : -1;
      let html = idx.map((i) => cardHtml(S.cues[i], i)).join('');
      if (S.cues[after]) html += `<li class="card-sep" aria-hidden="true">Next page · Scene ${esc(S.cues[after].scene)} · ${esc(S.cues[after].sceneTitle)}</li>` + cardHtml(S.cues[after], after, ' is-nextpage');
      list.innerHTML = html;
    }
    const nextI = S.cur + 1;
    list.querySelectorAll('.card').forEach((el) => {
      const i = Number(el.dataset.i);
      el.classList.toggle('is-done', i < S.cur);
      el.classList.toggle('is-now', i === S.cur);
      el.classList.toggle('is-next', i === nextI);
      el.querySelector('.card__badge').textContent = i === S.cur ? 'Now' : i === nextI ? 'Next' : '';
    });
    // Next cue, big.
    const n = S.cues[nextI];
    const say = S.cues[M.eligible(S.cues, S.cur)[0]];
    $('#nextCue').textContent = n ? (n.silent ? 'No cue word' : n.cue) : 'The end';
    $('#nextCue').classList.toggle('is-long', Boolean(n && !n.silent && String(n.cue).length > 18));
    $('#nextHint').textContent = !n ? 'That was the last beat.' : n.silent ? `Press Next for ${n.id}.${say ? ` Then say “${say.cue}”.` : ''}` : `Say it, or press Next. (${n.id})`;
    $('#backBtn').disabled = S.cur < 0;
    $('#nextBtn').disabled = !n;
    const target = list.querySelector('.is-now') || list.querySelector('.is-next');
    if (target && target.dataset.i !== list.dataset.focus) { list.dataset.focus = target.dataset.i; target.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    renderHeard();
    tick();
  }
  function progressOf(i) {
    const c = S.cues[i];
    if (!c) return 0;
    if (S.aud && fresh(S.audAt) && S.aud.beat === c.id) return S.aud.playing && S.aud.glide ? clamp(S.aud.glide.elapsed / S.aud.glide.total) : 1;
    if (S.sent && S.sent.i === i) return clamp(((S.sent.held || performance.now()) - S.sent.at) / 1000 / S.sent.total);
    return 0;
  }
  function tick() {
    const now = $('#cards .is-now .card__bar i');
    if (now) now.style.transform = `scaleX(${progressOf(S.cur).toFixed(3)})`;
    const n = audienceCount();
    const chip = $('#audStatus');
    chip.dataset.state = n === 1 ? 'on' : n > 1 ? 'many' : 'off';
    chip.textContent = n === 1 ? 'Audience screen: on' : n > 1 ? `${n} audience screens open. Close one.` : 'Audience screen: off';
    $('#openAudience').textContent = n ? 'Show audience screen' : 'Open audience screen';
  }
  setInterval(tick, 250);

  const MIC = {
    off: 'Mic off.',
    listening: () => `Listening (${ear.lang}).`,
    fallback: 'Switched to US English.',
    unsupported: 'No speech here. Use Google Chrome.',
    denied: 'Mic blocked. Allow it, then press Mic on.',
    nomic: 'No mic found. Plug one in.',
    network: 'Speech service not answering. Trying again.',
    'network-stop': 'Speech service down. Check the internet.',
    error: () => `Speech error: ${ear.detail}.`
  };
  function renderMic() {
    const m = MIC[ear.status];
    $('#micStatus').textContent = typeof m === 'function' ? m() : m || '';
    const btn = $('#micBtn');
    btn.textContent = ear.want ? 'Mic off' : 'Mic on';
    btn.setAttribute('aria-pressed', String(ear.want));
    btn.disabled = !ear.supported || !S.loaded;
    document.body.dataset.mic = ear.listening ? 'on' : ear.want ? 'starting' : 'off';
  }
  function renderHeard() {
    const t = ear.lastText.trim();
    $('#heard').textContent = t ? (t.length > 90 ? '…' + t.slice(-90) : t) : 'Nothing yet.';
    const r = S.lastResult, mv = S.lastMove;
    $('#lastMove').textContent = r && r.id && !r.moved ? `Heard ${r.id}. Held: ${r.reason}.` : mv ? `Moved to ${mv.id} (${mv.how}) at ${mv.at}.` : 'No move yet.';
  }

  // ---- controls ----
  $('#nextBtn').addEventListener('click', next);
  $('#backBtn').addEventListener('click', back);
  $('#micBtn').addEventListener('click', () => ear.listen(!ear.want));
  $('#openAudience').addEventListener('click', openAudience);
  const pace = $('#pace');
  pace.value = String(S.speed);
  pace.addEventListener('change', () => { S.speed = Number(pace.value); try { localStorage.setItem('gtp-presenter-pace', String(S.speed)); } catch (e) { /* storage blocked */ } pace.blur(); });
  $('#cards').addEventListener('click', (e) => { const card = e.target.closest('.card'); if (card) playBeat(Number(card.dataset.i), 'card'); });
  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName || '')) return;
    if (['ArrowRight', 'PageDown'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); back(); }
    else if (e.key === 'm' || e.key === 'M') ear.listen(!ear.want);
    else if (e.key === 'Escape') hold();
  });

  // ---- load ----
  const ready = fetch(new URL(CUES_URL, document.baseURI)).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }).then((data) => {
    S.cues = M.prepare(data.cues);
    S.source = data.source;
    S.loaded = true;
    $('#mapNote').textContent = `${data.counts.cues} cue words in ${data.counts.scenes} scenes.`;
    render(); renderMic();
    bc.postMessage({ type: 'hello' });
    // scripts/start-presenter.ps1 opens ?listen=1 with the mic already allowed.
    if (params.get('listen') === '1') ear.listen(true);
    return S.cues.length;
  }).catch((err) => { S.loadError = err.message; $('#mapNote').textContent = `Cue map did not load (${err.message}).`; return 0; });
  bc.postMessage({ type: 'hello' });
  renderMic(); sizePreview(pw, ph);

  window.gtpPresenter = {
    ready,
    hear: (text) => { ear.hear(text); return S.loaded ? evaluate('test') : { moved: false, reason: 'cue map not loaded' }; },
    next, back, hold, play: (id) => playBeat(S.cues.findIndex((c) => c.id === id), 'test'),
    listen: (on) => ear.listen(on),
    get state() {
      return {
        loaded: S.loaded, cues: S.cues.length, current: S.cues[S.cur]?.id || null, next: S.cues[S.cur + 1]?.id || null,
        eligible: M.eligible(S.cues, S.cur).map((i) => S.cues[i].id), mic: ear.status, listening: ear.listening,
        audience: S.aud && fresh(S.audAt) ? S.aud : null, audiences: audienceCount(), lastMove: S.lastMove, lastResult: S.lastResult, speed: S.speed
      };
    }
  };
})();
