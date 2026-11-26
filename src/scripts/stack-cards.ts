/**
 * Стос карток, що накладаються одна на одну під час прокрутки (position: sticky в CSS блоку).
 * - `cover`: де стос працює — там скрипт пише кожній картці --cover (0 … 1: скільки її накрила наступна),
 *   блок по ньому затемнює накриту картку.
 * - `phone`: де скрипт сам ставить списку клас (`className`, типово is-stacked) і рахує top кожної картки: під шапкою
 *   (96 + 8 × номер), а картка, вища за екран, прилипає низом до краю екрана — її видно цілу.
 */
export function stackCards(list: HTMLElement, cards: HTMLElement[], opts: { cover: string; phone: string; className?: string }) {
  const cover = window.matchMedia(opts.cover);
  const phone = window.matchMedia(opts.phone);
  let raf = 0;

  const layout = () => {
    list.classList.toggle(opts.className ?? 'is-stacked', phone.matches);
    const css = getComputedStyle(document.documentElement);
    const base = parseFloat(css.getPropertyValue('--space-96')) || 96;
    const step = parseFloat(css.getPropertyValue('--space-8')) || 8;
    const edge = parseFloat(css.getPropertyValue('--space-16')) || 16;
    cards.forEach((card, k) => {
      if (!phone.matches) return card.style.removeProperty('top');
      card.style.top = `${Math.min(base + k * step, window.innerHeight - card.offsetHeight - edge)}px`;
    });
  };

  const update = () => {
    raf = 0;
    if (!cover.matches) {
      cards.forEach((c) => c.style.removeProperty('--cover'));
      return;
    }
    cards.forEach((card, k) => {
      const next = cards[k + 1];
      if (!next) return;
      const r = card.getBoundingClientRect();
      const stickTop = parseFloat(getComputedStyle(next).top) || 0;
      const left = next.getBoundingClientRect().top - stickTop; // скільки наступній ще їхати до свого місця
      card.style.setProperty('--cover', Math.min(1, Math.max(0, 1 - left / r.height)).toFixed(3));
    });
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    layout();
    onScroll();
  });
  // висота картки міняється, коли довантажилась картинка чи шрифт, — тоді й місце прилипання
  const ro = new ResizeObserver(() => {
    layout();
    onScroll();
  });
  cards.forEach((c) => ro.observe(c));
  layout();
  update();
}
