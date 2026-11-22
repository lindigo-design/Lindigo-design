import { palette, roles, lightValue, spaces, radii, aspects, textStyles } from './lib/tokens.js';

/**
 * Токени дизайн-системи — CSS-змінні з `src/styles/global.css`.
 * Джерело правди — Figma «Lindigo design studio site» (змінні «Кольори», «Шрифти», «Відступи і радіуси»,
 * текстові стилі Heading, Body, Title, Label). Перемикач «Тема» на панелі показує ролі у світлій темі.
 */
export default {
  title: 'Токени',
};

function el(html) {
  const root = document.createElement('div');
  root.className = 'sb-tokens';
  root.innerHTML = html;
  return root;
}

const caption = (t, ...lines) =>
  `<figcaption><code>${t.name}</code>${lines.map((l) => `<span>${l}</span>`).join('')}${t.comment ? `<small>${t.comment}</small>` : ''}</figcaption>`;

export const Palette = {
  name: 'Кольори: палітра',
  render: () =>
    el(`<p class="sb-note">Палітра названа за іменами кольорів і не міняється з темою.</p>
      <div class="sb-grid">${palette
        .map((t) => `<figure class="sb-swatch"><span class="sb-swatch__color" style="background: var(${t.name})"></span>${caption(t, t.value)}</figure>`)
        .join('')}</div>`),
};

export const Roles = {
  name: 'Кольори: ролі',
  render: () =>
    el(`<p class="sb-note">Ролі міняються з темою, у компонентах беремо саме їх. Зразок показано в поточній темі.</p>
      <div class="sb-grid">${roles
        .map(
          (t) =>
            `<figure class="sb-swatch"><span class="sb-swatch__color" style="background: var(${t.name})"></span>${caption(t, `темна: ${t.value}`, `світла: ${lightValue(t.name) ?? '—'}`)}</figure>`,
        )
        .join('')}</div>`),
};

/** Unbounded — заголовки, Martian Mono — підписи, Mulish — решта */
function family(name) {
  if (/^(h\d|display|menu|quote)/.test(name)) return 'var(--font-display)';
  if (/^label/.test(name)) return 'var(--font-mono)';
  return 'var(--font-body)';
}

export const Typography = {
  name: 'Типографіка',
  render: () =>
    el(`<p class="sb-note">Розмір у rem (1rem = 16 px), інтервал між рядками у відсотках. Готові класи — <code>.type-&lt;стиль&gt;</code>.</p>
      <div class="sb-stack">${textStyles
        .map((s) => {
          const meta = [
            `${s.size}${s.px ? ` (${s.px})` : ''}`,
            `${s.lineHeight}${s.lineHeightPx ? ` (${s.lineHeightPx})` : ''}`,
            `вага ${s.weight}`,
            s.letterSpacing && s.letterSpacing !== '0' ? `трекінг ${s.letterSpacing}` : '',
          ]
            .filter(Boolean)
            .join(' · ');
          const v = `--text-${s.name}`;
          return `<div class="sb-type">
            <div class="sb-type__meta"><code>${v}</code><span>${meta}</span></div>
            <p style="margin: 0; font-family: ${family(s.name)}; font-size: var(${v}); line-height: var(${v}--line-height); font-weight: var(${v}--font-weight); letter-spacing: var(${v}--letter-spacing)">Lindigo Design — студія дизайну</p>
          </div>`;
        })
        .join('')}</div>`),
};

export const Spacing = {
  name: 'Відступи',
  render: () =>
    el(`<p class="sb-note">Шкала Space/* з Figma. Відступи в компонентах — тільки ці змінні.</p>
      <div class="sb-stack sb-stack--tight">${spaces
        .map((t) => `<div class="sb-space"><code>${t.name}</code><span class="sb-space__bar" style="width: var(${t.name})"></span><span>${t.value}</span></div>`)
        .join('')}</div>`),
};

export const Radius = {
  name: 'Радіуси',
  render: () =>
    el(`<div class="sb-grid">${radii
      .map((t) => `<figure class="sb-swatch"><span class="sb-swatch__color sb-swatch__color--radius" style="border-radius: var(${t.name})"></span>${caption(t, t.value)}</figure>`)
      .join('')}</div>`),
};

export const Aspect = {
  name: 'Пропорції',
  render: () =>
    el(`<div class="sb-grid">${aspects
      .map((t) => `<figure class="sb-swatch"><span class="sb-swatch__color sb-swatch__color--aspect" style="aspect-ratio: var(${t.name})"></span>${caption(t, t.value)}</figure>`)
      .join('')}</div>`),
};
