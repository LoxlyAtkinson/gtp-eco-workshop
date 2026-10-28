// Live-stage join popup on the public deck. The QR in scene 14 opens the deck at
// ?join=1, which pops this form up straight away; [data-join-open] buttons open it
// too. The form itself is join/join.js (GTPJoin.mount), shared with the join/ page.
(() => {
  'use strict';
  if (!window.GTPJoin) return;

  const MARKUP = `
    <div class="jn-pop__panel jn">
      <button type="button" class="jn-pop__close" aria-label="Close">×</button>
      <p class="jn-kicker">GTP ECO workshop <b aria-hidden="true">·</b> live demo</p>
      <h2 class="jn-title" id="jn-pop-title">Put your website on the <em>big screen.</em></h2>
      <p class="jn-lede">Add your website. The presenter picks one at random and scans it live.</p>
      <section class="jn-card" aria-label="Your website">
        <div class="jn-closed" data-state="closed" hidden>
          <p class="jn-closed__head">The live form opens at the talk.</p>
          <p>Call your website out to the presenter.</p>
        </div>
        <form class="jn-form" data-state="form" novalidate hidden>
          <div class="jn-field">
            <label for="jn-website">Your website</label>
            <input id="jn-website" name="website" type="url" inputmode="url" autocomplete="url" autocapitalize="off" spellcheck="false" maxlength="200" placeholder="https://yourbusiness.co.za" aria-describedby="jn-website-help jn-website-error" required>
            <small id="jn-website-help" class="jn-help">Starts with https://. We add it if you leave it out.</small>
            <small id="jn-website-error" class="jn-error" role="alert"></small>
          </div>
          <div class="jn-field">
            <label for="jn-name">First name <span>(optional)</span></label>
            <input id="jn-name" name="name" type="text" autocomplete="given-name" maxlength="40" aria-describedby="jn-name-error">
            <small id="jn-name-error" class="jn-error" role="alert"></small>
          </div>
          <button class="jn-submit" type="submit">Send my website</button>
          <p class="jn-status" role="status" aria-live="polite"></p>
        </form>
        <div class="jn-done" data-state="done" hidden tabindex="-1">
          <p class="jn-done__head">You're in the list.</p>
          <p class="jn-done__body"></p>
          <button class="jn-again" type="button">Send a different website</button>
        </div>
        <p class="jn-privacy">We use your website for a live demo today and delete the list after the talk.</p>
      </section>
    </div>`;

  let dialog = null;
  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'jn-pop';
    dialog.setAttribute('aria-labelledby', 'jn-pop-title');
    dialog.innerHTML = MARKUP; // static markup only, never user data
    document.body.append(dialog);
    window.GTPJoin.mount(dialog);
    dialog.querySelector('.jn-pop__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    // Keys typed in the popup never move the deck behind it.
    dialog.addEventListener('keydown', (e) => e.stopPropagation());
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('jn-pop-open');
      const u = new URL(location.href);
      if (u.searchParams.has('join')) { u.searchParams.delete('join'); history.replaceState(history.state, '', u); }
    });
  }

  function open() {
    if (!dialog) build();
    if (dialog.open) return;
    if (window.deckHold) window.deckHold();
    document.documentElement.classList.add('jn-pop-open');
    dialog.showModal();
    const first = dialog.querySelector('#jn-website');
    if (first && !first.closest('[hidden]')) first.focus();
  }

  document.addEventListener('click', (e) => { if (e.target.closest('[data-join-open]')) open(); });
  window.gtpJoinPopup = { open, close: () => dialog && dialog.close() };
  if (new URLSearchParams(location.search).get('join') === '1') open();
})();
