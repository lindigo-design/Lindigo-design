/**
 * Калькулятор вартості: поведінка в браузері (специфікація, версія 3).
 * Стан — обраний напрям, відповіді на питання і поточний крок (1–6). На кожну зміну рахуємо calculate()
 * з src/data/calculator.ts і перемальовуємо підсумок. Розмітку збирає Calculator.astro, тексти — JSON у <script data-calc-texts>.
 *
 * Показ по кроках: видно лише питання поточного кроку, пройдені згорнуті в рядки з «Змінити».
 * «Змінити» (або клік по пройденому кроку на смузі) повертає до кроку; наступні кроки людина проходить знову.
 * Крок 6 — форма запиту: POST на обробник хостингу; якщо його немає — лист через пошту людини (mailto).
 *
 * Сайт уже є (сайти й магазини): під «Чи є у вас сайт?» — «Що хочете зробити?» (обов'язкове) і «Що не працює?».
 * «Змінити окремі сторінки» — без суми й без кроків 2, 3 і 5 (skipSteps у конфігу).
 */
import {
  addonEffects,
  calculate,
  calculator,
  defaultAnswers,
  getService,
  includedUnits,
  isVisible,
  optionVisible,
  priorityRecommended,
  scopeOf,
  serviceIds,
  skippedSteps,
  STEP_COUNT,
  type Answers,
  type CalcLine,
  type CalcOption,
  type CalcQuestion,
  type CalcResult,
  type CalcService,
  type Money,
  type ServiceId,
} from '../../data/calculator';
import { fill, type CalcTexts } from '../../i18n/calculator';
import { titleCase, type TitleLocale } from '../../i18n/title-case';

const LOCALE_TAGS: Record<string, string> = { fr: 'fr-FR', en: 'en-GB', uk: 'uk-UA' };
const STORAGE_KEY = 'lindigo-estimate';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Нерозривний пробіл між двома останніми словами (як keepLastWords) */
const keepLast = (s: string) => s.replace(/ (\S+)$/, ' $1');

/** Аналітика, якщо підключена (dataLayer); без персональних даних */
function track(event: string, service?: string) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer?.push({ event, service });
}

