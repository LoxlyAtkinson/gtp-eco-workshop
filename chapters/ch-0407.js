/* Engage chapter, scenes 04-07 (rebuild 2026-10-28).
   Works beside scroll-presentation.js without editing it:
   - the engine owns auto-scroll, holds, Next and Space; this file reads scroll
     progress and switches each scene's beat plates (data-beats / data-on);
   - an in-scene click holds auto-scroll through the engine's own Pause button;
   - scene 04 "Start the runs" plays a demo of the skill runs (owner rehearsal
     r-20261028-184822: no volunteer, no consent card, no live run). Scenes 05-07
     show the saved runs in assets/cached-runs, tagged "cached run". */
(() => {
  const scenes = [...document.querySelectorAll('.c47')];
  if (!scenes.length) return;
  const G = window.gsap;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const motion = () => root.classList.contains('c47-motion');
  const q = (el, s) => el.querySelector(s), qa = (el, s) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byScene = Object.fromEntries(scenes.map((s) => [s.dataset.scene, s]));
  const syncMotion = () => root.classList.toggle('c47-motion', Boolean(G) && !reduced.matches);
  syncMotion();
  reduced.addEventListener('change', () => { syncMotion(); scenes.forEach((s) => { s.dataset.bi = ''; }); frame(); });

  // ---- hold: an in-scene click holds auto-scroll (engine button, no engine edit) ----
  function hold() {
    if (!motion()) return;
    const st = document.getElementById('autoStatus');
    if (st && st.dataset.state === 'running') window.deckHold ? window.deckHold() : document.getElementById('motionButton')?.click();
  }

  // ---- beats: p-ranges from talk seconds, 0 to 0.92 (auto-scroll stops at 0.92) ----
  const model = new Map();
  scenes.forEach((scene) => {
    const beats = scene.dataset.beats.split(',').map((x) => { const [id, s] = x.split(':'); return { id, sec: Number(s) }; });
    const total = beats.reduce((a, b) => a + b.sec, 0);
    let acc = 0;
    beats.forEach((b) => { b.p0 = acc / total * 0.92; acc += b.sec; b.p1 = acc / total * 0.92; });
    const index = Object.fromEntries(beats.map((b, i) => [b.id, i]));
    const layers = qa(scene, '[data-on]').map((el) => {
      const set = new Set();
      el.dataset.on.split(/\s+/).forEach((tok) => {
        const [a, b] = tok.split('..');
        const i0 = index[a], i1 = b ? index[b] : i0;
        for (let i = i0; i <= i1; i++) set.add(i);
      });
      return { el, set };
    });
    model.set(scene, { beats, layers, bi: -1, hooks: [], seen: new Set() });
  });
  const onBeat = (scene, fn) => model.get(scene).hooks.push(fn);
  const progressOf = (scene) => { const r = scene.getBoundingClientRect(); return Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight))); };
  function setBeat(scene, bi, force = false) {
    const m = model.get(scene);
    if (!force && bi === m.bi) return;
    const prev = m.bi; m.bi = bi;
    const beat = m.beats[bi];
    scene.dataset.beat = beat.id; scene.dataset.bi = String(bi);
    m.layers.forEach(({ el, set }) => el.classList.toggle('is-on', !motion() || set.has(bi)));
    const first = !m.seen.has(beat.id); m.seen.add(beat.id);
    m.hooks.forEach((fn) => { try { fn(beat.id, bi, prev, first); } catch (e) { console.error('[ch-0407]', e); } });
  }
  function frame() {
    scenes.forEach((scene) => {
      const r = scene.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < innerHeight;
      scene.classList.toggle('is-off', !visible);
      if (!motion()) { if (model.get(scene).bi === -1) setBeat(scene, model.get(scene).beats.length - 1, true); return; }
      if (!visible) return; // beats (and live-slot reveals) fire only on the scene in view
      const p = progressOf(scene), m = model.get(scene);
      let bi = m.beats.findIndex((b) => p < b.p1);
      if (bi < 0) bi = m.beats.length - 1;
      setBeat(scene, bi);
    });
  }
  let raf = 0;
  const queue = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; frame(); }); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });

  // ---- media slots: stand-in shows until the generated file loads ----
  qa(document, '.c47 .c47-media').forEach((fig) => {
    const img = q(fig, 'img[data-media-slot]'), vid = q(fig, 'video[data-media-slot]');
    if (img) {
      if (!img.getAttribute('src') || (img.complete && !img.naturalWidth)) fig.classList.add('is-missing');
      img.addEventListener('load', () => fig.classList.remove('is-missing'));
      img.addEventListener('error', () => fig.classList.add('is-missing'));
    }
    if (vid) {
      if (vid.readyState < 2) fig.classList.add('is-missing');
      vid.addEventListener('loadeddata', () => fig.classList.remove('is-missing'));
      q(vid, 'source')?.addEventListener('error', () => { fig.classList.add('is-missing'); vid.dataset.dead = '1'; });
    }
  });
  function playVideosIn(el) { qa(el, 'video[data-media-slot]').forEach((v) => { if (v.dataset.dead || document.body.classList.contains('motion-paused')) return; v.play().catch(() => {}); }); }
  function pauseVideosIn(el) { qa(el, 'video').forEach((v) => { try { v.pause(); } catch {} }); }

  // ---- text helpers ----
  function typeText(el, text, speed = 0.045) {
    if (!el) return;
    if (!G || !motion()) { el.textContent = text; return; }
    const o = { n: 0 };
    G.killTweensOf(el.__type || {});
    el.__type = o;
    el.textContent = '';
    G.to(o, { n: text.length, duration: Math.max(0.4, text.length * speed), ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); } });
  }
  function inline(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  function md(text) {
    const lines = String(text || '').split('\n'), out = [];
    let list = null, table = null;
    const close = () => { if (list) { out.push(`</${list}>`); list = null; } if (table) { out.push('</table>'); table = null; } };
    for (const raw of lines) {
      const line = raw.trimEnd();
      if (/^\s*\|/.test(line)) {
        if (/^\s*\|\s*-/.test(line)) continue;
        if (!table) { close(); table = 1; out.push('<table>'); }
        const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => `<td>${inline(c.trim())}</td>`).join('');
        out.push(`<tr>${cells}</tr>`); continue;
      }
      if (table) { out.push('</table>'); table = null; }
      let m;
      if ((m = /^#{1,4}\s+(.*)/.exec(line))) { close(); out.push(`<p><b>${inline(m[1])}</b></p>`); continue; }
      if ((m = /^\s*(\d+)\.\s+(.*)/.exec(line))) { if (list !== 'ol') { close(); list = 'ol'; out.push('<ol>'); } out.push(`<li>${inline(m[2])}</li>`); continue; }
      if ((m = /^\s*[-*]\s+(.*)/.exec(line))) { if (list !== 'ul' && list !== 'ol') { close(); list = 'ul'; out.push('<ul>'); } out.push(`<li>${inline(m[1])}</li>`); continue; }
      if (!line.trim()) { close(); continue; }
      close(); out.push(`<p>${inline(line)}</p>`);
    }
    close();
    return out.join('');
  }
  const tableRows = (text) => String(text || '').split('\n').filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*-/.test(l)).map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));

  // ---- saved-run slots: each later beat reveals the tagged cached run ----
  const SLOTS = {
    'competitor-scan': {}, content: {}, keywords: {}, 'seo-audit': {}, 'backlink-analyzer': {}, 'geo-citability': {}, 'seo-plan': {}, 'blog-calendar': {},
    'b2b-find': { blocked: 'needs the Apify key' }, last30days: { blocked: 'in review, needs a ScrapeCreators key' },
  };
  Object.entries(SLOTS).forEach(([kind, s]) => { s.kind = kind; s.cachedUrl = `./assets/cached-runs/${kind}.json`; s.renderers = []; s.revealed = false; s.state = null; });
  function runline(kind, st) {
    qa(document, `.c47 [data-slot-line="${kind}"]`).forEach((el) => {
      el.dataset.phase = st.phase;
      const src = st.source || {};
      if (st.phase === 'live') el.textContent = `Current check for ${src.business || 'this business'} · ${src.at || 'in progress'}`;
      else if (st.phase === 'cached') el.textContent = `Illustrative result${src.business ? ` for ${src.business}` : ''}${src.label ? ` · ${src.label}` : ''}`;
      else if (st.phase === 'running') el.textContent = `Checking the example · ${(st.progress || []).slice(-1)[0] || 'started'}`;
      else el.textContent = 'Illustrative example · no current result';
    });
  }
  function settle(kind, st) {
    const slot = SLOTS[kind];
    slot.state = st;
    if (!slot.revealed) return;
    runline(kind, st);
    if ((st.phase === 'live' || st.phase === 'cached') && st.result && !slot.painted) { slot.painted = true; slot.renderers.forEach((fn) => { try { fn(st.result, st); } catch (e) { console.error('[ch-0407 render]', kind, e); } }); }
  }
  async function cachedOnly(kind, why) {
    const slot = SLOTS[kind];
    let data = null;
    try { const r = await fetch(slot.cachedUrl, { cache: 'no-store' }); data = r.ok ? await r.json() : null; } catch {}
    settle(kind, { phase: 'cached', result: data || { text: '' }, why, source: { business: data && data.business, label: data && data.label } });
  }
  function reveal(kind) {
    const slot = SLOTS[kind];
    if (!slot || slot.revealed) return;
    slot.revealed = true;
    cachedOnly(kind, '');
  }
  const render = (kind, fn) => SLOTS[kind].renderers.push(fn);

  // ===================== scene 04: skills and what to use when, then where? =====================
  (function scene04() {
    const s = byScene['04'];
    const wheel = q(s, '#c4Wheel'), tiles = qa(wheel, '.c4-tile'), cursor = q(wheel, '.c4-cursor');
    const why = q(s, '#c4Why'), screens = qa(s, '.c4-screen');
    const order = tiles.map((t) => t.dataset.platform);
    const WHY = {
      b2c: {
        instagram: ['Instagram: to be seen', 'Your records say gift planners found you here. Show the gift set the way they will give it.'],
        whatsapp: ['WhatsApp: to sell', 'They order here. 93.8% of active social users in South Africa use it. Make ordering one message.'],
        gbp: ['Google Business Profile: to be found', 'Self-care regulars search nearby. Hours, photos and reviews on the map.'],
        facebook: ['Facebook: not first', 'Most South Africans on social media use it. Use it for birthday reminders once the first three work.'],
        tiktok: ['TikTok: later', '65% of millennials and Gen Z look for gift ideas there. Start once you can film every week.'],
        linkedin: ['LinkedIn: not these buyers', 'Amberkloof sells to people, not companies. Skip it here.'],
        web: ['Website: where everything points', 'Every other channel sends people here. Google handles 91.75% of searches in South Africa.'],
      },
      b2b: {
        linkedin: ['LinkedIn: where founders check you', 'A founder looks up a supplier here before asking for a quote. Post proof of short runs.'],
        web: ['Google Search: where founders start', 'They type "custom product labels Johannesburg". Your site must answer that.'],
        whatsapp: ['WhatsApp: for the quote', 'Once they trust you, the quote happens in a chat.'],
        gbp: ['Google Business Profile', 'Local founders search for a printer nearby.'],
        instagram: ['Instagram: show the work', 'Useful for finished boxes, but founders decide on LinkedIn and Google.'],
        facebook: ['Facebook: not first', 'Few founders look for a printer here.'],
        tiktok: ['TikTok: not now', 'Not where a founder picks a supplier.'],
      },
    };
    const wh = { a: 0, burst: 0, spinning: false, current: null, drift: 0 };
    // the wheel grows with the stage (1366x768 keeps 250x150), so big screens get readable tiles
    const geom = () => {
      if (innerWidth <= 900) return { rx: 150, ry: 96 };
      const h = Math.max(1, (q(s, '.scene__stage') || s).clientHeight || innerHeight - 144);
      return { rx: Math.min(250 * Math.max(1, h / 624), innerWidth * 0.19), ry: Math.max(120, Math.min(200, h * 0.216)) };
    };
    function place() {
      const { rx, ry } = geom(), n = tiles.length;
      wheel.style.setProperty('--rx', rx.toFixed(0) + 'px'); wheel.style.setProperty('--ry', ry.toFixed(0) + 'px');
      tiles.forEach((t, k) => {
        const a = wh.a + wh.drift + k * Math.PI * 2 / n - Math.PI / 2;
        const depth = (1 - Math.sin(a)) / 2; // 1 at the top
        const b = wh.burst;
        const x = Math.cos(a) * rx * b, y = Math.sin(a) * ry * b;
        const sel = t.getAttribute('aria-pressed') === 'true';
        const sc = (0.86 + depth * 0.24) * (sel ? 1.12 : 1) * b;
        t.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px)) scale(${sc.toFixed(3)})`;
        t.style.opacity = String(b * (0.72 + depth * 0.28));
        t.style.zIndex = String(Math.round(depth * 10));
        t.style.filter = wh.spinning ? 'blur(2.5px)' : '';
      });
    }
    function setAudience(mode) { s.dataset.audience = mode; }
    function showPlatform(p) {
      wh.current = p;
      tiles.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.platform === p)));
      screens.forEach((sc) => sc.classList.toggle('is-shown', p ? sc.dataset.screen === p : sc.classList.contains('c4-screen--idle')));
      const w = (WHY[s.dataset.audience] || WHY.b2c)[p] || WHY.b2c[p];
      if (w) { q(why, 'strong').textContent = w[0]; q(why, 'p').textContent = w[1]; }
      const shown = screens.find((sc) => sc.dataset.screen === p);
      if (shown) playVideosIn(shown);
      place();
    }
    function burst(on = true) {
      if (!G || !motion()) { wh.burst = on ? 1 : 0; place(); return; }
      G.to(wh, { burst: on ? 1 : 0, duration: on ? 0.9 : 0.4, ease: on ? 'back.out(1.6)' : 'power2.in', onUpdate: place });
      if (on) G.fromTo(cursor, { scale: 1 }, { scale: 0.82, duration: 0.12, yoyo: true, repeat: 1 });
    }
    function spinTo(p, extra = 1) {
      const k = order.indexOf(p);
      if (k < 0) return;
      const n = tiles.length, step = Math.PI * 2 / n;
      let target = -k * step;
      if (!G || !motion()) { wh.a = target; showPlatform(p); return; }
      while (target > wh.a - extra * Math.PI * 2) target -= Math.PI * 2;
      if (wh.burst < 1) burst(true);
      wh.spinning = true;
      G.fromTo(cursor, { scale: 1 }, { scale: 0.82, duration: 0.12, yoyo: true, repeat: 1 });
      G.to(wh, { a: target, duration: 1.4, ease: 'power3.inOut', onUpdate: place, onComplete: () => { wh.spinning = false; wh.a = ((wh.a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI * 2; showPlatform(p); G.fromTo(q(s, '.c4-phone'), { scale: 0.97 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }); } });
    }
    tiles.forEach((t) => t.addEventListener('click', () => { hold(); if (wh.burst < 1) burst(true); spinTo(t.dataset.platform, 0); }));
    cursor.addEventListener('click', () => { hold(); burst(true); });
    if (G) G.ticker.add((time) => { if (s.classList.contains('is-off') || wh.spinning || !motion()) return; wh.drift = Math.sin(time * 0.6) * 0.05; if (wh.burst > 0) place(); });
    // R2 rhythm: a soft click pulse on the cursor while the wheel waits
    if (G) G.to(cursor, { scale: 0.9, duration: 0.35, repeat: -1, yoyo: true, repeatDelay: 2.2, ease: 'power2.inOut' });

    // questionnaire + the demo runs: one skill at a time, then the tools that run them
    const start = q(s, '#c4Start'), form = q(s, '#c4Quiz');
    const runs = qa(s, '#c4Runs li'), runState = q(s, '#c4RunState');
    let runTl = null;
    const fill = (li, v) => { const u = q(li, 'u'); if (G) G.set(u, { scaleX: v }); else u.style.transform = ''; };
    function setRun(li, phase) { li.dataset.phase = phase; q(li, 'i').textContent = phase; }
    function finishRuns() {
      if (runTl) { runTl.kill(); runTl = null; }
      runs.forEach((li) => { setRun(li, 'done'); fill(li, 1); });
      s.dataset.runs = 'done';
      runState.textContent = `All ${runs.length} runs done. These three tools ran them.`;
      start.disabled = false; start.textContent = 'Run them again';
    }
    function playRuns() {
      if (runTl) { runTl.kill(); runTl = null; }
      runs.forEach((li) => { setRun(li, 'waiting'); fill(li, 0); });
      if (!G || !motion()) { finishRuns(); return; }
      s.dataset.runs = 'running';
      start.disabled = true; start.textContent = 'Running';
      runTl = G.timeline({ onComplete: finishRuns });
      runs.forEach((li, k) => {
        runTl.call(() => { setRun(li, 'running'); runState.textContent = `Running ${k + 1} of ${runs.length}: ${q(li, 'b').textContent}`; })
          .fromTo(q(li, 'u'), { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'power1.inOut' })
          .call(() => setRun(li, 'done'));
      });
    }
    let typed = false;
    function fillDemo() {
      const inputs = qa(form, 'input');
      if (typed || inputs.some((i) => i.value.trim())) return;
      typed = true;
      q(s, '#c4QuizDemo').hidden = false;
      inputs.forEach((i, k) => { if (G && motion()) G.delayedCall(k * 0.6, () => typeText({ set textContent(v) { i.value = v; } }, i.dataset.demo, 0.02)); else i.value = i.dataset.demo; });
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (s.dataset.runs === 'running') return;
      hold();
      playRuns();
    });

    onBeat(s, (id, bi, prev, first) => {
      const idx = (x) => model.get(s).beats.findIndex((b) => b.id === x);
      s.classList.toggle('is-phone', !motion() || bi >= idx('04-5'));
      if (id === '04-2') fillDemo();
      // the tools beat always shows finished runs, even if nobody pressed Start
      if (id === '04-4' && s.dataset.runs !== 'done' && s.dataset.runs !== 'running') { fillDemo(); finishRuns(); }
      if (bi < idx('04-6')) { if (wh.burst > 0) burst(false); if (motion()) showPlatform(null); }
      if (id === '04-6') { setAudience('b2c'); burst(true); }
      if (id === '04-7') { setAudience('b2c'); spinTo('instagram'); }
      if (id === '04-8') { setAudience('b2c'); spinTo('whatsapp'); }
      if (id === '04-9') { setAudience('b2b'); spinTo('linkedin'); if (G && motion()) G.delayedCall(3.2, () => { if (s.dataset.beat === '04-9') spinTo('web'); }); }
      if (id === '04-10' || id === '04-11') { setAudience('b2c'); if (wh.current !== 'instagram') spinTo('instagram'); }
      if (!motion() && first && bi === model.get(s).beats.length - 1) { wh.burst = 1; showPlatform('instagram'); }
    });
  })();

  // ===================== scene 05: what? =====================
  (function scene05() {
    const s = byScene['05'];
    s.dataset.mix = 'edu'; s.dataset.aud = 'self';
    const bindToggle = (attr) => qa(s, `[data-${attr}]`).forEach((b) => { if (b.closest('.c47-toggle')) b.addEventListener('click', () => { hold(); s.dataset[attr] = b.dataset[attr]; qa(b.parentElement, 'button').forEach((o) => o.setAttribute('aria-pressed', String(o === b))); }); });
    bindToggle('mix'); bindToggle('aud');
    const cards = q(s, '#c5Cards'), layers = q(s, '#c5Layers'), weak = q(s, '#c5Weak'), gaps = q(s, '#c5Gaps');
    function parse(text) {
      const parts = String(text || '').split(/\n(?=## )/);
      const comps = [], gapList = [];
      parts.forEach((p) => {
        const head = /^##\s+(\d+)\.\s+(.+)/.exec(p);
        if (head) {
          const f = (k) => (new RegExp(`\\*\\*${k}:\\*\\*\\s*(.+)`).exec(p) || [])[1] || '';
          comps.push({ name: head[2].trim(), source: (/^Source:\s*(\S+)/m.exec(p) || [])[1] || '', platforms: f('Platforms'), messages: f('Messages'), recipe: f('Recipe'), works: f('Works'), doesnt: f("Doesn't") });
        } else if (/^##\s+Gaps/.test(p)) {
          p.split('\n').forEach((l) => { const m = /^\s*\d+\.\s+(.*)/.exec(l); if (m) gapList.push(m[1]); });
        }
      });
      return { comps, gapList };
    }
    render('competitor-scan', (result) => {
      const { comps, gapList } = parse(result.text);
      if (!comps.length) { cards.innerHTML = `<article class="c5-card c47-glass">${md(result.text)}</article>`; return; }
      cards.innerHTML = comps.slice(0, 3).map((c) => `<article class="c5-card c47-glass"><svg class="c47-trace" aria-hidden="true"><rect x="1" y="1" width="99%" height="99%" rx="18" pathLength="100"/></svg><h3>${inline(c.name)}</h3><dl><div><dt>WHERE THEY POST</dt><dd>${inline(c.platforms)}</dd></div><div><dt>WHAT THEY SAY</dt><dd>${inline(c.messages)}</dd></div></dl><span class="c5-src">${esc(c.source)}</span></article>`).join('');
      qa(cards, '.c5-card').forEach((el, k) => setTimeout(() => el.classList.add('is-traced'), 250 + k * 420));
      if (G && motion()) G.from(qa(cards, '.c5-card'), { y: 40, autoAlpha: 0, rotateX: -12, duration: 0.8, stagger: 0.25, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
      const top = comps.find((c) => !/not observable/i.test(c.recipe)) || comps[0];
      const r = top.recipe;
      const grab = (re) => ((re.exec(r) || [])[1] || '').trim();
      const rows = [['HOOK', grab(/hook is ([^.]+)\./i) || 'not stated'], ['BODY', grab(/body is ([^.]+?)\.(?:\s|$)/i) || 'not stated'], ['OFFER', grab(/offer is (.+?)(?:\.\s|\.$|$)/i) || 'not stated'], ['FORMAT', 'not visible in this scan'], ['PLATFORM', top.platforms.replace(/\*/g, '')]];
      layers.innerHTML = `<li><b>TOP POST</b>${inline(top.name)}</li>` + rows.map(([k, v]) => `<li><b>${k}</b>${inline(v)}</li>`).join('');
      const w = comps.find((c) => /not observable/i.test(c.recipe)) || comps[comps.length - 1];
      weak.innerHTML = `<span class="c47-tag">WEAK · ${esc(w.name.replace(/\s*\(.*\)/, ''))}</span><p><b>What works:</b> ${inline(w.works)}</p><p><b>What doesn't:</b> ${inline(w.doesnt)}</p>`;
      gaps.innerHTML = gapList.slice(0, 5).map((g) => `<li>${inline(g)}</li>`).join('');
    });
    onBeat(s, (id) => {
      if (['05-3', '05-4', '05-5'].includes(id)) reveal('competitor-scan');
      if (id === '05-3' && G && motion()) G.fromTo(q(s, '.c5-scan__head'), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.6 });
      if (id === '05-7' && G && motion()) G.from(qa(s, '.c5-rule__line span'), { yPercent: 70, autoAlpha: 0, stagger: 0.5, duration: 0.8, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
    });
  })();

  // ===================== scene 06: make it yours =====================
  (function scene06() {
    const s = byScene['06'];
    s.dataset.flip = 'graphic';
    qa(s, '[data-flip]').forEach((b) => { if (b.closest('.c47-toggle')) b.addEventListener('click', () => { hold(); s.dataset.flip = b.dataset.flip; qa(b.parentElement, 'button').forEach((o) => o.setAttribute('aria-pressed', String(o === b))); }); });
    const orbit = q(s, '#c6Orbit'), outs = qa(orbit, '.c6-out');
    render('content', (result) => {
      const t = String(result.text || '');
      const sec = (name) => { const m = new RegExp(`##\\s*${name}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i').exec(t); return m ? m[1].trim() : ''; };
      const ideas = sec('Post Ideas').split('\n').map((l) => /^\s*\d+\.\s+(.*)/.exec(l)).filter(Boolean).map((m) => m[1]);
      const caption = sec('(?:Instagram )?Caption');
      const product = sec('Product Description').split(/\n\s*\nNext:/)[0].replace(/\nNext:[\s\S]*$/, '');
      const ol = q(orbit, '[data-fill="ideas"]');
      ol.innerHTML = (ideas.length ? ideas : [t.slice(0, 160)]).slice(0, 3).map((x) => `<li>${inline(x)}</li>`).join('');
      q(orbit, '[data-fill="caption"]').innerHTML = inline(caption || '');
      q(orbit, '[data-fill="product"]').innerHTML = md(product || '');
    });
    function spiralOut() {
      if (!G || !motion()) return;
      const core = q(s, '.c6-core').getBoundingClientRect();
      outs.forEach((el, k) => {
        const r = el.getBoundingClientRect();
        const dx = core.left + core.width / 2 - (r.left + r.width / 2), dy = core.top + core.height / 2 - (r.top + r.height / 2);
        const p = { t: 1 };
        G.fromTo(p, { t: 1 }, { t: 0, duration: 1.3, delay: 0.15 + k * 0.14, ease: 'power3.out', onUpdate: () => { const a = p.t * Math.PI * 1.5; const cx = dx * p.t, cy = dy * p.t; el.style.transform = `translate(${(cx * Math.cos(a) - cy * Math.sin(a)).toFixed(1)}px, ${(cx * Math.sin(a) + cy * Math.cos(a)) * 0.6}px) scale(${(1 - p.t * 0.8).toFixed(3)})`; el.style.opacity = String(1 - p.t); }, onComplete: () => { el.style.transform = ''; } });
      });
    }
    function shatter(pair) {
      const pane = q(pair, '.c6-pane--with');
      if (!G || !motion() || !pane) return;
      const cover = document.createElement('div');
      cover.className = 'c6-cover';
      Object.assign(cover.style, { position: 'absolute', inset: '0', borderRadius: '14px', background: '#d9d4cb', zIndex: '4' });
      pane.appendChild(cover);
      G.delayedCall(0.9, () => {
        const n = 14, shards = [];
        for (let i = 0; i < n; i++) {
          const sh = document.createElement('i');
          sh.className = 'c6-shard';
          const x = (i % 5) * 25 - 5, y = Math.floor(i / 5) * 40 - 5, j = () => Math.random() * 22 - 11;
          Object.assign(sh.style, { inset: '0', clipPath: `polygon(${x + j()}% ${y + j()}%, ${x + 30 + j()}% ${y + j()}%, ${x + 20 + j()}% ${y + 45 + j()}%)` });
          pane.appendChild(sh); shards.push(sh);
        }
        cover.remove();
        shards.forEach((sh) => G.to(sh, { x: (Math.random() - 0.5) * 700, y: (Math.random() - 0.3) * 420, rotation: (Math.random() - 0.5) * 140, scale: 1.4, autoAlpha: 0, duration: 1.1, ease: 'power2.in', onComplete: () => sh.remove() }));
      });
    }
    // Thumbnails come from YouTube's own image host; offline, the dark card and play button remain.
    qa(s, '.c6-ad__play img').forEach((img) => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }));
    qa(s, '.c6-ad').forEach((card) => q(card, '.c6-ad__play').addEventListener('click', () => {
      hold();
      const id = card.dataset.yt;
      const f = document.createElement('iframe');
      f.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      f.title = q(card, '.c6-ad__play').getAttribute('aria-label').replace(/^Play /, 'YouTube: ');
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      q(card, '.c6-ad__play').replaceWith(f);
    }));
    let ambient = [];
    if (G) outs.forEach((el, k) => ambient.push(G.to(el, { y: k % 2 ? -7 : 7, duration: 2.6 + k * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' })));
    onBeat(s, (id, bi, prev) => {
      if (id === '06-1' || id === '06-2') reveal('content');
      if (id === '06-2' && prev !== 1) { spiralOut(); playVideosIn(orbit); }
      if (id === '06-5') typeText(q(s, '#c6Typed'), 'Make me a launch video');
      if (id === '06-6') playVideosIn(q(s, '.c6-clip'));
      if (id === '06-7' && G && motion()) G.from(qa(s, '.c6-flow > *'), { x: -30, autoAlpha: 0, stagger: 0.25, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
      if (id === '06-8' && G && motion()) G.from(qa(s, '.c6-ad'), { y: 30, autoAlpha: 0, rotateY: 12, stagger: 0.15, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
      const pairN = { '06-9': 1, '06-10': 2, '06-11': 3 }[id];
      if (pairN) shatter(q(s, `.c6-pair[data-pair="${pairN}"]`));
      if (id === '06-15') typeText(q(s, '#c6Query'), 'How much would a gift set for 20 guests cost?');
    });
  })();

  // ===================== scene 07: be found =====================
  (function scene07() {
    const s = byScene['07'];
    const canvas = q(s, '.c7-tunnel__lines'), ctx = canvas.getContext('2d');
    const lines = Array.from({ length: 70 }, () => ({ a: Math.random() * Math.PI * 2, r: Math.random(), v: 0.2 + Math.random() * 0.6, hue: Math.random() < 0.6 ? '240,180,124' : '159,216,189' }));
    let lastY = scrollY, boost = 0;
    function drawTunnel(dt) {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      if (canvas.width !== w) { canvas.width = w; canvas.height = h; }
      const vel = Math.abs(scrollY - lastY); lastY = scrollY;
      boost = Math.min(4, boost * 0.92 + vel * 0.02);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.56, max = Math.hypot(w, h) * 0.6;
      lines.forEach((l) => {
        l.r += dt * l.v * (0.25 + boost) * 0.35;
        if (l.r > 1) { l.r = 0.02; l.a = Math.random() * Math.PI * 2; }
        const r0 = l.r * l.r * max, r1 = Math.min(max, r0 + 20 + l.r * 90 * (1 + boost));
        ctx.strokeStyle = `rgba(${l.hue},${Math.min(0.85, l.r * 1.2)})`;
        ctx.lineWidth = 0.6 + l.r * 2.2;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(l.a) * r0, cy + Math.sin(l.a) * r0 * 0.7); ctx.lineTo(cx + Math.cos(l.a) * r1, cy + Math.sin(l.a) * r1 * 0.7); ctx.stroke();
      });
    }
    const names = qa(s, '.c7-orbit > span'), dot = q(s, '.c7-orbit__dot'), orb = q(s, '.c7-orbit');
    let oa = 0;
    function drawOrbit(dt) {
      oa += dt * 0.35;
      const W = orb.clientWidth, H = orb.clientHeight, rx = W * 0.47, ry = H * 0.36;
      names.forEach((n, k) => {
        const a = oa + k * Math.PI * 2 / names.length, depth = (Math.sin(a) + 1) / 2;
        n.style.transform = `translate(calc(-50% + ${(Math.cos(a) * rx).toFixed(1)}px), calc(-50% + ${(Math.sin(a) * ry).toFixed(1)}px)) scale(${(0.8 + depth * 0.35).toFixed(3)})`;
        n.style.zIndex = String(Math.round(depth * 10)); n.style.opacity = String(0.55 + depth * 0.45);
      });
      const da = oa * 1.7;
      dot.setAttribute('cx', String(300 + Math.cos(da) * 290)); dot.setAttribute('cy', String(100 + Math.sin(da) * 80));
    }
    if (G) G.ticker.add((t, d) => {
      if (!motion() || s.classList.contains('is-off') || document.body.classList.contains('motion-paused')) return;
      if (!['07-1', '07-2'].includes(s.dataset.beat)) return;
      const dt = Math.min(0.05, d / 1000);
      drawTunnel(dt); drawOrbit(dt);
    });
    // live check panels
    const fill = (k, html) => { const el = q(s, `[data-fill="${k}"]`); if (el) el.innerHTML = html; };
    render('keywords', (r) => { const rows = tableRows(r.text).slice(1, 7); fill('keywords', rows.length ? `<table>${rows.map((c) => `<tr><td><b>${inline(c[1] || '')}</b></td><td>${inline(c[2] || '')}</td></tr>`).join('')}</table>` : md(r.text)); });
    render('seo-audit', (r) => { const items = [...String(r.text).matchAll(/^\s*\d+\.\s+\*\*(.+?)\*\*/gm)].map((m) => m[1]).filter((x) => !/catering|lunch|amina/i.test(x)).slice(0, 3); fill('seo-audit', items.length ? `<ol>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ol>` : md(r.text)); });
    render('backlink-analyzer', (r) => { const t = String(r.text); const head = (/^##\s+Result:\s*(.+)$/m.exec(t) || [])[1]; const opp = [...t.matchAll(/^\s*\d+\.\s+\*\*(.+?)\*\*/gm)].map((m) => m[1]).slice(0, 3); fill('backlink-analyzer', head ? `<p><b>Result:</b> ${inline(head)}</p><p><b>Link opportunities</b></p><ol>${opp.map((x) => `<li>${inline(x)}</li>`).join('')}</ol>` : md(t)); });
    render('geo-citability', (r) => { const t = String(r.text); const sc = (/Citability score:\s*([\d/]+)/i.exec(t) || [])[1]; const rows = tableRows(t).slice(1, 6); fill('geo-citability', sc ? `<p class="c7-score">${esc(sc)}</p><table>${rows.map((c) => `<tr><td>${inline(c[0])}</td><td><b>${inline(c[1])}</b></td></tr>`).join('')}</table>` : md(t)); });
    const plan = { goal: '', windows: {}, items: [] };
    let win = '30';
    function paintPlan() {
      const g = q(s, '[data-fill="seo-plan"]'), list = q(s, '[data-fill="blog-calendar"]');
      const w = plan.windows[win];
      g.innerHTML = `${plan.goal ? `<b>Goal:</b> ${inline(plan.goal)} ` : ''}${w ? `<br><b>${inline(w.name)}:</b> ${inline(w.prio)}` : ''}`;
      const items = plan.items.filter((it) => it.win === win);
      list.innerHTML = items.slice(0, 5).map((it) => `<li class="${/landing/i.test(it.type) ? 'is-landing' : ''}"><small>${esc(it.type.toUpperCase())} · ${esc(it.when)}</small>${inline(it.title)}<em>${inline(it.kw)}</em></li>`).join('');
      if (G && motion()) G.from(qa(list, 'li'), { z: -300, y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
    }
    render('seo-plan', (r) => {
      const t = String(r.text);
      plan.goal = (/\*\*Goal:\*\*\s*(.+)/.exec(t) || [])[1] || '';
      tableRows(t).slice(1).forEach((c) => { const m = /(\d+)\s*[-–]\s*(\d+)/.exec(c[0] || ''); if (!m) return; const key = m[2] === '30' ? '30' : m[2] === '60' ? '60' : '90'; plan.windows[key] = { name: c[0].replace(/\*/g, ''), prio: (c[1] || '').split(/\.\s/).slice(0, 2).join('. ') }; });
      paintPlan();
    });
    render('blog-calendar', (r) => {
      plan.items = tableRows(r.text).slice(1).map((c) => { const m = /(\d+)\s*[-–]\s*(\d+)/.exec(c[0] || ''); const day = /\(Day (\d+)\)/.exec(c[2] || ''); return m ? { win: m[2] === '30' ? '30' : m[2] === '60' ? '60' : '90', type: c[1] || '', title: (c[2] || '').replace(/\s*\(Day \d+\)/, ''), when: day ? `day ${day[1]}` : c[0], kw: c[3] || '' } : null; }).filter(Boolean);
      paintPlan();
    });
    qa(s, '[data-win]').forEach((b) => b.addEventListener('click', () => { hold(); win = b.dataset.win; qa(b.parentElement, 'button').forEach((o) => o.setAttribute('aria-pressed', String(o === b))); paintPlan(); }));
    const panelOf = (k) => q(s, `.c7-panel[data-slot="${k}"]`);
    onBeat(s, (id) => {
      const map = { '07-4': 'keywords', '07-5': 'seo-audit', '07-6': 'backlink-analyzer', '07-7': 'geo-citability' };
      if (map[id]) { reveal(map[id]); const p = panelOf(map[id]); p.classList.remove('is-traced'); void p.offsetWidth; p.classList.add('is-traced'); }
      if (!motion()) Object.values(map).forEach(reveal);
      if (id === '07-9' || id === '07-10' || !motion()) { reveal('seo-plan'); reveal('blog-calendar'); }
      if (id === '07-1' && G && motion()) G.from(q(s, '.c7-ask'), { scale: 0.7, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.8)', clearProps: 'opacity,visibility,transform' });
    });
  })();

  // static (no motion) layout: show every result without waiting for a beat
  if (!motion()) Object.keys(SLOTS).forEach((k) => { if (!SLOTS[k].blocked) reveal(k); });

  // ---- Next restarts motion: replay the arrival entrance when a scene becomes active ----
  let lastScene = document.body.dataset.scene;
  new MutationObserver(() => {
    const now = document.body.dataset.scene;
    if (now === lastScene) return;
    lastScene = now;
    const s = byScene[now];
    if (!s || !G || !motion()) return;
    const head = q(s, 'header[class$="-head"]');
    G.fromTo(head.children, { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', overwrite: true, clearProps: 'opacity,visibility,transform' });
    const m = model.get(s); setBeat(s, Math.max(0, m.bi), true);
  }).observe(document.body, { attributes: true, attributeFilter: ['data-scene'] });

  // pause scene videos when the presenter pauses
  new MutationObserver(() => { if (document.body.classList.contains('motion-paused')) scenes.forEach(pauseVideosIn); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  window.gtpEngage = { slots: SLOTS, reveal };
  frame();
  addEventListener('load', frame);
})();
