// Voice presenter assistant (owner item 21). The deck listens through the laptop
// mic (Chrome Web Speech API), matches what the presenter says against the cue map
// built from experience/presentation-script.md (chapters/voice-cues.json) and
// brings in the matching beat.
//
// Off by default: active only on localhost / 127.0.0.1, or with ?voice=1.
// ?voice=1 opens the pill and starts listening; ?voice=0 turns it off everywhere.
// Only the current beat and the next two are ever candidates, so a match can
// never move the deck backwards or far ahead. Same scene: the deck's own hash
// API (#SS-PP, scroll-presentation.js restoreSceneHash). Next scene: the Next
// control, which runs the deck's go(index+1) transition (no window API exists).
// Test hook without a mic: window.gtpVoice.hear('words'), window.gtpVoice.state.
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const flag = params.get('voice');
  const local = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname);
  if (flag === '0' || (!local && flag !== '1')) return;
  const autoListen = flag === '1';

  const THRESHOLD = 0.6, WINDOW = 24, LOCK_MS = 2000;
  // ---- normalisation (keep identical to scripts/build-voice-cues.mjs) ----
  const NUMS = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50', sixty: '60', seventy: '70', eighty: '80', ninety: '90', hundred: '100' };
  const STOP = new Set('a an the and or but so to of in on at for with from by is are was were be been being it its this that these those i im you your youre youve youll we weve well our us they theyre their them he she his her my me do does did just now then than there theres here heres okay ok right oh um uh lets let also very really as if up out about into get got go going gonna can will would could should has have had not dont thats whats s ll re ve d t'.split(' '));
  // Spelled letters join into one token, so "E, C, O" and "C-R-O" match Chrome's "ECO" and "CRO".
  function words(text) {
    const raw = String(text).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
    const out = [];
    for (let i = 0; i < raw.length; i++) {
      if (/^[a-z]$/.test(raw[i]) && /^[a-z]$/.test(raw[i + 1] || '')) { let run = raw[i]; while (/^[a-z]$/.test(raw[i + 1] || '')) run += raw[++i]; out.push(run); }
      else out.push(NUMS[raw[i]] || raw[i]);
    }
    return out;
  }
  const keysOf = (ws) => [...new Set(ws.filter((w) => !STOP.has(w)))];
  const same = (a, b) => a === b || (a.length >= 5 && b.length >= 5 && (a.startsWith(b) || b.startsWith(a)));

  const S = {
    cues: [], loaded: false, loadError: '',
    status: 'off', detail: '', lang: 'en-ZA', listening: false, want: false,
    heard: [], interim: { idx: -1, tokens: [], skip: 0 }, lastText: '',
    lastMove: null, lastResult: null, lockUntil: 0, lockIndex: -1, moves: 0, netFails: 0
  };

  // ---- deck position ----
  const nextButton = document.getElementById('nextButton');
  const autoState = () => document.getElementById('autoStatus')?.dataset.state || '';
  function deckPos() {
    const num = document.body.dataset.scene;
    const el = num && document.querySelector(`.scene[data-scene="${num}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { scene: num, p: Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight))) };
  }
  function currentIndex() {
    if (performance.now() < S.lockUntil) return S.lockIndex;
    const pos = deckPos();
    if (!pos) return -1;
    let cur = -1;
    S.cues.forEach((c, i) => { if (c.scene < pos.scene || (c.scene === pos.scene && c.p0 <= pos.p + 0.005)) cur = i; });
    return cur;
  }
  // A modal (overview, stage, clip player, join pop-up) or a glide in progress owns the deck.
  function blocker() {
    if (document.querySelector('dialog[open]')) return 'a dialog is open';
    const modal = [...document.querySelectorAll('[aria-modal="true"]')].find((el) => !el.hidden && el.getClientRects().length);
    if (modal) return 'an overlay is open';
    if (autoState() === 'jumping') return 'the deck is moving';
    return '';
  }

  // ---- matching ----
  function windowTokens() { return [...S.heard, ...S.interim.tokens.slice(S.interim.skip)].slice(-WINDOW); }
  function scoreCue(cue, win) {
    let best = { score: 0, hit: 0, need: 0, phrase: '' };
    for (const t of cue.triggers) {
      const keys = t.rt;
      const hit = keys.filter((k) => win.some((w) => same(k, w))).length;
      const score = hit / keys.length;
      if (score > best.score || (score === best.score && hit > best.hit)) best = { score, hit, need: Math.min(3, keys.length), phrase: t.phrase };
    }
    best.pass = best.score >= THRESHOLD && best.hit >= best.need;
    return best;
  }
  function consume() { S.heard = []; if (S.interim.idx >= 0) S.interim.skip = S.interim.tokens.length; }
  function evaluate(source) {
    const win = windowTokens();
    const cur = currentIndex();
    const cands = [cur + 1, cur + 2].filter((i) => i >= 0 && i < S.cues.length);
    const scored = cands.map((i) => ({ i, id: S.cues[i].id, ...scoreCue(S.cues[i], win) }));
    let pick = null;
    scored.forEach((s) => { if (s.pass && (!pick || s.score > pick.score + 1e-9)) pick = s; });
    const result = { source, heard: win.join(' '), current: S.cues[cur]?.id || null, candidates: scored.map(({ id, score, hit }) => ({ id, score: Number(score.toFixed(2)), hit })), moved: false, id: pick?.id || null };
    if (pick) {
      const block = performance.now() < S.lockUntil ? 'just moved' : blocker();
      if (block) result.reason = block;
      else {
        result.how = moveTo(pick.i);
        result.moved = true;
        result.score = Number(pick.score.toFixed(2));
        S.moves++;
        S.lastMove = { id: pick.id, phrase: pick.phrase, score: result.score, how: result.how, at: new Date().toLocaleTimeString() };
        S.lockIndex = pick.i; S.lockUntil = performance.now() + LOCK_MS;
        consume();
      }
    }
    S.lastResult = result;
    render();
    return result;
  }

  // ---- moving the deck ----
  function jumpHash(hash) {
    if (location.hash === hash) return;
    history.replaceState(null, '', location.pathname + location.search + hash);
    dispatchEvent(new HashChangeEvent('hashchange'));
  }
  function moveTo(i) {
    const cue = S.cues[i], pos = deckPos();
    const target = Number(cue.scene), active = pos ? Number(pos.scene) : 0;
    if (target === active + 1 && nextButton && !nextButton.disabled) {
      nextButton.click();
      if (cue.action.pct > 6) {
        // Wait for the transition to land, then bring in the later beat.
        const until = performance.now() + 3500;
        const settle = () => {
          if (autoState() !== 'jumping' && document.body.dataset.scene === cue.scene) { jumpHash(cue.action.hash); return; }
          if (performance.now() < until) setTimeout(settle, 120); else jumpHash(cue.action.hash);
        };
        setTimeout(settle, 300);
        return 'next-then-hash';
      }
      return 'next';
    }
    jumpHash(cue.action.hash);
    return 'hash';
  }

  // ---- speech recognition ----
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, restartTimer = 0;
  function setStatus(status, detail = '') { S.status = status; S.detail = detail; render(); }
  function pushTokens(tokens) { S.heard.push(...tokens); if (S.heard.length > 60) S.heard.splice(0, S.heard.length - 60); }
  function onResult(event) {
    if (!S.want) return;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i], text = r[0].transcript, tokens = words(text);
      if (r.isFinal) {
        const skip = S.interim.idx === i ? S.interim.skip : 0;
        pushTokens(tokens.slice(skip));
        if (S.interim.idx === i) S.interim = { idx: -1, tokens: [], skip: 0 };
      } else {
        S.interim = { idx: i, tokens, skip: S.interim.idx === i ? Math.min(S.interim.skip, tokens.length) : 0 };
      }
      S.lastText = text;
    }
    S.netFails = 0;
    evaluate('mic');
  }
  function listen(on) {
    if (!on) {
      S.want = false; clearTimeout(restartTimer);
      if (rec) { try { rec.abort(); } catch {} }
      S.heard = []; S.interim = { idx: -1, tokens: [], skip: 0 };
      setStatus('off');
      return;
    }
    if (!SR) { setStatus('unsupported'); return; }
    S.want = true;
    if (rec) return;
    rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1; rec.lang = S.lang;
    // A restarted session numbers its results from 0 again.
    rec.onstart = () => { S.listening = true; S.interim = { idx: -1, tokens: [], skip: 0 }; setStatus('listening'); };
    rec.onresult = onResult;
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { S.want = false; setStatus('denied'); }
      else if (e.error === 'audio-capture') { S.want = false; setStatus('nomic'); }
      else if (e.error === 'language-not-supported' && S.lang !== 'en-US') { S.lang = 'en-US'; setStatus('fallback'); }
      else if (e.error === 'network') { S.netFails++; if (S.netFails >= 5) { S.want = false; setStatus('network-stop'); } else setStatus('network'); }
      else if (e.error !== 'no-speech' && e.error !== 'aborted') setStatus('error', e.error);
    };
    rec.onend = () => {
      S.listening = false; rec = null;
      if (S.want) { clearTimeout(restartTimer); restartTimer = setTimeout(() => listen(true), S.status === 'network' ? 2500 : 300); }
      else if (S.status === 'listening') setStatus('off');
      else render();
    };
    try { rec.start(); } catch (err) { rec = null; S.want = false; setStatus('error', err.message); }
  }

  // ---- pill ----
  const MIC = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2Z"/></svg>';
  const root = document.createElement('div');
  root.className = 'gtp-voice';
  root.innerHTML = `<button type="button" class="gtp-voice__launcher" aria-expanded="false" aria-controls="gtpVoicePanel" title="Voice cues (V)">${MIC}<span>Voice</span><i class="gtp-voice__dot" aria-hidden="true"></i></button>
<section id="gtpVoicePanel" class="gtp-voice__panel" aria-label="Voice cues" hidden>
  <div class="gtp-voice__top"><strong>Voice cues</strong><button type="button" class="gtp-voice__mic" aria-pressed="false">Start listening</button><button type="button" class="gtp-voice__close" aria-label="Hide voice cues">×</button></div>
  <p class="gtp-voice__status" role="status" aria-live="polite"></p>
  <dl class="gtp-voice__facts"><dt>Heard</dt><dd data-v="heard">Nothing yet</dd><dt>Next cue</dt><dd data-v="next">…</dd><dt>Last move</dt><dd data-v="last">None yet</dd></dl>
  <form class="gtp-voice__try"><label for="gtpVoiceTry">Test a line without the mic</label><div><input id="gtpVoiceTry" type="text" autocomplete="off" spellcheck="false" placeholder="Type the start of a line, press Enter"><button type="submit">Hear</button></div></form>
  <p class="gtp-voice__keys">V shows or hides this. Only the next two beats can be matched.</p>
</section>`;
  document.body.appendChild(root);
  const launcher = root.querySelector('.gtp-voice__launcher'), panel = root.querySelector('.gtp-voice__panel');
  const micButton = root.querySelector('.gtp-voice__mic'), statusEl = root.querySelector('.gtp-voice__status');
  const field = (k) => root.querySelector(`[data-v="${k}"]`);
  // Keys typed or pressed inside the pill never reach the deck's Space, arrow and speed keys.
  root.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') { toggle(false); launcher.focus(); } });
  function toggle(open = panel.hidden) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-open', open);
    render();
  }
  launcher.addEventListener('click', () => toggle());
  root.querySelector('.gtp-voice__close').addEventListener('click', () => toggle(false));
  micButton.addEventListener('click', () => listen(!S.want));
  root.querySelector('.gtp-voice__try').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = root.querySelector('#gtpVoiceTry');
    if (input.value.trim()) hear(input.value);
    input.value = '';
  });
  addEventListener('keydown', (e) => {
    if (e.key !== 'v' && e.key !== 'V') return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;
    const a = document.activeElement;
    if (a && (/INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable)) return;
    if (blocker() && blocker() !== 'the deck is moving') return;
    toggle();
  });

  const STATUS = {
    off: 'Mic off. Press Start listening, or test a line below.',
    listening: () => `Listening (${S.lang}).`,
    fallback: 'en-ZA is not available here; switching to en-US.',
    unsupported: 'No speech recognition in this browser. Open the deck in Google Chrome.',
    denied: 'Microphone blocked. Allow the mic for this site, then press Start listening.',
    nomic: 'No microphone found. Plug one in, then press Start listening.',
    network: "Chrome's speech service did not answer (it needs internet). Retrying.",
    'network-stop': "Chrome's speech service is unreachable. Check the internet, then press Start listening.",
    error: () => `Speech error: ${S.detail}. Press Start listening to retry.`,
    loading: 'Loading the cue map.'
  };
  const quote = (s, n = 70) => (s.length > n ? '…' + s.slice(-n) : s);
  function render() {
    const msg = STATUS[S.status];
    let text = typeof msg === 'function' ? msg() : msg || '';
    if (S.loadError) text = `Cue map did not load (${S.loadError}). Voice cues are off.`;
    statusEl.textContent = text;
    root.dataset.status = S.loadError ? 'error' : S.status;
    micButton.textContent = S.want ? 'Stop listening' : 'Start listening';
    micButton.setAttribute('aria-pressed', String(S.want));
    micButton.disabled = !S.loaded || !SR;
    if (panel.hidden) return;
    field('heard').textContent = S.lastText ? quote(S.lastText.trim()) : 'Nothing yet';
    const cur = S.loaded ? currentIndex() : -1;
    const nxt = S.cues[cur + 1];
    field('next').textContent = nxt ? `${nxt.id} · “${nxt.triggers[0].phrase}”` : S.loaded ? 'End of the script' : '…';
    const r = S.lastResult;
    field('last').textContent = S.lastMove ? `${S.lastMove.id} at ${S.lastMove.at} (match ${Math.round(S.lastMove.score * 100)}%)` : r && r.id && r.reason ? `${r.id} matched, held: ${r.reason}` : 'None yet';
  }
  // Keep "Next cue" honest while the auto-scroll moves the deck.
  setInterval(() => { if (!panel.hidden) render(); }, 1000);

  // ---- public test hook ----
  function hear(text) {
    S.lastText = String(text);
    pushTokens(words(text));
    return S.loaded ? evaluate('test') : { moved: false, reason: 'cue map not loaded' };
  }
  const ready = fetch(new URL('./chapters/voice-cues.json?v=1', document.baseURI)).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }).then((data) => {
    S.cues = data.cues.map((c) => ({ ...c, triggers: c.triggers.map((t) => ({ ...t, rt: keysOf(words(t.phrase)) })).filter((t) => t.rt.length) }));
    S.loaded = true;
    if (autoListen) listen(true);
    else if (S.status === 'loading') setStatus('off');
    return S.cues.length;
  }).catch((err) => { S.loadError = err.message; render(); return 0; });

  window.gtpVoice = {
    hear,
    listen,
    toggle,
    ready,
    get state() {
      const cur = S.loaded ? currentIndex() : -1;
      return {
        active: true, loaded: S.loaded, cues: S.cues.length, status: S.status, lang: S.lang, listening: S.listening,
        current: S.cues[cur]?.id || null, next: [S.cues[cur + 1]?.id, S.cues[cur + 2]?.id].filter(Boolean),
        heard: windowTokens().join(' '), lastMove: S.lastMove, lastResult: S.lastResult, moves: S.moves, deck: deckPos()
      };
    }
  };
  setStatus(SR ? 'loading' : 'unsupported');
  if (autoListen) toggle(true);
})();
