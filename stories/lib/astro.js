/**
 * Стилі компонентів беремо прямо з файлів .astro (той самий CSS, що на сайті, без копій).
 * З файлу вирізаємо блоки <style> і знімаємо обгортку :global(...) — у Storybook стилі й так глобальні.
 * Назви класів у компонентах унікальні (BEM: .btn, .field__control, .slider-nav…), тож не перетинаються.
 */
import buttonSrc from '../../src/components/Button.astro?raw';
import fieldSrc from '../../src/components/Field.astro?raw';
import workCardSrc from '../../src/components/WorkCard.astro?raw';
import sliderNavSrc from '../../src/components/SliderNav.astro?raw';
import logoSrc from '../../src/components/Logo.astro?raw';

const sources = {
  Button: buttonSrc,
  Field: fieldSrc,
  WorkCard: workCardSrc,
  SliderNav: sliderNavSrc,
  Logo: logoSrc,
};

/** :global(X) → X (з урахуванням дужок усередині, наприклад :global(:root[data-theme='light'])) */
function unwrapGlobal(css) {
  let out = '';
  let i = 0;
  while (i < css.length) {
    if (css.startsWith(':global(', i)) {
      let depth = 1;
      let j = i + ':global('.length;
      const start = j;
      while (j < css.length && depth > 0) {
        if (css[j] === '(') depth++;
        else if (css[j] === ')') depth--;
        j++;
      }
      out += css.slice(start, j - 1);
      i = j;
    } else {
      out += css[i];
      i++;
    }
  }
  return out;
}

function extractStyles(src) {
  const blocks = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  return unwrapGlobal(blocks.join('\n'));
}

const injected = new Set();

/** Додає на сторінку стилі компонента один раз */
export function useStyles(...names) {
  for (const name of names) {
    if (injected.has(name)) continue;
    const style = document.createElement('style');
    style.dataset.component = name;
    style.textContent = extractStyles(sources[name]);
    document.head.append(style);
    injected.add(name);
  }
}
