// Voice presenter assistant, single-screen mode (owner item 21). The deck listens through
// the laptop mic (Chrome Web Speech API), matches what the presenter says against the cue
// map built from experience/presentation-script.md (chapters/voice-cues.json) and plays
// the matching beat.
//
// Two-screen mode (presenter.html on the laptop, /?audience=1 on the projector) is the
// main way to present now; this pill stays for rehearsing on one screen.
//
// Off by default: active only on localhost / 127.0.0.1, or with ?voice=1.
// ?voice=1 opens the pill and starts listening; ?voice=0 turns it off everywhere.
// Never on the audience screen (?audience=1): nothing voice-related shows there.
// Matching and the speech listener: chapters/voice-match.js (shared with presenter.js).
// Moving: chapters/presenter-link.js glides the scroll to the beat's end at the script's
// pace (window.gtpDeckLink.play), so every scroll animation plays; without it, the old
// hash jump. Test hook without a mic: window.gtpVoice.hear('words'), window.gtpVoice.state.
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const flag = params.get('voice');
  const local = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname);
  if (params.get('audience') === '1') return;
  if (flag === '0' || (!local && flag !== '1')) return;
  const autoListen = flag === '1';

  // voice-match.js and presenter-link.js may be tagged after this file; deferred scripts
  // have all run by DOMContentLoaded.
  if (window.GTPVoiceMatch) init();
  else addEventListener('DOMContentLoaded', init, { once: true });

  function init() {
    const M = window.GTPVoiceMatch;
    if (!M) return;
    const S = { cues: [], loaded: false, loadError: '', lastMove: null, lastResult: null, lockUntil: 0, lockIndex: -1, moves: 0, beat: -1 };
    const ear = M.createEar({ onStatus: () => render(), onHeard: (text, source) => { if (source === 'mic') evaluate('mic'); }, onStart: () => window.deckHold && window.deckHold() });

    // ---- deck position ----
    const autoState = () => document.getElementById('autoStatus')?.dataset.state || '';
    function deckPos() {
      const num = document.body.dataset.scene;
      const el = num && document.querySelector(`.scene[data-scene="${num}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { scene: num, p: Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight))) };
    }
    // The beat last played, while the deck is still inside it; otherwise from the position.
    function currentIndex() {
      if (performance.now() < S.lockUntil) return S.lockIndex;
      const pos = deckPos();
      if (!pos) return -1;
      const played = S.cues[S.beat];
      if (played && played.scene === pos.scene && pos.p >= played.p0 - 0.01 && pos.p <= played.p1 + 0.02) return S.beat;
      return M.beatAt(S.cues, pos.scene, pos.p);
    }
    // A modal (overview, stage, clip player, join pop-up) or a deck transition owns the deck.
    function blocker() {
      if (document.querySelector('dialog[open]')) return 'a dialog is open';
      const modal = [...document.querySelectorAll('[aria-modal="true"]')].find((el) => !el.hidden && el.getClientRects().length);
      if (modal) return 'an overlay is open';
      if (autoState() === 'jumping') return 'the deck is moving';
      return '';
    }

    // ---- matching ----
    function evaluate(source) {
      const win = ear.window();
      const cur = currentIndex();
      const { pick, scored } = M.choose(S.cues, cur, win);
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
          S.lockIndex = pick.i; S.lockUntil = performance.now() + M.LOCK_MS; S.beat = pick.i;
          ear.consume();
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
      const cue = S.cues[i];
      if (window.gtpDeckLink) {
        window.gtpDeckLink.play({ beat: cue.id, scene: cue.scene, p0: cue.p0, lead: cue.lead, p1: cue.p1, seconds: cue.glideSeconds ?? cue.seconds, speed: 1 });
        return 'glide';
      }
      const pos = deckPos(), target = Number(cue.scene), active = pos ? Number(pos.scene) : 0;
      // Next steps one section now; the scene move is the deck's explicit scene call.
      if (target === active + 1 && window.deckNav?.goScene) {
        window.deckNav.goScene(target - 1);
        if (cue.action.pct > 6) {
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
  <p class="gtp-voice__keys">V shows or hides this. Only the next two beats can be matched. Two screens: open presenter.html.</p>
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
    micButton.addEventListener('click', () => ear.listen(!ear.want));
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
      listening: () => `Listening (${ear.lang}).`,
      fallback: 'en-ZA is not available here; switching to en-US.',
      unsupported: 'No speech recognition in this browser. Open the deck in Google Chrome.',
      denied: 'Microphone blocked. Allow the mic for this site, then press Start listening.',
      nomic: 'No microphone found. Plug one in, then press Start listening.',
      network: "Chrome's speech service did not answer (it needs internet). Retrying.",
      'network-stop': "Chrome's speech service is unreachable. Check the internet, then press Start listening.",
      error: () => `Speech error: ${ear.detail}. Press Start listening to retry.`
    };
    const quote = (s, n = 70) => (s.length > n ? '…' + s.slice(-n) : s);
    function render() {
      const msg = STATUS[ear.status];
      let text = typeof msg === 'function' ? msg() : msg || '';
      if (!S.loaded && !S.loadError) text = 'Loading the cue map.';
      if (S.loadError) text = `Cue map did not load (${S.loadError}). Voice cues are off.`;
      statusEl.textContent = text;
      root.dataset.status = S.loadError ? 'error' : ear.status;
      micButton.textContent = ear.want ? 'Stop listening' : 'Start listening';
      micButton.setAttribute('aria-pressed', String(ear.want));
      micButton.disabled = !S.loaded || !ear.supported;
      if (panel.hidden) return;
      field('heard').textContent = ear.lastText ? quote(ear.lastText.trim()) : 'Nothing yet';
      const cur = S.loaded ? currentIndex() : -1;
      const nxt = S.cues[M.eligible(S.cues, cur)[0]];
      field('next').textContent = nxt ? `${nxt.id} · “${nxt.cue || nxt.triggers[0].phrase}”` : S.loaded ? 'End of the script' : '…';
      const r = S.lastResult;
      field('last').textContent = S.lastMove ? `${S.lastMove.id} at ${S.lastMove.at} (match ${Math.round(S.lastMove.score * 100)}%)` : r && r.id && r.reason ? `${r.id} matched, held: ${r.reason}` : 'None yet';
    }
    // Keep "Next cue" honest while the deck moves.
    setInterval(() => { if (!panel.hidden) render(); }, 1000);

    // ---- public test hook ----
    function hear(text) {
      ear.hear(text);
      return S.loaded ? evaluate('test') : { moved: false, reason: 'cue map not loaded' };
    }
    const ready = fetch(new URL('./chapters/voice-cues.json?v=2', document.baseURI)).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }).then((data) => {
      S.cues = M.prepare(data.cues);
      S.loaded = true;
      if (autoListen) ear.listen(true);
      render();
      return S.cues.length;
    }).catch((err) => { S.loadError = err.message; render(); return 0; });

    window.gtpVoice = {
      hear,
      listen: (on) => ear.listen(on),
      toggle,
      ready,
      get state() {
        const cur = S.loaded ? currentIndex() : -1;
        return {
          active: true, loaded: S.loaded, cues: S.cues.length, status: ear.status, lang: ear.lang, listening: ear.listening,
          current: S.cues[cur]?.id || null, next: M.eligible(S.cues, cur).map((i) => S.cues[i].id),
          heard: ear.window().join(' '), lastMove: S.lastMove, lastResult: S.lastResult, moves: S.moves, deck: deckPos()
        };
      }
    };
    render();
    if (autoListen) toggle(true);
  }
})();
