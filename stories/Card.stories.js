import { useStyles } from './lib/astro.js';
import cover from '../src/assets/hero/datatixx-cover.png';
import arrow from '../src/assets/hero/arrow-card.svg';

/**
 * Картка «Остання робота» — `src/components/WorkCard.astro` (перший екран).
 *
 * Стани: наведення і фокус з клавіатури однакові — обкладинка збільшується, стрілка в колі повертається;
 * при фокусі ще й видимий контур :focus-visible.
 */
export default {
  title: 'Компоненти/Картка',
  tags: ['autodocs'],
  argTypes: {
    eyebrow: { control: 'text', description: 'Підпис над назвою' },
    title: { control: 'text', description: 'Назва роботи' },
  },
  args: { eyebrow: 'Остання робота', title: 'DataTixx' },
  render: ({ eyebrow, title }) => {
    useStyles('WorkCard');
    const root = document.createElement('div');
    root.innerHTML = `
      <section class="work-card" aria-label="${eyebrow}" style="--interval: 6s">
        <article class="work-card__slide">
          <a class="work-card__link" href="#">
            <p class="work-card__eyebrow">${eyebrow}</p>
            <h2 class="work-card__title">${title}</h2>
            <div class="work-card__cover">
              <img class="work-card__img" src="${cover}" alt="" width="360" height="220" />
              <span class="work-card__arrow" aria-hidden="true"><img src="${arrow}" width="20" height="20" alt="" /></span>
            </div>
            <span class="visually-hidden">Відкрити роботу</span>
          </a>
        </article>
        <div class="work-card__footer">
          <p class="work-card__counter"><span>01</span> / 01</p>
          <div class="work-card__track"><div class="work-card__progress" style="--step: 1"></div></div>
        </div>
      </section>`;
    root.querySelector('a').addEventListener('click', (e) => e.preventDefault());
    return root;
  },
};

export const LatestWork = { name: 'Остання робота' };
