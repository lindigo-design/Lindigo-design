/**
 * Калькулятор орієнтовної вартості проєкту: усі ціни й коефіцієнти (специфікація «Калькулятор вартості», версія 3).
 * Кроки: 1 напрям, 2 параметри, 3 доповнення, 4 про проєкт, 5 темп, 6 контакти (форма, без питань конфігу).
 * Ціни звірені з таблицею «Ціноутворення Lindigo»: ставка 530 € / день, запас 20 %, округлення до 50 €.
 * Тексти (назви, підписи) — у src/i18n/calculator.ts за тими самими id; тут лише числа й логіка.
 *
 * draft: true — тестова ціна, якої ще немає в таблиці. Перед запуском їх не має лишитися:
 * `npm run calc:drafts` виводить усі такі ціни.
 *
 * Файл без імпортів Astro: його запускають тести (`npm run test:calc`) і скрипт чернеток прямо в Node.
 */

/** Ціна, що залежить від питання «Що потрібно?» у сайтах: дизайн і розробка або лише дизайн */
export type Money = number | { full: number; design: number };

export interface CalcOption {
  id: string;
  /** Ціна (база, доповнення, тривалість зйомки) */
  price?: Money;
  /** Скільки екранів / сторінок уже входить у базу */
  includedUnits?: number;
  /** Коефіцієнт до бази (кількість товарів, темп) */
  multiplier?: number;
  /** Відсоток від бази й додаткових одиниць (друга платформа) */
  percentOfBase?: number;
  /** Щомісячна ціна: показується текстом, у суму не входить */
  monthly?: number;
  /** Обрано — замість суми «Потрібна індивідуальна оцінка» */
  custom?: boolean;
  /** «Не знаю — порадьте»: під сумою примітка «Підкажемо на дзвінку» */
  advice?: boolean;
  /** Тестова ціна */
  draft?: boolean;
  /** Взаємовиключні варіанти: обрати цей — зняти ці (логотип / ребрендинг) */
  excludes?: string[];
}

export type QuestionRole =
  | 'base' // ціна обраного типу
  | 'variant' // уточнює базу: дизайн і розробка / лише дизайн (ключ ціни Money)
  | 'extraUnits' // лічильник понад includedUnits
  | 'multiplier' // коефіцієнт до бази
  | 'languages' // 1 / 2 / 3 мови
  | 'copy' // хто пише тексти
  | 'addon' // доповнення, можна кілька
  | 'pace' // темп
  | 'context'; // питання про контекст (сайт, бренд, терміни, сума): на ціну не впливає, йде у зведення запиту

export interface CalcQuestion {
  id: string;
  kind: 'single' | 'multi' | 'counter';
  role: QuestionRole;
  /** Крок: 1 напрям, 2 параметри, 3 доповнення, 4 про проєкт, 5 темп (6 — контакти, форма) */
  step: 1 | 2 | 3 | 4 | 5;
  options?: CalcOption[];
  /** Варіант, обраний на старті (для single) */
  defaultOption?: string;
  /** Лічильник: ціна кожної одиниці понад включені */
  unitPrice?: Money;
  /** Лічильник: більше — індивідуальна оцінка */
  customAbove?: number;
  /** Питання видно, лише коли в іншому питанні обрано один із варіантів */
  showIf?: { question: string; in: string[] };
  /** Ціна одиниці лічильника — тестова */
  draft?: boolean;
  /** Необов'язкове: на старті нічого не обрано */
  optional?: boolean;
  /** Не показувати, коли потрібна індивідуальна оцінка («Ця сума вам підходить?») */
  hideWhenCustom?: boolean;
}

export interface CalcService {
  id: ServiceId;
  questions: CalcQuestion[];
}

export const serviceIds = ['uiux', 'sites', 'shop', 'branding', 'content'] as const;
export type ServiceId = (typeof serviceIds)[number];

/** Кроки калькулятора; 6-й — форма контактів */
export const STEP_COUNT = 6;

/** Логотип з логобуком: та сама ціна в брендингу і як доповнення до сайту чи магазину */
const LOGO_PRICE = 1600;
/** Логотип + фірмовий стиль: та сама ціна в брендингу і як доповнення «Потрібен ребрендинг» */
const IDENTITY_PRICE = 2550;

