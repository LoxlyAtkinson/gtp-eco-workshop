// Chapter 08-10 (Convert: capture, follow up; Optimize). Loaded after
// scroll-presentation.js, which owns auto-scroll, holds and Next. This file only
// reads the engine's public surface: the #autoStatus data-state, the Pause
// button and each scene's scroll position. CSS holds every end state, so reduced
// motion, print and a failed script all read a complete static page.
(() => {
  'use strict';
  const S8 = document.querySelector('.cx-08'), S9 = document.querySelector('.cx-09'), S10 = document.querySelector('.cx-10');
  if (!S8 || !S9 || !S10) return;
  const G = window.gsap, ST = window.ScrollTrigger;
  const q = (r, s) => r.querySelector(s), qa = (r, s) => [...r.querySelectorAll(s)];
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const ramp = (p, a, b) => clamp01((p - a) / (b - a));
  const motionOn = () => document.documentElement.classList.contains('cx-motion');
  const paused = () => document.body.classList.contains('motion-paused');

  // ---- Generated media: show the file when it loads, keep the stand-in when it is missing.
  qa(document, '.cx [data-media-slot]').forEach(fig => {
    const media = fig.querySelector('img,video');
    if (!media) return;
    const ok = () => fig.classList.add('has-media');
    const bad = () => { fig.classList.add('is-standin'); media.remove(); };
    if (media.tagName === 'IMG') {
      if (media.complete) { media.naturalWidth ? ok() : bad(); return; }
      media.addEventListener('load', ok, { once: true });
      media.addEventListener('error', bad, { once: true });
    } else {
      media.querySelector('source')?.addEventListener('error', bad, { once: true });
      media.addEventListener('error', bad, { once: true });
      media.addEventListener('loadeddata', ok, { once: true });
    }
  });

  // ---- A click on an in-scene control holds the auto-scroll, like scene 02.
  // Uses the engine's own Pause control; Space or Next resumes.
  const statusEl = document.getElementById('autoStatus'), pauseBtn = document.getElementById('motionButton');
  const hold = () => { if (statusEl?.dataset.state === 'running') window.deckHold ? window.deckHold() : pauseBtn?.click(); };

  // ---- Real embeds load only on a click (no third-party request before the presenter asks).
  qa(document, '.cx [data-cx-embed]').forEach(box => {
    q(box, '.cx-embed__play')?.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      const src = box.dataset.cxEmbed;
      frame.src = src.includes('youtube.com') ? `${src}?autoplay=1&rel=0` : src;
      frame.title = box.dataset.cxTitle || 'Embedded example';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      box.append(frame);
      box.classList.add('is-loaded');
      hold();
    });
  });

  // ---- 08-3 AI helper. Public deck: the scripted demo, labelled. On stage (local
  // host or ?stage): the presenter's click is the go-ahead for one live run on the
  // fixed fictional question; any failure keeps the scripted answer, tagged.
  const onStage = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || new URLSearchParams(location.search).has('stage');
  const runBtn = q(S8, '[data-cx-run="helper"]'), liveTag = q(S8, '[data-cx-live="tag"]');
  const liveAnswer = q(S8, '[data-cx-live="answer"]'), liveSource = q(S8, '[data-cx-live="source"]');
  const scripted = liveAnswer.textContent;
  const setTag = (state, text, source) => { liveTag.dataset.state = state; liveTag.textContent = text; if (source) liveSource.textContent = source; };
  if (onStage && runBtn) runBtn.hidden = false;
  runBtn?.addEventListener('click', async () => {
    hold();
    runBtn.disabled = true;
    setTag('running', 'Running', 'Live run starting · fictional question only');
    try {
      const mod = await import(new URL('live-runner/client.js', document.baseURI).href);
      mod.createLiveRun({
        kind: 'helper',
        consent: true,
        request: { business: 'Amberkloof (fictional demo brand)', question: 'I need a gift for my mom. She has sensitive skin. Which one should I get?', fictional: true },
        onUpdate: st => {
          if (st.phase === 'live' && st.result) {
            const text = String(st.result.text || '').trim();
            if (text) liveAnswer.textContent = text.length > 320 ? `${text.slice(0, 317)}...` : text;
            setTag('live', 'Live', `Live run · fictional question · ${st.source?.at || ''}`);
          } else if (st.phase === 'cached') {
            liveAnswer.textContent = scripted;
            setTag('cached', 'Scripted fallback', `Scripted fallback · ${mod.reasonLine(st) || 'live run unavailable'} · fictional customer`);
          }
        },
      }).start({ reveal: true });
    } catch {
      setTag('cached', 'Scripted fallback', 'Scripted fallback · live runner not loaded · fictional customer');
    }
  });

  // ---- 08-4 dwell timers: real time while the beat is on screen (x10 on
  // fast-forward), never behind the scroll, so the offer opens before the beat ends.
  const dwell = q(S8, '.cx08-dwell'), ffBtn = q(S8, '[data-cx-ff]'), points = qa(S8, '[data-cx-dwell]');
  const dwellState = { real: 0, ff: false, scroll: 0 };
  ffBtn.addEventListener('click', () => { dwellState.ff = !dwellState.ff; ffBtn.setAttribute('aria-pressed', String(dwellState.ff)); });
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function renderDwell() {
    const base = motionOn() ? Math.max(dwellState.real, dwellState.scroll) : 34;
    let due = false;
    points.forEach((pt, k) => {
      const v = base * (k ? .74 : 1);
      q(pt, 'output').textContent = fmt(v);
      pt.style.setProperty('--t', Math.min(1, v / 30).toFixed(3));
      pt.classList.toggle('is-due', v >= 30);
      due = due || v >= 30;
    });
    dwell.classList.toggle('is-due', due);
  }

  // ---- 09 channel picker (click holds; the scroll walks the four places otherwise).
  const orbitBox = q(S9, '.cx09-orbit'), chButtons = qa(S9, '[data-cx-channel]');
  const chOrder = ['web', 'whatsapp', 'dm', 'slack'];
  let chManual = null;
  function pickChannel(kind) {
    if (orbitBox.dataset.pick === kind) return;
    orbitBox.dataset.pick = kind;
    chButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cxChannel === kind)));
  }
  chButtons.forEach(b => b.addEventListener('click', () => { chManual = b.dataset.cxChannel; pickChannel(chManual); hold(); }));

  // ---- 09-6 volunteer pick.
  const pickOut = q(S9, '.cx09-vote__out');
  const pickText = { good: 'Helpful: it answers the price, the deadline and the next step.', avg: 'Vague: she still does not know if it arrives by Friday.' };
  qa(S9, '[data-cx-pick]').forEach(b => b.addEventListener('click', () => {
    qa(S9, '[data-cx-pick]').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    pickOut.textContent = pickText[b.dataset.cxPick];
    q(S9, '.cx09-dial--good').classList.toggle('is-chosen', b.dataset.cxPick === 'good');
    q(S9, '.cx09-dial--avg').classList.toggle('is-chosen', b.dataset.cxPick === 'avg');
    hold();
  }));

  // ---- 09-8 Send: the welcome goes at once; the day marker then walks both lanes.
  const sendBtn = q(S9, '[data-cx-send]'), welcome = q(S9, '.cx09-welcome'), laneMsgs = qa(S9, '.cx09-lane span'), marker = q(S9, '.cx09-days__marker');
  let sent = false, sentManual = false;
  function setSent(on) {
    if (sent === on) return;
    sent = on;
    sendBtn.setAttribute('aria-pressed', String(on));
    sendBtn.textContent = on ? 'Sent' : 'Send';
    welcome.classList.toggle('is-sent', on);
    if (on && G && motionOn()) G.fromTo(welcome, { scale: .86, boxShadow: '0 0 0 0 rgba(255,216,137,.8)' }, { scale: 1, boxShadow: '0 0 0 22px rgba(255,216,137,0)', duration: .7, ease: 'back.out(2)' });
  }
  sendBtn.addEventListener('click', () => { sentManual = true; setSent(true); hold(); });
  function renderDays(dayFrac) {
    const day = sent ? dayFrac * 10 : 0;
    marker.style.setProperty('--day', (sent ? dayFrac : 0).toFixed(3));
    laneMsgs.forEach(m => m.classList.toggle('is-sent', sent && day >= Number(m.dataset.day) - .01));
  }

  // ---- 09-9 pipeline: Advance deal moves Tumelo's deal one box; counts update.
  const boxes = qa(S9, '[data-cx-box]'), deal = q(S9, '.cx09-deal'), baseCounts = [4, 2, 3, 5];
  let dealAt = 0, dealManual = -1;
  function renderDeal(i) {
    dealAt = i;
    boxes.forEach((b, k) => {
      const n = baseCounts[k] + (k === i ? 1 : 0);
      q(b, 'output').textContent = String(n);
      b.classList.toggle('is-here', k === i);
    });
    const target = boxes[i], row = target.parentElement;
    const x = target.offsetLeft - row.offsetLeft + target.offsetWidth / 2 - deal.offsetWidth / 2;
    const maxX = Math.max(0, row.offsetWidth - deal.offsetWidth);
    const tx = Math.max(0, Math.min(maxX, x));
    if (G && motionOn()) G.to(deal, { x: tx, duration: .55, ease: 'power3.inOut', overwrite: 'auto' });
    else deal.style.transform = `translateX(${tx}px)`;
  }
  q(S9, '[data-cx-advance]').addEventListener('click', () => { dealManual = (dealAt + 1) % 4; renderDeal(dealManual); hold(); });

  // ---- 09-11/12 funnel tabs.
  const tabs = qa(S9, '[data-cx-funnel]'), flows = qa(S9, '[data-cx-flow]');
  let funnelManual = null;
  function showFunnel(kind) {
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.cxFunnel === kind)));
    flows.forEach(f => { f.hidden = f.dataset.cxFlow !== kind; });
  }
  tabs.forEach(t => t.addEventListener('click', () => { funnelManual = t.dataset.cxFunnel; showFunnel(funnelManual); hold(); }));
  showFunnel('cart');

  // ---- 10-3 tap to sort.
  const posts = qa(S10, '[data-cx-post]'), whys = qa(S10, '[data-cx-for]');
  const manualSorted = new Set();
  function sortPost(post, on) {
    const id = post.dataset.cxPost;
    if (on) post.dataset.sorted = post.dataset.verdict; else delete post.dataset.sorted;
    post.setAttribute('aria-pressed', String(on));
    whys.filter(w => w.dataset.cxFor === id).forEach(w => w.classList.toggle('is-lit', on));
  }
  posts.forEach(p => p.addEventListener('click', () => { manualSorted.add(p.dataset.cxPost); sortPost(p, true); hold(); }));

  // ---- Per-scene progress (works with and without motion).
  const progressOf = s => { const r = s.getBoundingClientRect(); return clamp01(-r.top / Math.max(1, r.height - innerHeight)); };
  const kpis = qa(S10, '.cx10-kpis b[data-count]'), rankNums = qa(S8, '.cx08-rank b[data-count]');
  const typeOuts = qa(S8, '.cx08-capture output'), stars = qa(S9, '.cx09-stars i'), bars = q(S10, '.cx10-bars');
  const autoSort = [['tue', .33], ['thu', .39], ['mon', .46], ['fri', .52], ['wed', .57]];
  const oursVideo = q(S8, '.cx08-ours video');
  function on08(p) {
    rankNums.forEach(b => { const n = Number(b.dataset.count) * ramp(p, .065, .095); b.textContent = Math.round(n).toLocaleString('en-ZA').replace(/ /g, ','); });
    typeOuts.forEach((o, i) => { const full = o.dataset.type, f = ramp(p, .29 + i * .012, .3 + i * .012); o.textContent = full.slice(0, Math.round(full.length * f)); o.classList.toggle('is-typing', f > 0 && f < 1); });
    dwellState.scroll = 34 * ramp(p, .38, .455);
    if (p < .37) dwellState.real = 0;
    renderDwell();
    if (oursVideo && oursVideo.isConnected) {
      const play = p > .545 && p < .605 && !paused() && !document.hidden;
      if (play && oursVideo.paused) oursVideo.play().catch(() => {});
      else if (!play && !oursVideo.paused) oursVideo.pause();
    }
  }
  function on09(p) {
    const auto = p < .078 ? 0 : p < .1092 ? 1 : p < .1403 ? 2 : 3;
    if (chManual && chOrder.indexOf(chManual) < auto) chManual = null;
    pickChannel(chManual || chOrder[auto]);
    if (!sentManual) setSent(p >= .36);
    renderDays(ramp(p, .37, .455));
    const autoDeal = Math.min(3, Math.floor(ramp(p, .49, .565) * 4));
    const want = dealManual >= autoDeal ? dealManual : autoDeal;
    if (want !== dealAt) { if (dealManual < autoDeal) dealManual = -1; renderDeal(want); }
    stars.forEach((s, k) => s.style.setProperty('--f', ramp(p, .6 + k * .005, .605 + k * .005).toFixed(3)));
    if (!funnelManual) showFunnel(p < .6861 ? 'cart' : 'onboard');
  }
  function on10(p) {
    kpis.forEach(b => { b.textContent = Math.round(Number(b.dataset.count) * ramp(p, .15, .25)).toLocaleString('en-ZA').replace(/ /g, ','); });
    bars.style.setProperty('--grow', ramp(p, .17, .27).toFixed(3));
    autoSort.forEach(([id, at]) => { if (manualSorted.has(id)) return; const post = posts.find(x => x.dataset.cxPost === id); const on = p >= at; if ((post.dataset.sorted !== undefined) !== on) sortPost(post, on); });
    S10.classList.toggle('is-double', p >= .66);
    S10.classList.toggle('is-quiet', p >= .85);
  }
  function staticState() {
    dwellState.real = 34; renderDwell();
    pickChannel('web'); setSent(true); renderDays(1); renderDeal(0);
    stars.forEach(s => s.style.setProperty('--f', '1'));
    typeOuts.forEach(o => { o.textContent = o.dataset.type; });
    rankNums.forEach(b => { b.textContent = Number(b.dataset.count).toLocaleString('en-ZA').replace(/ /g, ','); });
    kpis.forEach(b => { b.textContent = Number(b.dataset.count).toLocaleString('en-ZA').replace(/ /g, ','); });
    bars.style.setProperty('--grow', '1');
    whys.forEach(w => w.classList.add('is-lit'));
  }
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(.25, (now - last) / 1000); last = now;
    if (motionOn()) {
      const near = s => { const r = s.getBoundingClientRect(); return r.bottom > -innerHeight && r.top < innerHeight * 2; };
      if (near(S8)) {
        const p = progressOf(S8);
        if (p > .372 && p < .478 && !document.hidden && document.body.dataset.scene === '08') dwellState.real += dt * (dwellState.ff ? 10 : 1);
        on08(p);
      }
      if (near(S9)) on09(progressOf(S9));
      if (near(S10)) on10(progressOf(S10));
    }
    requestAnimationFrame(loop);
  }

  // ---- Motion layer: sticky stages with scrubbed beats, arrival entrances and ambient loops.
  if (G && ST) G.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    document.documentElement.classList.add('cx-motion');
    const ambient = [], cleanups = [];
    const scenes = [S8, S9, S10];
    const FROM = { rise: { y: 40 }, up: { y: 70 }, fade: {}, zoom: { scale: .9 }, none: {} };
    function build(scene, extra) {
      const tl = G.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: .5, invalidateOnRefresh: true } });
      qa(scene, '[data-in]').forEach(el => {
        const a = Number(el.dataset.in), b = el.dataset.out ? Number(el.dataset.out) : null, fx = FROM[el.dataset.fx || 'rise'];
        if (a === 0) G.set(el, { autoAlpha: 1 });
        else tl.fromTo(el, { autoAlpha: 0, ...fx }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .012 }, a);
        if (b !== null) tl.fromTo(el, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -30, duration: .012, immediateRender: false }, b - .012);
      });
      qa(scene, '[data-at]').forEach(el => tl.fromTo(el, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .01 }, Number(el.dataset.at)));
      extra(tl);
      tl.to({}, { duration: .001 }, .999);
      return tl;
    }
    const shrinkHead = (tl, scene, at) => tl.fromTo(q(scene, '.cx-head'), { scale: 1 }, { scale: () => innerWidth <= 900 ? .62 : .5, duration: .015 }, at);

    // Scene 08
    const site = q(S8, '.cx08-site'), frame = q(S8, '.cx08-site__frame');
    build(S8, tl => {
      shrinkHead(tl, S8, .045);
      tl.fromTo(q(S8, '.cx08-rank__trace'), { '--draw': 1 }, { '--draw': 0, duration: .02 }, .085)
        .fromTo(q(S8, '.cx08-site__trace'), { '--draw': 1 }, { '--draw': 0, duration: .025 }, .105)
        .fromTo(frame, { scale: 1 }, { scale: 1.03, duration: .012, yoyo: true, repeat: 1 }, .13)
        .fromTo(frame, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, duration: .012, immediateRender: false }, .468)
        .fromTo(q(S8, '.cx08-site__trace'), { autoAlpha: 1 }, { autoAlpha: .45, duration: .02 }, .2)
        .fromTo(q(S8, '.cx08-track__card'), { y: -240, autoAlpha: 0, rotation: -8 }, { y: 0, autoAlpha: 1, rotation: 0, duration: .02, ease: 'power2.in' }, .893)
        .fromTo(q(S8, '.cx08-track .is-first'), { scale: 1 }, { scale: 1.08, duration: .006, yoyo: true, repeat: 1 }, .912);
    });
    // Arrival: the answer card from scene 07 punches through and becomes the landing page.
    const punch = () => {
      G.fromTo(site, { scale: .14, autoAlpha: 0, rotationX: 18, filter: 'blur(10px)' }, { scale: 1, autoAlpha: 1, rotationX: 0, filter: 'blur(0px)', duration: 1.15, ease: 'expo.out', clearProps: 'filter' });
      G.fromTo(qa(S8, '.cx-head h2 > *'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, stagger: .15, ease: 'power3.out', delay: .25 });
    };
    ST.create({ trigger: S8, start: 'top 60%', onEnter: punch });
    ambient.push(
      G.to(qa(S8, '.cx-standin__gift,.cx08-ours__gift'), { y: -10, rotation: 2, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(qa(S8, '.cx-standin__bottle,.cx08-ours__bottle'), { y: -14, duration: 3.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(q(S8, '.cx08-chat__top i'), { scale: 1.18, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to(q(S8, '.cx08-ours__chat'), { y: -8, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    );

    // Scene 09: four places spiral into an orbit around the capture card.
    const stage9 = q(S9, '.scene__stage'), core = q(S9, '.cx09-orbit__core');
    const orb = { a: 0, m: 1, W: 0, H: 0 };
    const measure9 = () => { orb.W = stage9.clientWidth; orb.H = stage9.clientHeight; };
    measure9();
    G.set(chButtons, { xPercent: -50, yPercent: -50 });
    function placeOrbit() {
      const phone = innerWidth <= 900, cx = orb.W * (phone ? .5 : .31), cy = orb.H * (phone ? .4 : .52);
      const rx = Math.min(orb.W * (phone ? .3 : .2), 260) * orb.m, ry = (phone ? 120 : rx * .44) * (phone ? orb.m : 1);
      chButtons.forEach((b, k) => {
        const a = orb.a + k * Math.PI / 2 + (orb.m - 1) * 2.2, depth = (Math.sin(a) + 1) / 2, on = b.getAttribute('aria-pressed') === 'true';
        G.set(b, { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * (phone ? ry : rx * .44), scale: (on ? 1.12 : .9) + depth * .14, opacity: on ? 1 : .55 + depth * .35, zIndex: on ? 9 : depth > .5 ? 6 : 2 });
      });
    }
    const orbitTick = (t, dms) => {
      const r = S9.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      if (!paused()) orb.a += Math.min(100, dms) / 1000 * Math.PI * 2 / 34;
      placeOrbit();
    };
    G.ticker.add(orbitTick);
    cleanups.push(() => G.ticker.remove(orbitTick));
    // The Slack claim breaks: shards of the wrong line fly apart and the right one lands.
    const oldClaim = q(S9, '.cx09-claim__old'), newClaim = q(S9, '.cx09-claim__new');
    const cuts = ['polygon(0 0,34% 0,28% 55%,0 70%)', 'polygon(34% 0,62% 0,55% 48%,28% 55%)', 'polygon(62% 0,100% 0,100% 40%,55% 48%)', 'polygon(0 70%,28% 55%,40% 100%,0 100%)', 'polygon(28% 55%,55% 48%,70% 100%,40% 100%)', 'polygon(55% 48%,100% 40%,100% 100%,70% 100%)'];
    const shards = cuts.map(c => { const s = oldClaim.cloneNode(true); s.classList.add('cx09-shard'); s.setAttribute('aria-hidden', 'true'); s.style.clipPath = c; oldClaim.after(s); return s; });
    cleanups.push(() => shards.forEach(s => s.remove()));
    build(S9, tl => {
      shrinkHead(tl, S9, .04);
      tl.fromTo(orb, { m: 2.6 }, { m: 1, duration: .04, ease: 'power2.out', onUpdate: placeOrbit }, 0)
        .fromTo(core, { scale: .6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .03 }, .005)
        .fromTo(q(S9, '.cx09-detail'), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: .01 }, .045)
        .fromTo(shards, { autoAlpha: 0 }, { autoAlpha: 1, duration: .001 }, .17)
        .fromTo(oldClaim, { autoAlpha: 1 }, { autoAlpha: 0, duration: .001, immediateRender: false }, .1705);
      shards.forEach((s, k) => tl.fromTo(s, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1 }, { x: (k % 3 - 1) * 120 + (k % 2 ? 30 : -30), y: (k < 3 ? -1 : 1) * (60 + k * 12), rotation: (k % 2 ? 1 : -1) * (18 + k * 7), scale: 1.5, autoAlpha: 0, duration: .016, ease: 'power2.out', immediateRender: false }, .172));
      tl.fromTo(newClaim, { autoAlpha: 0, scale: .86, filter: 'blur(8px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: .012 }, .18);
      // One phrase per beat: each line enters, holds, then hands off to the next.
      const beats = qa(S9, '.cx09-beats span');
      beats.forEach((b, k) => {
        const at = .303 + k * .0068;
        tl.fromTo(b, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .003 }, at);
        if (k < beats.length - 1) tl.fromTo(b, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -50, duration: .003, immediateRender: false }, at + .0055);
      });
      tl.fromTo(q(S9, '.cx09-track__pour'), { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: .02 }, .895);
    });
    ST.create({ trigger: S9, start: 'top 60%', onEnter: () => G.fromTo(qa(S9, '.cx-head h2 > *'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, stagger: .15, ease: 'power3.out' }) });
    ambient.push(
      G.to(qa(S9, '.cx09-dial--good .cx09-dial__face i'), { rotation: 540, duration: 2.4, ease: 'none', repeat: -1 }),
      G.to(qa(S9, '.cx09-dial--avg .cx09-dial__face i'), { rotation: 200, duration: 9, ease: 'none', repeat: -1 }),
      G.to(core, { y: -8, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    );

    // Scene 10: OPTIMIZE in a data tunnel with an orbit ring, then the website turns into the dashboard.
    qa(S10, '.cx10-tunnel i').forEach((s, k) => { s.style.setProperty('--r', `${k * 30 + (k % 2) * 11}deg`); s.style.animationDelay = `${-(k * .37) % 2.4}s`; });
    const spark = q(S10, '.cx10-ring__spark'), sparkP = { t: 0 };
    ambient.push(G.to(sparkP, { t: Math.PI * 2, duration: 4.5, ease: 'none', repeat: -1, onUpdate: () => { spark.setAttribute('cx', String(300 + 290 * Math.cos(sparkP.t))); spark.setAttribute('cy', String(100 + 70 * Math.sin(sparkP.t))); spark.style.opacity = Math.sin(sparkP.t) > 0 ? '1' : '.25'; } }));
    build(S10, tl => {
      tl.fromTo(S10, { '--tunnel': 1 }, { '--tunnel': 0, duration: .03 }, .095)
        .fromTo(q(S10, '.cx10-lens__site'), { autoAlpha: 1, scale: 1, filter: 'blur(0px)' }, { autoAlpha: 0, scale: 1.1, filter: 'blur(6px)', duration: .04 }, .14)
        .fromTo(q(S10, '.cx10-lens__dash'), { scale: .9, autoAlpha: .2 }, { scale: 1, autoAlpha: 1, duration: .04 }, .15)
        .fromTo(qa(S10, '.cx10-post__stats'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .01, stagger: .008 }, .19);
      shrinkHead(tl, S10, .27);
    });
    ST.create({ trigger: S10, start: 'top 60%', onEnter: () => {
      G.fromTo(q(S10, '.cx10-word'), { scale: .4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1, ease: 'expo.out', clearProps: 'scale' });
      G.fromTo(qa(S10, '.cx10-post'), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6, stagger: .08, ease: 'power3.out', delay: .2 });
    } });
    ambient.push(G.to(qa(S10, '.cx10-post'), { y: -5, duration: 1.8, ease: 'sine.inOut', stagger: { each: .25, repeat: -1, yoyo: true } }));

    // Ambient loops and CSS animations sleep while their scene is off screen or paused.
    const ambientOf = new Map(scenes.map(s => [s, []]));
    ambient.forEach(t => { const target = t.targets?.()[0]; const owner = scenes.find(s => target instanceof Element ? s.contains(target) : target === sparkP && s === S10); ambientOf.get(owner || S10).push(t); });
    let wasPaused = false;
    const pauseTick = () => { const p = paused(); if (p !== wasPaused) { wasPaused = p; ambient.forEach(t => p ? t.pause() : t.resume()); } };
    G.ticker.add(pauseTick);
    cleanups.push(() => G.ticker.remove(pauseTick));
    scenes.forEach(scene => ST.create({ trigger: scene, start: 'top bottom', end: 'bottom top', onToggle: self => { scene.classList.toggle('cx-off', !self.isActive); ambientOf.get(scene).forEach(t => self.isActive && !paused() ? t.resume() : t.pause()); }, onRefresh: self => scene.classList.toggle('cx-off', !self.isActive) }));
    const onResize = () => { measure9(); renderDeal(dealAt); };
    addEventListener('resize', onResize);
    ST.refresh();
    document.fonts?.ready.then(() => { ST.refresh(); measure9(); });
    return () => {
      document.documentElement.classList.remove('cx-motion');
      removeEventListener('resize', onResize);
      ambient.forEach(t => t.kill());
      cleanups.forEach(f => f());
      staticState();
    };
  });
  if (!motionOn()) staticState();
  requestAnimationFrame(loop);
})();
