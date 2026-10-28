// Live stage (scene 14): a full-screen presenter overlay.
// Invite (QR) -> show websites -> spin the drum -> scan -> ad ideas ->
// competitors and keywords -> two ads. Every step waits for its own presenter
// button; nothing runs or appears on its own. Runs stream from the local live
// runner (live-runner/server.mjs) through live-runner/client.js. No cached or
// sample results are ever shown here: a failed step says why and offers Retry.
import { createLiveRun, RUNNER_URL } from '../live-runner/client.js';

const JOIN_URL = 'https://loxlyatkinson.github.io/gtp-eco-workshop/?join=1';
const launchers = [...document.querySelectorAll('[data-stage-open]')];

// Test hook: ?stageRunner=http://127.0.0.1:<port> points the stage at a local stub.
// Loopback only, so a link can never send the stage to another machine.
const RUNNER = (() => {
  const v = new URLSearchParams(location.search).get('stageRunner');
  return v && /^http:\/\/(127\.0\.0\.1|localhost):\d{2,5}$/.test(v) ? v : RUNNER_URL;
})();

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const G = () => window.gsap;

// ---------- small DOM helpers (text only, never HTML from a run) ----------
function h(tag, attrs, ...kids) {
  // The second argument is optional: a node, string or list there is a child.
  if (attrs === null || attrs === undefined || typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs)) { kids.unshift(attrs); attrs = {}; }
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) el.append(kid);
  return el;
}
const str = (v, max = 400) => (typeof v === 'string' ? v : v === null || v === undefined ? '' : String(v)).replace(/\s+/g, ' ').trim().slice(0, max);
const arr = (v) => (Array.isArray(v) ? v : []);
// Shorten for the screen: cut at a word boundary and show the cut with an ellipsis.
const fit = (v, max) => {
  const s = str(v, 4000);
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1), sp = cut.lastIndexOf(' ');
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,.;:·-]+$/, '')}…`;
};
const mod = (a, n) => ((a % n) + n) % n;
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return str(u, 80); } };
const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function safeImg(u) {
  const s = str(u, 2000);
  if (!s) return '';
  if (/^https:\/\//i.test(s)) return s;
  if (/^data:image\/(png|jpe?g|webp|gif|svg\+xml);/i.test(s)) return s;
  try { const x = new URL(s, location.href); if (x.origin === location.origin) return x.href; } catch { /* no */ }
  return '';
}
function safeMedia(u) {
  const s = str(u, 2000);
  if (!s) return '';
  if (/^https:\/\//i.test(s)) return s;
  try { const x = new URL(s, location.href); if (x.origin === location.origin) return x.href; } catch { /* no */ }
  return '';
}
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const CSSLEN = /^-?\d+(\.\d+)?(px|rem|em|%)?$/i;

function hexToRgb(hex) {
  let x = hex.slice(1);
  if (x.length <= 4) x = [...x].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16));
}
function luminance(hex) {
  return hexToRgb(hex).map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; })
    .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b) { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }

// ---------- fonts: show a scanned family in itself when it can load ----------
const fontCache = new Map();
function fontInstalled(family) {
  const c = fontInstalled.ctx || (fontInstalled.ctx = document.createElement('canvas').getContext('2d'));
  const sample = 'mmmmmmmmmmlliWWWQg@#0';
  return ['monospace', 'serif', 'sans-serif'].some((b) => {
    c.font = `72px ${b}`; const w0 = c.measureText(sample).width;
    c.font = `72px "${family}", ${b}`; return c.measureText(sample).width !== w0;
  });
}
function loadFamily(family) {
  const f = str(family, 60);
  if (!/^[A-Za-z0-9][A-Za-z0-9 \-]{0,58}$/.test(f)) return Promise.resolve(false);
  if (/^(serif|sans-serif|monospace|system-ui|cursive|fantasy|ui-[a-z-]+|inherit|initial)$/i.test(f)) return Promise.resolve(true);
  if (fontCache.has(f)) return fontCache.get(f);
  const p = (async () => {
    if (fontInstalled(f)) return true;
    // Most small-business sites use Google Fonts; try it, give up after 3 s.
    await new Promise((res) => {
      const link = h('link', { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, '+')}&display=swap`, onload: res, onerror: res });
      document.head.append(link);
      setTimeout(res, 3000);
    });
    try { await Promise.race([document.fonts.load(`400 40px "${f}"`), new Promise((r) => setTimeout(r, 2500))]); } catch { /* not loadable */ }
    return fontInstalled(f);
  })();
  fontCache.set(f, p);
  return p;
}
function applyFamily(el, family, fallback = 'system-ui, sans-serif') {
  const f = str(family, 60);
  return loadFamily(f).then((ok) => {
    if (ok && /^[A-Za-z0-9][A-Za-z0-9 \-]{0,58}$/.test(f)) { el.style.fontFamily = `"${f}", ${fallback}`; el.dataset.fontLoaded = 'yes'; }
    else el.dataset.fontLoaded = 'no';
    return ok;
  });
}

// ---------- QR (vendor/qrcode-generator-1.4.4.min.js, MIT) ----------
function qrSvg(text) {
  if (typeof window.qrcode !== 'function') return h('p', { class: 'stg-err', text: 'QR library did not load. Read the link out instead.' });
  const qr = window.qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const m = 2;
  let d = '';
  for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) if (qr.isDark(r, c)) d += `M${c + m} ${r + m}h1v1h-1z`;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${n + m * 2} ${n + m * 2}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `QR code for ${text}`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  const bg = document.createElementNS(ns, 'rect');
  bg.setAttribute('width', '100%'); bg.setAttribute('height', '100%'); bg.setAttribute('fill', '#fff');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d); path.setAttribute('fill', '#0a1510');
  svg.append(bg, path);
  return svg;
}

// ---------- secure random pick (no modulo bias) ----------
function randomIndex(n) {
  const limit = Math.floor(0x100000000 / n) * n;
  const a = new Uint32Array(1);
  do { crypto.getRandomValues(a); } while (a[0] >= limit);
  return a[0] % n;
}

