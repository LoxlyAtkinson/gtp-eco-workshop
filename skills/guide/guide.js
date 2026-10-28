// 7-day list ticks (kept on this device only) and copy buttons for the example prompts.
(() => {
  const KEY = 'gtp-skills-week';
  const boxes = [...document.querySelectorAll('#days input[data-day]')];
  const progress = document.getElementById('progress');
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { saved = {}; }
  const render = () => {
    const done = boxes.filter(b => b.checked).length;
    progress.textContent = done === 7 ? 'All 7 days done. Well done. Run the week again next month with a new goal.' : done ? `${done} of 7 days done.` : '';
  };
  for (const box of boxes) {
    box.checked = saved[box.dataset.day] === true;
    box.addEventListener('change', () => {
      saved[box.dataset.day] = box.checked;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* private mode: ticks last for this visit only */ }
      render();
    });
  }
  render();

  for (const button of document.querySelectorAll('[data-copy]')) {
    button.addEventListener('click', async () => {
      const text = button.parentElement.querySelector('blockquote').textContent.trim();
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch {
        const area = Object.assign(document.createElement('textarea'), { value: text });
        area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0';
        document.body.append(area); area.select();
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        area.remove();
      }
      button.textContent = ok ? 'Copied' : 'Select and copy it by hand';
      setTimeout(() => { button.textContent = 'Copy prompt'; }, 2500);
    });
  }
})();
