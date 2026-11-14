/**
 * Великий заголовок блоку з двох рядків («Принципи», «Про студію»), як у макеті:
 * блок притиснутий праворуч — найдовший рядок закінчується по правому краю фото під ним,
 * рядки між собою вирівняні ліворуч.
 *
 * Рядки не переносяться, тож якщо найдовший (у якійсь мові) не вміщується, шрифт трохи
 * зменшується саме настільки, щоб рядок став точно до краю (не більше ніж на MAX_SHRINK).
 * Якщо й так не вміщується — текст переноситься (клас is-wrapped), а блок звужується до
 * найдовшого рядка й теж стоїть праворуч (переноси від цього не змінюються).
 * Працює лише на широкому екрані (від 1101 px); на вужчих — звичайний текст із переносами.
 *
 * Розмітка: <h2 data-fit-lead><span class="fit-lead__box"><span>рядок</span><span>рядок</span></span></h2>
 */
const wide = window.matchMedia('(min-width: 1101px)');
/** Наскільки найбільше можна зменшити шрифт, щоб рядок уліз (0.12 = на 12 %) */
const MAX_SHRINK = 0.12;

const fit = (lead: HTMLElement) => {
  const box = lead.querySelector<HTMLElement>('.fit-lead__box');
  if (!box) return;
  lead.style.fontSize = '';
  box.style.width = '';
  lead.classList.remove('is-wrapped');
  if (!wide.matches) return;
  const base = parseFloat(getComputedStyle(lead).fontSize);
  const available = lead.clientWidth;
  const needed = box.scrollWidth;
  if (needed <= available + 0.5) return;
  const ratio = available / needed;
  if (ratio >= 1 - MAX_SHRINK) lead.style.fontSize = `${Math.floor(base * ratio * 10) / 10}px`;
  else {
    lead.classList.add('is-wrapped');
    // ширина найдовшого рядка після переносів
    const range = document.createRange();
    range.selectNodeContents(box);
    const rects = [...range.getClientRects()];
    const left = Math.min(...rects.map((r) => r.left));
    const right = Math.max(...rects.map((r) => r.right));
    box.style.width = `${Math.ceil(right - left) + 1}px`;
  }
};

const fitAll = () => document.querySelectorAll<HTMLElement>('[data-fit-lead]').forEach(fit);

fitAll();
document.fonts?.ready.then(fitAll);
window.addEventListener('resize', () => requestAnimationFrame(fitAll));
wide.addEventListener('change', fitAll);
