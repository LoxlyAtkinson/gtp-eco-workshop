// Shared voice matcher (owner item 21, two-screen presenting 2026-10-28).
// One copy of the word rules, the cue scoring and the Chrome speech listener, used by:
//   - presenter.js (the laptop screen in two-screen mode),
//   - chapters/voice-cues.js (the single-screen ?voice=1 pill),
//   - scripts/build-voice-cues.mjs (loads this file with node:vm, so the cue keys it
//     writes are normalised exactly the way the browser normalises what it hears).
// Plain script, no imports: it sets globalThis.GTPVoiceMatch.
(function (root) {
  'use strict';
  // Real speech garbles brand names ("Amberkloof" heard as "brookhuru"), so a first-words
  // trigger needs half its key words, at least 2. A cue-word trigger needs one cue word.
  // Only the next 2 beats that have a trigger can match, and a move locks matching for 2 s.
  const THRESHOLD = 0.5, MIN_HITS = 2, WINDOW = 24, LOCK_MS = 2000, AHEAD = 2;
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
  // Context words for a {{cue}}: real content words, not single letters.
  const contentOf = (ws) => ws.filter((w) => !STOP.has(w) && (w.length >= 3 || /^\d+$/.test(w)));

  function editDistance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let best = i;
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }
  // Same word, a shared 5-letter stem ("engage"/"engagement"), or one wrong letter in a
  // long word ("convert" heard as "concert"); two wrong letters from 9 letters up.
  function same(a, b) {
    if (a === b) return true;
    if (a.length >= 5 && b.length >= 5 && (a.startsWith(b) || b.startsWith(a))) return true;
    const n = Math.min(a.length, b.length);
    if (n < 6) return false;
    const max = n >= 9 ? 2 : 1;
    return editDistance(a, b, max) <= max;
  }

  // Cue map from chapters/voice-cues.json: every beat, silent ones with no triggers.
  function prepare(cues) {
    return cues.map((c) => ({
      ...c,
      triggers: (c.triggers || []).map((t) => ({ ...t, rt: t.keys && t.keys.length ? t.keys : keysOf(words(t.phrase)), rc: t.cue && t.cue.length ? t.cue : null })).filter((t) => t.rt.length)
    }));
  }
  function scoreCue(cue, win) {
    let best = { score: 0, hit: 0, need: 0, phrase: '', pass: false };
    for (const t of cue.triggers) {
      const hit = t.rt.filter((k) => win.some((w) => same(k, w))).length;
      const cueHit = t.rc ? t.rc.filter((k) => win.some((w) => same(k, w))).length : 1;
      const score = hit / t.rt.length;
      const need = t.rc ? 1 : Math.min(MIN_HITS, t.rt.length);
      const pass = score >= THRESHOLD && hit >= need && cueHit >= 1;
      if ((pass && !best.pass) || (pass === best.pass && (score > best.score || (score === best.score && hit > best.hit)))) best = { score, hit, need, phrase: t.phrase, pass };
    }
    return best;
  }
  // The next AHEAD beats after `cur` that can be spoken (silent beats are skipped).
  function eligible(cues, cur) {
    const out = [];
    for (let i = Math.max(-1, cur) + 1; i < cues.length && out.length < AHEAD; i++) if (cues[i].triggers.length) out.push(i);
    return out;
  }
  function choose(cues, cur, win) {
    const scored = eligible(cues, cur).map((i) => ({ i, id: cues[i].id, ...scoreCue(cues[i], win) }));
    let pick = null;
    scored.forEach((s) => { if (s.pass && (!pick || s.score > pick.score + 1e-9)) pick = s; });
    return { pick, scored };
  }
  // The beat the deck is in, from its position: the last beat that started before p.
  // At a scene's top (p = 0) that is the previous scene's last beat, so the scene's
  // first beat is the next one to say.
  function beatAt(cues, scene, p) {
    let cur = -1;
    cues.forEach((c, i) => { if (c.scene < scene || (c.scene === scene && c.p0 < p - 0.003)) cur = i; });
    return cur;
  }

  // Chrome speech listener with a rolling window of heard words. Interim results count at
  // once (a cue fires while the word is still being said); finals replace them.
  function createEar(opts = {}) {
    const SR = root.SpeechRecognition || root.webkitSpeechRecognition;
    const ear = { supported: Boolean(SR), lang: opts.lang || 'en-ZA', status: SR ? 'off' : 'unsupported', detail: '', want: false, listening: false, lastText: '' };
    let heard = [], interim = { idx: -1, tokens: [], skip: 0 }, rec = null, restartTimer = 0, netFails = 0;
    const setStatus = (status, detail = '') => { ear.status = status; ear.detail = detail; opts.onStatus && opts.onStatus(status, detail); };
    const push = (tokens) => { heard.push(...tokens); if (heard.length > 60) heard.splice(0, heard.length - 60); };
    ear.window = () => [...heard, ...interim.tokens.slice(interim.skip)].slice(-WINDOW);
    ear.consume = () => { heard = []; if (interim.idx >= 0) interim.skip = interim.tokens.length; };
    ear.hear = (text) => { ear.lastText = String(text); push(words(text)); opts.onHeard && opts.onHeard(ear.lastText, 'test'); };
    function onResult(event) {
      if (!ear.want) return;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i], text = r[0].transcript, tokens = words(text);
        if (r.isFinal) {
          const skip = interim.idx === i ? interim.skip : 0;
          push(tokens.slice(skip));
          if (interim.idx === i) interim = { idx: -1, tokens: [], skip: 0 };
        } else {
          interim = { idx: i, tokens, skip: interim.idx === i ? Math.min(interim.skip, tokens.length) : 0 };
        }
        ear.lastText = text;
      }
      netFails = 0;
      opts.onHeard && opts.onHeard(ear.lastText, 'mic');
    }
    ear.listen = (on) => {
      if (!on) {
        ear.want = false; clearTimeout(restartTimer);
        if (rec) { try { rec.abort(); } catch (e) { /* already stopped */ } }
        heard = []; interim = { idx: -1, tokens: [], skip: 0 };
        setStatus('off');
        return;
      }
      if (!SR) { setStatus('unsupported'); return; }
      ear.want = true;
      if (rec) return;
      rec = new SR();
      rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1; rec.lang = ear.lang;
      // A restarted session numbers its results from 0 again.
      rec.onstart = () => { ear.listening = true; interim = { idx: -1, tokens: [], skip: 0 }; setStatus('listening'); opts.onStart && opts.onStart(); };
      rec.onresult = onResult;
      rec.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { ear.want = false; setStatus('denied'); }
        else if (e.error === 'audio-capture') { ear.want = false; setStatus('nomic'); }
        else if (e.error === 'language-not-supported' && ear.lang !== 'en-US') { ear.lang = 'en-US'; setStatus('fallback'); }
        else if (e.error === 'network') { netFails++; if (netFails >= 5) { ear.want = false; setStatus('network-stop'); } else setStatus('network'); }
        else if (e.error !== 'no-speech' && e.error !== 'aborted') setStatus('error', e.error);
      };
      rec.onend = () => {
        ear.listening = false; rec = null;
        if (ear.want) { clearTimeout(restartTimer); restartTimer = setTimeout(() => ear.listen(true), ear.status === 'network' ? 2500 : 300); }
        else if (ear.status === 'listening') setStatus('off');
        else setStatus(ear.status, ear.detail);
      };
      try { rec.start(); } catch (err) { rec = null; ear.want = false; setStatus('error', err.message); }
    };
    return ear;
  }

  root.GTPVoiceMatch = { THRESHOLD, MIN_HITS, WINDOW, LOCK_MS, AHEAD, words, keysOf, contentOf, same, prepare, scoreCue, eligible, choose, beatAt, createEar };
})(typeof window !== 'undefined' ? window : globalThis);
