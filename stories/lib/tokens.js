/**
 * Токени читаються прямо з src/styles/global.css — Storybook завжди показує поточні значення.
 */
import css from '../../src/styles/global.css?raw';

const LIGHT = "data-theme='light'";

/** Усі оголошення CSS-змінних: { name, value, comment, selector } */
function parse() {
  const out = [];
  const clean = css.replace(/@import[^;]+;/g, '');
  for (const block of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = block[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    for (const m of block[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*\s*([\s\S]*?)\s*\*\/)?/g)) {
      out.push({ name: m[1], value: m[2].trim(), comment: (m[3] ?? '').trim(), selector });
    }
  }
  return out;
}

export const tokens = parse();

/** Перше оголошення кожної змінної, що підходить під умову */
function pick(pred) {
  const seen = new Set();
  return tokens.filter((t) => {
    if (!pred(t) || seen.has(t.name)) return false;
    seen.add(t.name);
    return true;
  });
}

/** Палітра: блок :root з hex-кольорами */
export const palette = pick((t) => t.selector === ':root' && /^#[0-9a-f]{3,8}$/i.test(t.value));

/** Ролі: змінні, що перевизначаються у світлій темі */
const lightNames = new Set(tokens.filter((t) => t.selector.includes(LIGHT)).map((t) => t.name));
export const roles = pick((t) => t.selector === ':root' && lightNames.has(t.name) && !/^--(text-[a-z0-9-]+--|disabled)/.test(t.name));
export const lightValue = (name) => tokens.find((t) => t.name === name && t.selector.includes(LIGHT))?.value;

export const spaces = pick((t) => /^--space-\d+$/.test(t.name));
export const radii = pick((t) => /^--radius-/.test(t.name));
export const aspects = pick((t) => /^--aspect-/.test(t.name));

/** Стилі тексту: --text-<назва> з розміром у rem (кольори --text-muted тощо сюди не потрапляють) */
export const textStyles = pick((t) => /^--text-[a-z0-9-]+$/.test(t.name) && /rem$/.test(t.value)).map((t) => {
  const part = (p) => tokens.find((x) => x.name === `${t.name}--${p}`);
  return {
    name: t.name.slice('--text-'.length),
    size: t.value,
    px: t.comment,
    lineHeight: part('line-height')?.value,
    lineHeightPx: part('line-height')?.comment,
    weight: part('font-weight')?.value,
    letterSpacing: part('letter-spacing')?.value,
  };
});
