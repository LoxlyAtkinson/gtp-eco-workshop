// Two-screen presenting, deck side (owner item 21, 2026-10-28).
//
// The presenter's laptop runs presenter.html (cue cards, mic, Next/Back). It sends each
// beat to the deck over a BroadcastChannel. The deck then GLIDES the page scroll to the
// end of that beat at the script's pace, exactly as if someone were scrolling, so every
// scroll-linked animation (ScrollTrigger scrubs, the scene 02 word beats, the chapter
// timelines) plays through. Moving into another scene uses the deck's own Next / Prev /
// Overview transition first, then glides inside the new scene.
//
// Roles (from the URL):
//   ?audience=1            the audience screen: obeys the presenter, reports its position.
//   ?audience=1&preview=1  the live copy inside presenter.html: obeys too, follows the
//                          audience screen's reported position, all media muted.
//   anything else          the normal deck: no channel. window.gtpDeckLink.play() is the
//                          same glide for the single-screen ?voice=1 pill.
// In both audience roles the deck's own auto-scroll is held for good: the voice drives.
// Only the deck's public surface is used (window.deckHold, window.deckNav.goScene,
// #autoStatus, the overview grid), as the chapter scripts do.
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const role = params.get('audience') === '1' ? (params.get('preview') === '1' ? 'preview' : 'audience') : 'local';
  const CHANNEL = 'gtp-presenter-v1';
  const MIN_SECONDS = 3;
  const id = Math.random().toString(36).slice(2, 8);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const linear = (t) => t;
  const allScenes = () => [...document.querySelectorAll('.scene')];
  const sceneEl = (num) => document.querySelector(`.scene[data-scene="${num}"]`);
  const deckState = () => document.getElementById('autoStatus')?.dataset.state || '';
  const activeScene = () => document.body.dataset.scene || '';
  // The deck's own scroll mapping: progress p of a scene = how far its top has scrolled
  // past the viewport top, over (scene height - viewport height).
  const topOf = (el) => el.getBoundingClientRect().top + scrollY;
  const travelOf = (el) => Math.max(1, el.offsetHeight - innerHeight);
  const progressOf = (el) => clamp((scrollY - topOf(el)) / travelOf(el));
  const yAt = (el, p) => topOf(el) + travelOf(el) * p;
  const setY = (y) => scrollTo({ top: y, behavior: 'instant' });
  const hold = () => { if (window.deckHold) window.deckHold(); };
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

  const E = { token: 0, playing: false, crossing: false, beat: null, scene: null, started: 0, total: 0, glideStart: 0, glideTotal: 0, raf: 0, moves: 0 };

  function stop() { E.token++; cancelAnimationFrame(E.raf); E.playing = false; E.crossing = false; post(); }

  // Into another scene with the deck's own transition, then wait for it to land.
  async function cross(scene, token) {
    const list = allScenes();
    const to = list.findIndex((s) => s.dataset.scene === scene), from = list.findIndex((s) => s.dataset.scene === activeScene());
    if (to < 0) return false;
    E.crossing = true; post();
    // Next/Prev now step one visual SECTION inside a scene (2026-10-29), so a scene move
    // goes through the deck's explicit scene call; it keeps the adjacent-scene seams.
    if (window.deckNav?.goScene) window.deckNav.goScene(to);
    else document.querySelector(`#overviewGrid [data-goto="${to}"]`)?.click();
    const until = performance.now() + 3000;
    let frames = 0;
    while (performance.now() < until) {
      await nextFrame();
      if (token !== E.token) return false;
      if (++frames > 2 && deckState() !== 'jumping' && activeScene() === scene) break;
    }
    hold();
    E.crossing = false;
    return true;
  }

  // cmd: { beat, scene, lead, p1, seconds, speed, from? }
  //   lead  where the beat's visual shows (reached in 1.2-3 s, so the cue's word comes up)
  //   p1    the beat's end; reached at the script's pace (seconds / speed, at least 3 s)
  //   from  only for Back / replay: move to this progress first, even backwards.
  // A forward glide starts from wherever the deck is and never moves backwards.
  async function play(cmd) {
    stop();
    const token = E.token;
    const el = sceneEl(cmd.scene);
    if (!el) return { ok: false, reason: `no scene ${cmd.scene}` };
    const speed = clamp(Number(cmd.speed) || 1, 0.25, 4);
    const total = Math.max(MIN_SECONDS, Number(cmd.seconds) || 0) / speed;
    Object.assign(E, { playing: true, beat: cmd.beat || null, scene: cmd.scene, started: performance.now(), total, glideStart: 0, glideTotal: 0 });
    E.moves++;
    hold();
    if (activeScene() !== cmd.scene && !(await cross(cmd.scene, token))) return { ok: false, reason: 'cancelled' };
    if (token !== E.token) return { ok: false, reason: 'cancelled' };
    let at = progressOf(el);
    const segs = [];
    let budget = Math.max(1, total - (performance.now() - E.started) / 1000);
    if (cmd.from != null && Math.abs(at - Number(cmd.from)) > 0.002) {
      const d = clamp(0.6 + 4 * Math.abs(Number(cmd.from) - at), 0.6, 2);
      segs.push({ a: at, b: Number(cmd.from), d, ease: easeInOut });
      at = Number(cmd.from);
    }
    const p1 = Math.max(at, Number(cmd.p1));
    const leadRaw = Number(cmd.lead ?? cmd.p0 ?? at);
    const lead = clamp(leadRaw, at, p1);
    if (lead > at + 0.0005) {
      const d = Math.min(clamp(1.2 + 8 * (lead - at), 1.2, 3), Math.max(0.6, budget * 0.4));
      segs.push({ a: at, b: lead, d, ease: easeInOut });
      at = lead; budget -= d;
    }
    if (p1 > at + 0.0005) {
      const span = Math.max(1e-4, p1 - Math.min(leadRaw, p1));
      segs.push({ a: at, b: p1, d: Math.max(1, budget * clamp((p1 - at) / span, 0.05, 1)), ease: linear });
    }
    run(el, segs, token);
    return { ok: true, segments: segs.map((s) => ({ from: Number(s.a.toFixed(4)), to: Number(s.b.toFixed(4)), seconds: Number(s.d.toFixed(2)) })) };
  }

  function run(el, segs, token) {
    let i = 0, t0 = performance.now();
    E.glideStart = t0; E.glideTotal = segs.reduce((s, x) => s + x.d, 0);
    const finish = () => { E.playing = false; post(); };
    const frame = (now) => {
      if (token !== E.token) return;
      hold();
      let seg = segs[i];
      let t = seg ? (now - t0) / 1000 / seg.d : 1;
      while (seg && t >= 1) { setY(yAt(el, seg.b)); t0 += seg.d * 1000; seg = segs[++i]; t = seg ? (now - t0) / 1000 / seg.d : 1; }
      if (!seg) { finish(); return; }
      setY(yAt(el, seg.a + (seg.b - seg.a) * seg.ease(clamp(t))));
      E.raf = requestAnimationFrame(frame);
    };
    if (!segs.length) { finish(); return; }
    E.raf = requestAnimationFrame(frame);
  }

  function snapshot() {
    const el = sceneEl(activeScene());
    const now = performance.now();
    return {
      type: 'state', role, id, scene: activeScene(), p: el ? Number(progressOf(el).toFixed(4)) : 0,
      beat: E.beat, playing: E.playing, crossing: E.crossing,
      glide: E.playing ? { elapsed: Number(((now - E.started) / 1000).toFixed(2)), total: Number(E.total.toFixed(2)) } : null,
      w: innerWidth, h: innerHeight, deck: deckState(), visible: !document.hidden, moves: E.moves
    };
  }

  // ---- channel (audience and preview only) ----
  let bc = null;
  function post() { if (bc && role === 'audience') bc.postMessage(snapshot()); }
  // The preview follows the audience screen whenever it is not gliding itself.
  function follow(s) {
    if (role !== 'preview' || E.playing || E.crossing || !s.scene) return;
    const el = sceneEl(s.scene);
    if (!el) return;
    if (activeScene() !== s.scene || Math.abs(progressOf(el) - s.p) > 0.01) { setY(yAt(el, s.p)); hold(); }
  }
  if (role !== 'local' && 'BroadcastChannel' in window) {
    bc = new BroadcastChannel(CHANNEL);
    bc.onmessage = (event) => {
      const m = event.data || {};
      if (m.type === 'play') play(m);
      else if (m.type === 'stop') stop();
      else if (m.type === 'hello') post();
      else if (m.type === 'state' && m.role === 'audience') follow(m);
    };
    // The presenter drives: the deck's auto-scroll stays held (chapter clicks may resume it).
    hold();
    setInterval(hold, 200);
    if (role === 'audience') {
      setInterval(post, 400);
      addEventListener('pagehide', () => bc.postMessage({ type: 'bye', role, id }));
      post();
    }
  }

  if (role === 'preview') {
    document.documentElement.classList.add('gtp-preview');
    const mute = (m) => { if (!m.muted) m.muted = true; };
    document.querySelectorAll('video,audio').forEach(mute);
    document.addEventListener('play', (e) => { if (e.target instanceof HTMLMediaElement) mute(e.target); }, true);
    document.addEventListener('volumechange', (e) => { if (e.target instanceof HTMLMediaElement) mute(e.target); }, true);
    // A mirror only: the deck's own keys (Space, arrows, V) never act here.
    addEventListener('keydown', (e) => e.stopImmediatePropagation(), true);
  }

  window.gtpDeckLink = { role, play, stop, hold, get state() { return snapshot(); } };
})();
