// Skills pack form. Two modes, picked by config.js:
//  - no apiUrl: validate, then show the direct download. Nothing is sent or stored.
//  - apiUrl set: POST to the skills-request Edge Function, then show "Check your inbox" or an honest failure with the download fallback.
(() => {
  const $ = id => document.getElementById(id);
  const form = $('get-form'), submit = $('submit'), mode = $('mode'), result = $('result');
  const fields = { firstName: $('firstName'), email: $('email'), consent: $('consent') };
  const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]{0,39}$/u;
  const EMAIL_RE = /^[^\s@<>"',;:()[\]\\]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
  const PACK = '../downloads/gtp-workshop-skills.zip';

  const apiUrl = (() => {
    const raw = (window.GTP_SKILLS_CONFIG && window.GTP_SKILLS_CONFIG.apiUrl) || '';
    try { const u = new URL(raw); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; }
  })();
  document.documentElement.dataset.delivery = apiUrl ? 'email' : 'direct';

  mode.hidden = false;
  if (apiUrl) {
    mode.textContent = "We'll email you a download link that works for 7 days.";
  } else {
    mode.append('Email delivery opens soon. For now, the pack downloads right here after you press the button. ');
    const skip = document.createElement('a');
    skip.href = PACK; skip.setAttribute('download', ''); skip.textContent = 'Skip the form and download now';
    mode.append(skip, '.');
  }

  function setError(name, message) {
    const el = fields[name];
    $(`${name}-err`).textContent = message || '';
    if (name === 'consent') $('consent-box').dataset.invalid = message ? 'true' : 'false';
    else el.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function check() {
    const name = fields.firstName.value.normalize('NFC').replace(/\s+/g, ' ').trim();
    const email = fields.email.value.trim().toLowerCase();
    const errors = {};
    if (!name) errors.firstName = 'Type your first name.';
    else if (name.length > 40 || !NAME_RE.test(name)) errors.firstName = 'Use letters only, up to 40.';
    if (!email) errors.email = 'Type your email address.';
    else if (email.length < 6 || email.length > 254 || !EMAIL_RE.test(email)) errors.email = "That email doesn't look right. Check it and try again.";
    if (!fields.consent.checked) errors.consent = 'Tick the box so we may email you the link.';
    for (const key of Object.keys(fields)) setError(key, errors[key]);
    const first = Object.keys(fields).find(key => errors[key]);
    if (first) fields[first].focus();
    return first ? null : { firstName: name, email, consent: true, company: $('company').value };
  }

  function show(state, detail) {
    const copy = {
      ready: ['Your skills pack is ready.', "Email delivery isn't switched on yet, so we didn't send an email or keep your details. Download the pack here instead."],
      sent: ['Check your inbox.', `We sent the link to ${detail}. It works for 7 days. Not there in 5 minutes? Look in spam or promotions, or download the pack right here.`],
      failed: ["We couldn't send the email.", `${detail} You can still download the pack right here.`],
    }[state];
    $('result-title').textContent = copy[0];
    $('result-text').textContent = copy[1];
    result.dataset.state = state;
    result.dataset.tone = state === 'failed' ? 'bad' : 'good';
    $('again-row').hidden = state !== 'failed';
    form.hidden = true;
    result.hidden = false;
    result.focus();
  }

  let busy = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const body = check();
    if (!body) return;
    if (!apiUrl) { show('ready'); return; }
    busy = true;
    submit.disabled = true;
    submit.textContent = 'Sending...';
    form.setAttribute('aria-busy', 'true');
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 15000);
    try {
      const res = await fetch(apiUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: abort.signal });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) { show('sent', body.email); return; }
      if (res.status === 400 && data.field && fields[data.field]) {
        setError(data.field, data.error || 'Check this field.');
        fields[data.field].focus();
        return;
      }
      const reasons = {
        NOT_CONFIGURED: "Email delivery isn't switched on yet.",
        RATE_LIMIT: 'This email or network already asked a few times today. Check your inbox first.',
        SEND_FAILED: 'The email service had a problem on our side.',
        SIGN_FAILED: 'The download link could not be made on our side.',
      };
      show('failed', reasons[data.code] || `Something went wrong on our side (HTTP ${res.status}).`);
    } catch (cause) {
      show('failed', cause && cause.name === 'AbortError' ? 'The email service took too long to answer.' : 'Your connection dropped before we could send it.');
    } finally {
      clearTimeout(timer);
      busy = false;
      submit.disabled = false;
      submit.textContent = 'Send me the skills';
      form.removeAttribute('aria-busy');
    }
  });

  $('again').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    fields.email.focus();
  });
})();
