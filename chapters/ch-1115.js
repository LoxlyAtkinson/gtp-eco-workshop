// Scenes 11-15: Attract, Interact, Responsible AI, tools, keep learning.
// The page engine (scroll-presentation.js) owns auto-scroll, holds and Next.
// This file only reads scroll progress through ScrollTrigger, so the engine
// contract stays intact: arrival scrolls the scene, the hold keeps ambient
// motion alive, and Next restarts the engine's motion on the next scene.
(() => {
  'use strict';
  const scenes = ['11', '12', '13', '14', '15'].map(n => document.querySelector(`.scene[data-scene="${n}"]`)).filter(Boolean);
  if (!scenes.length) return;
  const G = window.gsap, ST = window.ScrollTrigger;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const q = (r, s) => r.querySelector(s), qa = (r, s) => [...r.querySelectorAll(s)];
  const phone = () => innerWidth <= 900;
  const byId = n => scenes.find(s => s.dataset.scene === n);

  // Holding the auto-scroll uses the engine's own header button, so the engine's
  // state, status chip and Space key stay the single source of truth.
  let pausedByUs = false;
  const autoState = () => document.getElementById('autoStatus')?.dataset.state;
  function holdScroll() { if (autoState() === 'running') { window.deckHold ? window.deckHold() : document.getElementById('motionButton')?.click(); pausedByUs = true; } }
  function releaseScroll() { if (pausedByUs && ['paused', 'held'].includes(autoState())) document.getElementById('motionButton')?.click(); pausedByUs = false; }

  // ---- Media slots: generated media replaces the stand-in when it exists ----
  const ready = el => el.parentElement.classList.add('has-media');
  const failed = el => { el.parentElement.classList.add('is-standin'); el.hidden = true; };
  qa(document, '.c15 img.c15-media').forEach(img => {
    img.addEventListener('load', () => ready(img));
    img.addEventListener('error', () => failed(img));
    if (img.complete) img.naturalWidth ? ready(img) : failed(img);
  });
  const videos = qa(document, '.c15 video.c15-media');
  videos.forEach(v => {
    const src = v.getAttribute('src');
    v.removeAttribute('src');
    fetch(src, { method: 'HEAD' }).then(r => {
      if (!r.ok) throw new Error('missing');
      v.src = src; v.preload = 'auto'; v.dataset.ok = '1';
      v.addEventListener('loadeddata', () => ready(v), { once: true });
    }).catch(() => failed(v));
  });
  const videoIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target; if (!v.dataset.ok) return;
    if (e.isIntersecting && !reduced.matches && !document.body.classList.contains('motion-paused')) v.play().catch(() => {}); else v.pause();
  }), { threshold: .2 }) : null;
  videos.forEach(v => videoIO?.observe(v));

  // ---- 11 · Switchboard ----
  const s11 = byId('11');
  const frame = s11 && q(s11, '.c15-studio__frame');
  if (frame) qa(s11, '[data-switch]').forEach(btn => btn.addEventListener('click', () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    const off = qa(s11, '[data-switch]').filter(b => b.getAttribute('aria-pressed') === 'false').map(b => b.dataset.switch);
    frame.dataset.off = off.join(' ');
    frame.classList.toggle('is-good', !off.length && frame.dataset.built === '1');
    holdScroll();
  }));

  // ---- 11 · Click-to-load ads (official players only) ----
  qa(document, '.c15-ad').forEach(card => q(card, '.c15-ad__play')?.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = card.dataset.embed; f.title = card.dataset.title;
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.referrerPolicy = 'strict-origin-when-cross-origin'; f.allowFullscreen = true;
    q(card, '.c15-ad__play').replaceWith(f);
    holdScroll();
  }));

  // ---- 12 · Click-to-burst ----
  const s12 = byId('12');
  const details = {
    oil: [['What', 'Cold-pressed marula oil for dry skin'], ['Size', '30 ml'], ['Price (demo)', 'R349'], ['Proof', 'Batch-dated, made in Pretoria East'], ['Ask', 'Ask us on WhatsApp']],
    butter: [['What', 'Rooibos and marula, for after the shower'], ['Size', '50 ml'], ['Price (demo)', 'R289'], ['Proof', 'Every ingredient listed on the label'], ['Ask', 'Ask us on WhatsApp']],
    gift: [['What', 'Face oil, body serum and hand cream'], ['Size', 'Wrapped, with a card'], ['Price (demo)', 'R899'], ['Proof', 'Delivered by Friday in Gauteng'], ['Ask', 'Build yours on WhatsApp']]
  };
  let burstTouched = false;
  function openProduct(btn, byUser) {
    if (!s12 || !btn) return;
    const beat = q(s12, '.c15-burst'), arc = q(beat, '.c15-arc'), chips = qa(arc, 'span');
    qa(beat, '.c15-prod').forEach(b => b.setAttribute('aria-expanded', String(b === btn)));
    details[btn.dataset.prod].forEach(([k, v], i) => { chips[i].innerHTML = `<b>${k}</b>${v}`; });
    const br = beat.getBoundingClientRect(), pr = btn.getBoundingClientRect();
    const cx = pr.left + pr.width / 2 - br.left, cy = pr.top + pr.height * .35 - br.top;
    const R = Math.min(br.width * (phone() ? .42 : .3), phone() ? 170 : 300);
    const n = chips.length;
    chips.forEach((chip, i) => {
      const a = Math.PI * (1.08 + .84 * i / (n - 1));
      const w = chip.offsetWidth, h = chip.offsetHeight;
      const x = Math.max(4, Math.min(br.width - w - 4, cx + Math.cos(a) * R - w / 2));
      const y = Math.max(4, Math.min(br.height - h - 4, cy + Math.sin(a) * R * .78 - h / 2));
      if (G && !reduced.matches) G.fromTo(chip, { x: cx - w / 2, y: cy - h / 2, scale: .2, autoAlpha: 0 }, { x, y, scale: 1, autoAlpha: 1, duration: .38, delay: i * .045, ease: 'back.out(1.7)', overwrite: true });
      else Object.assign(chip.style, { transform: `translate(${x}px,${y}px)`, opacity: 1, visibility: 'visible' });
    });
    if (byUser) { burstTouched = true; holdScroll(); }
  }
  if (s12) qa(s12, '.c15-prod').forEach(b => b.addEventListener('click', () => openProduct(b, true)));

  // ---- 12 · Grid dead end vs the walk-through builder ----
  if (s12) {
    const dead = q(s12, '.c15-deadend'), out = q(s12, '.c15-deadend__out');
    dead?.addEventListener('click', () => { out.classList.add('is-on'); if (G && !reduced.matches) G.fromTo(dead, { x: -6 }, { x: 0, duration: .4, ease: 'elastic.out(1,.3)' }); });
  }
  let builderTouched = false;
  function syncBuilder(animateBtn) {
    if (!s12) return;
    const picks = qa(s12, '[data-pick][aria-pressed="true"]').map(b => b.dataset.pick);
    const msg = q(s12, '.c15-chat__msg');
    msg.textContent = picks.length ? `Hi Amberkloof, I'd like a gift set: ${picks.join(', ')}. Can it arrive by Friday?` : 'Pick items and the order writes itself.';
    if (animateBtn && G && !reduced.matches) {
      const box = q(s12, '.c15-builder__box');
      const tok = document.createElement('b'); tok.className = 'c15-token'; box.appendChild(tok);
      const a = animateBtn.getBoundingClientRect(), b = box.getBoundingClientRect();
      G.fromTo(tok, { x: a.left - b.left - b.width * .3, y: a.top - b.top - b.height * .2, scale: 1.4, autoAlpha: 1 }, { x: 0, y: b.height * .2, scale: .4, autoAlpha: 0, duration: .55, ease: 'power2.in', onComplete: () => tok.remove() });
      G.fromTo(q(box, '.c15-builder__lid'), { rotationX: 62 }, { rotationX: 30, duration: .25, yoyo: true, repeat: 1 });
    }
  }
  function pick(btn, byUser) {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    if (on && qa(s12, '[data-pick][aria-pressed="true"]').length >= 3) return;
    btn.setAttribute('aria-pressed', String(on));
    syncBuilder(on ? btn : null);
    if (byUser) { builderTouched = true; holdScroll(); }
  }
  if (s12) qa(s12, '[data-pick]').forEach(b => b.addEventListener('click', () => pick(b, true)));

  // ---- 12 · The real oryzo.ai, in-scene ----
  function loadFrame(btn) {
    if (!btn || btn.dataset.loaded) return;
    btn.dataset.loaded = '1';
    const f = document.createElement('iframe');
    f.src = btn.dataset.frame; f.title = 'oryzo.ai by Lusion, loaded live from its own site';
    f.loading = 'eager'; f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.setAttribute('allow', 'autoplay; fullscreen');
    q(btn.parentElement, '.c15-live__holder').appendChild(f);
    btn.textContent = 'Loading oryzo.ai…';
  }
  const liveBtn = s12 && q(s12, '.c15-live__load');
  liveBtn?.addEventListener('click', () => { loadFrame(liveBtn); holdScroll(); });

  // ---- 13 · Check the claims ----
  const s13 = byId('13');
  const verdicts = {
    proven: 'Clinically proven? We have no study on file. Cut it, or link the study.',
    heals: "Heals eczema? That's a medical claim. A face oil can soothe dry skin. It can't promise to treat a condition.",
    number: "South Africa's #1? By what count? No source, so it goes.",
    review: 'We wrote this review ourselves. A made-up review misleads buyers. Use real ones, with permission.'
  };
  let claimsTouched = false;
  function strike(btn) { btn.classList.add('is-struck'); btn.setAttribute('aria-pressed', 'true'); q(s13, '.c15-page__fix').textContent = verdicts[btn.dataset.claim]; }
  if (s13) qa(s13, '.c15-claim').forEach(b => b.addEventListener('click', () => { claimsTouched = true; strike(b); holdScroll(); }));
  const answers = {
    list: ['no', 'Names and numbers are personal information under POPIA. Count or anonymise first.'],
    totals: ['yes', 'Totals with no names are fine to share.'],
    desc: ['yes', "It's already public. Paste away."],
    chat: ['no', "It's a private conversation. Ask permission, then remove names and numbers."],
    race: ['no', 'Race is special personal information under POPIA. Never paste it.']
  };
  function answer(li, choice) {
    const [right, why] = answers[li.dataset.item];
    qa(li, 'button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.answer === choice)));
    li.classList.toggle('is-right', choice === right); li.classList.toggle('is-wrong', choice !== right);
    q(li, 'small').textContent = (choice === right ? 'Right. ' : 'Not quite. ') + why;
  }
  let sortTouched = false;
  if (s13) qa(s13, '.c15-items li').forEach(li => qa(li, 'button').forEach(b => b.addEventListener('click', () => { sortTouched = true; answer(li, b.dataset.answer); holdScroll(); })));

  // ---- Tabs (14 report, 15 stages) ----
  function selectTab(btns, panels, key, attr, pattr) {
    btns.forEach(b => b.setAttribute('aria-selected', String(b.dataset[attr] === key)));
    panels.forEach(p => { p.hidden = p.dataset[pattr] !== key; });
  }
  const s14 = byId('14'), s15 = byId('15');
  let tabsTouched = false, stagesTouched = false;
  const reportTabs = s14 ? qa(s14, '[data-tab]') : [], reportPanels = s14 ? qa(s14, '[data-tabpanel]') : [];
  reportTabs.forEach(b => b.addEventListener('click', () => { tabsTouched = true; selectTab(reportTabs, reportPanels, b.dataset.tab, 'tab', 'tabpanel'); holdScroll(); }));
  const stageTabs = s15 ? qa(s15, '[data-stage-tab]') : [], stagePanels = s15 ? qa(s15, '[data-stage-panel]') : [];
  stageTabs.forEach(b => b.addEventListener('click', () => { stagesTouched = true; selectTab(stageTabs, stagePanels, b.dataset.stageTab, 'stageTab', 'stagePanel'); holdScroll(); }));

  // ---- 15 · The 7-day test ----
  const verbs = { Create: 'make one post', Convert: 'add one clear next step, like a WhatsApp button', 'Follow up': 'reply to every inquiry within the hour' };
  function planText() {
    const v = k => q(s15, `[data-pick-k="${k}"][aria-pressed="true"]`)?.textContent || '';
    const c = v('customer'), p = v('platform'), a = v('action'), m = v('measure');
    return `Customer: ${c}\nPlatform: ${p}\nAction: ${a}\nMeasure: ${m}\n\nTonight: ${verbs[a] || a} for ${c.toLowerCase()} on ${p}.\nThis week: count ${m.toLowerCase()} every day.\nDay 30, 60, 90: keep what worked, drop what didn't.`;
  }
  function renderPlan() { if (s15) q(s15, '.c15-plancard__text').textContent = planText(); }
  if (s15) {
    qa(s15, '[data-pick-k]').forEach(b => b.addEventListener('click', () => {
      qa(s15, `[data-pick-k="${b.dataset.pickK}"]`).forEach(o => o.setAttribute('aria-pressed', String(o === b)));
      renderPlan(); holdScroll();
    }));
    renderPlan();
    const copy = q(s15, '.c15-copy');
    copy.addEventListener('click', () => {
      const text = planText();
      const done = () => { copy.textContent = 'Copied'; setTimeout(() => { copy.textContent = 'Copy'; }, 1800); };
      const fallback = () => { const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch { } t.remove(); done(); };
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    });
    const timer = q(s15, '.c15-timer');
    let left = 40, id = 0;
    const paint = () => { q(timer, 'b').textContent = String(Math.ceil(left)); };
    timer.addEventListener('click', () => {
      if (timer.getAttribute('aria-pressed') === 'true') { clearInterval(id); left = 40; paint(); timer.setAttribute('aria-pressed', 'false'); releaseScroll(); return; }
      timer.setAttribute('aria-pressed', 'true'); left = 40; paint(); holdScroll();
      const t0 = performance.now();
      id = setInterval(() => { left = Math.max(0, 40 - (performance.now() - t0) / 1000); paint(); if (left <= 0) { clearInterval(id); timer.setAttribute('aria-pressed', 'false'); q(timer, 'b').textContent = 'Done'; releaseScroll(); } }, 250);
    });
  }

  // ---- Motion: one scrubbed timeline per scene ----
  if (!G || !ST || reduced.matches) return;
  G.registerPlugin(ST);
  document.documentElement.classList.add('c15-motion');

  // Talk seconds per beat after the owner's tier 1-3 cuts (spine v2.1 section 8).
  const seconds = {
    '11-1': 40, '11-2': 90, '11-7': 45, '11-8': 38, '11-9': 20, '11-10': 12,
    '12-1': 25, '12-2': 25, '12-4': 45, '12-5': 45, '12-6': 25, '12-9': 10, '12-11': 30, '12-12': 35, '12-13': 30, '12-14': 10, '12-16': 10,
    '13-1': 65, '13-3': 40, '13-5': 20, '13-6': 10,
    '14-1': 15, '14-2': 95, '14-8': 75, '14-12': 20, '14-13': 10,
    '15-1': 55, '15-3': 40, '15-5': 40, '15-6': 60, '15-7': 25
  };
  const ranges = new Map();
  scenes.forEach(scene => {
    const beats = qa(scene, '.c15-beat');
    const total = beats.reduce((s, b) => s + (seconds[b.dataset.beat] || 20), 0);
    let at = 0;
    beats.forEach(b => { const w = (seconds[b.dataset.beat] || 20) / total * .92; ranges.set(b, [at, at + w]); at += w; });
  });
  const local = (beat, p) => { const [a, b] = ranges.get(beat); return Math.max(0, Math.min(1, (p - a) / (b - a))); };
  const ambient = new Map(scenes.map(s => [s, []]));
  const loop = (scene, ...tweens) => ambient.get(scene).push(...tweens);

  function build(scene, inner) {
    const beats = qa(scene, '.c15-beat');
    const tl = G.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: .5, invalidateOnRefresh: true, onUpdate: self => state(scene, self.progress), onRefresh: self => state(scene, self.progress) } });
    beats.forEach((beat, i) => {
      const [a, b] = ranges.get(beat), d = Math.min(.022, (b - a) * .22);
      const kind = beat.dataset.enter || 'rise';
      const from = kind === 'punch' ? { autoAlpha: 0, scale: 1.3, filter: 'blur(10px)' } : kind === 'drop' ? { autoAlpha: 0, y: -50 } : { autoAlpha: 0, y: 46, scale: .985 };
      const to = { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: d };
      if (i === 0) tl.fromTo(beat, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)' }, { autoAlpha: 1, y: 0, duration: .001 }, 0);
      else tl.fromTo(beat, from, to, a);
      if (i < beats.length - 1) tl.to(beat, { autoAlpha: 0, y: -36, scale: .985, filter: 'blur(4px)', duration: d * .8 }, b - d * .8);
    });
    const at = (beat, f) => { const [a, b] = ranges.get(beat); return a + (b - a) * f; };
    inner(tl, at);
    tl.to({}, { duration: .001 }, .999);
    return tl;
  }
  const B = (scene, sel) => q(scene, sel);

  // 11 · Attract
  if (s11) {
    const studio = B(s11, '.c15-studio'), why = B(s11, '.c15-why'), gal = B(s11, '.c15-gallery'), ours = B(s11, '.c15-ourpair'), pull = B(s11, '.c15-pullback'), ai = B(s11, '.c15-ai');
    gal.dataset.enter = 'punch';
    build(s11, (tl, at) => {
      tl.fromTo(qa(ai, '.c15-ai__tail'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .05, stagger: .02 }, at(ai, .12))
        .fromTo(qa(ai, '.c15-ai__ghost'), { autoAlpha: 1, x: 0 }, { autoAlpha: .25, x: -20, duration: .04 }, at(ai, .1))
        .fromTo(qa(ai, '.c15-ai__lines p'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .03, stagger: .03 }, at(ai, .45));
      // The stage builds layer by layer: light, depth, break-out, offer, next step (17/15/19/13/26 s).
      const cut = [0, 17, 32, 51, 64, 90].map(s => s / 90);
      const seg = k => at(studio, cut[k] + .02);
      tl.fromTo(B(s11, '.c15-layer--light'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .03 }, seg(0) + .01)
        .fromTo(B(s11, '.c15-flat__standin'), { rotation: 0 }, { rotation: 3, duration: .03 }, seg(0))
        .fromTo(qa(s11, '.c15-block'), { autoAlpha: 0, y: 30 }, { autoAlpha: .85, y: 0, duration: .03, stagger: .008 }, seg(1))
        .fromTo(B(s11, '.c15-plinth'), { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .03 }, seg(1))
        .fromTo(B(s11, '.c15-layer--depth'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .01 }, seg(1))
        .fromTo(B(s11, '.c15-studio__frame'), { scale: 1 }, { scale: 1.03, duration: .1 }, seg(1))
        .fromTo(B(s11, '.c15-layer--breakout'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .01 }, seg(2))
        .fromTo(B(s11, '.c15-phone'), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .02 }, seg(2))
        .fromTo(qa(s11, '.c15-float'), { y: 90, scale: .35, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .035, stagger: .006, ease: 'power2.out' }, seg(2) + .012)
        .fromTo(B(s11, '.c15-giant'), { xPercent: -30, autoAlpha: 0 }, { xPercent: -70, autoAlpha: .55, duration: .12 }, seg(2))
        .fromTo(B(s11, '.c15-layer--offer'), { autoAlpha: 0, scale: .85 }, { autoAlpha: 1, scale: 1, duration: .025, ease: 'back.out(2)' }, seg(3))
        .fromTo(B(s11, '.c15-layer--cta'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .025 }, seg(4))
        .fromTo(B(s11, '.c15-switch'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .02 }, seg(4) + .03);
      tl.fromTo(qa(why, '.c15-pair'), { autoAlpha: 0, y: 40, rotation: i => i ? 3 : -3 }, { autoAlpha: 1, y: 0, rotation: 0, duration: .03, stagger: .03 }, at(why, .1))
        .fromTo(qa(why, '.c15-shelf--mess i'), { y: 0 }, { y: i => (i % 2 ? 8 : -6), duration: .06 }, at(why, .3))
        .fromTo(B(why, '.c15-why__line'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .02 }, at(why, .55));
      tl.fromTo(qa(gal, '.c15-ad'), { autoAlpha: 0, scale: 1.25, z: 0, filter: 'blur(8px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: .025, stagger: .012, ease: 'power3.out' }, at(gal, .06));
      tl.fromTo(qa(ours, 'figure'), { autoAlpha: 0, y: 60, rotation: i => [-6, 4, 8][i] }, { autoAlpha: 1, y: 0, rotation: 0, duration: .025, stagger: .015 }, at(ours, .05));
      tl.fromTo(B(pull, '.c15-window'), { scale: 1.7, transformOrigin: '50% 60%' }, { scale: 1, duration: .04, ease: 'power2.out' }, at(pull, .05))
        .fromTo(B(pull, '.c15-ref'), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: .02 }, at(pull, .3));
    });
    const steps = qa(s11, '.c15-steps li'), names = ['light', 'depth', 'breakout', 'offer', 'cta'], cut = [0, 17, 32, 51, 64, 90].map(s => s / 90);
    s11._state = p => {
      const t = local(studio, p);
      const k = t <= 0 ? -1 : cut.filter(c => t >= c + .02).length - 1;
      steps.forEach((li, i) => li.classList.toggle('is-on', i === Math.min(4, k)));
      frame.dataset.built = t >= cut[4] + .03 ? '1' : '0';
      frame.classList.toggle('is-good', t >= cut[4] + .03 && !(frame.dataset.off || '').trim());
    };
    loop(s11,
      G.to(qa(s11, '.c15-float'), { yPercent: -9, rotation: 4, duration: 2.4, ease: 'sine.inOut', stagger: { each: .4, repeat: -1, yoyo: true } }),
      G.to(qa(s11, '.c15-window__standin svg, .c15-reel__standin svg'), { y: -8, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: .3 }),
      G.to(qa(s11, '.c15-window__glow, .c15-counter__glow'), { opacity: .7, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(qa(s11, '.c15-ai__row strong'), { textShadow: '0 0 28px #d98a3e', duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    );
  }

  // 12 · Interact
  if (s12) {
    const front = B(s12, '.c15-front'), burst = B(s12, '.c15-burst'), sel = B(s12, '.c15-select'), sites = B(s12, '.c15-sites'), judge = B(s12, '.c15-judge'), rec = B(s12, '.c15-recreate'), reint = B(s12, '.c15-reint'), shat = B(s12, '.c15-shatter'), teach = B(s12, '.c15-teach'), ask = B(s12, '.c15-askus');
    build(s12, (tl, at) => {
      tl.fromTo(B(front, '.c15-window'), { scale: 1 }, { scale: 1.12, duration: .07 }, at(front, 0));
      tl.fromTo(qa(burst, '.c15-prod'), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: .02, stagger: .008, ease: 'power3.out' }, at(burst, .04));
      tl.fromTo(B(sel, '.c15-grid'), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: .02 }, at(sel, .04))
        .fromTo(B(sel, '.c15-builder'), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: .02 }, at(sel, .12))
        .fromTo(B(sel, '.c15-builder__box'), { rotationY: -25 }, { rotationY: 25, duration: .1 }, at(sel, .1));
      tl.fromTo(B(sites, '.c15-plain'), { autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0, duration: .02 }, at(sites, .04))
        .fromTo(B(sites, '.c15-live'), { autoAlpha: 0, x: 50 }, { autoAlpha: 1, x: 0, duration: .02 }, at(sites, .14))
        .fromTo(B(sites, '.c15-plain__page'), { y: 0 }, { y: -14, duration: .1 }, at(sites, .2));
      tl.fromTo(qa(teach, 'h3, p'), { autoAlpha: 0, y: 30, letterSpacing: '0.02em' }, { autoAlpha: 1, y: 0, letterSpacing: '-0.06em', duration: .012, stagger: .008 }, at(teach, .05));
      tl.fromTo(qa(judge, '.c15-critic'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .015, stagger: .012 }, at(judge, .06))
        .fromTo(qa(judge, '.c15-critic b'), { scale: 2.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .008, stagger: .012, ease: 'power4.in' }, at(judge, .3))
        .fromTo(B(judge, '.c15-fix'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .015 }, at(judge, .62));
      tl.fromTo(qa(rec, '.c15-chain > *'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: .012, stagger: .012 }, at(rec, .06));
      tl.fromTo(qa(reint, '.c15-chain > *'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: .012, stagger: .012 }, at(reint, .06))
        .fromTo(qa(reint, '.c15-mini-burst i'), { x: 0, y: 0 }, { x: i => Math.cos(Math.PI * (1.1 + .2 * i)) * 70, y: i => Math.sin(Math.PI * (1.1 + .2 * i)) * 46, duration: .03, stagger: .004, ease: 'back.out(2)' }, at(reint, .45));
      const shards = qa(shat, '.c15-shard');
      tl.fromTo(shards, { autoAlpha: 0 }, { autoAlpha: 1, duration: .001 }, at(shat, .25))
        .fromTo(B(shat, '.c15-generic span'), { autoAlpha: 1 }, { autoAlpha: 0, duration: .005 }, at(shat, .26))
        .fromTo(shards, { x: 0, y: 0, rotation: 0, clipPath: i => `polygon(${i * 16}% 0,${i * 16 + 20}% 0,${i * 16 + 8}% 100%,${i * 16 - 10}% 100%)` }, { x: i => (i - 2.5) * 70, y: i => (i % 2 ? 1 : -1) * 90, rotation: i => (i - 2.5) * 14, autoAlpha: 0, duration: .02, ease: 'power2.out' }, at(shat, .28))
        .fromTo(B(shat, '.c15-taught'), { autoAlpha: 0, scale: .9 }, { autoAlpha: 1, scale: 1, duration: .012 }, at(shat, .4));
      tl.fromTo(qa(ask, '.c15-bubble'), { autoAlpha: 0, y: 24, scale: .9 }, { autoAlpha: 1, y: 0, scale: 1, duration: .01, stagger: .012 }, at(ask, .1));
    });
    const autoPicks = ['Marula Face Oil', 'Rooibos Body Serum', 'Gift wrap and card'];
    s12._state = p => {
      const tb = local(burst, p);
      if (!burstTouched && tb > .35 && tb < 1 && !qa(burst, '[aria-expanded="true"]').length) openProduct(q(burst, '[data-prod="oil"]'), false);
      if (!burstTouched && tb > .7 && tb < 1 && q(burst, '[data-prod="oil"]').getAttribute('aria-expanded') === 'true') openProduct(q(burst, '[data-prod="gift"]'), false);
      if (!builderTouched) {
        const ts = local(sel, p), want = ts > .78 ? 3 : ts > .58 ? 2 : ts > .38 ? 1 : 0;
        const have = qa(s12, '[data-pick][aria-pressed="true"]').length;
        if (want !== have) { qa(s12, '[data-pick]').forEach(b => b.setAttribute('aria-pressed', String(autoPicks.indexOf(b.dataset.pick) > -1 && autoPicks.indexOf(b.dataset.pick) < want))); syncBuilder(want > have ? q(s12, `[data-pick="${autoPicks[want - 1]}"]`) : null); }
      }
      if (local(sites, p) > 0 && p < ranges.get(sites)[1] + .1) loadFrame(liveBtn);
    };
    loop(s12,
      G.to(qa(s12, '.c15-prod svg'), { y: -8, duration: 2.3, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: .35 }),
      G.to(qa(s12, '.c15-window__glow'), { opacity: .72, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(qa(s12, '.c15-bubble'), { yPercent: -12, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: .5 }),
      G.to(qa(s12, '.c15-taught svg, .c15-chain__out svg'), { y: -7, duration: 2.1, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    );
  }

  // 13 · Responsible AI
  if (s13) {
    const draft = B(s13, '.c15-draft'), sort = B(s13, '.c15-sort'), three = B(s13, '.c15-three'), cons = B(s13, '.c15-consent');
    build(s13, (tl, at) => {
      tl.fromTo(B(draft, '.c15-page'), { autoAlpha: 0, y: 60, rotation: -1.5 }, { autoAlpha: 1, y: 0, rotation: 0, duration: .03 }, at(draft, .02))
        .fromTo(B(draft, '.c15-page__honest'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .03 }, at(draft, .84));
      tl.fromTo(qa(sort, '.c15-items li'), { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: .02, stagger: .015 }, at(sort, .05));
      tl.fromTo(qa(three, '.c15-words span'), { autoAlpha: 0, y: 60, scale: 1.2 }, { autoAlpha: 1, y: 0, scale: 1, duration: .015, stagger: .03, ease: 'power3.out' }, at(three, .02))
        .fromTo(B(three, '.c15-sub'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .02 }, at(three, .6));
      tl.fromTo(B(cons, '.c15-runline i'), { scaleX: 0 }, { scaleX: 1, duration: .06 }, at(cons, .1));
    });
    const order = ['proven', 'heals', 'number', 'review'];
    s13._state = p => {
      if (!claimsTouched) {
        const t = local(draft, p), n = t >= 1 ? 4 : Math.max(0, Math.min(4, Math.floor((t - .18) / .16) + 1));
        qa(draft, '.c15-claim').forEach(b => { const on = order.indexOf(b.dataset.claim) < n; b.classList.toggle('is-struck', on); b.setAttribute('aria-pressed', String(on)); });
        q(draft, '.c15-page__fix').textContent = n ? verdicts[order[n - 1]] : '';
      }
      if (!sortTouched) {
        const show = local(sort, p) > .8;
        qa(sort, '.c15-items li').forEach(li => { if (show) answer(li, answers[li.dataset.item][0]); else { li.classList.remove('is-right', 'is-wrong'); q(li, 'small').textContent = ''; qa(li, 'button').forEach(b => b.setAttribute('aria-pressed', 'false')); } });
      }
    };
    loop(s13,
      G.to(B(s13, '.c15-page'), { yPercent: -1.5, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(B(s13, '.c15-consent__card'), { y: -6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(B(s13, '.c15-runline i'), { filter: 'brightness(1.5)', duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(qa(s13, '.c15-words span'), { yPercent: -6, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: .3 })
    );
  }

  // 14 · Tools: a data tunnel, the site morphs into the report, panels punch through
  if (s14) {
    const ped = B(s14, '.c15-pedestal'), rep = B(s14, '.c15-report'), tb = B(s14, '.c15-toolb'), qr = B(s14, '.c15-qr'), tl2 = B(s14, '.c15-tolearn');
    rep.dataset.enter = 'punch'; tl2.dataset.enter = 'drop';
    build(s14, (tl, at) => {
      tl.fromTo(qa(ped, '.c15-tunnel i:not(.c15-orbit)'), { scale: 1 }, { scale: 1.9, autoAlpha: 0, duration: .07, stagger: .006 }, at(ped, .25))
        .fromTo(qa(ped, '.c15-site-morph__body i'), { borderRadius: 6, scaleY: 1 }, { borderRadius: 14, scaleY: 1.5, backgroundColor: '#7fd3a833', duration: .04, stagger: .006 }, at(ped, .4))
        .fromTo(B(ped, '.c15-site-morph'), { scale: 1 }, { scale: 1.6, autoAlpha: 0, duration: .03 }, at(ped, .75));
      tl.fromTo(qa(rep, '.c15-panel'), { autoAlpha: 0, scale: 1.25, filter: 'blur(8px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: .02, stagger: .02 }, at(rep, .05))
        .fromTo(B(rep, '.c15-tabs'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .02 }, at(rep, .5));
      tl.fromTo(qa(tb, '.c15-flow > *'), { autoAlpha: 0, x: 60, rotationY: -20 }, { autoAlpha: 1, x: 0, rotationY: 0, duration: .025, stagger: .03 }, at(tb, .05))
        .fromTo(qa(tb, '.c15-kit__sw i'), { scale: 0 }, { scale: 1, duration: .01, stagger: .005, ease: 'back.out(3)' }, at(tb, .6));
      tl.fromTo(qa(qr, '.c15-qrcard'), { autoAlpha: 0, y: 60, rotation: i => (i ? 4 : -4) }, { autoAlpha: 1, y: 0, rotation: 0, duration: .02, stagger: .015 }, at(qr, .08));
      tl.fromTo(B(tl2, '.c15-learncard'), { scale: 1.2 }, { scale: .8, y: 60, duration: .03 }, at(tl2, .4));
    });
    const keys = ['strong', 'gaps', 'next'];
    s14._state = p => { if (!tabsTouched) { const t = local(rep, p); selectTab(reportTabs, reportPanels, keys[t > .82 ? 2 : t > .66 ? 1 : 0], 'tab', 'tabpanel'); } };
    loop(s14,
      G.to(B(s14, '.c15-orbit'), { rotation: 360, duration: 9, ease: 'none', repeat: -1 }),
      G.to(B(s14, '.c15-learncard'), { yPercent: -8, rotation: 2, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(qa(s14, '.c15-qrcard'), { yPercent: -3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: .6 }),
      G.to(B(s14, '.c15-post svg'), { y: -6, rotation: 3, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    );
  }

  // 15 · Keep learning: the box opens, skills spiral into orbit, the lid closes
  if (s15) {
    const box = B(s15, '.c15-box'), ws = B(s15, '.c15-withskill'), learn = B(s15, '.c15-learn'), plan = B(s15, '.c15-plan'), close = B(s15, '.c15-close');
    build(s15, (tl, at) => {
      tl.fromTo(B(box, '.c15-giftbox__lid'), { y: 0, rotation: 0 }, { y: -70, rotation: -10, duration: .03, ease: 'power2.out' }, at(box, .05));
      const skills = qa(box, '.c15-skills li');
      tl.fromTo(skills, { autoAlpha: 0, scale: .1, rotation: i => 160 - i * 20, x: i => (i % 2 ? -1 : -1.6) * (phone() ? 60 : 260), y: i => (phone() ? -80 : 120) + i * 4 }, { autoAlpha: 1, scale: 1, rotation: 0, x: 0, y: 0, duration: .03, stagger: .018, ease: 'power3.out' }, at(box, .14))
        .fromTo(B(box, '.c15-skills__src'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .02 }, at(box, .85));
      tl.fromTo(qa(ws, '.c15-ws'), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .02, stagger: .02 }, at(ws, .05));
      tl.fromTo(qa(learn, '.c15-links li'), { autoAlpha: .4, y: 10 }, { autoAlpha: 1, y: 0, duration: .02 }, at(learn, .05));
      tl.fromTo(qa(plan, 'fieldset'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .015, stagger: .012 }, at(plan, .04))
        .fromTo(B(plan, '.c15-plancard'), { autoAlpha: 0, x: 50 }, { autoAlpha: 1, x: 0, duration: .02 }, at(plan, .2));
      tl.fromTo(qa(close, '.c15-words span'), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .01, stagger: .012 }, at(close, .04))
        .fromTo(B(close, '.c15-closebox__bottle'), { y: -170 }, { y: 0, duration: .025, ease: 'power2.in' }, at(close, .2))
        .fromTo(B(close, '.c15-closebox__lid'), { y: -90, rotation: -14 }, { y: 0, rotation: 0, duration: .02, ease: 'bounce.out' }, at(close, .45))
        .fromTo(B(close, '.c15-takeaway'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .02 }, at(close, .55));
    });
    const stageKeys = ['engage', 'convert', 'optimize', 'attract', 'ai', 'support'];
    s15._state = p => { if (!stagesTouched) { const t = local(learn, p); const k = Math.min(5, Math.max(0, Math.floor(t * 6))); selectTab(stageTabs, stagePanels, stageKeys[k], 'stageTab', 'stagePanel'); } };
    loop(s15,
      G.to(qa(s15, '.c15-skills li'), { yPercent: -10, duration: 2, ease: 'sine.inOut', stagger: { each: .25, repeat: -1, yoyo: true } }),
      G.to(B(s15, '.c15-giftbox'), { y: -6, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(B(s15, '.c15-closebox'), { y: -7, rotation: 1.5, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(B(s15, '.c15-takeaway'), { yPercent: -4, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    );
  }

  // Every scene: the key light drifts so a hold never freezes.
  scenes.forEach(scene => { const key = q(scene, '.c15-sky__key'); if (key) loop(scene, G.to(key, { xPercent: -14, yPercent: 10, scale: 1.12, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 })); });

  function state(scene, p) { scene._state?.(p); }

  // Loops sleep off screen and while the presenter has paused (Space).
  const visible = new Set();
  const sync = () => { const paused = document.body.classList.contains('motion-paused'); scenes.forEach(s => ambient.get(s).forEach(t => (visible.has(s) && !paused) ? t.resume() : t.pause())); };
  scenes.forEach(scene => ST.create({ trigger: scene, start: 'top bottom', end: 'bottom top', onToggle: self => { self.isActive ? visible.add(scene) : visible.delete(scene); sync(); }, onRefresh: self => { self.isActive ? visible.add(scene) : visible.delete(scene); sync(); } }));
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Arrival: the first beat plays its entrance whenever a scene comes in from above.
  // Only elements the scrubbed timelines never touch, so the two never fight.
  const intro = { '11': '.c15-ai__word', '12': '.c15-front h2, .c15-front .c15-sub', '13': '.c15-draft h2', '14': '.c15-pedestal h2, .c15-source', '15': '.c15-box h2' };
  scenes.forEach(scene => {
    const kids = qa(scene, intro[scene.dataset.scene]);
    ST.create({ trigger: scene, start: 'top 60%', onEnter: () => G.fromTo(kids, { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, stagger: .14, ease: 'power3.out', overwrite: 'auto' }) });
  });

  ST.refresh();
  document.fonts?.ready.then(() => ST.refresh());
  addEventListener('load', () => ST.refresh(), { once: true });
})();
