// Live-stage join form: one website (and an optional first name) goes straight
// to Supabase with the public anon key. RLS allows INSERT only, so this form can
// never read the list back. No trackers, no cookies, no third-party scripts.
// Used by the join/ page and by the deck's popup (chapters/join-popup.js):
// GTPJoin.mount(root) wires one copy of the form markup inside root.
(() => {
  'use strict';
  const cfg = window.GTP_JOIN_CONFIG || {};
  const base = String(cfg.supabaseUrl || '').trim().replace(/\/+$/, '');
  const key = String(cfg.anonKey || '').trim();
  const live = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(base) && key.length > 20;

  // Same rules as the database check: https://, 8-200 characters, a public host name.
  function normalise(raw) {
    let v = String(raw || '').trim();
    if (!v) return { error: 'Enter your website, for example https://yourbusiness.co.za' };
    if (/^http:\/\//i.test(v)) v = 'https://' + v.slice(7);
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) v = 'https://' + v;
    let u;
    try { u = new URL(v); } catch { return { error: 'That does not look like a website address. Try https://yourbusiness.co.za' }; }
    const host = u.hostname.toLowerCase();
    if (u.protocol !== 'https:') return { error: 'Use a website address that starts with https://' };
    if (u.username || u.password) return { error: 'Leave out any user name or password.' };
    if (!host.includes('.') || host.endsWith('.') || /^[\d.]+$/.test(host) || host.includes(':') || /(^|\.)(localhost|local|internal)$/.test(host)) {
      return { error: 'Use your public website address, for example https://yourbusiness.co.za' };
    }
    const out = u.href.replace(/\/$/, '');
    if (out.length < 8 || out.length > 200) return { error: 'That address is too long. Use your home page address.' };
    return { value: out, host };
  }

  function setError(input, el, msg) {
    el.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }

  function mount(root) {
    const $ = (s) => root.querySelector(s);
    const closed = $('[data-state="closed"]');
    const form = $('[data-state="form"]');
    const done = $('[data-state="done"]');
    const site = $('#jn-website');
    const name = $('#jn-name');
    const siteErr = $('#jn-website-error');
    const nameErr = $('#jn-name-error');
    const status = $('.jn-status');
    const submit = $('.jn-submit');

    if (!live) { closed.hidden = false; return; }
    form.hidden = false;

    let sending = false;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (sending) return;
      status.textContent = '';
      const w = normalise(site.value);
      const n = name.value.trim().replace(/\s+/g, ' ');
      setError(site, siteErr, w.error);
      setError(name, nameErr, n.length > 40 ? 'Keep your first name under 40 characters.' : '');
      if (w.error) { site.focus(); return; }
      if (n.length > 40) { name.focus(); return; }

      sending = true;
      submit.disabled = true;
      submit.textContent = 'Sending…';
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 12000);
      try {
        const res = await fetch(`${base}/rest/v1/stage_submissions`, {
          method: 'POST',
          headers: {
            apikey: key,
            authorization: `Bearer ${key}`,
            'content-type': 'application/json',
            prefer: 'return=minimal',
          },
          body: JSON.stringify(n ? { website: w.value, name: n } : { website: w.value }),
          signal: ac.signal,
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
        });
        if (res.ok) {
          form.hidden = true;
          done.hidden = false;
          done.querySelector('.jn-done__body').textContent = `${n ? `Thanks, ${n}. ` : 'Thanks. '}${w.host} is waiting for the draw. Watch the screen.`;
          done.focus();
          return;
        }
        status.textContent = res.status === 429
          ? 'Lots of people are sending at once. Wait a few seconds and press Send again.'
          : res.status >= 500
            ? 'The list is not answering right now. Press Send again, or call your website out to the presenter.'
            : 'The form is not taking entries right now. Call your website out to the presenter.';
      } catch {
        status.textContent = 'That did not send. Check your connection and press Send again.';
      } finally {
        clearTimeout(timer);
        sending = false;
        submit.disabled = false;
        submit.textContent = 'Send my website';
      }
    });

    site.addEventListener('input', () => { if (siteErr.textContent) setError(site, siteErr, ''); });
    name.addEventListener('input', () => { if (nameErr.textContent) setError(name, nameErr, ''); });

    $('.jn-again').addEventListener('click', () => {
      done.hidden = true;
      form.hidden = false;
      site.value = '';
      status.textContent = '';
      site.focus();
    });
  }

  window.GTPJoin = { mount, live };
  const pageRoot = document.querySelector('[data-join-root]');
  if (pageRoot) mount(pageRoot);
})();