// ---------- the drum: faces around the X axis, seen edge-on ----------
// A fixed ring of F faces carries a virtual reel: each face shows whichever entry
// sits at its position right now, so 1 to 60 entries all roll the same way.
// Positive progress p moves the front surface DOWN: names come over the top from
// the back and roll toward the viewer, like a slot reel.
function makeDrum() {
  const F = 18;
  const STEP = 360 / F;
  const TURNS = 4;
  const root = h('div', { class: 'stg-drum', role: 'img', 'aria-label': 'Website drum' });
  const reel = h('div', { class: 'stg-drum__reel' });
  const faces = Array.from({ length: F }, (_, k) => {
    const face = h('div', { class: 'stg-drum__face', 'data-k': String(k) }, h('span', { class: 'stg-drum__host' }), h('span', { class: 'stg-drum__name' }));
    reel.append(face);
    return face;
  });
  root.append(h('i', { class: 'stg-drum__line', 'aria-hidden': 'true' }), reel, h('i', { class: 'stg-drum__shade', 'aria-hidden': 'true' }));
  const st = { p: 0, items: [], r: 200, tween: null, landed: null };

  function measure() {
    const fh = faces[0].offsetHeight || 72;
    st.r = fh / (2 * Math.tan(Math.PI / F));
    faces.forEach((f, k) => { f.style.transform = `rotateX(${k * STEP}deg) translateZ(${st.r.toFixed(2)}px)`; });
  }
  function render() {
    const N = st.items.length;
    const angle = -st.p * STEP;
    reel.style.transform = `translateZ(${(-st.r).toFixed(2)}px) rotateX(${angle.toFixed(3)}deg)`;
    reel.dataset.angle = angle.toFixed(3);
    for (let k = 0; k < F; k += 1) {
      const face = faces[k];
      const v = k + F * Math.round((st.p - k) / F);
      const delta = (v - st.p) * STEP;
      const vis = Math.max(0, Math.cos((delta * Math.PI) / 180));
      face.style.opacity = vis < 0.02 ? '0' : (0.25 + 0.75 * vis ** 1.6).toFixed(3);
      if (face.dataset.v !== String(v)) {
        face.dataset.v = String(v);
        const it = N ? st.items[mod(v, N)] : null;
        face.dataset.index = it ? String(mod(v, N)) : '';
        face.children[0].textContent = it ? it.host : '';
        face.children[1].textContent = it ? it.name : '';
      }
    }
  }
  // keep = index of an already chosen entry: the drum rests on it, still highlighted.
  function setItems(items, keep = -1) {
    st.tween?.kill();
    st.tween = null;
    if (st.pending) { const r = st.pending; st.pending = null; r(null); }
    st.items = items;
    st.p = keep >= 0 ? keep : 0;
    st.landed = null;
    faces.forEach((f) => { f.dataset.v = ''; f.classList.remove('is-winner'); });
    root.classList.remove('is-landed');
    delete root.dataset.landed;
    measure();
    render();
    if (keep >= 0) { frontFace()?.classList.add('is-winner'); root.classList.add('is-landed'); st.landed = keep; root.dataset.landed = String(keep); }
  }
  function frontFace() { return faces.find((f) => Number(f.dataset.v) === Math.round(st.p)); }
  function spin(winnerIndex) {
    const N = st.items.length;
    st.tween?.kill();
    faces.forEach((f) => f.classList.remove('is-winner'));
    root.classList.remove('is-landed');
    const base = Math.ceil(st.p) + TURNS * F;
    const end = base + mod(winnerIndex - mod(base, N), N);
    root.dataset.target = String(winnerIndex);
    return new Promise((resolve) => {
      st.pending = resolve;
      const land = () => {
        if (st.pending !== resolve) return;
        st.pending = null;
        st.tween = null;
        st.p = end; render();
        const face = frontFace();
        face?.classList.add('is-winner');
        root.classList.add('is-landed');
        st.landed = winnerIndex;
        root.dataset.landed = String(winnerIndex);
        resolve(winnerIndex);
      };
      const gsap = G();
      if (reduced.matches || !gsap) {
        // Reduced motion: no rolling, a short fade straight to the winner.
        const fade = (o, d, cb) => (gsap ? gsap.to(reel, { opacity: o, duration: d, onComplete: cb }) : (reel.style.opacity = String(o), cb && cb()));
        fade(0, 0.2, () => { st.p = end; render(); fade(1, 0.35, land); });
        return;
      }
      st.tween = gsap.to(st, { p: end, duration: 6.2, ease: 'power4.out', onUpdate: render, onComplete: land });
    });
  }
  return { root, setItems, spin, measure, render, state: st };
}

// ---------- overlay ----------
const S = {
  items: null, source: null, listShown: false,
  winner: null, // {id, website, host, name}
  scan: null, ideas: null, idea: 0, comp: null, kw: null, adPlain: null, adVideo: null,
};

const STEPS = [
  ['invite', 'Invite'], ['list', 'Websites'], ['spin', 'Spin'], ['scan', 'Scan'],
  ['ideas', 'Ad ideas'], ['research', 'Research'], ['ads', 'Two ads'],
];

let overlay = null;
let opener = null;
let isOpen = false;
let drum = null;
const panels = {};
const tick = new Set(); // running timers

function build() {
  overlay = h('div', { class: 'stg', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'stg-title', hidden: true, tabindex: '-1' });
  const rail = h('nav', { class: 'stg-rail', 'aria-label': 'Live stage steps' },
    STEPS.map(([id, label], i) => h('button', { type: 'button', class: 'stg-rail__btn', 'data-go': id, 'aria-current': i === 0 ? 'step' : null },
      h('span', { text: String(i + 1) }), label)));
  const top = h('header', { class: 'stg-top' },
    h('div', { class: 'stg-brand' }, h('span', { text: 'Scene 14 · live' }), h('strong', { id: 'stg-title', text: 'Live stage' })),
    rail,
    h('p', { class: 'stg-chosen', 'data-chosen': true, hidden: true }),
    h('button', { type: 'button', class: 'stg-close', 'data-close': true, 'aria-label': 'Close the live stage (Esc)' }, 'Close ', h('kbd', { text: 'Esc' })));
  const body = h('div', { class: 'stg-body' });
  for (const [id] of STEPS) { panels[id] = h('section', { class: `stg-step stg-step--${id}`, 'data-step': id, hidden: id !== 'invite', 'aria-labelledby': `stg-h-${id}` }); body.append(panels[id]); }
  overlay.append(top, body);
  document.body.append(overlay);

  buildInvite(); buildList(); buildSpin(); buildScan(); buildIdeas(); buildResearch(); buildAds();

  rail.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });
  overlay.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
    const n = e.target.closest('[data-next]'); if (n) go(n.dataset.next);
  });
  // Keys typed inside the overlay never reach the deck (Space, arrows, Page keys).
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') trapTab(e);
    e.stopPropagation();
  });
  addEventListener('resize', () => { if (isOpen && drum) { drum.measure(); drum.render(); } });
  // The deck behind never scrolls while the stage is open.
  const bodyEl = overlay.querySelector('.stg-body');
  const guard = (e) => { if (!bodyEl.contains(e.target) || bodyEl.scrollHeight <= bodyEl.clientHeight + 1) e.preventDefault(); };
  overlay.addEventListener('wheel', guard, { passive: false });
  overlay.addEventListener('touchmove', guard, { passive: false });
}

