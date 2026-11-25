/**
 * Поява ряду карток під час прокрутки (стилі — [data-reveal-row] у global.css).
 * [data-reveal-soft] — той самий запуск, але тихіший рух; стилі в самому компоненті (напр. «Принципи»).
 * Ряд з'являється, коли його верх піднявся до 60 % висоти екрана: блок уже добре видно.
 * data-reveal-at="0.85" на ряді — запуск раніше (частка висоти екрана).
 * Також тоді, коли сторінку перескочили (End, якір) і ряд уже вище екрана.
 * Картки виходять по черзі зліва направо: номер картки --n ставимо тут.
 * З «зменшити рух» нічого не робимо: стилі появи тоді вимкнені, картки видно одразу.
 *
 * [data-reveal-each] — для карток у кілька рядів (напр. «Етапи»): кожна картка з'являється сама,
 * коли її верх дійшов до тієї самої межі. Картки, що дійшли одночасно (один ряд), — по черзі зліва направо.
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-reveal-row], [data-reveal-soft]').forEach((row) => {
  Array.from(row.children).forEach((item, i) => (item as HTMLElement).style.setProperty('--n', String(i)));
  if (reduceMotion) return;
  const at = Number(row.dataset.revealAt) || 0.6;
  let pending = 0;
  const reveal = () => {
    pending = 0;
    if (row.getBoundingClientRect().top < window.innerHeight * at) {
      row.classList.add('is-visible');
      window.removeEventListener('scroll', onScroll);
    }
  };
  const onScroll = () => {
    if (!pending) pending = requestAnimationFrame(reveal);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  reveal();
});

document.querySelectorAll<HTMLElement>('[data-reveal-each]').forEach((list) => {
  if (reduceMotion) return;
  const at = Number(list.dataset.revealAt) || 0.6;
  let waiting = Array.from(list.children) as HTMLElement[];
  let pending = 0;
  const reveal = () => {
    pending = 0;
    const now = waiting.filter((item) => item.getBoundingClientRect().top < window.innerHeight * at);
    now.forEach((item, i) => {
      item.style.setProperty('--n', String(i));
      item.classList.add('is-visible');
    });
    waiting = waiting.filter((item) => !now.includes(item));
    if (!waiting.length) window.removeEventListener('scroll', onScroll);
  };
  const onScroll = () => {
    if (!pending) pending = requestAnimationFrame(reveal);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  reveal();
});