/* Питання про контекст (специфікація, розділ 5а): усі необов'язкові, на суму не впливають */
const ctx = (id: string, step: CalcQuestion['step'], options: string[], extra: Partial<CalcQuestion> = {}): CalcQuestion => ({
  id,
  kind: 'single',
  role: 'context',
  step,
  optional: true,
  options: options.map((o) => ({ id: o })),
  ...extra,
});
/** Крок 1, сайти й магазини */
const hasSite = ctx('hasSite', 1, ['yes', 'no']);
/** Крок 3, усі напрями, крім брендингу */
const brand = ctx('brand', 3, ['none', 'logo', 'full', 'rebrand']);
/** Крок 4 — про проєкт */
const start = ctx('start', 4, ['exploring', 'soon', 'months', 'later']);
const deadline = ctx('deadline', 4, ['flexible', 'date']);
const sea = ctx('sea', 4, ['sea', 'mountains', 'both']);
/** Крок 5 — після темпу, бо сума вже остаточна */
const budget = ctx('budget', 5, ['yes', 'cheaper', 'discuss'], { hideWhenCustom: true });
const project = [start, deadline, sea];

/** Доповнення «Потрібен логотип» і «Потрібен ребрендинг» — взаємовиключні */
const logoAddon: CalcOption = { id: 'logo', price: LOGO_PRICE, excludes: ['rebrand'] };
const rebrandAddon: CalcOption = { id: 'rebrand', price: IDENTITY_PRICE, excludes: ['logo'] };

const pace: CalcQuestion = {
  id: 'pace',
  kind: 'single',
  role: 'pace',
  step: 5,
  defaultOption: 'normal',
  options: [
    { id: 'normal', multiplier: 1 },
    { id: 'priority', multiplier: 1.25 },
  ],
};

const languages: CalcQuestion = {
  id: 'languages',
  kind: 'single',
  role: 'languages',
  step: 2,
  defaultOption: '1',
  options: [{ id: '1' }, { id: '2' }, { id: '3' }],
};