function focusables() {
  return [...overlay.querySelectorAll('button, a[href], input, video[controls], [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.disabled && el.offsetParent !== null);
}
function trapTab(e) {
  const f = focusables(); if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === overlay)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

// Capture phase: Esc closes from anywhere; deck keys aimed outside the overlay are swallowed.
document.addEventListener('keydown', (e) => {
  if (!isOpen) return;
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
  if (overlay.contains(e.target)) return;
  if (e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); (focusables()[0] || overlay).focus(); return; }
  if (/^(Arrow|Page|Home|End| $|Spacebar|Enter|[-_=+]$)/.test(e.key)) { e.preventDefault(); e.stopPropagation(); }
}, true);

function go(id) {
  for (const [k] of STEPS) panels[k].hidden = k !== id;
  overlay.querySelectorAll('[data-go]').forEach((b) => { if (b.dataset.go === id) { b.setAttribute('aria-current', 'step'); b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } else b.removeAttribute('aria-current'); });
  overlay.dataset.step = id;
  overlay.querySelector('.stg-body').scrollTop = 0;
  if (id === 'spin' && drum) requestAnimationFrame(() => { drum.measure(); drum.render(); });
  refreshGates();
  const head = panels[id].querySelector('h2'); head?.focus({ preventScroll: true });
}

function open(e) {
  if (!overlay) build();
  opener = e?.currentTarget || document.activeElement;
  if (window.deckHold) window.deckHold();
  overlay.hidden = false;
  isOpen = true;
  document.documentElement.classList.add('stg-open');
  go(overlay.dataset.step || 'invite');
}
function close() {
  if (!isOpen) return;
  overlay.hidden = true;
  isOpen = false;
  document.documentElement.classList.remove('stg-open');
  opener?.focus?.({ preventScroll: true });
}

// ---------- step scaffolding ----------
function stepHead(id, n, title, lede, ...actions) {
  return h('div', { class: 'stg-head' },
    h('div', { class: 'stg-head__text' },
      h('span', { class: 'stg-num', text: `Step ${n}` }),
      h('h2', { id: `stg-h-${id}`, tabindex: '-1', text: title }),
      lede ? h('p', { class: 'stg-lede', text: lede }) : null),
    h('div', { class: 'stg-actions' }, actions));
}
function gateNote(text) { return h('p', { class: 'stg-gate', hidden: true, text }); }
function nextBtn(id, label) { return h('button', { type: 'button', class: 'stg-next', 'data-next': id, hidden: true }, label, h('span', { 'aria-hidden': 'true', text: ' →' })); }

// A live-run slot: progress lines, elapsed time, error with Retry, nothing faked.
function runSlot(label) {
  const root = h('div', { class: 'stg-run', 'data-phase': 'idle' });
  const status = h('p', { class: 'stg-run__status', role: 'status', 'aria-live': 'polite' });
  const lines = h('ol', { class: 'stg-run__lines' });
  const err = h('div', { class: 'stg-run__err', hidden: true }, h('p'), h('button', { type: 'button', class: 'stg-retry', text: 'Retry' }));
  const out = h('div', { class: 'stg-run__out' });
  root.append(status, lines, err, out);
  const slot = { root, out, run: null, t0: 0, onRetry: null, label };
  err.querySelector('button').addEventListener('click', () => slot.onRetry && slot.onRetry());
  slot.timer = () => {
    if (root.dataset.phase !== 'running') return;
    const s = Math.round((Date.now() - slot.t0) / 1000);
    status.textContent = `${label} · running · ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };
  slot.view = (st, renderResult) => {
    root.dataset.phase = st.phase === 'cached' ? 'error' : st.phase;
    lines.replaceChildren(...st.progress.slice(-5).map((t) => h('li', { text: str(t, 220) })));
    // Progress lines show only while a run is going; a stopped run shows its reason, not raw model output.
    lines.hidden = !st.progress.length || st.phase !== 'running';
    if (st.phase === 'running') { slot.timer(); tick.add(slot); err.hidden = true; return; }
    tick.delete(slot);
    if (st.phase === 'live') {
      err.hidden = true;
      // "none: Firecrawl v2 scrape (branding, …)" reads as the tool name alone.
      const raw = str(st.result?.skill || st.result?.data?.skill, 200);
      const skill = fit(/^none:/i.test(raw) ? raw.replace(/^none:\s*/i, '').split(' (')[0] : raw, 60);
      status.textContent = `${label} · live · ${st.source?.at || timeNow()}${skill ? ` · ${skill}` : ''}`;
      try { renderResult(st.result); } catch (ex) { showError(slot, `The result arrived but could not be shown (${str(ex.message, 120)}).`); }
      return;
    }
    if (st.phase === 'cached') {
      status.textContent = `${label} · stopped`;
      showError(slot, errorText(st, label));
    }
  };
  return slot;
}
function showError(slot, text) {
  const err = slot.root.querySelector('.stg-run__err');
  err.querySelector('p').textContent = text;
  err.hidden = false;
  slot.root.dataset.phase = 'error';
  slot.out.replaceChildren();
}
const REASON = {
  unreachable: 'Live runner not reachable on this laptop. Start it: node live-runner/server.mjs',
  error: 'The run failed',
  'runner-lost': 'The runner stopped mid-run',
  blocked: 'Blocked',
  held: 'Held: the spend ceiling is reached',
};
function errorText(st, label) {
  const head = REASON[st.reason] || 'The run stopped';
  const d = str(st.detail, 300);
  return d && st.reason !== 'unreachable' ? `${head}: ${d}` : head;
}
setInterval(() => tick.forEach((s) => s.timer()), 1000);

function startRun(slot, kind, request, onResult, extraView) {
  slot.out.replaceChildren();
  slot.t0 = Date.now();
  slot.root.querySelector('.stg-run__err').hidden = true;
  const run = createLiveRun({
    kind,
    request,
    consent: true,
    runnerUrl: RUNNER,
    onUpdate: (st) => { slot.view(st, onResult); extraView?.(st); },
  });
  slot.run = run;
  run.start(); // no reveal(): live stage runs have no 20 s cached-run deadline
  return run;
}

// ---------- a. Invite ----------
function buildInvite() {
  const p = panels.invite;
  const short = JOIN_URL.replace(/^https:\/\//, '').replace(/\/$/, '');
  p.append(
    stepHead('invite', 1, 'Put your website on the big screen.', 'Scan the code or open the link. Add your website. One gets picked at random and scanned live.'),
    h('div', { class: 'stg-invite' },
      h('figure', { class: 'stg-qr' }, qrSvg(JOIN_URL), h('figcaption', { text: 'Scan with your phone camera' })),
      h('div', { class: 'stg-invite__text' },
        h('p', { class: 'stg-bigurl' }, h('span', { text: 'Or type' }), h('strong', { text: short })),
        h('p', { class: 'stg-invite__note', text: 'No phone handy? Call your website out and it goes in the list by hand.' }),
        h('p', { class: 'stg-invite__note stg-invite__note--small', text: 'We use your website for a live demo today and delete the list after the talk.' }),
        nextBtn('list', 'Next: show the websites'))));
  p.querySelector('[data-next]').hidden = false;
}

// ---------- b. Websites ----------
function normaliseSite(raw) {
  let v = str(raw, 220);
  if (!v) return { error: 'Type a website first.' };
  if (/^http:\/\//i.test(v)) v = 'https://' + v.slice(7);
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) v = 'https://' + v;
  let u; try { u = new URL(v); } catch { return { error: 'That is not a website address.' }; }
  const host = u.hostname.toLowerCase();
  if (u.protocol !== 'https:' || !host.includes('.') || /^[\d.]+$/.test(host) || host.includes(':') || /(^|\.)(localhost|local|internal)$/.test(host)) return { error: 'Use a public website, for example amberkloof.co.za' };
  const out = u.href.replace(/\/$/, '');
  if (out.length > 200) return { error: 'That address is too long.' };
  return { value: out, host };
}

async function api(path, body) {
  const res = await fetch(`${RUNNER}${path}`, body === undefined ? { cache: 'no-store' } : { method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  let json = null; try { json = await res.json(); } catch { /* not json */ }
  if (!res.ok) { const e = new Error(str(json?.error || json?.message || `HTTP ${res.status}`, 200)); e.status = res.status; throw e; }
  return json || {};
}

function buildList() {
  const p = panels.list;
  const show = h('button', { type: 'button', class: 'stg-primary', 'data-act': 'show', text: 'Show websites' });
  const count = h('p', { class: 'stg-count', hidden: true });
  const grid = h('ol', { class: 'stg-sites', 'aria-label': 'Websites from the room' });
  const empty = h('p', { class: 'stg-empty', text: 'Nothing on screen yet. Press Show websites when the room is ready.' });
  const status = h('p', { class: 'stg-run__status', role: 'status', 'aria-live': 'polite' });
  const err = h('p', { class: 'stg-err', hidden: true });

  const addSite = h('input', { id: 'stg-add-site', type: 'text', inputmode: 'url', autocomplete: 'off', spellcheck: 'false', maxlength: '200', placeholder: 'amberkloof.co.za' });
  const addName = h('input', { id: 'stg-add-name', type: 'text', autocomplete: 'off', maxlength: '40', placeholder: 'Thandi' });
  const addMsg = h('p', { class: 'stg-add__msg', role: 'status', 'aria-live': 'polite' });
  const addBtn = h('button', { type: 'submit', class: 'stg-secondary', text: 'Add' });
  const add = h('form', { class: 'stg-add', novalidate: true, 'aria-labelledby': 'stg-add-h' },
    h('h3', { id: 'stg-add-h', text: 'Add a website called out by the room' }),
    h('div', { class: 'stg-add__row' },
      h('label', { for: 'stg-add-site' }, h('span', { text: 'Website' }), addSite),
      h('label', { for: 'stg-add-name' }, h('span', { text: 'First name (optional)' }), addName),
      addBtn),
    addMsg);
  const clearBtn = h('button', { type: 'button', class: 'stg-link', text: 'Clear the list' });

  p.append(
    stepHead('list', 2, 'Websites from the room.', 'Nothing shows until you press the button.', show),
    h('div', { class: 'stg-list' }, h('div', { class: 'stg-list__main' }, status, err, count, empty, grid),
      h('aside', { class: 'stg-list__side' }, add, clearBtn, h('p', { class: 'stg-source', 'data-source': true }))),
    nextBtn('spin', 'Next: spin the drum'));

  async function load() {
    show.disabled = true; err.hidden = true;
    status.textContent = 'Fetching the list…';
    try {
      const j = await api('/stage/submissions');
      S.items = arr(j.items).map((it, i) => ({ id: str(it.id, 80) || String(i), website: str(it.website, 200), host: hostOf(it.website), name: str(it.name, 40), at: str(it.at, 40) })).filter((it) => it.website);
      S.source = j.source === 'supabase' ? 'supabase' : 'local';
      S.listShown = true;
      status.textContent = '';
      if (addMsg.textContent.includes('Press Show websites')) { addMsg.textContent = ''; addMsg.dataset.tone = ''; }
      renderList();
      if (S.winner) {
        const k = S.items.findIndex((it) => it.id === S.winner.id || it.website === S.winner.website);
        if (k < 0) { S.winner = null; resetFrom('scan'); updateChosen(); }
        if (drum) drum.setItems(S.items, k);
      } else if (drum) drum.setItems(S.items);
      show.textContent = 'Refresh the list';
    } catch (ex) {
      status.textContent = '';
      err.textContent = ex.status ? `The list did not load: ${ex.message}` : REASON.unreachable;
      err.hidden = false;
    } finally { show.disabled = false; refreshGates(); }
  }
  function renderList() {
    const n = S.items.length;
    count.hidden = false;
    count.textContent = n === 1 ? '1 website' : `${n} websites`;
    empty.hidden = n > 0;
    empty.textContent = 'No websites yet. Ask the room to scan the code, or add one called out.';
    grid.replaceChildren(...S.items.map((it) => h('li', { class: 'stg-site' }, h('strong', { text: it.host }), it.name ? h('span', { text: it.name }) : null)));
    grid.classList.toggle('is-dense', n > 18);
    p.querySelector('[data-source]').textContent = S.source === 'supabase' ? 'Source: the join form (Supabase).' : 'Source: the local list on this laptop. The join form is not connected today.';
  }
  show.addEventListener('click', load);

  add.addEventListener('submit', async (e) => {
    e.preventDefault();
    const w = normaliseSite(addSite.value);
    const nm = str(addName.value, 41);
    if (w.error) { addMsg.textContent = w.error; addMsg.dataset.tone = 'bad'; addSite.focus(); return; }
    if (nm.length > 40) { addMsg.textContent = 'Keep the name under 40 characters.'; addMsg.dataset.tone = 'bad'; return; }
    addBtn.disabled = true; addMsg.textContent = 'Adding…'; addMsg.dataset.tone = '';
    try {
      const j = await api('/stage/submissions/add', nm ? { website: w.value, name: nm } : { website: w.value });
      const dup = j.duplicate === true || j.status === 'duplicate';
      const shown = hostOf(w.value);
      addMsg.textContent = dup ? `${shown} is already in the list.` : `Added ${shown}.${S.listShown ? '' : ' Press Show websites to put the list on screen.'}`;
      addMsg.dataset.tone = dup ? '' : 'good';
      addSite.value = ''; addName.value = '';
      if (S.listShown) await load();
      addSite.focus();
    } catch (ex) {
      addMsg.textContent = ex.status ? `Not added: ${ex.message}` : REASON.unreachable;
      addMsg.dataset.tone = 'bad';
    } finally { addBtn.disabled = false; }
  });

  let armed = false;
  clearBtn.addEventListener('click', async () => {
    if (!armed) { armed = true; clearBtn.textContent = 'Press again to delete the whole list'; setTimeout(() => { armed = false; clearBtn.textContent = 'Clear the list'; }, 5000); return; }
    armed = false; clearBtn.disabled = true;
    try {
      await api('/stage/submissions/clear', {});
      clearBtn.textContent = 'List cleared';
      S.winner = null; resetFrom('scan'); updateChosen();
      if (S.listShown) await load();
    } catch (ex) {
      clearBtn.textContent = ex.status ? `Not cleared: ${ex.message}` : 'Not cleared: runner not reachable';
    } finally { clearBtn.disabled = false; setTimeout(() => { clearBtn.textContent = 'Clear the list'; }, 4000); }
  });
}

// ---------- c. Spin ----------
function buildSpin() {
  const p = panels.spin;
  drum = makeDrum();
  const spinBtn = h('button', { type: 'button', class: 'stg-primary stg-primary--big', 'data-act': 'spin', text: 'Spin' });
  const result = h('p', { class: 'stg-winner', role: 'status', 'aria-live': 'polite' });
  p.append(
    stepHead('spin', 3, 'Who goes on the big screen?', 'The drum lands on one website at random.', spinBtn),
    gateNote('Show the websites first (step 2). The drum uses that list.'),
    h('div', { class: 'stg-spin' }, drum.root, result),
    nextBtn('scan', 'Next: scan this website'));
  spinBtn.addEventListener('click', async () => {
    if (!S.items?.length) return;
    const items = S.items;
    busy(spinBtn, true);
    result.textContent = 'Spinning…';
    if (S.winner) resetFrom('scan');
    S.winner = null; updateChosen(); refreshGates();
    const i = randomIndex(items.length);
    const landed = await drum.spin(i);
    busy(spinBtn, false);
    if (landed === null || items !== S.items) { result.textContent = 'The list changed during the spin. Spin again.'; return; }
    S.winner = items[i];
    result.replaceChildren(h('span', { text: 'On the big screen' }), h('strong', { text: S.winner.host }), S.winner.name ? h('em', { text: S.winner.name }) : '');
    spinBtn.textContent = 'Spin again';
    updateChosen();
    refreshGates();
    p.querySelector('[data-next]').focus({ preventScroll: true });
  });
}

function updateChosen() {
  const c = overlay.querySelector('[data-chosen]');
  c.hidden = !S.winner;
  c.textContent = S.winner ? `Website: ${S.winner.host}` : '';
  for (const id of ['scan', 'ideas', 'research', 'ads']) {
    const t = panels[id].querySelector('[data-target]');
    if (t) t.textContent = S.winner ? S.winner.host : 'no website chosen yet';
  }
}

// Changing the website clears every result that belonged to the old one.
const slots = {};
function resetFrom(step) {
  const order = ['scan', 'ideas', 'research', 'ads'];
  for (const id of order.slice(order.indexOf(step))) {
    if (id === 'scan') S.scan = null;
    if (id === 'ideas') { S.ideas = null; S.idea = 0; }
    if (id === 'research') { S.comp = null; S.kw = null; }
    if (id === 'ads') { S.adPlain = null; S.adVideo = null; }
  }
  for (const [k, s] of Object.entries(slots)) {
    if (order.indexOf(k.split(':')[0]) >= order.indexOf(step)) {
      s.out.replaceChildren(); s.root.dataset.phase = 'idle';
      s.root.querySelector('.stg-run__status').textContent = '';
      s.root.querySelector('.stg-run__lines').replaceChildren();
      s.root.querySelector('.stg-run__err').hidden = true;
      tick.delete(s);
    }
  }
  refreshGates();
}

function refreshGates() {
  if (!overlay) return;
  const hasList = !!(S.items && S.items.length);
  const gate = (id, ok) => {
    const g = panels[id].querySelector('.stg-gate'); if (g) g.hidden = ok;
    panels[id].querySelectorAll('[data-act]').forEach((b) => { if (!b.dataset.busy) b.disabled = !ok; });
  };
  gate('spin', hasList);
  if (hasList && drum && drum.state.items !== S.items) drum.setItems(S.items);
  if (!hasList && drum && drum.state.items.length) drum.setItems([]);
  gate('scan', !!S.winner);
  gate('ideas', !!(S.winner && S.scan));
  gate('research', !!S.winner);
  gate('ads', !!(S.winner && S.scan));
  panels.list.querySelector('[data-next]').hidden = !hasList;
  panels.spin.querySelector('[data-next]').hidden = !S.winner;
  panels.scan.querySelector('[data-next]').hidden = !S.scan;
  panels.ideas.querySelector('[data-next]').hidden = !S.ideas;
  panels.research.querySelector('[data-next]').hidden = !(S.comp || S.kw);
}

function targetLine() { return h('p', { class: 'stg-target' }, h('span', { text: 'Website ' }), h('strong', { 'data-target': true, text: S.winner ? S.winner.host : 'no website chosen yet' })); }

function runButton(id, label, fn) {
  const b = h('button', { type: 'button', class: 'stg-primary', 'data-act': id, text: label });
  b.addEventListener('click', fn);
  return b;
}
function busy(btn, on) { if (on) { btn.dataset.busy = '1'; btn.disabled = true; } else { delete btn.dataset.busy; refreshGates(); } }

// ---------- d. Scan ----------
function briefContext(max = 1800) {
  const d = S.scan?.data || {};
  const pr = d.product || {};
  const parts = [
    pr.name || pr.what ? `Product or service: ${str(pr.name, 80)}${pr.what ? ` - ${str(pr.what, 240)}` : ''}` : '',
    pr.who ? `Customer: ${str(pr.who, 200)}` : '',
    arr(pr.proof).length ? `Facts quoted from the page: ${arr(pr.proof).slice(0, 4).map((x) => str(x, 160)).join(' | ')}` : '',
    S.scan?.text ? `Design brief: ${str(S.scan.text, 900)}` : '',
  ].filter(Boolean);
  return parts.join('\n').slice(0, max);
}

function buildScan() {
  const p = panels.scan;
  const slot = runSlot('stage-scan · Firecrawl branding scan');
  slots['scan'] = slot;
  const btn = runButton('scan', 'Scan the website', () => go2());
  function go2() {
    if (!S.winner) return;
    resetFrom('scan');
    busy(btn, true);
    slot.onRetry = go2;
    startRun(slot, 'stage-scan', { target: S.winner.website }, (r) => { S.scan = r; renderScan(slot.out, r); }, (st) => { if (st.phase !== 'running') busy(btn, false); });
  }
  p.append(stepHead('scan', 4, 'What does their website look like?', 'Colours, type, spacing, corners, shadows, components and assets, straight from the page.', btn),
    targetLine(), gateNote('Spin the drum first (step 3) to choose a website.'), slot.root, nextBtn('ideas', 'Next: three ad ideas'));
}

function chipList(title, values, render) {
  const items = values.filter(Boolean);
  if (!items.length) return null;
  return h('div', { class: 'stg-tok' }, h('h3', { text: title }), h('ul', { class: 'stg-chips' }, items.map(render)));
}
function objChips(obj) {
  if (!obj || typeof obj !== 'object') return [];
  return Object.entries(obj).slice(0, 12).map(([k, v]) => [str(k, 40), typeof v === 'object' && v ? Object.entries(v).slice(0, 4).map(([a, b]) => `${a} ${str(b, 30)}`).join(' · ') : str(v, 60)]).filter(([, v]) => v);
}

function renderBrief(text) {
  const box = h('div', { class: 'stg-brief' });
  let list = null;
  for (const raw of String(text || '').split('\n').slice(0, 60)) {
    const line = raw.trim();
    if (!line) { list = null; continue; }
    const clean = line.replace(/\*\*|__|`/g, '');
    if (/^#{1,6}\s/.test(clean)) { list = null; box.append(h('h4', { text: clean.replace(/^#+\s*/, '') })); }
    else if (/^[-*•]\s|^\d+[.)]\s/.test(clean)) { if (!list) { list = h('ul'); box.append(list); } list.append(h('li', { text: clean.replace(/^([-*•]|\d+[.)])\s*/, '') })); }
    else { list = null; box.append(h('p', { text: clean })); }
  }
  return box;
}

