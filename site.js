// Skopos site: flip cards, lightbox, feature loops, passage demos. Content is in the HTML, so the page reads without this file.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// Flip cards: a button with aria-pressed, so Enter and Space work natively.
for (const card of document.querySelectorAll('.fcard')) {
  card.addEventListener('click', () => {
    const on = card.getAttribute('aria-pressed') !== 'true';
    card.setAttribute('aria-pressed', String(on));
    card.querySelector('.hint').textContent = on ? 'Show question' : 'Show answer';
  });
}

// Lightbox for the screens gallery.
const box = document.getElementById('lightbox');
const boxImg = box.querySelector('img');
const boxCap = box.querySelector('.cap');
for (const btn of document.querySelectorAll('.shot button')) {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    const cap = btn.closest('figure').querySelector('figcaption');
    boxImg.src = btn.dataset.full;
    boxImg.alt = img.alt;
    boxCap.textContent = cap.textContent.replace(cap.querySelector('b').textContent, cap.querySelector('b').textContent + '. ');
    box.showModal();
  });
}
box.addEventListener('click', (e) => { if (e.target === box) box.close(); });



// Passage demos: one question at a time, immediate feedback, then the app's explanation.
for (const set of document.querySelectorAll('.pset')) {
  const qs = [...set.querySelectorAll('.pq-item')];
  const tabs = [...set.querySelectorAll('.pset-tabs button')];
  const show = (i) => {
    qs.forEach((q, j) => { q.hidden = j !== i; });
    tabs.forEach((t, j) => t.setAttribute('aria-current', String(j === i)));
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
  qs.forEach((q, i) => {
    const key = q.dataset.key;
    const fb = q.querySelector('.fb');
    for (const input of q.querySelectorAll('input')) {
      input.addEventListener('change', () => {
        const right = input.value === key;
        q.querySelectorAll('.opt').forEach((o) => o.classList.remove('right', 'wrong'));
        q.querySelector(`input[value="${key}"]`).closest('.opt').classList.add('right');
        if (!right) input.closest('.opt').classList.add('wrong');
        const v = fb.querySelector('.verdict');
        v.className = 'verdict ' + (right ? 'ok' : 'no');
        v.textContent = right ? `Correct. The answer is ${key}.` : `Not this one. You chose ${input.value}. The answer is ${key}.`;
        fb.querySelectorAll('[data-why]').forEach((w) => { w.hidden = w.dataset.why !== input.value; });
        fb.hidden = false;
        tabs[i].classList.toggle('ok', right);
        tabs[i].classList.toggle('no', !right);
      });
    }
    const next = q.querySelector('.next');
    if (next) next.addEventListener('click', () => { show(i + 1); qs[i + 1].querySelector('input').focus(); });
  });
  show(0);
}