export function initCalculator(root: HTMLElement) {
  const textsEl = root.querySelector<HTMLScriptElement>('script[data-calc-texts]');
  if (!textsEl) return;
  const t = JSON.parse(textsEl.textContent || '{}') as CalcTexts;
  const locale = root.dataset.locale || 'fr';
  const tag = LOCALE_TAGS[locale] || 'fr-FR';
  // заголовки й кнопки, які калькулятор пише сам, — Title Case, як усі заголовки й кнопки сайту (src/i18n/title-case.ts)
  const tc = (s: string) => titleCase(s, locale as TitleLocale);
  const moneyFmt = new Intl.NumberFormat(tag, { style: 'currency', currency: calculator.currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 });
  const numFmt = new Intl.NumberFormat(tag, { maximumFractionDigits: 2 });
  const dateFmt = new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long', year: 'numeric' });
  const money = (n: number) => moneyFmt.format(n);
  /** «8 300–10 400 €» (символ після числа) або «€8,300–€10,400» (символ перед) */
  const rangeText = (low: number, high: number) => {
    const lo = money(low);
    const hi = money(high);
    const suffix = /\d\s*€$/.test(lo);
    return suffix ? `${lo.replace(/\s*€$/, '')}–${hi}` : `${lo}–${hi}`;
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  /** «Назва: значення»; у французькій — нерозривний пробіл перед двокрапкою */
  const COLON = locale === 'fr' ? ' : ' : ': ';

  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const els = {
    steps: [...root.querySelectorAll<HTMLElement>('[data-step-item]')],
    stepsList: $('[data-steps]'),
    stepNow: $('[data-step-now]'),
    done: $('[data-done]'),
    stage: $('[data-stage]'),
    serviceInputs: [...root.querySelectorAll<HTMLInputElement>('input[name="calc-service"]')],
    groups: [...root.querySelectorAll<HTMLElement>('[data-service-group]')],
    range: $('[data-range]'),
    meta: $('[data-meta]'),
    live: $('[data-live]'),
    empty: $('[data-empty]'),
    breakdown: $('[data-breakdown]'),
    lines: $('[data-lines]'),
    customText: $('[data-custom-text]'),
    advice: $('[data-advice]'),
    panelNext: $('[data-panel-next]'),
    call: root.querySelector<HTMLAnchorElement>('[data-call] a'),
    restart: $<HTMLButtonElement>('[data-restart]'),
    summary: $('[data-summary]'),
    barRange: $('[data-bar-range]'),
    nav: $('[data-nav]'),
    next: $('[data-next]'),
    back: $<HTMLButtonElement>('[data-back]'),
    form: $<HTMLFormElement>('[data-form]'),
    status: $('[data-status]'),
    callLink: $('[data-call-link]'),
    thanks: $('[data-thanks]'),
    thanksList: $('[data-thanks-list]'),
    included: document.querySelector<HTMLElement>('[data-calc-included]'),
  };
  const nextBtn = els.next.querySelector<HTMLButtonElement>('button')!;
  const panelBtn = els.panelNext.querySelector<HTMLButtonElement>('button')!;
  const submitBtn = els.form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submitLabel = submitBtn.querySelector<HTMLElement>('.btn__label')!;
  const field = (name: string) => els.form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`)!;

  let serviceId: ServiceId | null = null;
  let service: CalcService | null = null;
  let answers: Answers = {};
  let result: CalcResult | null = null;
  let shown = { low: 0, high: 0 };
  let step = 1;
  let sent = false;
  let started = false;
  let busy = false;
  /** Людина сама редагувала коментар — не перезаписуємо його зведенням */
  let commentEdited = false;
  /** Кроки, які людина вже бачила (відповіді за замовчуванням з defaults ставимо лише в ще не бачені) */
  const visited = new Set<number>([1]);

  const skipped = () => (service ? skippedSteps(service, answers) : []);
  /** Наступний / попередній крок з урахуванням пропущених */
  const nextStep = (from: number) => {
    for (let n = from + 1; n <= STEP_COUNT; n++) if (!skipped().includes(n)) return n;
    return 0;
  };
  const prevStep = (from: number) => {
    for (let n = from - 1; n >= 1; n--) if (!skipped().includes(n)) return n;
    return 0;
  };
  const siteUrl = () => $('[data-site-url]');

  const qText = (sid: string, qid: string) => t.questions[sid]?.[qid] ?? t.questions.common?.[qid];
  const optText = (sid: string, qid: string, oid: string) => qText(sid, qid)?.options?.[oid];
  const priceOf = (m: Money | undefined, scope: string) => (m === undefined ? 0 : typeof m === 'number' ? m : scope === 'design' ? m.design : m.full);

  /* ---------- Ціни на картках варіантів ---------- */

  function optionPrice(s: CalcService, q: CalcQuestion, o: CalcOption): string {
    const scope = scopeOf(s, answers);
    const scalable = s.questions.some((x) => x.role === 'extraUnits' || x.role === 'multiplier' || x.role === 'languages');
    if (o.custom) return t.price.custom;
    switch (q.role) {
      case 'base': {
        if (o.price === 0) {
          // зйомка: ціна — з тривалості, показуємо найменшу
          const dur = s.questions.find((x) => x.showIf?.question === q.id && x.showIf.in.includes(o.id));
          const min = Math.min(...(dur?.options ?? []).filter((d) => !d.custom).map((d) => priceOf(d.price, scope)));
          return fill(t.price.from, { price: money(min) });
        }
        const p = money(priceOf(o.price, scope));
        return scalable ? fill(t.price.from, { price: p }) : p;
      }
      case 'variant': {
        const base = s.questions.find((x) => x.role === 'base');
        const chosen = base?.options?.find((x) => x.id === answers[base.id]);
        return money(priceOf(chosen?.price, o.id));
      }
      case 'multiplier':
        return `× ${numFmt.format(o.multiplier ?? 1)}`;
      case 'copy':
        if (o.id !== 'studio') return money(0);
        return includedUnits(s, answers) <= 1
          ? fill(t.price.plus, { price: money(calculator.copyLanding) })
          : fill(t.price.perPage, { price: money(calculator.copyPerPage) });
      case 'addon':
        if (o.monthly !== undefined) return fill(t.price.perMonth, { price: money(o.monthly) });
        if (o.percentOfBase !== undefined) return fill(t.price.percent, { n: numFmt.format(o.percentOfBase * 100) });
        return fill(t.price.plus, { price: money(priceOf(o.price, scope)) });
      case 'pace': {
        const f = o.multiplier ?? 1;
        return f === 1 ? '× 1' : fill(t.price.percent, { n: numFmt.format(Math.round((f - 1) * 100)) });
      }
      default:
        return '';
    }
  }

  /* ---------- Видимість питань ---------- */

  function questionEls(sid: string) {
    return [...root.querySelectorAll<HTMLElement>(`[data-service-group="${sid}"] [data-question]`)];
  }

  /** Чи показується питання напряму за поточних відповідей */
  function shown_(q: CalcQuestion): boolean {
    if (!service) return false;
    if (!isVisible(q, answers)) return false;
    if (q.kind === 'counter' && includedUnits(service, answers) <= 1) return false; // лендинг: лічильника немає
    if (q.hideWhenCustom && result?.custom) return false;
    return true;
  }

  /** Усі блоки кроку в порядку на сторінці: питання напряму, крок 1 — ще й вибір напряму, крок 6 — форма */
  function stepEls(n: number): HTMLElement[] {
    const list: HTMLElement[] = [];
    if (n === 1) list.push($('[data-question="service"]'));
    if (serviceId) list.push(...questionEls(serviceId).filter((el) => Number(el.dataset.step) === n && !el.hidden));
    if (n === 6) list.push(...els.form.querySelectorAll<HTMLElement>('[data-step="6"], [data-step-extra="6"]'));
    return list;
  }

  /* ---------- Синхронізація розмітки зі станом ---------- */

  function syncInputs() {
    if (!service || !serviceId) return;
    const effects = addonEffects(answers);
    const priority = priorityRecommended(answers);
    const firstSeen = new Set<string>();

    for (const el of questionEls(serviceId)) {
      const q = service.questions.find((x) => x.id === el.dataset.question);
      if (!q) continue;
      el.hidden = !shown_(q);

      // мітка «Крок N · …» — лише над першим видимим питанням кроку (на кроці 1 вона над вибором напряму)
      const eyebrow = el.querySelector<HTMLElement>('[data-eyebrow]');
      if (eyebrow) {
        const first = !el.hidden && q.step !== 1 && !firstSeen.has(String(q.step));
        eyebrow.hidden = !first;
        if (!el.hidden) firstSeen.add(String(q.step));
      }

      if (q.kind === 'counter') {
        const inc = includedUnits(service, answers);
        const input = el.querySelector<HTMLInputElement>('input')!;
        input.min = String(inc);
        input.max = String((q.customAbove ?? 999) + 1);
        input.value = String(answers[q.id] ?? inc);
        const n = Number(input.value);
        el.querySelector<HTMLButtonElement>('[data-dec]')!.disabled = n <= inc;
        el.querySelector<HTMLButtonElement>('[data-inc]')!.disabled = n > (q.customAbove ?? 999);
        const hint = el.querySelector<HTMLElement>('[data-hint]');
        if (hint) {
          const tpl = qText(serviceId, q.id)?.hint ?? '';
          hint.textContent = keepLast(
            fill(tpl, {
              n: inc,
              price: money(priceOf(q.unitPrice, scopeOf(service, answers))),
              full: money(priceOf(q.unitPrice, 'full')),
              design: money(priceOf(q.unitPrice, 'design')),
            }),
          );
        }
        const over = el.querySelector<HTMLElement>('[data-over]');
        if (over) over.hidden = !(q.customAbove !== undefined && n > q.customAbove);
        continue;
      }

      const hint = el.querySelector<HTMLElement>('[data-hint]');
      if (hint && q.role === 'languages') hint.textContent = keepLast(fill(qText(serviceId, q.id)?.hint ?? '', { price: money(calculator.extraLanguage) }));

      for (const input of el.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]')) {
        const v = answers[q.id];
        input.checked = Array.isArray(v) ? v.includes(input.value) : v === input.value;
        const o = q.options?.find((x) => x.id === input.value);
        const card = input.closest<HTMLElement>('label');
        const priceEl = card?.querySelector<HTMLElement>('[data-price]');
        if (o && priceEl) priceEl.textContent = optionPrice(service, q, o);
        if (!card) continue;
        // доповнення: «Потрібен логотип» ховається, якщо логотип уже є; рекомендоване — з позначкою
        if (q.role === 'addon') card.hidden = effects.hidden.includes(input.value) || (!!o && !optionVisible(o, answers));
        const badge = card.querySelector<HTMLElement>('[data-badge]');
        if (badge) {
          const rec = (q.role === 'addon' && effects.recommended.includes(input.value)) || (q.role === 'pace' && input.value === 'priority' && priority);
          badge.hidden = !rec;
        }
      }

      // «Є конкретна дата» — поле дати
      const date = el.querySelector<HTMLElement>('[data-date]');
      if (date) {
        date.hidden = answers.deadline !== 'date';
        date.querySelector<HTMLInputElement>('input')!.value = String(answers.deadlineDate ?? '');
      }
    }
  }

  /* ---------- Підсумок ---------- */

  function lineText(sid: string, line: CalcLine): [string, string] {
    switch (line.kind) {
      case 'base': {
        const names = line.parts.map((p, i) => {
          const o = optText(sid, p.question, p.option);
          return i === 0 ? (o?.title ?? '') : (o?.line ?? o?.title ?? '');
        });
        // зйомка: «Зйомка, повний день»; пакет без тривалості — назва варіанта
        return [names.filter(Boolean).join(', '), money(line.amount)];
      }
      case 'units':
        return [fill(line.question === 'screens' ? t.lines.screens : t.lines.pages, { n: line.extra }), `+ ${money(line.amount)}`];
      case 'multiplier':
        return [fill(t.lines.products, { name: optText(sid, line.question, line.option)?.line ?? '' }), `× ${numFmt.format(line.factor)}`];
      case 'languages':
        return [t.languages[String(line.count)] ?? String(line.count), `+ ${money(line.amount)}`];
      case 'copy':
        return [line.landing ? t.lines.copyLanding : fill(t.lines.copy, { n: line.pages }), `+ ${money(line.amount)}`];
      case 'addon':
        return [optText(sid, line.question, line.option)?.title ?? '', `+ ${money(line.amount)}`];
      case 'monthly':
        return [optText(sid, line.question, line.option)?.title ?? '', fill(t.lines.monthly, { price: money(line.amount) })];
      case 'pace':
        return [fill(t.lines.pace, { name: optText(sid, 'pace', line.option)?.line ?? '' }), `× ${numFmt.format(line.factor)}`];
    }
  }

  let animFrame = 0;
  function animateRange(to: { low: number; high: number }) {
    cancelAnimationFrame(animFrame);
    const from = { ...shown };
    if (reduceMotion.matches || (from.low === 0 && from.high === 0)) {
      shown = to;
      els.range.textContent = rangeText(to.low, to.high);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 300);
      const e = 1 - Math.pow(1 - k, 3);
      // проміжні числа кратні 50, як і підсумок
      const lo = Math.round((from.low + (to.low - from.low) * e) / 50) * 50;
      const hi = Math.round((from.high + (to.high - from.high) * e) / 50) * 50;
      els.range.textContent = rangeText(lo, hi);
      if (k < 1) animFrame = requestAnimationFrame(tick);
      else shown = to;
    };
    animFrame = requestAnimationFrame(tick);
  }

  function renderSummary() {
    root.classList.toggle('is-empty', !result);
    els.empty.hidden = !!result;
    els.breakdown.hidden = !result;
    if (!result || !serviceId) {
      root.classList.remove('is-custom');
      els.range.textContent = '';
      els.meta.textContent = '';
      els.barRange.textContent = '—';
      els.live.textContent = '';
      renderIncluded();
      return;
    }
    const custom = result.custom;
    root.classList.toggle('is-custom', custom);
    els.customText.hidden = !custom;
    els.advice.hidden = !result.advice || custom;
    els.meta.textContent = custom ? t.services[serviceId].title : `${t.summary.tax} · ${t.services[serviceId].title}`;

    if (custom) {
      cancelAnimationFrame(animFrame);
      shown = { low: 0, high: 0 };
      els.range.textContent = t.summary.custom;
      els.barRange.textContent = t.summary.custom;
      els.live.textContent = t.summary.custom;
      track('calc_custom', serviceId);
    } else {
      animateRange({ low: result.low, high: result.high });
      els.barRange.textContent = rangeText(result.low, result.high);
      els.live.textContent = fill(t.summary.range, { low: money(result.low), high: money(result.high) });
    }

    // «Змінити окремі сторінки»: параметри не питали — рядків розрахунку немає
    const priced = !skipped().includes(2);
    els.lines.parentElement!.hidden = !priced;
    els.lines.replaceChildren(
      ...(priced ? result.lines : []).map((line) => {
        const [name, amount] = lineText(serviceId!, line);
        const li = document.createElement('li');
        li.className = 'calc-sum__line';
        const a = document.createElement('span');
        a.textContent = name;
        const b = document.createElement('span');
        b.className = 'calc-sum__amount';
        b.textContent = custom && line.kind !== 'pace' && line.kind !== 'multiplier' && line.kind !== 'monthly' ? '' : amount;
        li.append(a, b);
        return li;
      }),
    );
    renderIncluded();
  }

  function renderIncluded() {
    const box = els.included;
    if (!box) return;
    box.hidden = !serviceId;
    if (!serviceId || !service) return;
    const key = serviceId === 'sites' && scopeOf(service, answers) === 'design' ? 'sites-design' : serviceId;
    box.querySelector<HTMLElement>('[data-incl-title]')!.textContent = tc(t.included.titles[serviceId]);
    const items = t.included.items[key] ?? [];
    box.querySelectorAll<HTMLElement>('[data-incl-item]').forEach((card, i) => {
      const it = items[i];
      card.hidden = !it;
      if (!it) return;
      card.querySelector('[data-incl-name]')!.textContent = tc(it.title);
      card.querySelector('[data-incl-text]')!.textContent = keepLast(it.text);
    });
  }

  /* ---------- Відповіді кроку одним рядком (згорнуті кроки, зведення) ---------- */

  /** Відповідь на одне питання текстом; '' — немає відповіді */
  function answerText(q: CalcQuestion): string {
    if (!service || !serviceId) return '';
    const v = answers[q.id];
    if (q.kind === 'counter') {
      const n = Number(v ?? includedUnits(service, answers));
      return fill(q.id === 'screens' ? t.flow.units.screens : t.flow.units.pages, { n });
    }
    if (q.role === 'languages') return t.languages[String(v)] ?? '';
    if (q.kind === 'multi' && q.role === 'context') {
      const list = Array.isArray(v) ? v : [];
      if (!list.length) return '';
      const qt = qText(serviceId, q.id);
      const value = list.map((id) => optText(serviceId!, q.id, id)?.line ?? optText(serviceId!, q.id, id)?.title ?? '').join(', ');
      return qt?.short ? `${qt.short}${COLON}${value}` : value;
    }
    if (q.kind === 'multi') {
      const hidden = addonEffects(answers).hidden;
      const opts = q.options ?? [];
      const list = (Array.isArray(v) ? v : []).filter((id) => !hidden.includes(id) && optionVisible(opts.find((o) => o.id === id) ?? { id }, answers));
      return list.map((id) => optText(serviceId!, q.id, id)?.title ?? '').filter(Boolean).join(', ');
    }
    if (typeof v !== 'string') return '';
    const o = optText(serviceId, q.id, v);
    if (q.role === 'context') {
      const qt = qText(serviceId, q.id);
      let value = o?.line ?? o?.title ?? '';
      if (q.id === 'deadline' && v === 'date' && answers.deadlineDate) value = formatDate(String(answers.deadlineDate));
      return qt?.short ? `${qt.short}${COLON}${value}` : value;
    }
    // друге питання бази (лише дизайн / зйомка): коротка форма
    return q.role === 'variant' || (q.role === 'base' && q.showIf) ? (o?.line ?? o?.title ?? '') : (o?.title ?? '');
  }

  function formatDate(iso: string): string {
    const d = new Date(`${iso}T12:00:00`);
    return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
  }

  /** Друга й далі відповіді в рядку — з малої літери, крім назв на кшталт UI/UX чи Shopify */
  const lowerFirst = (x: string) => (/^\p{Lu}\p{Ll}/u.test(x) && !/^Shopify/.test(x) ? x[0].toLocaleLowerCase(tag) + x.slice(1) : x);
  const joinParts = (parts: string[]) => parts.map((x, i) => (i === 0 ? x : lowerFirst(x))).join(', ');

  function stepSummary(n: number): string {
    if (n === 1) {
      if (!serviceId) return '';
      const extra = (service?.questions ?? []).filter((q) => q.step === 1 && shown_(q)).map(answerText);
      return joinParts([t.services[serviceId].title, ...extra].filter(Boolean));
    }
    if (!service) return '';
    const parts = service.questions.filter((q) => q.step === n && shown_(q)).map(answerText).filter(Boolean);
    return parts.length ? joinParts(parts) : t.flow.nothing;
  }

  /* ---------- Кроки ---------- */

  function renderSteps() {
    const skip = skipped();
    els.steps.forEach((li, i) => {
      const n = i + 1;
      const isSkipped = skip.includes(n);
      const done = !isSkipped && (sent || n < step);
      li.classList.toggle('is-skipped', isSkipped);
      li.classList.toggle('is-done', done);
      li.classList.toggle('is-now', !sent && n === step);
      const btn = li.querySelector<HTMLButtonElement>('[data-goto]')!;
      btn.disabled = !done || sent;
      if (!sent && n === step) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
    });
    els.stepNow.textContent = sent ? t.thanks.eyebrow : `${step} ${t.steps[step - 1]}`;

    // згорнуті пройдені кроки
    const rows = sent ? [] : Array.from({ length: step - 1 }, (_, i) => i + 1).filter((n) => !skip.includes(n));
    els.done.hidden = rows.length === 0;
    els.done.replaceChildren(
      ...rows.map((n) => {
        const li = document.createElement('li');
        li.className = 'calc-done__row';
        const check = document.createElement('span');
        check.className = 'calc-done__check';
        check.setAttribute('aria-hidden', 'true');
        const body = document.createElement('span');
        body.className = 'calc-done__body';
        const name = document.createElement('span');
        name.className = 'calc-done__name';
        name.textContent = `${n} ${t.steps[n - 1]}`;
        const answer = document.createElement('span');
        answer.className = 'calc-done__answer';
        answer.textContent = stepSummary(n);
        body.append(name, answer);
        const change = document.createElement('button');
        change.type = 'button';
        change.className = 'calc-done__change';
        change.dataset.goto = String(n);
        change.textContent = t.flow.change;
        change.setAttribute('aria-label', `${t.flow.change}: ${n} ${t.steps[n - 1]}`);
        li.append(check, body, change);
        return li;
      }),
    );

    // видно лише поточний крок
    root.classList.add('is-flow');
    for (const el of root.querySelectorAll<HTMLElement>('[data-question], [data-step-extra]')) el.classList.remove('is-current');
    if (!sent) for (const el of stepEls(step)) el.classList.add('is-current');
    els.form.hidden = sent || step !== 6;
    els.thanks.hidden = !sent;

    // «Далі» під кроком: на кроці 1 — коли обрано напрям і є відповіді на обов'язкові питання; на кроці 6 замість неї кнопка форми
    const missing = !!service && service.questions.some((q) => q.step === step && q.required && shown_(q) && !answers[q.id]);
    const canNext = (step > 1 || !!serviceId) && !missing;
    const next = nextStep(step);
    els.next.hidden = !next || next > STEP_COUNT || step >= STEP_COUNT;
    if (canNext) {
      nextBtn.removeAttribute('aria-disabled');
      nextBtn.removeAttribute('aria-describedby');
    } else {
      nextBtn.setAttribute('aria-disabled', 'true');
      nextBtn.setAttribute('aria-describedby', 'calc-need-choice');
    }
    els.back.hidden = !prevStep(step);
    els.nav.hidden = sent;

    // кнопка панелі дублює «Далі» й називає наступний крок
    const panelOn = !sent && !!serviceId && step < STEP_COUNT && !!next;
    els.panelNext.hidden = !panelOn;
    if (panelOn) panelBtn.querySelector<HTMLElement>('.btn__label')!.textContent = tc(t.flow.nextTo[next - 1]);
    if (canNext) panelBtn.removeAttribute('aria-disabled');
    else panelBtn.setAttribute('aria-disabled', 'true');

    // посилання на сайт у формі — лише якщо сайт є
    siteUrl().hidden = answers.hasSite !== 'yes';
  }

  async function goTo(n: number, { focus = true } = {}) {
    if (busy || n < 1 || n > STEP_COUNT || (n > 1 && !serviceId) || skipped().includes(n)) return;
    const forward = n > step;
    if (forward && step === 4) track('calc_context', serviceId ?? undefined);
    if (forward && step <= 5 && n > 5) track('calc_result', serviceId ?? undefined);
    visited.add(n);
    if (n === 6) fillComment();

    const animate = !reduceMotion.matches && 'animate' in HTMLElement.prototype;
    busy = true;
    if (animate) {
      // поточний крок плавно йде вгору й зникає
      const out = [...root.querySelectorAll<HTMLElement>('.is-current')];
      await Promise.all(
        out.map((el) => el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-16px)' }], { duration: 200, easing: 'ease-in' }).finished.catch(() => {})),
      );
    }
    step = n;
    renderSteps();
    if (animate) {
      // новий з'являється знизу
      for (const el of root.querySelectorAll<HTMLElement>('.is-current')) {
        el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 250, easing: 'ease-out' });
      }
    }
    busy = false;
    if (focus) focusStep();
  }

  /** До смуги кроків і фокус на заголовок нового кроку */
  function focusStep() {
    els.stepsList.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    const target = sent ? $('[data-thanks-title]') : root.querySelector<HTMLElement>('.calc-q.is-current .calc-q__head');
    target?.focus({ preventScroll: true });
  }

  /* ---------- Зміни ---------- */

  function update() {
    if (serviceId) {
      result = calculate(serviceId, answers);
      if (!started) {
        started = true;
        track('calc_start', serviceId);
      }
    } else result = null;
    syncInputs();
    renderSummary();
    renderSteps();
  }

  function selectService(id: ServiceId | null) {
    serviceId = id;
    service = id ? getService(id)! : null;
    answers = service ? defaultAnswers(service) : {};
    for (const g of els.groups) g.hidden = g.dataset.serviceGroup !== id;
    for (const i of els.serviceInputs) i.checked = i.value === id;
    update();
  }

  root.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.name === 'calc-service') {
      // зміна напряму скидає відповіді наступних кроків
      selectService(input.value as ServiceId);
      return;
    }
    if (input.name === 'call') {
      els.callLink.hidden = input.value !== 'yes';
      return;
    }
    if (!service || !serviceId) return;
    const qEl = input.closest<HTMLElement>('[data-question]');
    const q = service.questions.find((x) => x.id === qEl?.dataset.question);
    if (!q) return;
    if (input.type === 'date') {
      answers.deadlineDate = input.value || undefined;
      update();
      return;
    }
    const before = q.kind === 'single' ? q.options?.find((o) => o.id === answers[q.id]) : undefined;
    if (q.kind === 'single') {
      answers[q.id] = input.value;
      const chosen = q.options?.find((o) => o.id === input.value);
      if (q.id === 'siteGoal') {
        (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'calc_site_goal', goal: input.value });
        // «Оновити дизайн» → тексти вже готові, якщо крок 2 людина ще не бачила
        for (const [qid, val] of Object.entries(chosen?.defaults ?? {})) if (!visited.has(2)) answers[qid] = val;
        // з «окремих сторінок» на інше: пропущені кроки повертаються й заповнюються з нуля
        const back = (before?.skipSteps ?? []).filter((n) => !(chosen?.skipSteps ?? []).includes(n));
        if (back.length) {
          const fresh = defaultAnswers(service);
          for (const x of service.questions) if (back.includes(x.step) && x.role !== 'context') answers[x.id] = fresh[x.id];
          for (const n of back) visited.delete(n);
        }
      }
      // новий тип: лічильник стартує з включених одиниць
      if (q.role === 'base') {
        const counter = service.questions.find((x) => x.kind === 'counter');
        if (counter) answers[counter.id] = includedUnits(service, answers);
      }
      if (q.id === 'deadline' && input.value !== 'date') answers.deadlineDate = undefined;
    } else if (q.kind === 'multi') {
      const set = new Set((answers[q.id] as string[]) ?? []);
      if (input.checked) {
        set.add(input.value);
        // «Потрібен логотип» і «Потрібен ребрендинг» — взаємовиключні
        for (const x of q.options?.find((o) => o.id === input.value)?.excludes ?? []) set.delete(x);
      } else set.delete(input.value);
      answers[q.id] = [...set];
    } else if (q.kind === 'counter') {
      setCounter(q, Number(input.value));
      return;
    }
    // питання про контекст, що сховались (сайт «Ні»), — без відповідей
    for (const x of service.questions.filter((y) => y.role === 'context' && !isVisible(y, answers))) {
      answers[x.id] = x.kind === 'multi' ? [] : undefined;
    }
    // доповнення, сховані відповіддю про бренд або недоступні (перенесення вмісту), знімаємо
    const { hidden } = addonEffects(answers);
    for (const aq of service.questions.filter((x) => x.role === 'addon')) {
      if (Array.isArray(answers[aq.id]))
        answers[aq.id] = (answers[aq.id] as string[]).filter((id) => !hidden.includes(id) && optionVisible(aq.options?.find((o) => o.id === id) ?? { id }, answers));
    }
    if (answers.hasSite !== 'yes') {
      const url = field('site');
      url.value = '';
      setError('site', '');
    }
    const appeared = q.id === 'hasSite' && input.value === 'yes';
    update();
    // «Так» — нові питання плавно з'являються під «Чи є у вас сайт?»
    if (appeared && !reduceMotion.matches && 'animate' in HTMLElement.prototype) {
      for (const el of questionEls(serviceId).filter((x) => ['siteGoal', 'sitePains'].includes(x.dataset.question ?? '') && !x.hidden)) {
        el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 250, easing: 'ease-out' });
      }
    }
  });

  function setCounter(q: CalcQuestion, value: number) {
    if (!service) return;
    const min = includedUnits(service, answers);
    const max = (q.customAbove ?? 999) + 1;
    answers[q.id] = Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : min)));
    update();
  }

  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const goto = target.closest<HTMLButtonElement>('[data-goto]');
    if (goto && !goto.disabled) {
      goTo(Number(goto.dataset.goto));
      return;
    }
    const btn = target.closest<HTMLButtonElement>('[data-dec], [data-inc]');
    if (!btn || !service) return;
    const q = service.questions.find((x) => x.id === btn.closest<HTMLElement>('[data-question]')?.dataset.question);
    if (!q) return;
    setCounter(q, Number(answers[q.id] ?? 0) + (btn.hasAttribute('data-inc') ? 1 : -1));
  });

  // Число в полі лічильника: рахуємо одразу, обмеження — коли поле втрачає фокус
  root.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;
    if (input === field('comment')) {
      commentEdited = true;
      return;
    }
    if (input.type !== 'number' || !service) return;
    const q = service.questions.find((x) => x.id === input.closest<HTMLElement>('[data-question]')?.dataset.question);
    const n = Number(input.value);
    if (!q || !Number.isFinite(n) || input.value === '') return;
    answers[q.id] = Math.max(includedUnits(service, answers), Math.round(n));
    result = calculate(serviceId!, answers);
    renderSummary();
  });

  const onNext = () => {
    if (nextBtn.getAttribute('aria-disabled') === 'true') return;
    goTo(nextStep(step));
  };
  nextBtn.addEventListener('click', onNext);
  panelBtn.addEventListener('click', onNext);
  els.back.addEventListener('click', () => goTo(prevStep(step)));

  els.restart.addEventListener('click', () => {
    sent = false;
    step = 1;
    commentEdited = false;
    visited.clear();
    visited.add(1);
    els.form.reset();
    els.callLink.hidden = true;
    clearErrors();
    els.status.hidden = true;
    shown = { low: 0, high: 0 };
    selectService(null);
    focusStep();
    els.serviceInputs[0]?.focus({ preventScroll: true });
  });

  els.call?.addEventListener('click', () => {
    if (serviceId) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ service: serviceId, answers, text: estimateText() }));
      } catch {
        /* приватний режим: без передачі */
      }
    }
    track('calc_to_call', serviceId ?? undefined);
  });

  /* ---------- Зведення запиту (специфікація, розділ 7) ---------- */

  /**
   * Зведення: напрям, рядки розрахунку (назва, сума), орієнтовна сума і питання про контекст.
   * line: true — рядок розрахунку («2 мови (+ 450 €)»), інакше пара «Назва: значення».
   */
  function estimatePairs(): { k: string; v: string; line?: boolean; group?: number }[] {
    if (!result || !serviceId || !service) return [];
    const pairs: { k: string; v: string; line?: boolean; group?: number }[] = [{ k: t.estimate.service, v: t.services[serviceId].title }];
    for (const line of skipped().includes(2) ? [] : result.lines) {
      const [name, amount] = lineText(serviceId, line);
      const hideAmount = result.custom && line.kind !== 'pace' && line.kind !== 'multiplier' && line.kind !== 'monthly';
      pairs.push({ k: name, v: hideAmount ? '' : amount, line: true });
    }
    pairs.push({ k: t.estimate.total, v: result.custom ? t.summary.custom : `${rangeText(result.low, result.high)} ${t.summary.tax}` });
    // контекст парами в рядок, як у специфікації: «Сайт є · Бренд», «Початок · Термін», «Сума · Море чи гори»
    const groups: Record<string, number> = { start: 2, deadline: 2, budget: 3, sea: 3 };
    const url = normalizeUrl(field('site').value);
    for (const q of service.questions.filter((x) => x.role === 'context' && shown_(x))) {
      const text = answerText(q);
      const i = text.indexOf(COLON);
      if (text && i > 0) pairs.push({ k: text.slice(0, i), v: text.slice(i + COLON.length), group: groups[q.id] });
      // посилання на сайт — одразу після питань про сайт
      if (q.id === 'sitePains' && answers.hasSite === 'yes' && url) pairs.push({ k: t.contact.siteShort, v: url });
    }
    return pairs;
  }

  function estimateText(): string {
    const rows: string[] = [];
    let lastGroup: number | undefined;
    for (const p of estimatePairs()) {
      const text = p.line ? (p.v ? `${p.k} (${p.v})` : p.k) : `${p.k}${COLON}${p.v}`;
      if (p.group && p.group === lastGroup) rows[rows.length - 1] += ` · ${text}`;
      else rows.push(text);
      lastGroup = p.group;
    }
    return rows.join('\n');
  }

  /** «lindigo.fr» → «https://lindigo.fr»; порожнє — порожнє */
  function normalizeUrl(raw: string): string {
    const v = raw.trim();
    if (!v) return '';
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  }
  const urlLooksValid = (v: string) => {
    try {
      const u = new URL(v);
      return /^https?:$/.test(u.protocol) && /\.[a-z]{2,}$/i.test(u.hostname);
    } catch {
      return false;
    }
  };

  function fillComment() {
    const c = field('comment');
    if (!commentEdited) c.value = estimateText();
  }

  /* ---------- Крок 6: форма ---------- */

  function setError(name: string, message: string) {
    const input = field(name);
    const wrap = input.closest<HTMLElement>('.field')!;
    const err = wrap.querySelector<HTMLElement>('[data-field-error]');
    wrap.classList.toggle('field--error', !!message);
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    if (!err) return;
    err.textContent = message;
    err.hidden = !message;
    const ids = new Set((input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
    if (message) ids.add(err.id);
    else ids.delete(err.id);
    if (ids.size) input.setAttribute('aria-describedby', [...ids].join(' '));
    else input.removeAttribute('aria-describedby');
  }

  function clearErrors() {
    setError('name', '');
    setError('email', '');
  }

  function validate(): boolean {
    const name = field('name').value.trim();
    const email = field('email').value.trim();
    setError('name', name ? '' : t.contact.errName);
    setError('email', EMAIL_RE.test(email) ? '' : t.contact.errEmail);
    const firstBad = !name ? field('name') : !EMAIL_RE.test(email) ? field('email') : null;
    firstBad?.focus();
    return !firstBad;
  }

  // помилка зникає, щойно поле виправлено
  for (const name of ['name', 'email']) {
    field(name).addEventListener('input', () => {
      const wrap = field(name).closest('.field');
      if (!wrap?.classList.contains('field--error')) return;
      const v = field(name).value.trim();
      if (name === 'name' ? v : EMAIL_RE.test(v)) setError(name, '');
    });
  }

  function mailtoHref(): string {
    const subject = fill(t.contact.subject, { service: serviceId ? t.services[serviceId].title : '' });
    const body = [field('name').value.trim(), field('email').value.trim(), '', field('comment').value.trim() || estimateText()].join('\n');
    return `mailto:${root.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function showFailed() {
    const email = root.dataset.email || '';
    const [before, after] = t.contact.failed.split('{email}');
    const link = document.createElement('a');
    link.href = mailtoHref();
    link.textContent = email;
    const open = document.createElement('a');
    open.href = link.href;
    open.textContent = t.contact.failedLink;
    els.status.replaceChildren(before ?? '', link, after ?? '', ' ', open);
    els.status.hidden = false;
  }

  let sending = false;
  els.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending || !serviceId) return;
    els.status.hidden = true;
    if (!validate()) return;

    // посилання на сайт: доповнюємо https://, помилку показуємо, але відправку не блокуємо
    const url = normalizeUrl(field('site').value);
    if (url) field('site').value = url;
    setError('site', url && !urlLooksValid(url) ? t.contact.errSite : '');
    if (!commentEdited) fillComment();

    const data = new FormData(els.form);
    data.set('name', field('name').value.trim());
    data.set('email', field('email').value.trim());
    data.set('comment', field('comment').value.trim());
    data.set('service', t.services[serviceId].title);
    data.set('estimate', estimateText());
    data.set('subject', fill(t.contact.subject, { service: t.services[serviceId].title }));
    data.set('locale', locale);
    data.set('page', location.href);

    sending = true;
    const label = submitLabel.textContent;
    submitLabel.textContent = t.contact.sending;
    submitBtn.setAttribute('aria-disabled', 'true');
    let ok = false;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(root.dataset.endpoint || '', { method: 'POST', body: data, signal: ctrl.signal, headers: { Accept: 'application/json' } });
      clearTimeout(timer);
      const json = res.ok ? ((await res.json().catch(() => null)) as { ok?: boolean } | null) : null;
      ok = !!json?.ok;
    } catch {
      ok = false;
    }
    sending = false;
    submitLabel.textContent = label;
    submitBtn.removeAttribute('aria-disabled');

    if (!ok) {
      showFailed();
      return;
    }
    track('calc_submit', serviceId);
    renderThanks();
    sent = true;
    renderSteps();
    focusStep();
  });

  function renderThanks() {
    const pairs = estimatePairs();
    const call = new FormData(els.form).get('call');
    if (call) pairs.push({ k: t.thanks.call, v: call === 'yes' ? t.contact.yes.toLowerCase() : t.contact.no.toLowerCase() });
    els.thanksList.replaceChildren(
      ...pairs.flatMap(({ k, v }) => {
        const dt = document.createElement('dt');
        dt.textContent = k;
        const dd = document.createElement('dd');
        dd.textContent = v;
        return [dt, dd];
      }),
    );
  }

  /* ---------- Старт ---------- */

  const fromUrl = new URLSearchParams(location.search).get('service');
  const preset = (serviceIds as readonly string[]).includes(fromUrl ?? '') ? (fromUrl as ServiceId) : (root.dataset.service as ServiceId | undefined);
  selectService(preset && (serviceIds as readonly string[]).includes(preset) ? preset : null);
  root.classList.add('is-ready');
}
