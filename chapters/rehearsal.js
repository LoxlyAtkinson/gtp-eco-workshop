// Rehearsal recorder (owner, 2026-10-28). Local deck only, with ?rehearse=1.
// The owner wings the talk and moves the deck himself; this only LISTENS:
// mic audio goes to the live runner in 5 s chunks, plus a log of which slide and
// beat is on screen and the words Chrome hears. Nothing here moves the deck.
// Saved by live-runner/lib/rehearsal.mjs under live-runner/.stage/rehearsal/<id>/.
// The first two takes recorded silence (the browser's default mic was not the one he
// spoke into), so the panel now has a mic picker and a live level bar that warns.
(() => {
  'use strict';
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (!local || new URLSearchParams(location.search).get('rehearse') !== '1') return;
  const RUNNER = 'http://127.0.0.1:8790';
  const MIC_KEY = 'gtp-rehearse-mic';
  const QUIET_DB = -50, QUIET_MS = 8000; // below this for this long = no voice reaching the mic

  let id = null, t0 = 0, rec = null, speech = null, recording = false, queue = Promise.resolve(), lastHash = '', lastScene = '', heard = '';
  let stream = null, ctx = null, analyser = null, loudAt = 0;
  const now = () => Math.round(performance.now() - t0);
  const where = () => ({ scene: document.body.dataset.scene || '', hash: location.hash.replace('#', '') });

  const panel = document.createElement('div');
  panel.className = 'gtp-rehearse';
  panel.innerHTML = '<label class="gtp-rehearse__miclabel">Microphone <select class="gtp-rehearse__mic"><option value="">Click to choose…</option></select></label><div class="gtp-rehearse__meter" title="Your voice level"><i></i></div><p class="gtp-rehearse__hint">Say something: the bar should jump. If it stays flat, pick another microphone.</p><button type="button" class="gtp-rehearse__btn">● Record rehearsal</button><p class="gtp-rehearse__status">Not recording.</p><p class="gtp-rehearse__heard"></p>';
  document.body.append(panel);
  const $ = (s) => panel.querySelector(s);
  const btn = $('.gtp-rehearse__btn'), status = $('.gtp-rehearse__status'), heardEl = $('.gtp-rehearse__heard');
  const micSel = $('.gtp-rehearse__mic'), bar = $('.gtp-rehearse__meter i'), hint = $('.gtp-rehearse__hint');
  panel.addEventListener('keydown', (e) => e.stopPropagation());

  const send = (path, bodyInit, type) => { queue = queue.then(() => fetch(`${RUNNER}/rehearsal/${id}/${path}`, { method: 'POST', headers: { 'content-type': type }, body: bodyInit }).catch(() => { status.textContent = 'Runner not reachable: start it with npm run stage.'; })); };
  const log = (type, extra = {}) => send('event', JSON.stringify({ t: now(), type, ...where(), ...extra }), 'application/json');

  async function listMics() {
    const devs = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'audioinput');
    const saved = localStorage.getItem(MIC_KEY);
    micSel.replaceChildren(...devs.map((d, i) => Object.assign(document.createElement('option'), { value: d.deviceId, textContent: d.label || `Microphone ${i + 1}`, selected: d.deviceId === saved })));
  }
  // Open the chosen mic and drive the level bar, so a silent mic shows before a long take.
  async function openMic(deviceId) {
    stream?.getTracks().forEach((t) => t.stop());
    stream = await navigator.mediaDevices.getUserMedia({ audio: deviceId ? { deviceId: { exact: deviceId } } : true });
    const used = stream.getAudioTracks()[0]?.getSettings().deviceId;
    if (used) { localStorage.setItem(MIC_KEY, used); }
    await listMics();
    if (used) micSel.value = used;
    ctx = ctx || new AudioContext();
    analyser = ctx.createAnalyser(); analyser.fftSize = 2048;
    ctx.createMediaStreamSource(stream).connect(analyser);
    loudAt = performance.now();
  }
  const buf = new Float32Array(2048);
  (function meter() {
    if (analyser) {
      analyser.getFloatTimeDomainData(buf);
      let sum = 0; for (const v of buf) sum += v * v;
      const db = 10 * Math.log10(sum / buf.length + 1e-12);
      bar.style.width = `${Math.max(0, Math.min(100, (db + 70) * 1.6))}%`;
      if (db > QUIET_DB) { loudAt = performance.now(); panel.classList.remove('is-quiet'); }
      else if (performance.now() - loudAt > QUIET_MS) {
        panel.classList.add('is-quiet');
        hint.textContent = 'No voice is reaching this microphone. Pick another one above.';
      }
      if (!panel.classList.contains('is-quiet')) hint.textContent = 'Say something: the bar should jump. If it stays flat, pick another microphone.';
    }
    requestAnimationFrame(meter);
  })();
  // Open the mic as soon as the rehearsal page loads, so the level bar moves before Record is pressed.
  openMic(localStorage.getItem(MIC_KEY) || '').catch(() => { hint.textContent = 'Microphone blocked. Allow it in the address bar, then reload.'; });
  micSel.addEventListener('change', () => { if (!recording) openMic(micSel.value).catch(() => { hint.textContent = 'That microphone would not open. Pick another one.'; }); });

  function watchSlides() {
    if (!recording) return;
    const w = where();
    if (w.scene !== lastScene || w.hash !== lastHash) { lastScene = w.scene; lastHash = w.hash; log('slide'); }
    const s = Math.round(now() / 1000);
    status.textContent = `Recording ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} · slide ${w.scene || '?'}`;
    setTimeout(watchSlides, 500);
  }

  function startSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    speech = new SR();
    speech.lang = 'en-ZA'; speech.continuous = true; speech.interimResults = true;
    speech.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text = e.results[i][0].transcript.trim();
        if (e.results[i].isFinal && text) { log('speech', { text }); heard = text; }
        heardEl.textContent = `Heard: ${e.results[i].isFinal ? heard : text}`;
      }
    };
    speech.onend = () => { if (recording) try { speech.start(); } catch { /* already running */ } };
    try { speech.start(); } catch { /* ignore */ }
  }

  async function start() {
    try { if (!stream) await openMic(micSel.value || localStorage.getItem(MIC_KEY) || ''); }
    catch { status.textContent = 'Microphone blocked. Allow it in the address bar, then press the button again.'; return; }
    const r = await fetch(`${RUNNER}/rehearsal/start`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }).then((x) => x.json()).catch(() => null);
    if (!r?.id) { status.textContent = 'Runner not reachable: start it with npm run stage.'; return; }
    id = r.id; t0 = performance.now(); recording = true; lastHash = ''; lastScene = '';
    rec = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm' });
    rec.ondataavailable = (e) => { if (e.data.size) send('audio', e.data, 'audio/webm'); };
    rec.start(5000);
    log('start', { text: `mic: ${micSel.selectedOptions[0]?.textContent || 'default'}` });
    startSpeech();
    watchSlides();
    btn.textContent = '■ Stop recording';
    micSel.disabled = true;
    panel.classList.add('is-on');
  }

  function stop() {
    recording = false;
    try { speech?.stop(); } catch { /* ignore */ }
    if (rec && rec.state !== 'inactive') rec.stop();
    setTimeout(() => { log('stop'); queue.then(() => { status.textContent = `Saved as ${id}. Tell Claude it's done.`; }); }, 300);
    btn.textContent = '● Record rehearsal';
    micSel.disabled = false;
    panel.classList.remove('is-on');
  }

  btn.addEventListener('click', () => (recording ? stop() : start()));
  addEventListener('beforeunload', (e) => { if (recording) { e.preventDefault(); e.returnValue = ''; } });
})();
