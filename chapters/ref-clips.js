/* "What good looks like" reel strip (scene 11, beat 11-10).
   Tiles play muted and looped only while their beat is on screen. Click a tile for a large player; Esc closes.
   The clips live in assets/ref/, which is local only (rule G6). When a clip is missing (the public build),
   the tile becomes a link to the original post instead of a broken frame. */
(() => {
  const strip = document.querySelector('.rc-strip');
  if (!strip) return;
  const tiles = [...strip.querySelectorAll('.rc-tile')];
  const scene = strip.closest('.scene');
  const beat = strip.closest('.c15-beat') || strip;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const autoState = () => document.getElementById('autoStatus')?.dataset.state;
  let pausedByUs = false;

  const toLink = tile => {
    tile.classList.add('is-missing');
    const play = tile.querySelector('.rc-tile__play');
    play.querySelector('video')?.remove();
    const a = document.createElement('a');
    a.className = 'rc-tile__missing';
    a.href = tile.dataset.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = 'Watch the original ↗';
    play.replaceWith(Object.assign(document.createElement('div'), { className: 'rc-tile__play' }));
    tile.querySelector('.rc-tile__play').append(a);
  };

  // Build each tile's video only after the file is confirmed present.
  // The stage server (python http.server) has no Range support, so streamed playback can stall.
  // When scene 11 comes near, each clip is read once into memory and played from a blob URL.
  const blobs = new Map();
  // Tiles play a small 180x320 proxy (cheap to decode five at once); the large player uses the full clip.
  const loadBlob = tile => blobs.get(tile) || blobs.set(tile, fetch(tile.dataset.tile || tile.dataset.src)
    .then(r => { if (!r.ok) throw new Error('missing'); return r.blob(); })
    .then(b => URL.createObjectURL(b))).get(tile);
  // Nothing is requested at page load: the first fetch, when scene 11 comes near, doubles as the presence check.
  const warm = () => tiles.forEach(tile => loadBlob(tile).then(url => {
    const v = document.createElement('video');
    Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'metadata' });
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.poster = tile.dataset.poster; v.src = url;
    v.addEventListener('error', () => toLink(tile), { once: true });
    tile.querySelector('.rc-tile__play').append(v);
    tile.dataset.ok = '1';
    sync();
  }).catch(() => toLink(tile)));
  if ('IntersectionObserver' in window && scene) {
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { near.disconnect(); warm(); } }, { rootMargin: '150% 0px' });
    near.observe(scene);
  } else warm();

  // Play only while scene 11 is in view AND this beat is the one showing.
  let inView = false, timer = 0;
  const beatShowing = () => {
    const cs = getComputedStyle(beat);
    const r = beat.getBoundingClientRect();
    return cs.visibility !== 'hidden' && parseFloat(cs.opacity) > .15 && r.bottom > 0 && r.top < innerHeight;
  };
  const sync = () => {
    const go = inView && !overlay.isOpen && !reduced.matches && !document.body.classList.contains('motion-paused') && beatShowing();
    strip.querySelectorAll('.rc-tile video').forEach(v => { if (!v.src) return; go ? (v.paused && v.play().catch(() => {})) : (!v.paused && v.pause()); });
  };
  if ('IntersectionObserver' in window && scene) {
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      clearInterval(timer);
      if (inView) timer = setInterval(sync, 400);
      sync();
    }).observe(scene);
  }

  // Large player overlay.
  const overlay = document.createElement('div');
  overlay.className = 'rc-overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Reference clip, playing large');
  overlay.innerHTML = '<div class="rc-overlay__box"><video muted loop playsinline controls preload="auto"></video><p class="rc-overlay__credit"></p><button type="button" class="rc-overlay__close" aria-label="Close the clip">×</button></div>';
  document.body.append(overlay);
  const big = overlay.querySelector('video');
  const credit = overlay.querySelector('.rc-overlay__credit');
  let opener = null;

  overlay.isOpen = false;
  const open = tile => {
    opener = tile.querySelector('.rc-tile__play');
    big.poster = tile.dataset.poster; big.src = tile.dataset.src; big.muted = true;
    const note = tile.querySelector('figcaption b')?.textContent || '';
    const who = tile.querySelector('figcaption small')?.textContent || '';
    credit.innerHTML = '';
    credit.append(document.createTextNode(`${note} · ${who} · `));
    const a = Object.assign(document.createElement('a'), { href: tile.dataset.url, target: '_blank', rel: 'noopener noreferrer', textContent: 'Source ↗' });
    credit.append(a);
    overlay.hidden = false; overlay.isOpen = true;
    if (autoState() === 'running') { window.deckHold ? window.deckHold() : document.getElementById('motionButton')?.click(); pausedByUs = true; }
    sync();
    big.play().catch(() => {});
    overlay.querySelector('.rc-overlay__close').focus({ preventScroll: true });
  };
  const close = () => {
    if (!overlay.isOpen) return;
    big.pause(); big.removeAttribute('src'); big.load();
    overlay.hidden = true; overlay.isOpen = false;
    if (pausedByUs && ['paused', 'held'].includes(autoState())) document.getElementById('motionButton')?.click();
    pausedByUs = false;
    opener?.focus({ preventScroll: true });
    sync();
  };
  strip.addEventListener('click', e => {
    const btn = e.target.closest('button.rc-tile__play');
    if (!btn) return;
    const tile = btn.closest('.rc-tile');
    if (tile.dataset.ok) open(tile);
  });
  overlay.addEventListener('click', e => { if (e.target === overlay || e.target.closest('.rc-overlay__close')) close(); });
  // Capture phase so the deck's own keys (Space, arrows) do not act behind the open player.
  document.addEventListener('keydown', e => {
    if (!overlay.isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === ' ') { e.preventDefault(); e.stopPropagation(); big.paused ? big.play().catch(() => {}) : big.pause(); return; }
    if (/^(Arrow|Page|Home|End)/.test(e.key)) { e.preventDefault(); e.stopPropagation(); }
    if (e.key === 'Tab') { e.preventDefault(); overlay.querySelector('.rc-overlay__close').focus(); }
  }, true);
})();