export const calculator = {
  currency: 'EUR',
  /** Куди приходять заявки з кроку 6 (та сама адреса в public/api/calc-request.php) */
  contactEmail: 'contact@lindigo-design.com',
  /** Обробник форми на хостингу (Hostinger, PHP), відносно кореня сайту */
  endpoint: 'api/calc-request.php',
  /** Верхня межа = разом × rangeSpread */
  rangeSpread: 1.25,
  roundTo: 50,
  /** Кожна мова понад першу, без перекладу (сайти й магазини) */
  extraLanguage: 450,
  /** Тексти від студії: за кожну сторінку */
  copyPerPage: 150,
  /** Тексти від студії для лендинга (одна сторінка) */
  copyLanding: 400,
  services: [
    {
      id: 'uiux',
      questions: [
        {
          id: 'type',
          kind: 'single',
          role: 'base',
          step: 2,
          defaultOption: 'prototype',
          options: [
            { id: 'prototype', price: 3200, includedUnits: 10 },
            { id: 'mobile', price: 8500, includedUnits: 20 },
            { id: 'webservice', price: 9500, includedUnits: 25 },
          ],
        },
        { id: 'screens', kind: 'counter', role: 'extraUnits', step: 2, unitPrice: 300, customAbove: 60 },
        brand,
        {
          id: 'addons',
          kind: 'multi',
          role: 'addon',
          step: 3,
          options: [
            { id: 'interviews', price: 1250 },
            { id: 'testing', price: 950 },
            { id: 'ds', price: 2550 },
            { id: 'platform2', percentOfBase: 0.4, draft: true },
          ],
        },
        ...project,
        pace,
        budget,
      ],
    },
    {
      id: 'sites',
      questions: [
        hasSite,
        {
          id: 'type',
          kind: 'single',
          role: 'base',
          step: 2,
          defaultOption: 'landing',
          options: [
            { id: 'landing', price: { full: 1900, design: 950 }, includedUnits: 1 },
            { id: 'vitrine', price: { full: 3800, design: 1900 }, includedUnits: 5 },
            { id: 'corporate', price: { full: 6350, design: 3500 }, includedUnits: 10 },
          ],
        },
        {
          id: 'scope',
          kind: 'single',
          role: 'variant',
          step: 2,
          defaultOption: 'full',
          options: [{ id: 'design' }, { id: 'full' }],
        },
        // ціна сторінки звірена зі звітом (350 / 200 €), у таблиці ще немає
        { id: 'pages', kind: 'counter', role: 'extraUnits', step: 2, unitPrice: { full: 400, design: 200 }, customAbove: 20, draft: true },
        languages,
        {
          id: 'copy',
          kind: 'single',
          role: 'copy',
          step: 2,
          defaultOption: 'ready',
          options: [{ id: 'ready' }, { id: 'studio' }],
        },
        brand,
        {
          id: 'addons',
          kind: 'multi',
          role: 'addon',
          step: 3,
          options: [
            logoAddon,
            rebrandAddon,
            { id: 'blog', price: 500, draft: true },
            { id: 'booking', price: 550, draft: true },
            { id: 'support', monthly: 80, draft: true },
          ],
        },
        ...project,
        pace,
        budget,
      ],
    },
    {
      id: 'shop',
      questions: [
        hasSite,
        {
          id: 'platform',
          kind: 'single',
          role: 'base',
          step: 2,
          defaultOption: 'shopify',
          options: [
            { id: 'shopify', price: 5100 },
            { id: 'custom', price: 8900 },
            { id: 'unsure', price: 5100, advice: true },
          ],
        },
        {
          id: 'products',
          kind: 'single',
          role: 'multiplier',
          step: 2,
          defaultOption: 'upTo50',
          options: [
            { id: 'upTo50', multiplier: 1 },
            { id: 'upTo300', multiplier: 1.2 },
            { id: 'over300', multiplier: 1.5 },
          ],
        },
        languages,
        brand,
        {
          id: 'addons',
          kind: 'multi',
          role: 'addon',
          step: 3,
          options: [
            { id: 'photos', price: 650 },
            logoAddon,
            rebrandAddon,
          ],
        },
        ...project,
        pace,
        budget,
      ],
    },
    {
      id: 'branding',
      questions: [
        {
          id: 'type',
          kind: 'single',
          role: 'base',
          step: 2,
          defaultOption: 'logo',
          options: [
            { id: 'logo', price: LOGO_PRICE },
            { id: 'identity', price: IDENTITY_PRICE },
            { id: 'full', price: 4450 },
            { id: 'logobook', price: 800 },
            { id: 'brandbook', price: 1750 },
          ],
        },
        {
          id: 'media',
          kind: 'multi',
          role: 'addon',
          step: 3,
          options: [
            { id: 'card', price: 200, draft: true },
            { id: 'social', price: 400, draft: true },
            { id: 'deck', price: 600, draft: true },
          ],
        },
        ...project,
        pace,
        budget,
      ],
    },
    {
      id: 'content',
      questions: [
        {
          id: 'type',
          kind: 'single',
          role: 'base',
          step: 2,
          defaultOption: 'shoot',
          options: [
            // ціна зйомки — з тривалості (наступне питання)
            { id: 'shoot', price: 0 },
            { id: 'social', price: 950 },
          ],
        },
        {
          id: 'duration',
          kind: 'single',
          role: 'base',
          step: 2,
          defaultOption: 'half',
          showIf: { question: 'type', in: ['shoot'] },
          options: [
            { id: 'half', price: 650 },
            { id: 'full', price: 1250 },
            { id: 'multi', custom: true },
          ],
        },
        brand,
        {
          id: 'addons',
          kind: 'multi',
          role: 'addon',
          step: 3,
          options: [
            { id: 'video', price: 500, draft: true },
            { id: 'retouch', price: 300, draft: true },
          ],
        },
        ...project,
        pace,
        budget,
      ],
    },
  ] satisfies CalcService[],
};

/* ---------- Розрахунок ---------- */

/** Відповіді: id питання → id варіанта (single), список id (multi) або число (counter) */
export type Answers = Record<string, string | string[] | number | undefined>;

