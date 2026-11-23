/*
 * Проявлення тексту під час гортання (рішення Яни 23.11.2026, зразок — aldena.framer.media).
 * Слова [data-reveal-text] .reveal-word спершу сірі (--text-supplement) і по черзі набувають основного кольору:
 * починає, коли верх абзацу на 85 % висоти екрана, закінчує, коли його низ на 50 %.
 * Гортання назад знову робить слова сірими. Без JS і з «менше руху» в системі текст одразу звичайний.
 */
const START = 0.85;
const END = 0.5;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-reveal-text]').forEach((el) => {
    const words = Array.from(el.querySelectorAll<HTMLElement>('.reveal-word'));
    if (!words.length) return;
    el.classList.add('is-ready');
    let lit = -1;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * START;
      const total = start - vh * END + r.height;
      const p = Math.min(1, Math.max(0, (start - r.top) / total));
      const n = Math.round(p * words.length);
      if (n === lit) return;
      lit = n;
      words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  });
}
