/**
 * Title Case для заголовків h1–h3 і тексту кнопок на всьому сайті, трьома мовами (рішення Яни 24.11.2026):
 * кожне значуще слово з великої букви, короткі службові слова — з малої (крім першого слова).
 *
 * Тексти в src/i18n лишаються звичайними реченнями; перетворення робить src/middleware.ts під час
 * збирання сторінки, а calculator-client.ts — для заголовків, які калькулятор змінює в браузері.
 *
 * Слова, де вже є велика буква не на початку або цифра (UI/UX, DataTixx, iOS, 3D), не чіпаємо.
 */

export type TitleLocale = 'fr' | 'en' | 'uk';

const SMALL: Record<TitleLocale, Set<string>> = {
  fr: new Set(['à', 'au', 'aux', 'de', 'des', 'du', 'en', 'et', 'ou', 'le', 'la', 'les', 'un', 'une', 'par', 'pour', 'sur', 'dans', 'avec', 'sans', 'chez']),
  en: new Set(['a', 'an', 'the', 'and', 'or', 'but', 'nor', 'of', 'to', 'for', 'in', 'on', 'at', 'by', 'as', 'from', 'with', 'via']),
  uk: new Set(['і', 'й', 'та', 'а', 'або', 'в', 'у', 'з', 'із', 'зі', 'до', 'на', 'під', 'над', 'по', 'про', 'за', 'для', 'від', 'без', 'при', 'через']),
};

/** Французькі усічені частки перед апострофом: d’un, l’équipe, qu’il */
const ELISION = /^(d|l|qu|j|n|s|c|m|t)([’'])(.+)$/i;

const WORD = /[\p{L}\p{N}][\p{L}\p{N}\p{M}’'/-]*/gu;

const cap = (w: string) => w.charAt(0).toLocaleUpperCase() + w.slice(1);

/** Слово вже має «свою» форму — абревіатура, бренд, число */
const keepAsIs = (w: string) => /\p{N}/u.test(w) || /\p{Lu}/u.test(w.slice(1));

function part(w: string, locale: TitleLocale, first: boolean): string {
  if (keepAsIs(w)) return w;
  const lower = w.toLocaleLowerCase();
  if (!first && SMALL[locale].has(lower)) return lower;
  return cap(w);
}

function word(w: string, locale: TitleLocale, first: boolean): string {
  // Складені через дефіс — кожна частина окремо: avez-vous → Avez-Vous, UX-дослідження → UX-Дослідження
  if (w.includes('-')) {
    return w
      .split('-')
      .map((p, i) => (p ? word(p, locale, first && i === 0) : p))
      .join('-');
  }
  if (keepAsIs(w)) return w;
  if (locale === 'fr') {
    const m = w.match(ELISION);
    if (m) {
      // d’un → d’un (службове), d’applications → d’Applications; на початку — D’un
      const head = first ? cap(m[1].toLocaleLowerCase()) : m[1].toLocaleLowerCase();
      return head + m[2] + word(m[3], locale, false);
    }
  }
  return part(w, locale, first);
}

/**
 * Перетворює рядок. state.first — чи наступне слово перше в заголовку
 * (передається між кількома шматками тексту одного заголовка).
 */
export function titleCase(text: string, locale: TitleLocale, state = { first: true }): string {
  let last = 0;
  const out = text.replace(WORD, (w, offset: number) => {
    // нове речення в заголовку («…Stratégie. Ensuite…») — перше слово знову з великої
    if (/[.!?:]/.test(text.slice(last, offset))) state.first = true;
    last = offset + w.length;
    const res = word(w, locale, state.first);
    state.first = false;
    return res;
  });
  // крапка в кінці шматка, а наступне речення — в іншому тезі (<br>, <span>)
  if (/[.!?:]/.test(text.slice(last))) state.first = true;
  return out;
}

/** Те саме для HTML усередині елемента: змінює лише текст між тегами (теги й &сутності не чіпає) */
export function titleCaseHtml(html: string, locale: TitleLocale): string {
  const state = { first: true };
  return html
    .split(/(<[^>]+>|&[#\w]+;)/)
    .map((chunk) => (chunk.startsWith('<') || chunk.startsWith('&') ? chunk : titleCase(chunk, locale, state)))
    .join('');
}

/** Застосовує Title Case до h1–h3 і кнопок (.btn) у готовій HTML-сторінці */
export function titleCasePage(page: string): string {
  const lang = (page.match(/<html[^>]*\blang="([a-z]{2})/i)?.[1] ?? 'fr').toLowerCase();
  const locale: TitleLocale = lang === 'en' || lang === 'uk' ? lang : 'fr';
  const body = page.indexOf('<body');
  if (body < 0) return page;
  const head = page.slice(0, body);
  let rest = page.slice(body);
  // заголовки
  rest = rest.replace(/(<h([1-3])\b[^>]*>)([\s\S]*?)(<\/h\2>)/g, (_, open, _n, inner, close) => open + titleCaseHtml(inner, locale) + close);
  // кнопки: <a> або <button> з класом btn (усередині немає вкладених <a>/<button>)
  rest = rest.replace(/(<(a|button)\b[^>]*\bclass="[^"]*\bbtn\b[^"]*"[^>]*>)([\s\S]*?)(<\/\2>)/g, (_, open, _t, inner, close) => open + titleCaseHtml(inner, locale) + close);
  return head + rest;
}