export type CalcLine =
  /** База: назви обраних варіантів (питання base і variant), ціна */
  | { kind: 'base'; parts: { question: string; option: string }[]; amount: number }
  /** Одиниці понад включені */
  | { kind: 'units'; question: string; extra: number; amount: number }
  | { kind: 'multiplier'; question: string; option: string; factor: number }
  | { kind: 'languages'; count: number; amount: number }
  | { kind: 'copy'; pages: number; landing: boolean; amount: number }
  | { kind: 'addon'; question: string; option: string; amount: number }
  /** Щомісячна ціна: показується, у суму не входить */
  | { kind: 'monthly'; question: string; option: string; amount: number }
  | { kind: 'pace'; option: string; factor: number };

export interface CalcResult {
  service: ServiceId;
  /** Потрібна індивідуальна оцінка: суми немає */
  custom: boolean;
  /** Обрано «Не знаю — порадьте» */
  advice: boolean;
  lines: CalcLine[];
  /** Ціна обраного типу (нижня межа не менша за неї) */
  basePrice: number;
  /** Разом з темпом, до округлення */
  total: number;
  low: number;
  high: number;
}

export const roundTo = (x: number, step = calculator.roundTo) => Math.round(x / step) * step;

export function getService(id: string): CalcService | undefined {
  return calculator.services.find((s) => s.id === id);
}

const priceOf = (m: Money | undefined, scope: string): number =>
  m === undefined ? 0 : typeof m === 'number' ? m : scope === 'design' ? m.design : m.full;

/** Чи показується питання за поточних відповідей */
export function isVisible(q: CalcQuestion, answers: Answers): boolean {
  if (!q.showIf) return true;
  const v = answers[q.showIf.question];
  return typeof v === 'string' && q.showIf.in.includes(v);
}

/** Скільки одиниць уже входить у базу (за обраним варіантом базового питання); 0 — лічильника немає */
export function includedUnits(service: CalcService, answers: Answers): number {
  const base = service.questions.find((q) => q.role === 'base');
  const opt = base?.options?.find((o) => o.id === answers[base.id]);
  return opt?.includedUnits ?? 0;
}

/** Ключ ціни (full / design) з питання role: 'variant' */
export function scopeOf(service: CalcService, answers: Answers): string {
  const q = service.questions.find((x) => x.role === 'variant');
  const v = q ? answers[q.id] : undefined;
  return typeof v === 'string' ? v : 'full';
}

/**
 * Як відповідь «Чи є у вас бренд?» впливає на доповнення (розділ 5а):
 * «Ще немає» — рекомендуємо логотип; «Потрібен ребрендинг» — рекомендуємо ребрендинг;
 * «Лише логотип» або «Логотип і брендбук» — «Потрібен логотип» ховаємо.
 */
export function addonEffects(answers: Answers): { hidden: string[]; recommended: string[] } {
  switch (answers.brand) {
    case 'none':
      return { hidden: [], recommended: ['logo'] };
    case 'rebrand':
      return { hidden: [], recommended: ['rebrand'] };
    case 'logo':
    case 'full':
      return { hidden: ['logo'], recommended: [] };
    default:
      return { hidden: [], recommended: [] };
  }
}

/** «Пріоритет» рекомендуємо, якщо почати треба найближчим часом або є конкретна дата */
export function priorityRecommended(answers: Answers): boolean {
  return answers.start === 'soon' || answers.deadline === 'date';
}

/** Відповіді на старті для напряму: варіанти за замовчуванням, лічильник = включені одиниці */
export function defaultAnswers(service: CalcService): Answers {
  const answers: Answers = {};
  for (const q of service.questions) {
    if (q.kind === 'single' && !q.optional) answers[q.id] = q.defaultOption ?? q.options?.[0]?.id;
    if (q.kind === 'multi') answers[q.id] = [];
  }
  for (const q of service.questions) {
    if (q.kind === 'counter') answers[q.id] = includedUnits(service, answers);
  }
  return answers;
}

