// Generated media for scenes 01-03 (merge 2026-10-28). The files live in
// assets/gen/ (MANIFEST.md). A class is set only after a file has loaded, so a
// missing file keeps the code-drawn stand-in. The engine is not touched.
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const loaded = (el, done, fail) => {
    if (el.tagName === 'VIDEO') {
      if (el.readyState >= 2) { done(); return; }
      el.addEventListener('loadeddata', done, { once: true });
      el.addEventListener('error', fail, { once: true });
    } else {
      if (el.complete) { el.naturalWidth ? done() : fail(); return; }
      el.addEventListener('load', done, { once: true });
      el.addEventListener('error', fail, { once: true });
    }
  };

  // 01 · hero loop. If the clip fails, fall back to its poster still; if that
  // fails too, the code-drawn bottle stays.
  const open = document.querySelector('.g1-open');
  const hero = open?.querySelector('.g1-gen--hero');
  if (hero) {
    const ok = () => { open.classList.add('g1-has-hero'); root.classList.add('has-gen-media'); };
    const syncPlay = () => { if (reduced.matches) hero.pause(); else hero.play().catch(() => {}); };
    loaded(hero, () => { ok(); syncPlay(); }, () => {
      const still = new Image();
      still.className = hero.className; still.alt = ''; still.setAttribute('aria-hidden', 'true');
      still.dataset.mediaSlot = 'amber-hero';
      loaded(still, ok, () => still.remove());
      still.src = hero.getAttribute('poster');
      hero.replaceWith(still);
    });
    reduced.addEventListener('change', syncPlay);
    if (reduced.matches) hero.removeAttribute('autoplay');
  }

  // 02 / 03 · capsule photos inside the bottle SVGs: drop the image if it fails.
  document.querySelectorAll('image.g1-photo').forEach(img => img.addEventListener('error', () => img.remove(), { once: true }));

  // 02 · example post still.
  document.querySelectorAll('.g1-gen--post').forEach(img => loaded(img, () => img.parentElement.classList.add('has-photo'), () => img.remove()));

  // 03 · persona pictures.
  document.querySelectorAll('.g1-gen--persona').forEach(img => loaded(img, () => { img.classList.add('is-ok'); img.closest('.g1-persona__pic')?.classList.add('has-photo'); }, () => img.remove()));
})();
