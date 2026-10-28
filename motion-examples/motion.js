/* Three original, deterministic GSAP motion studies. Every study has one timeline. */
(() => {
  const studies = Array.from(document.querySelectorAll('.study'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!window.gsap || !window.ScrollTrigger) {
    studies.forEach(section => section.querySelector('.motion-status').textContent = 'Static example available');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const timelines = new Map();
  function build(section) {
    const $ = selector => section.querySelector(selector);
    const $$ = selector => Array.from(section.querySelectorAll(selector));
    const key = section.dataset.study;
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onStart: () => { $('.motion-status').textContent = 'Playing'; }, onComplete: () => { $('.motion-status').textContent = 'Complete · replay any time'; $('.pause').textContent = 'Pause'; } });
    if (key === 'evidence') {
      timeline.from($('.assumption'), { x: -46, autoAlpha: 0, duration: .7 }, 0)
        .from($$('.receipt'), { y: 75, rotation: -5, autoAlpha: 0, duration: .52, stagger: .09 }, .6)
        .to($('.assumption'), { y: -18, opacity: .33, duration: .6 }, 2.4)
        .to($$('.receipt--office'), { y: -18, scale: 1.05, duration: .85, stagger: .06, ease: 'power2.inOut' }, 2.6)
        .to($$('.receipt--family'), { y: 15, opacity: .58, duration: .85, stagger: .06, ease: 'power2.inOut' }, 2.6)
        .from($('.evidence-result'), { y: 55, autoAlpha: 0, duration: .8 }, 4.2)
        .from($('.evidence-result strong b'), { textContent: 0, duration: .7, stagger: .12, snap: { textContent: 1 } }, 4.5)
        .to({}, { duration: 2.2 });
    } else if (key === 'ad') {
      timeline.from($('.ad-frame'), { x: -90, rotation: -5, autoAlpha: 0, duration: .85 }, 0)
        .from($('.ad-frame__art img'), { x: -130, y: 55, rotation: -8, scale: .72, autoAlpha: 0, duration: 1.35, ease: 'power3.inOut' }, .7)
        .from($('.ad-copy span'), { x: 24, autoAlpha: 0, duration: .55 }, 1.45)
        .from($('.ad-copy strong'), { y: 38, autoAlpha: 0, duration: .7 }, 2)
        .from($('.ad-copy p'), { y: 24, autoAlpha: 0, duration: .65 }, 3.1)
        .from($('.ad-frame__action b'), { x: 18, autoAlpha: 0, duration: .55 }, 4.4)
        .from($('.ad-destination'), { x: 80, autoAlpha: 0, duration: .9 }, 5.2)
        .to({}, { duration: 1.5 });
    } else {
      timeline.from($('.message--incoming'), { x: -80, autoAlpha: 0, duration: .75 }, 0)
        .from($('.message--outgoing'), { x: 80, autoAlpha: 0, duration: .85 }, 2)
        .from($$('.quote-path>div'), { y: 35, autoAlpha: 0, duration: .65, stagger: .42 }, 3.6)
        .from($$('.quote-path>i'), { scale: .25, autoAlpha: 0, duration: .38, stagger: .42 }, 4)
        .to({}, { duration: 1.5 });
    }
    timelines.set(section, timeline);
  }
  function completeForReduced() {
    timelines.forEach((timeline, section) => {
      if (reducedMotion.matches) { timeline.pause(0).progress(1); section.querySelector('.motion-status').textContent = 'Reduced motion · final frame'; }
      else { timeline.pause(0); section.querySelector('.motion-status').textContent = 'Ready to play'; }
    });
  }
  studies.forEach(build);
  // Exposes the same timeline clock for presenter scrubbing and frame inspection.
  window.GTPMotionStudies = Object.freeze({
    seek: (name, progress) => {
      const section = studies.find(item => item.dataset.study === name);
      if (!section) return false;
      timelines.get(section).pause().progress(Math.max(0, Math.min(1, Number(progress))));
      section.querySelector('.motion-status').textContent = 'Held for inspection';
      section.querySelector('.pause').textContent = 'Resume';
      return true;
    }
  });
  completeForReduced();
  reducedMotion.addEventListener('change', completeForReduced);
  studies.forEach(section => {
    const tl = timelines.get(section);
    section.querySelector('.play').addEventListener('click', () => {
      if (reducedMotion.matches) return;
      tl.restart(); section.querySelector('.pause').textContent = 'Pause';
    });
    section.querySelector('.pause').addEventListener('click', event => {
      if (reducedMotion.matches) return;
      if (tl.paused()) { tl.resume(); event.currentTarget.textContent = 'Pause'; section.querySelector('.motion-status').textContent = 'Playing'; }
      else { tl.pause(); event.currentTarget.textContent = 'Resume'; section.querySelector('.motion-status').textContent = 'Paused'; }
    });
    ScrollTrigger.create({ trigger: section, start: 'top 70%', once: true, onEnter: () => { if (!reducedMotion.matches) tl.play(0); } });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) timelines.forEach((tl, section) => { if (tl.isActive()) { tl.pause(); section.querySelector('.motion-status').textContent = 'Paused while hidden'; section.querySelector('.pause').textContent = 'Resume'; } });
  });
})();
