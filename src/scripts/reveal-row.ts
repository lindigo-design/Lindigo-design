/**
 * Поява ряду карток під час прокрутки (стилі — [data-reveal-row] у global.css).
 * [data-reveal-soft] — той самий запуск, але тихіший рух; стилі в самому компоненті (напр. «Принципи»).
 * Ряд з'являється, коли його верх піднявся до 60 % висоти екрана: блок уже добре видно.
 * Також тоді, коли сторінку перескочили (End, якір) і ряд уже вище екрана.
 * Картки виходять по черзі зліва направо: номер картки --n ставимо тут.
 * З «зменшити рух» нічого не робимо: стилі появи тоді вимкнені, картки видно одразу.
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-reveal-row], [data-reveal-soft]').forEach((row) => {
  Array.from(row.children).forEach((item, i) => (item as HTMLElement).style.setProperty('--n', String(i)));
  if (reduceMotion) return;
  let pending = 0;
  const reveal = () => {
    pending = 0;
    if (row.getBoundingClientRect().top < window.innerHeight * 0.6) {
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
