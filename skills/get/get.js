// Skills pack form: validate, POST to the skills-request Edge Function, then "Check your inbox".
// The pack is only ever sent by email (owner 2026-10-29): most people fill this in on a phone,
// so the page never offers a download. Session feedback is optional and goes out with the request.
(() => {
  const $ = id => document.getElementById(id);
  const form = $('get-form'), submit = $('submit'), mode = $('mode'), result = $('result');
  const fields = { firstName: $('firstName'), email: $('email'), consent: $('consent') };
  const extra = { takeaway: $('takeaway'), change: $('change') };
  const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]{0,39}$/u;
  const EMAIL_RE = /^[^\s@<>"',;:()[\]\\]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
  const SUBMIT_LABEL = submit.textContent;

  const apiUrl = (() => {
    const raw = (window.GTP_SKILLS_CONFIG && window.GTP_SKILLS_CONFIG.apiUrl) || '';
    try { const u = new URL(raw); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; }
  })();
  mode.hidden = false;
  mode.textContent = apiUrl ? "We'll email you a download link that works for 7 days." : "The form isn't open yet. Ask the presenter for the link.";
  if (!apiUrl) submit.disabled = true;

  function setError(name, message) {
    const el = fields[name] || extra[name];
    const err = $(`${name}-err`);
    if (err) err.textContent = message || '';
    if (name === 'consent') $('consent-box').dataset.invalid = message ? 'true' : 'false';
    else if (el) el.setAttribute('aria-invalid', message ? 'true' : 'false');
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
    for (const key of Object.keys(extra)) if (extra[key].value.trim().length > 600) errors[key] = 'Please keep this under 600 characters.';
    for (const key of [...Object.keys(fields), ...Object.keys(extra)]) setError(key, errors[key]);
    const first = [...Object.keys(fields), ...Object.keys(extra)].find(key => errors[key]);
    if (first) {
      if (extra[first]) $('feedback').open = true;
      (fields[first] || extra[first]).focus();
      return null;
    }
    const value = (form.querySelector('input[name="value"]:checked') || {}).value || '';
    return { firstName: name, email, consent: true, company: $('company').value, takeaway: extra.takeaway.value.trim(), change: extra.change.value.trim(), value };
  }

  function show(state, detail) {
    const copy = {
      sent: ['Check your inbox.', `We sent the link and the how-to guide to ${detail}. The link works for 7 days. Not there in 5 minutes? Look in spam or promotions.`],
      failed: ["We couldn't send the email.", `${detail} Please try again in a minute.`],
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
    if (busy || !apiUrl) return;
    const body = check();
    if (!body) return;
    busy = true;
    submit.disabled = true;
    submit.textContent = 'Sending...';
    form.setAttribute('aria-busy', 'true');
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 25000);
    try {
      const res = await fetch(apiUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: abort.signal });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) { show('sent', body.email); return; }
      if (res.status === 400 && data.field && (fields[data.field] || extra[data.field])) {
        setError(data.field, data.error || 'Check this field.');
        if (extra[data.field]) $('feedback').open = true;
        (fields[data.field] || extra[data.field]).focus();
        return;
      }
      const reasons = {
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
      submit.disabled = !apiUrl;
      submit.textContent = SUBMIT_LABEL;
      form.removeAttribute('aria-busy');
    }
  });

  $('again').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    fields.email.focus();
  });
})();
