import { useStyles } from './lib/astro.js';
import prevDark from '../src/assets/works/prev-dark.svg';
import prevLight from '../src/assets/works/prev-light.svg';
import nextDark from '../src/assets/works/next-dark.svg';
import nextLight from '../src/assets/works/next-light.svg';
import iconDark from '../src/assets/logo/dark-icon.svg';
import designDark from '../src/assets/logo/dark-design.svg';
import lindigoDark from '../src/assets/logo/dark-lindigo.svg';
import iconLight from '../src/assets/logo/light-icon.svg';
import designLight from '../src/assets/logo/light-design.svg';
import lindigoLight from '../src/assets/logo/light-lindigo.svg';

/**
 * Навігація: стрілки слайдера (`src/components/SliderNav.astro`) і логотип-посилання на головну
 * (`src/components/Logo.astro`, шапка, меню, футер).
 *
 * Стани: наведення і фокус з клавіатури однакові — градієнтне кільце на стрілках, перелив фірмовим
 * градієнтом на логотипі. Один слайд — стрілки вимкнені через `aria-disabled`, причину озвучує прихований текст.
 */
export default {
  title: 'Компоненти/Навігація',
  tags: ['autodocs'],
};

const pad = (n) => String(n).padStart(2, '0');

function sliderNavHtml({ total, id }) {
  const off = total < 2;
  const state = off ? `aria-disabled="true" aria-describedby="${id}-note"` : '';
  return `<div class="slider-nav">
    <button class="slider-nav__btn ring-hover" type="button" aria-label="Попередня робота" ${state}>
      <img src="${prevDark}" width="48" height="48" alt="" data-theme-only="dark" />
      <img src="${prevLight}" width="48" height="48" alt="" data-theme-only="light" />
    </button>
    <p class="slider-nav__count"><span data-current>01</span> / <span>${pad(total)}</span></p>
    <button class="slider-nav__btn ring-hover" type="button" aria-label="Наступна робота" ${state}>
      <img src="${nextDark}" width="48" height="48" alt="" data-theme-only="dark" />
      <img src="${nextLight}" width="48" height="48" alt="" data-theme-only="light" />
    </button>
    ${off ? `<p class="visually-hidden" id="${id}-note">Поки що тут одна робота.</p>` : ''}
  </div>`;
}

/** Лічильник гортається стрілками, як у «Вибраних роботах» */
function wireSlider(root, total) {
  const current = root.querySelector('[data-current]');
  let i = 0;
  const [prev, next] = root.querySelectorAll('.slider-nav__btn');
  const go = (d) => {
    if (prev.getAttribute('aria-disabled') === 'true') return;
    i = (i + d + total) % total;
    current.textContent = pad(i + 1);
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
}

export const SliderNav = {
  name: 'Стрілки слайдера',
  argTypes: { total: { control: { type: 'number', min: 1, max: 9 }, description: 'Скільки слайдів; 1 — стрілки вимкнені' } },
  args: { total: 4 },
  render: ({ total }) => {
    useStyles('SliderNav');
    const root = document.createElement('div');
    root.innerHTML = sliderNavHtml({ total, id: 'nav' });
    wireSlider(root, total);
    return root;
  },
};

export const SliderNavDisabled = {
  ...SliderNav,
  name: 'Стрілки слайдера, вимкнені',
  args: { total: 1 },
};

export const LogoLink = {
  name: 'Логотип — посилання на головну',
  argTypes: { width: { control: { type: 'range', min: 120, max: 320, step: 1 }, description: 'Ширина, px (шапка 151, футер 300)' } },
  args: { width: 151 },
  render: ({ width }) => {
    useStyles('Logo');
    const sets = [
      ['dark', iconDark, designDark, lindigoDark],
      ['light', iconLight, designLight, lindigoLight],
    ]
      .map(
        ([theme, icon, design, lindigo]) => `<span class="logo__set" data-theme-only="${theme}">
          <img class="logo__icon" src="${icon}" alt="" />
          <img class="logo__design" src="${design}" alt="" />
          <img class="logo__lindigo" src="${lindigo}" alt="" />
        </span>`,
      )
      .join('');
    const masks = `--mask-icon: url(${iconDark}); --mask-design: url(${designDark}); --mask-lindigo: url(${lindigoDark})`;
    const root = document.createElement('div');
    root.innerHTML = `<a href="#" aria-label="Lindigo Design — на головну" style="display: inline-block">
      <span class="logo" aria-hidden="true" style="--logo-w: ${width}px">${sets}<span class="logo__fill" style="${masks}"></span></span>
    </a>`;
    root.querySelector('a').addEventListener('click', (e) => e.preventDefault());
    return root;
  },
};
