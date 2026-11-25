/**
 * Калькулятор вартості: поведінка в браузері.
 * Стан — відповіді на питання обраного напряму; на кожну зміну рахуємо calculate() з src/data/calculator.ts
 * і перемальовуємо підсумок. Розмітку питань збирає Calculator.astro, тексти — JSON у <script data-calc-texts>.
 *
 * Телефон (до 640 px): одне питання на екран, кнопки «Назад / Далі», панель із сумою внизу.
 */
import {
  calculate,
  calculator,
  defaultAnswers,
  getService,
  includedUnits,
  isVisible,
  scopeOf,
  serviceIds,
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

/** Нерозривний пробіл між двома останніми словами (як keepLastWords) */
const keepLast = (s: string) => s.replace(/ (\S+)$/, ' $1');

/** Аналітика, якщо підключена (dataLayer); без персональних даних */
function track(event: string, service?: string) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer?.push({ event, service });
}

export function initCalculator(root: HTMLElement) {
  const textsEl = root.querySelector<HTMLScriptElement>('script[data-calc-texts]');
  if (!textsEl) return;
  const t = JSON.parse(textsEl.textContent || '{}') as CalcTexts;
  const tag = LOCALE_TAGS[root.dataset.locale || 'fr'] || 'fr-FR';
  // заголовки h2/h3, які калькулятор пише сам, — Title Case, як усі заголовки сайту (src/i18n/title-case.ts)
  const tc = (s: string) => titleCase(s, (root.dataset.locale || 'fr') as TitleLocale);
  const moneyFmt = new Intl.NumberFormat(tag, { style: 'currency', currency: calculator.currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 });
  const numFmt = new Intl.NumberFormat(tag, { maximumFractionDigits: 2 });
  const money = (n: number) => moneyFmt.format(n);
  /** «8 300–10 400 €» (символ після числа) або «€8,300–€10,400» (символ перед) */
  const rangeText = (low: number, high: number) => {
    const lo = money(low);
    const hi = money(high);
    const suffix = /\d\s*€$/.test(lo);
    return suffix ? `${lo.replace(/\s*€$/, '')}–${hi}` : `${lo}–${hi}`;
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phone = window.matchMedia('(max-width: 640px)');

  const els = {
    steps: [...root.querySelectorAll<HTMLElement>('[data-step-item]')],
    serviceInputs: [...root.querySelectorAll<HTMLInputElement>('input[name="calc-service"]')],
    groups: [...root.querySelectorAll<HTMLElement>('[data-service-group]')],
    range: root.querySelector<HTMLElement>('[data-range]')!,
    meta: root.querySelector<HTMLElement>('[data-meta]')!,
    live: root.querySelector<HTMLElement>('[data-live]')!,
    empty: root.querySelector<HTMLElement>('[data-empty]')!,
    breakdown: root.querySelector<HTMLElement>('[data-breakdown]')!,
    lines: root.querySelector<HTMLElement>('[data-lines]')!,
    customText: root.querySelector<HTMLElement>('[data-custom-text]')!,
    advice: root.querySelector<HTMLElement>('[data-advice]')!,
    note: root.querySelector<HTMLElement>('[data-note]')!,
    exact: root.querySelector<HTMLAnchorElement>('[data-exact] a, a[data-exact]'),
    call: root.querySelector<HTMLAnchorElement>('[data-call] a, a[data-call]'),
    restart: root.querySelector<HTMLButtonElement>('[data-restart]')!,
    summary: root.querySelector<HTMLElement>('[data-summary]')!,
    bar: root.querySelector<HTMLElement>('[data-bar]')!,
    barRange: root.querySelector<HTMLElement>('[data-bar-range]')!,
    nav: root.querySelector<HTMLElement>('[data-nav]')!,
    back: root.querySelector<HTMLButtonElement>('[data-back]')!,
    next: root.querySelector<HTMLButtonElement>('[data-next]')!,
    included: document.querySelector<HTMLElement>('[data-calc-included]'),
  };
  const exactHref = els.exact?.getAttribute('href') || '';

  let serviceId: ServiceId | null = null;
  let service: CalcService | null = null;
  let answers: Answers = {};
  let result: CalcResult | null = null;
  let shown = { low: 0, high: 0 };
  let wizardIndex = 0;
  let started = false;

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

  /* ---------- Синхронізація розмітки зі станом ---------- */

  function questionEls(sid: string) {
    return [...root.querySelectorAll<HTMLElement>(`[data-service-group="${sid}"] [data-question]`)];
  }

  function syncInputs() {
    if (!service || !serviceId) return;
    for (const el of questionEls(serviceId)) {
      const q = service.questions.find((x) => x.id === el.dataset.question);
      if (!q) continue;
      el.hidden = !isVisible(q, answers);

      if (q.kind === 'counter') {
        const inc = includedUnits(service, answers);
        // лендинг (одна сторінка): лічильника немає
        if (inc <= 1) el.hidden = true;
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

      for (const input of el.querySelectorAll<HTMLInputElement>('input')) {
        const v = answers[q.id];
        input.checked = Array.isArray(v) ? v.includes(input.value) : v === input.value;
        const o = q.options?.find((x) => x.id === input.value);
        const priceEl = input.closest('label')?.querySelector<HTMLElement>('[data-price]');
        if (o && priceEl) priceEl.textContent = optionPrice(service, q, o);
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
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 300);
      const e = 1 - Math.pow(1 - k, 3);
      // проміжні числа кратні 50, як і підсумок
      const lo = Math.round((from.low + (to.low - from.low) * e) / 50) * 50;
      const hi = Math.round((from.high + (to.high - from.high) * e) / 50) * 50;
      els.range.textContent = rangeText(lo, hi);
      if (k < 1) animFrame = requestAnimationFrame(step);
      else shown = to;
    };
    animFrame = requestAnimationFrame(step);
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

    els.lines.replaceChildren(
      ...result.lines.map((line) => {
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

    if (els.exact) els.exact.href = exactHref;
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

  /* ---------- Кроки ---------- */

  /** Видимі питання в порядку на сторінці (для телефона й смуги кроків) */
  function visibleQuestions(): HTMLElement[] {
    const list: HTMLElement[] = [root.querySelector<HTMLElement>('[data-question="service"]')!];
    if (serviceId) list.push(...questionEls(serviceId).filter((el) => !el.hidden));
    return list;
  }

  function setStep(current: number) {
    els.steps.forEach((el, i) => {
      el.classList.toggle('is-done', i + 1 <= current);
      if (i + 1 === current) el.setAttribute('aria-current', 'step');
      else el.removeAttribute('aria-current');
    });
  }

  function stepFromScroll() {
    if (root.classList.contains('is-wizard')) return;
    const line = window.innerHeight * 0.5;
    let current = 1;
    for (const el of visibleQuestions()) {
      if (el.getBoundingClientRect().top < line) current = Math.max(current, Number(el.dataset.step || 1));
    }
    if (!serviceId) current = 1;
    setStep(current);
  }

  /* ---------- Телефон: одне питання на екран ---------- */

  function renderWizard() {
    const on = phone.matches;
    root.classList.toggle('is-wizard', on);
    const list = visibleQuestions();
    for (const el of root.querySelectorAll<HTMLElement>('[data-question]')) el.classList.remove('is-current');
    if (!on) {
      els.summary.classList.remove('is-current');
      stepFromScroll();
      return;
    }
    // останній «крок» — результат
    wizardIndex = Math.max(0, Math.min(wizardIndex, list.length));
    const atResult = wizardIndex === list.length;
    if (!atResult) list[wizardIndex].classList.add('is-current');
    els.summary.classList.toggle('is-current', atResult);
    root.classList.toggle('is-result', atResult);
    els.back.hidden = wizardIndex === 0;
    els.next.disabled = !serviceId;
    els.next.textContent = wizardIndex >= list.length - 1 ? t.mobile.result : t.mobile.next;
    els.nav.hidden = atResult;
    setStep(atResult ? 4 : Number(list[wizardIndex].dataset.step || 1));
  }

  function goWizard(delta: number) {
    wizardIndex += delta;
    renderWizard();
    const target = root.querySelector<HTMLElement>('.is-current');
    // до смуги кроків, щоб було видно, на якому ви кроці
    root.querySelector<HTMLElement>('.calc__steps')?.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    const focusable = target?.querySelector<HTMLElement>('legend, h2, [tabindex="-1"]');
    focusable?.focus({ preventScroll: true });
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
    renderWizard();
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
      selectService(input.value as ServiceId);
      return;
    }
    if (!service || !serviceId) return;
    const qEl = input.closest<HTMLElement>('[data-question]');
    const q = service.questions.find((x) => x.id === qEl?.dataset.question);
    if (!q) return;
    if (q.kind === 'single') {
      answers[q.id] = input.value;
      // новий тип: лічильник стартує з включених одиниць
      if (q.role === 'base') {
        const counter = service.questions.find((x) => x.kind === 'counter');
        if (counter) answers[counter.id] = includedUnits(service, answers);
      }
    } else if (q.kind === 'multi') {
      const set = new Set((answers[q.id] as string[]) ?? []);
      if (input.checked) set.add(input.value);
      else set.delete(input.value);
      answers[q.id] = [...set];
    } else if (q.kind === 'counter') {
      setCounter(q, Number(input.value));
      return;
    }
    update();
  });

  function setCounter(q: CalcQuestion, value: number) {
    if (!service) return;
    const min = includedUnits(service, answers);
    const max = (q.customAbove ?? 999) + 1;
    answers[q.id] = Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : min)));
    update();
  }

  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-dec], [data-inc]');
    if (!btn || !service) return;
    const q = service.questions.find((x) => x.id === btn.closest<HTMLElement>('[data-question]')?.dataset.question);
    if (!q) return;
    setCounter(q, Number(answers[q.id] ?? 0) + (btn.hasAttribute('data-inc') ? 1 : -1));
  });

  // Число в полі лічильника: рахуємо одразу, обмеження — коли поле втрачає фокус
  root.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.type !== 'number' || !service) return;
    const q = service.questions.find((x) => x.id === input.closest<HTMLElement>('[data-question]')?.dataset.question);
    const n = Number(input.value);
    if (!q || !Number.isFinite(n) || input.value === '') return;
    answers[q.id] = Math.max(includedUnits(service, answers), Math.round(n));
    result = calculate(serviceId!, answers);
    renderSummary();
  });

  els.restart.addEventListener('click', () => {
    selectService(null);
    wizardIndex = 0;
    shown = { low: 0, high: 0 };
    renderWizard();
    root.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    els.serviceInputs[0]?.focus({ preventScroll: true });
  });

  els.back.addEventListener('click', () => goWizard(-1));
  els.next.addEventListener('click', () => {
    const atLast = wizardIndex >= visibleQuestions().length - 1;
    if (atLast) track('calc_result', serviceId ?? undefined);
    goWizard(1);
  });
  els.bar.querySelector('[data-bar-link]')?.addEventListener('click', (e) => {
    if (!root.classList.contains('is-wizard')) return;
    e.preventDefault();
    wizardIndex = visibleQuestions().length;
    goWizard(0);
  });

  /* ---------- Передача у форму запиту ---------- */

  function estimateText(): string {
    if (!result || !serviceId) return '';
    const rows = [`${t.estimate.service}: ${t.services[serviceId].title}`];
    for (const line of result.lines) {
      const [name, amount] = lineText(serviceId, line);
      rows.push(line.kind === 'base' || result.custom ? name : `${name} (${amount})`);
    }
    rows.push(`${t.estimate.total}: ${result.custom ? t.summary.custom : `${rangeText(result.low, result.high)} ${t.summary.tax}`}`);
    return rows.join('\n');
  }

  function toBase64(s: string) {
    const bytes = new TextEncoder().encode(s);
    let bin = '';
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
  }

  els.exact?.addEventListener('click', () => {
    if (!serviceId || !els.exact) return;
    const payload = { service: serviceId, answers, text: estimateText() };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* приватний режим: лишається параметр в адресі */
    }
    const [path, hash] = exactHref.split('#');
    els.exact.href = `${path}?estimate=${encodeURIComponent(toBase64(JSON.stringify({ service: serviceId, text: payload.text })))}${hash ? `#${hash}` : ''}`;
    track('calc_to_form', serviceId);
  });
  els.call?.addEventListener('click', () => track('calc_to_call', serviceId ?? undefined));

  /* ---------- Старт ---------- */

  window.addEventListener('scroll', () => requestAnimationFrame(stepFromScroll), { passive: true });
  phone.addEventListener('change', renderWizard);

  const fromUrl = new URLSearchParams(location.search).get('service');
  const preset = (serviceIds as readonly string[]).includes(fromUrl ?? '') ? (fromUrl as ServiceId) : (root.dataset.service as ServiceId | undefined);
  selectService(preset && (serviceIds as readonly string[]).includes(preset) ? preset : null);
  root.classList.add('is-ready');
}
