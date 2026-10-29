// Scene 15 closing beat (15-8): still here, still building.
// The page engine (scroll-presentation.js) owns auto-scroll, holds and Next.
// chapters/ch-1115.js owns the beat's entrance in scene 15's scrubbed timeline.
// This file only scrubs what happens inside the beat: a seed sprouts, bends
// in the rain, stands up again, then two stakes hold it while it grows.
(() => {
  'use strict';
  const scene = document.querySelector('.scene[data-scene="15"]');
  const beat = scene?.querySelector('.c15-still');
  const G = window.gsap, ST = window.ScrollTrigger;
  // Without motion (reduced motion, print, no GSAP) the CSS end state reads as is.
  if (!beat || !G || !ST || !document.documentElement.classList.contains('c15-motion')) return;
  G.registerPlugin(ST);
  const q = s => beat.querySelector(s), qa = s => [...beat.querySelectorAll(s)];

  // Read where ch-1115.js starts this beat, so the inner moves stay inside it.
  const owner = ST.getAll().find(t => t.trigger === scene && t.animation);
  const entries = owner ? owner.animation.getTweensOf(beat) : [];
  const start = entries.length ? Math.min(...entries.map(t => t.startTime())) / owner.animation.duration() : .84;
  const at = f => start + (1 - start) * f;
  const d = (1 - start) * .06;

  const lines = qa('.c15-still__beats li'), cues = [.12, .3, .48, .66], ALL = .86;
  const tl = G.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: .5, onUpdate: s => mark(s.progress), onRefresh: s => mark(s.progress) } });
  // One tween per element: a staggered fromTo only pre-renders its first target,
  // so later targets would show their end state before the playhead reaches them.
  const each = (targets, from, to, pos, gap = 0) => [].concat(targets).forEach((el, i) => tl.fromTo(el, from, { ...to }, pos + i * gap));
  each(qa('.c15-still__title > *'), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: d, ease: 'power2.out' }, at(0), d * .7);
  lines.forEach((li, i) => each(li, { autoAlpha: 0, x: -26 }, { autoAlpha: 1, x: 0, duration: d, ease: 'power2.out' }, at(cues[i])));
  // 1 · Big results start small: the seed, then a sprout.
  each(q('.st-seed'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: d, ease: 'back.out(2.4)' }, at(.1));
  each(q('.st-stem'), { '--draw': 1 }, { '--draw': .62, duration: d * 2 }, at(.13));
  each(qa('.st-sprout'), { scale: 0, svgOrigin: '120 192' }, { scale: 1, duration: d, ease: 'back.out(2)' }, at(.19), d * .5);
  // 2 · Tired shows up first: weather rolls in, the light drops, the sprout bends.
  each(q('.st-cloud'), { x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: d * 1.5 }, at(.27));
  each(q('.st-sun'), { autoAlpha: 1 }, { autoAlpha: .2, duration: d * 1.5 }, at(.27));
  each(qa('.st-drop'), { y: -6, autoAlpha: 0 }, { y: 64, autoAlpha: .9, duration: d * .9, repeat: 2 }, at(.31), d * .22);
  each(q('.st-plant'), { rotation: 0, svgOrigin: '120 224' }, { rotation: -16, svgOrigin: '120 224', duration: d * 1.6, ease: 'power1.inOut' }, at(.32));
  // 3 · Still here: the weather clears and the sprout stands up again.
  tl.to(q('.st-cloud'), { x: 90, autoAlpha: 0, duration: d * 1.5 }, at(.46))
    .to(qa('.st-drop'), { autoAlpha: 0, duration: d * .5 }, at(.46))
    .to(q('.st-sun'), { autoAlpha: 1, duration: d * 1.5 }, at(.46))
    .to(q('.st-plant'), { rotation: 0, svgOrigin: '120 224', duration: d * 1.5, ease: 'back.out(1.8)' }, at(.48));
  each(q('.c15-still__cite'), { autoAlpha: 0 }, { autoAlpha: 1, duration: d }, at(.54));
  // 4 · Carried on the tired days: two stakes hold it and it grows into a tree.
  each(qa('.st-stake'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: d, ease: 'power2.out' }, at(.64), d * .4);
  each(qa('.c15-still__tag, .st-ties'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: d }, at(.68), d * .3);
  tl.to(q('.st-stem'), { '--draw': 0, duration: d * 2 }, at(.7));
  each(q('.st-trunk'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: d * 2 }, at(.72));
  each(qa('.st-canopy circle'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: d * 1.2, ease: 'back.out(1.5)' }, at(.76), d * .3);
  tl.to({}, { duration: .001 }, .999);

  // The line being spoken is lit; earlier lines step back until all four stand together.
  function mark(p) {
    const f = (p - start) / (1 - start);
    const k = cues.filter(c => f >= c).length - 1;
    lines.forEach((li, i) => { li.classList.toggle('is-on', i === k && f < ALL); li.classList.toggle('is-past', i < k && f < ALL); });
  }

  // Ambient life so the final hold never freezes: the canopy sways, the sun breathes.
  const ambient = [
    G.to(q('.st-canopy'), { rotation: 1.8, svgOrigin: '120 150', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
    G.to(q('.st-glow'), { scale: 1.18, transformOrigin: '50% 50%', autoAlpha: .55, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  ];
  let visible = false;
  const sync = () => { const run = visible && !document.body.classList.contains('motion-paused'); ambient.forEach(t => (run ? t.resume() : t.pause())); };
  ST.create({ trigger: scene, start: 'top bottom', end: 'bottom top', onToggle: s => { visible = s.isActive; sync(); }, onRefresh: s => { visible = s.isActive; sync(); } });
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // closing.css lengthens scene 15 after ch-1115.js measured it; measure again.
  ST.refresh();
  addEventListener('load', () => ST.refresh(), { once: true });
})();