export function calculate(serviceId: ServiceId, answers: Answers): CalcResult {
  const service = getService(serviceId);
  if (!service) throw new Error(`Невідомий напрям: ${serviceId}`);
  const scope = scopeOf(service, answers);
  const visible = service.questions.filter((q) => isVisible(q, answers));
  const single = (q: CalcQuestion) => q.options?.find((o) => o.id === answers[q.id]);

  let custom = false;
  let advice = false;
  const lines: CalcLine[] = [];

  // База: ціни обраних варіантів питань base (+ назва варіанта variant у тому самому рядку)
  let base = 0;
  const parts: { question: string; option: string }[] = [];
  for (const q of visible) {
    if (q.role !== 'base' && q.role !== 'variant') continue;
    const o = single(q);
    if (!o) continue;
    parts.push({ question: q.id, option: o.id });
    if (o.custom) custom = true;
    if (o.advice) advice = true;
    base += priceOf(o.price, scope);
  }
  const basePrice = base;
  lines.push({ kind: 'base', parts, amount: base });

  // Коефіцієнт до бази (кількість товарів)
  for (const q of visible.filter((x) => x.role === 'multiplier')) {
    const o = single(q);
    if (!o?.multiplier) continue;
    base *= o.multiplier;
    lines.push({ kind: 'multiplier', question: q.id, option: o.id, factor: o.multiplier });
  }

  let total = base;
  const included = includedUnits(service, answers);
  let units = included;

  // Додаткові одиниці
  let unitsAmount = 0;
  for (const q of visible.filter((x) => x.role === 'extraUnits')) {
    if (included <= 1) continue; // лендинг: лічильника немає
    const n = Math.max(included, Math.round(Number(answers[q.id] ?? included)));
    units = n;
    if (q.customAbove !== undefined && n > q.customAbove) custom = true;
    const extra = n - included;
    if (extra > 0) {
      unitsAmount = extra * priceOf(q.unitPrice, scope);
      lines.push({ kind: 'units', question: q.id, extra, amount: unitsAmount });
    }
  }
  total += unitsAmount;

  // Мови: кожна понад першу
  for (const q of visible.filter((x) => x.role === 'languages')) {
    const count = Number(answers[q.id] ?? 1) || 1;
    if (count > 1) {
      const amount = (count - 1) * calculator.extraLanguage;
      total += amount;
      lines.push({ kind: 'languages', count, amount });
    }
  }

  // Тексти від студії
  for (const q of visible.filter((x) => x.role === 'copy')) {
    if (answers[q.id] !== 'studio') continue;
    const landing = included <= 1;
    const amount = landing ? calculator.copyLanding : units * calculator.copyPerPage;
    total += amount;
    lines.push({ kind: 'copy', pages: units, landing, amount });
  }

  // Доповнення (сховані відповіддю про бренд — не рахуємо)
  const { hidden } = addonEffects(answers);
  for (const q of visible.filter((x) => x.role === 'addon')) {
    const chosen = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
    for (const o of q.options ?? []) {
      if (!chosen.includes(o.id) || hidden.includes(o.id)) continue;
      if (o.monthly !== undefined) {
        lines.push({ kind: 'monthly', question: q.id, option: o.id, amount: o.monthly });
        continue;
      }
      const amount = o.percentOfBase !== undefined ? (base + unitsAmount) * o.percentOfBase : priceOf(o.price, scope);
      total += amount;
      lines.push({ kind: 'addon', question: q.id, option: o.id, amount });
    }
  }

  // Темп
  for (const q of visible.filter((x) => x.role === 'pace')) {
    const o = single(q);
    if (!o) continue;
    const factor = o.multiplier ?? 1;
    total *= factor;
    lines.push({ kind: 'pace', option: o.id, factor });
  }

  const low = custom ? 0 : Math.max(roundTo(total), basePrice);
  const high = custom ? 0 : Math.max(roundTo(total * calculator.rangeSpread), low);
  return { service: serviceId, custom, advice, lines, basePrice, total, low, high };
}

/** Усі тестові ціни конфігу: «напрям / питання / варіант» */
export function listDrafts(): string[] {
  const out: string[] = [];
  for (const s of calculator.services) {
    for (const q of s.questions) {
      if (q.draft) out.push(`${s.id} / ${q.id} — ціна одиниці ${JSON.stringify(q.unitPrice)}`);
      for (const o of q.options ?? []) {
        if (!o.draft) continue;
        const value = o.price !== undefined ? JSON.stringify(o.price) : o.monthly !== undefined ? `${o.monthly} € / міс.` : `${(o.percentOfBase ?? 0) * 100} %`;
        out.push(`${s.id} / ${q.id} / ${o.id} — ${value}`);
      }
    }
  }
  return out;
}