function renderScan(out, r) {
  const d = r?.data || {};
  const pr = d.product || {};
  // One swatch per colour and one line per family; the roles they play are listed together.
  const group = (list, key) => [...list.reduce((m, x) => { const k = x[key].toLowerCase(); const g = m.get(k); if (g) { if (x.role && !g.roles.includes(x.role)) g.roles.push(x.role); } else m.set(k, { ...x, roles: x.role ? [x.role] : [] }); return m; }, new Map()).values()]
    .map((g) => ({ ...g, role: g.roles.join(' · ') }));
  const colors = group(arr(d.colors).map((c) => ({ hex: str(c?.hex, 9), role: str(c?.role, 30) })).filter((c) => HEX.test(c.hex)), 'hex').slice(0, 12);
  const fonts = group(arr(d.fonts).map((f) => ({ family: str(f?.family, 60), role: str(f?.role, 30) })).filter((f) => f.family), 'family').slice(0, 6);
  const logo = safeImg(d.logo?.url || d.logo);
  const shot = safeImg(d.screenshot?.url || d.screenshot);
  const assets = arr(d.assets).map((a) => ({ url: safeImg(a?.url || a), kind: str(a?.kind, 30) })).filter((a) => a.url).slice(0, 8);

  const left = h('div', { class: 'stg-scan__media' },
    shot ? h('figure', { class: 'stg-shot' }, h('img', { src: shot, alt: `Screenshot of ${S.winner?.host || 'the website'}`, loading: 'lazy', referrerpolicy: 'no-referrer' }), h('figcaption', { text: 'Screenshot from the scan' })) : h('p', { class: 'stg-missing', text: 'No screenshot came back from the scan.' }),
    logo ? h('figure', { class: 'stg-logo' }, h('img', { src: logo, alt: 'Logo from the scan', referrerpolicy: 'no-referrer' }), h('figcaption', { text: 'Logo' })) : null);
  // A logo file the site will not serve here becomes a plain note, never a broken image.
  left.querySelector('.stg-logo img')?.addEventListener('error', (e) => e.target.closest('figure').replaceChildren(h('p', { class: 'stg-missing', text: 'The logo file would not load here.' })), { once: true });

  const product = (pr.name || pr.what || pr.who || arr(pr.proof).length) ? h('div', { class: 'stg-product' },
    h('h3', { text: str(pr.name, 80) || 'What they sell' }),
    pr.what ? h('p', { text: str(pr.what, 300) }) : null,
    pr.who ? h('p', { class: 'stg-product__who' }, h('b', { text: 'For ' }), str(pr.who, 200)) : null,
    arr(pr.proof).length ? h('ul', { class: 'stg-proof' }, arr(pr.proof).slice(0, 4).map((x) => h('li', h('q', { text: str(x, 200) })))) : null) : null;

  const sw = colors.length ? h('div', { class: 'stg-tok' }, h('h3', { text: 'Colours' }), h('ul', { class: 'stg-swatches' }, colors.map((c) => {
    const chip = h('i'); chip.style.background = c.hex;
    return h('li', chip, h('b', { text: c.hex.toUpperCase() }), c.role ? h('span', { text: c.role }) : null);
  }))) : null;

  const fontList = fonts.length ? h('div', { class: 'stg-tok' }, h('h3', { text: 'Fonts' }), h('ul', { class: 'stg-fonts' }, fonts.map((f) => {
    const name = h('strong', { text: f.family });
    const note = h('small', { text: 'loading…' });
    applyFamily(name, f.family).then((ok) => { note.textContent = ok ? `${f.role || 'font'} · shown in itself` : `${f.role || 'font'} · not loadable here, shown in the deck font`; });
    return h('li', name, note);
  }))) : null;

  const typeChips = chipList('Type scale', objChips(d.type), ([k, v]) => h('li', h('b', { text: k }), ` ${v}`));
  const spacingChips = chipList('Spacing', objChips(d.spacing), ([k, v]) => h('li', h('b', { text: k }), ` ${v}`));
  const radii = arr(d.radii).map((x) => str(typeof x === 'object' ? x?.value : x, 20)).filter(Boolean).slice(0, 8);
  const radiiBox = chipList('Corner radius', radii, (v) => { const s = h('i'); if (CSSLEN.test(v)) s.style.borderRadius = /^\d+(\.\d+)?$/.test(v) ? `${v}px` : v; return h('li', { class: 'stg-radius' }, s, v); });
  const shadows = arr(d.shadows).map((x) => str(typeof x === 'object' ? x?.value : x, 120)).filter(Boolean).slice(0, 4);
  const shadowBox = chipList('Shadows', shadows, (v) => { const s = h('i'); s.style.boxShadow = v; return h('li', { class: 'stg-shadow' }, s, h('code', { text: v })); })
    || h('div', { class: 'stg-tok' }, h('h3', { text: 'Shadows' }), h('p', { class: 'stg-none', text: 'None found: this site uses a flat look.' }));
  const comps = arr(d.components).map((x) => (typeof x === 'object' && x ? str(x.name || x.type || x.kind, 60) : str(x, 60))).filter(Boolean).slice(0, 14);
  const compBox = chipList('Components', comps, (v) => h('li', { text: v }));
  const assetBox = assets.length ? h('div', { class: 'stg-tok' }, h('h3', { text: 'Assets' }), h('ul', { class: 'stg-assets' }, assets.map((a) => {
    const img = h('img', { src: a.url, alt: a.kind || 'Image from the site', loading: 'lazy', referrerpolicy: 'no-referrer' });
    img.addEventListener('error', () => { img.closest('li')?.classList.add('is-broken'); });
    return h('li', img, a.kind ? h('span', { text: a.kind }) : null);
  }))) : null;

  const when = str(r?.scanned_at, 40);
  const t = when && !Number.isNaN(Date.parse(when)) ? new Date(when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const note = h('p', { class: 'stg-source', text: r?.reused ? `Reused this site's scan from ${t || 'earlier today'} · 0 Firecrawl credits` : `Fresh Firecrawl scan${t ? ` at ${t}` : ''}${r?.credits !== undefined ? ` · ${str(r.credits, 6)} credits` : ''}` });
  out.replaceChildren(note, h('div', { class: 'stg-scan' }, left,
    h('div', { class: 'stg-scan__tokens' }, product, sw, fontList, typeChips, spacingChips, radiiBox, shadowBox, compBox, assetBox,
      r?.text ? h('div', { class: 'stg-tok stg-tok--brief' }, h('h3', { text: 'Design brief' }), renderBrief(r.text)) : null)));
}

// ---------- e. Ad ideas ----------
function buildIdeas() {
  const p = panels.ideas;
  const slot = runSlot('stage-ideas · ad skill');
  slots['ideas'] = slot;
  const btn = runButton('ideas', 'Get 3 ad ideas', () => go2());
  function go2() {
    if (!S.winner || !S.scan) return;
    resetFrom('ideas');
    busy(btn, true);
    slot.onRetry = go2;
    startRun(slot, 'stage-ideas', { target: S.winner.website, context: briefContext() }, (r) => { S.ideas = arr(r?.data?.ideas).slice(0, 3); renderIdeas(slot.out, r); refreshGates(); }, (st) => { if (st.phase !== 'running') busy(btn, false); });
  }
  p.append(stepHead('ideas', 5, 'Three ad ideas, each from a fact on their page.', 'Pick the one to build in step 7.', btn),
    targetLine(), gateNote('Scan the website first (step 4). The ideas come from its facts.'), slot.root, nextBtn('research', 'Next: competitors and keywords'));
}
function renderIdeas(out, r) {
  const ideas = S.ideas || [];
  if (!ideas.length) { out.replaceChildren(h('p', { class: 'stg-missing', text: 'The run finished without ideas.' })); return; }
  const cards = ideas.map((it, i) => {
    const pick = h('button', { type: 'button', class: 'stg-pick', 'aria-pressed': String(i === S.idea), text: i === S.idea ? 'Chosen for the ads' : 'Use this idea' });
    pick.addEventListener('click', () => { S.idea = i; out.querySelectorAll('.stg-pick').forEach((b, j) => { b.setAttribute('aria-pressed', String(j === i)); b.textContent = j === i ? 'Chosen for the ads' : 'Use this idea'; b.closest('.stg-idea').classList.toggle('is-chosen', j === i); }); });
    return h('article', { class: `stg-idea${i === S.idea ? ' is-chosen' : ''}` },
      it.format ? h('span', { class: 'stg-idea__fmt', text: str(it.format, 40) }) : null,
      h('h3', { text: str(it.title, 90) || `Idea ${i + 1}` }),
      it.hook ? h('p', { class: 'stg-idea__hook', text: str(it.hook, 220) }) : null,
      h('p', { class: 'stg-idea__fact' }, h('span', { text: 'Fact from their page' }), it.fact ? h('q', { text: str(it.fact, 220) }) : h('em', { text: 'No fact quoted' })),
      pick);
  });
  out.replaceChildren(h('div', { class: 'stg-ideas' }, cards));
}

// ---------- f. Competitors and keywords ----------
function buildResearch() {
  const p = panels.research;
  const cSlot = runSlot('stage-competitors · competitor-analysis');
  const kSlot = runSlot('stage-keywords · DataForSEO');
  slots['research:c'] = cSlot; slots['research:k'] = kSlot;
  const btn = runButton('research', 'Research competitors and keywords', () => go2());
  let pending = 0;
  const settle = (st) => { if (st.phase !== 'running' && st.phase !== 'idle') { pending -= 1; if (pending <= 0) busy(btn, false); } };
  function goC() {
    startRun(cSlot, 'stage-competitors', { target: S.winner.website, context: briefContext(1200) }, (r) => { S.comp = r; renderComp(cSlot.out, r); refreshGates(); }, onceSettled(settle));
  }
  function goK() {
    startRun(kSlot, 'stage-keywords', { target: S.winner.website }, (r) => { S.kw = r; renderKw(kSlot.out, r); refreshGates(); }, onceSettled(settle));
  }
  function go2() {
    if (!S.winner) return;
    resetFrom('research');
    busy(btn, true); pending = 2;
    cSlot.onRetry = () => { pending += 1; busy(btn, true); goC(); };
    kSlot.onRetry = () => { pending += 1; busy(btn, true); goK(); };
    goC(); goK();
  }
  // Keyword data without the DataForSEO login is a plain sentence, not an error dump.
  const kView = kSlot.view;
  kSlot.view = (st, fn) => {
    kView(st, fn);
    if (st.phase === 'cached' && st.reason === 'blocked') {
      kSlot.root.querySelector('.stg-run__err p').textContent = 'Keyword data needs the DataForSEO login. Not set today.';
      kSlot.root.dataset.phase = 'blocked';
    }
  };
  p.append(stepHead('research', 6, 'Who else sells this, and what do people search for?', 'Both run at once: competitors on the left, keywords on the right.', btn),
    targetLine(), gateNote('Spin the drum first (step 3) to choose a website.'),
    h('div', { class: 'stg-two' },
      h('div', { class: 'stg-col' }, h('h3', { class: 'stg-col__h', text: 'Competitors' }), cSlot.root),
      h('div', { class: 'stg-col' }, h('h3', { class: 'stg-col__h', text: 'Keywords to rank for' }), kSlot.root)),
    nextBtn('ads', 'Next: make the two ads'));
}
function onceSettled(fn) { let done = false; return (st) => { if (!done && st.phase !== 'running' && st.phase !== 'idle') { done = true; fn(st); } }; }

function renderComp(out, r) {
  const d = r?.data || {};
  const list = arr(d.competitors).slice(0, 6);
  const gaps = arr(d.gaps).map((g) => fit(g, 260)).filter(Boolean).slice(0, 5);
  out.replaceChildren(
    list.length ? h('ol', { class: 'stg-comp' }, list.map((c) => {
      const url = safeMedia(c?.url);
      return h('li', h('strong', { text: str(c?.name, 80) || hostOf(c?.url) }), url ? h('a', { href: url, target: '_blank', rel: 'noopener noreferrer', text: hostOf(url) }) : null,
        c?.whatTheyDo ? h('p', { text: fit(c.whatTheyDo, 320) }) : null,
        c?.whatWorks ? h('p', { class: 'stg-comp__works' }, h('b', { text: 'What works: ' }), fit(c.whatWorks, 320)) : null);
    })) : h('p', { class: 'stg-missing', text: 'No competitors came back.' }),
    gaps.length ? h('div', { class: 'stg-gaps' }, h('h4', { text: 'Gaps they leave open' }), h('ul', gaps.map((g) => h('li', { text: g })))) : null,
    h('p', { class: 'stg-source', text: `Source: ${str(d.source, 120) || 'not stated'}` }));
}
function renderKw(out, r) {
  const d = r?.data || {};
  const rows = arr(d.keywords).slice(0, 12);
  const advice = arr(d.advice).map((a) => str(a, 220)).filter(Boolean).slice(0, 4);
  const num = (v) => (v === null || v === undefined || v === '' ? '–' : str(v, 12));
  out.replaceChildren(
    rows.length ? h('table', { class: 'stg-kw' },
      h('thead', h('tr', h('th', { scope: 'col', text: 'Phrase' }), h('th', { scope: 'col', text: 'Searches / mo' }), h('th', { scope: 'col', text: 'Difficulty' }), h('th', { scope: 'col', text: 'Their rank' }))),
      h('tbody', rows.map((k) => h('tr', h('th', { scope: 'row', text: str(k?.phrase, 80) }), h('td', { text: num(k?.volume) }), h('td', { text: num(k?.difficulty) }), h('td', { text: num(k?.position) }))))) : h('p', { class: 'stg-missing', text: 'No keywords came back.' }),
    advice.length ? h('div', { class: 'stg-gaps' }, h('h4', { text: 'What to rank for' }), h('ul', advice.map((a) => h('li', { text: a })))) : null,
    h('p', { class: 'stg-source', text: 'Source: DataForSEO Labs · South Africa · English' }));
}

// ---------- g. The two ads ----------
function buildAds() {
  const p = panels.ads;
  const aSlot = runSlot('stage-ad-plain · no skill');
  const vSlot = runSlot('stage-ad-video · higgsfield-generate');
  slots['ads:a'] = aSlot; slots['ads:v'] = vSlot;
  const btn = runButton('ads', 'Make the 2 ads', () => go2());
  let pending = 0;
  const settle = () => { pending -= 1; if (pending <= 0) busy(btn, false); };
  // Context object: the scan brief plus the chosen idea as fields (lib/stage.mjs normalizeContext).
  const ctx = () => {
    const idea = S.ideas?.[S.idea];
    const brief = briefContext(2000);
    return idea ? { brief, idea: { title: str(idea.title, 120), hook: str(idea.hook, 240), fact: str(idea.fact, 240), format: str(idea.format, 60) } } : brief;
  };
  function goA() { startRun(aSlot, 'stage-ad-plain', { target: S.winner.website, context: ctx() }, (r) => { S.adPlain = r; renderPlainAd(aSlot.out, r); }, onceSettled(settle)); }
  function goV() { startRun(vSlot, 'stage-ad-video', { target: S.winner.website, context: ctx() }, (r) => { S.adVideo = r; renderVideoAd(vSlot.out, r); }, onceSettled(settle)); }
  function go2() {
    if (!S.winner || !S.scan) return;
    resetFrom('ads');
    busy(btn, true); pending = 2;
    aSlot.onRetry = () => { pending += 1; busy(btn, true); goA(); };
    vSlot.onRetry = () => { pending += 1; busy(btn, true); goV(); };
    goA(); goV();
  }
  // A blocked or failed Higgsfield run says so in plain words; nothing stands in for the video.
  const vView = vSlot.view;
  vSlot.view = (st, fn) => {
    vView(st, fn);
    if (st.phase === 'cached' && st.reason !== 'unreachable') {
      vSlot.root.querySelector('.stg-run__err p').textContent = `No video made. ${str(st.detail, 300) || REASON[st.reason] || 'The run stopped.'}`;
      vSlot.root.dataset.phase = /BLOCKED|credit|auth|login|balance/i.test(String(st.detail || '')) || st.reason === 'blocked' ? 'blocked' : 'error';
    }
  };
  const chosen = h('p', { class: 'stg-target stg-target--idea' });
  p.append(stepHead('ads', 7, 'Two ads: a plain prompt against a skill.', 'Same website, same idea. Left: one plain prompt, no skill. Right: the Higgsfield skill makes a video.', btn),
    targetLine(), chosen, gateNote('Scan the website first (step 4). Both ads use its brief.'),
    h('div', { class: 'stg-two stg-two--ads' },
      h('div', { class: 'stg-col' }, h('h3', { class: 'stg-col__h stg-col__h--label', text: 'Plain prompt, no skill' }), aSlot.root),
      h('div', { class: 'stg-col' }, h('h3', { class: 'stg-col__h stg-col__h--label stg-col__h--skill', text: 'With a skill: Higgsfield video' }), vSlot.root)));
  // Keep the "chosen idea" line current whenever the step is shown.
  new MutationObserver(() => {
    if (p.hidden) return;
    const idea = S.ideas?.[S.idea];
    chosen.textContent = idea ? `Idea: ${str(idea.title, 90)}` : 'Idea: none chosen. The ads work from the scan brief.';
  }).observe(p, { attributes: true, attributeFilter: ['hidden'] });
}

function pickColors() {
  const cs = arr(S.scan?.data?.colors).map((c) => ({ hex: str(c?.hex, 9), role: str(c?.role, 30).toLowerCase() })).filter((c) => HEX.test(c.hex));
  const by = (re) => cs.find((c) => re.test(c.role));
  const bg = (by(/primary|brand/) || cs[0] || { hex: '#1e1a17' }).hex;
  const text = [by(/text|foreground/)?.hex, '#ffffff', '#111111'].filter(Boolean).find((x) => contrast(x, bg) >= 4.5) || (contrast('#ffffff', bg) > contrast('#111111', bg) ? '#ffffff' : '#111111');
  const accentC = [by(/accent|secondary|link|cta/)?.hex, ...cs.map((c) => c.hex)].filter(Boolean).find((x) => x.toLowerCase() !== bg.toLowerCase() && contrast(x, bg) >= 1.6) || text;
  const ctaText = contrast('#ffffff', accentC) >= contrast('#111111', accentC) ? '#ffffff' : '#111111';
  return { bg, text, accent: accentC, ctaText };
}
function pickFonts() {
  const fs = arr(S.scan?.data?.fonts).map((f) => ({ family: str(f?.family, 60), role: str(f?.role, 30).toLowerCase() })).filter((f) => f.family);
  const head = (fs.find((f) => /head|display|title/.test(f.role)) || fs[0])?.family;
  const body = (fs.find((f) => /body|text|paragraph/.test(f.role)) || fs[1] || fs[0])?.family;
  return { head, body };
}

function renderPlainAd(out, r) {
  const d = r?.data || {};
  const c = pickColors();
  const f = pickFonts();
  const radius = arr(S.scan?.data?.radii).map((x) => str(typeof x === 'object' ? x?.value : x, 20)).find((v) => CSSLEN.test(v));
  const logo = safeImg(S.scan?.data?.logo?.url || S.scan?.data?.logo);
  const head = h('strong', { class: 'stg-ad__head', text: str(d.headline, 120) || 'No headline came back' });
  const bodyEl = h('p', { class: 'stg-ad__body', text: str(d.body, 400) });
  const cta = h('span', { class: 'stg-ad__cta', text: str(d.cta, 40) || 'Learn more' });
  const card = h('article', { class: 'stg-ad', 'aria-label': 'Plain-prompt ad' },
    // A logo file is usually dark ink: on a dark card it sits on a light plate so it stays readable.
    logo ? h('img', { class: `stg-ad__logo${luminance(c.bg) < 0.18 ? ' stg-ad__logo--plate' : ''}`, src: logo, alt: '', referrerpolicy: 'no-referrer' }) : h('span', { class: 'stg-ad__brand', text: S.winner?.host || '' }),
    head, bodyEl, cta);
  card.style.background = c.bg; card.style.color = c.text;
  cta.style.background = c.accent; cta.style.color = c.ctaText;
  if (radius) { const v = /^\d+(\.\d+)?$/.test(radius) ? `${radius}px` : radius; card.style.borderRadius = `max(${v}, 6px)`; cta.style.borderRadius = v; }
  // The caption names the scanned font only once it has actually loaded on this laptop.
  const fontNote = h('span');
  if (f.head) applyFamily(head, f.head).then((ok) => { fontNote.textContent = ok ? ` and ${f.head}` : ` (${f.head} is not loadable here, so the deck font stands in)`; });
  if (f.body) { applyFamily(bodyEl, f.body); applyFamily(cta, f.body); }
  out.replaceChildren(card,
    h('p', { class: 'stg-source' }, `Format: ${fit(d.format, 120) || 'not stated'} · styled with the scanned colours `, h('code', { text: `${c.bg} / ${c.accent}` }), fontNote));
}

function renderVideoAd(out, r) {
  const d = r?.data || {};
  const url = safeMedia(d.videoUrl);
  const status = str(d.status, 40) || 'unknown';
  const meta = h('dl', { class: 'stg-vmeta' },
    h('div', h('dt', { text: 'Status' }), h('dd', { text: status })),
    d.jobId ? h('div', h('dt', { text: 'Job' }), h('dd', { text: str(d.jobId, 80) })) : null,
    d.creditsUsed !== undefined && d.creditsUsed !== null ? h('div', h('dt', { text: 'Credits used' }), h('dd', { text: str(d.creditsUsed, 12) })) : null);
  if (url) {
    out.replaceChildren(h('video', { class: 'stg-video', src: url, controls: true, playsinline: true, muted: true, loop: true, preload: 'metadata' }), meta);
    const v = out.querySelector('video'); v.muted = true; v.play?.().catch(() => {});
  } else {
    out.replaceChildren(h('div', { class: 'stg-vpending' }, h('strong', { text: /complete|done|succe/i.test(status) ? 'The job finished but no video link came back.' : 'The video is still rendering on Higgsfield.' }), h('p', { text: 'No video is shown until a real link comes back.' })), meta);
  }
}

// ---------- launch ----------
launchers.forEach((b) => b.addEventListener('click', open));
window.gtpStage = { open: () => open(), close, get state() { return S; }, runner: RUNNER };
