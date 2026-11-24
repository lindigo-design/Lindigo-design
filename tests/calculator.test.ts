/**
 * Перевірка функції розрахунку калькулятора (специфікація, розділ 13).
 * Запуск: npm run test:calc (Node 24 сам читає TypeScript).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, defaultAnswers, getService, roundTo, type Answers, type ServiceId } from '../src/data/calculator.ts';

function run(service: ServiceId, patch: Answers) {
  const answers = { ...defaultAnswers(getService(service)!), ...patch };
  return calculate(service, answers);
}

const range = (r: ReturnType<typeof calculate>) => [r.low, r.high];

test('UI/UX → Прототип, 10 екранів, звичайний', () => {
  assert.deepEqual(range(run('uiux', { type: 'prototype', screens: 10 })), [3200, 4000]);
});

test('UI/UX → Вебсервіс, 30 екранів (+5)', () => {
  const r = run('uiux', { type: 'webservice', screens: 30 });
  assert.equal(r.total, 11000);
  assert.deepEqual(range(r), [11000, 13750]);
});

test('UI/UX → Мобільний, 61 екран — індивідуальна оцінка', () => {
  const r = run('uiux', { type: 'mobile', screens: 61 });
  assert.equal(r.custom, true);
  assert.equal(run('uiux', { type: 'mobile', screens: 60 }).custom, false);
});

test('Сайт → Корпоративний, дизайн і розробка, 10 стор., 2 мови, тексти від студії', () => {
  const r = run('sites', { type: 'corporate', scope: 'full', pages: 10, languages: '2', copy: 'studio' });
  assert.equal(r.total, 8300);
  assert.deepEqual(range(r), [8300, 10400]);
});

test('Сайт → Візитівка, лише дизайн, 5 стор., 1 мова', () => {
  assert.deepEqual(range(run('sites', { type: 'vitrine', scope: 'design', pages: 5 })), [1900, 2400]);
});

test('Сайт → Лендинг: лічильника немає, тексти від студії +400', () => {
  const r = run('sites', { type: 'landing', pages: 7, copy: 'studio' });
  assert.equal(r.total, 1900 + 400);
});

test('Сайт → понад 20 сторінок — індивідуальна оцінка', () => {
  assert.equal(run('sites', { type: 'corporate', pages: 21 }).custom, true);
});

test('Магазин → Shopify, 50–300 товарів, 1 мова', () => {
  const r = run('shop', { platform: 'shopify', products: 'upTo300' });
  assert.equal(r.total, 6120);
  assert.deepEqual(range(r), [6100, 7650]);
});

test('Магазин → «Не знаю» рахується як Shopify з приміткою', () => {
  const r = run('shop', { platform: 'unsure' });
  assert.equal(r.advice, true);
  assert.deepEqual(range(r), [5100, 6400]);
});

test('Брендинг → Логотип + стиль + візитка', () => {
  const r = run('branding', { type: 'identity', media: ['card'] });
  assert.equal(r.total, 2750);
  assert.deepEqual(range(r), [2750, 3450]);
});

test('Брендинг → Брендбук для готового стилю', () => {
  assert.deepEqual(range(run('branding', { type: 'brandbook' })), [1750, 2200]);
});

test('Фото → Повний день', () => {
  assert.deepEqual(range(run('content', { type: 'shoot', duration: 'full' })), [1250, 1550]);
});

test('Фото → Кілька днів — індивідуальна оцінка; пакет для соцмереж не питає тривалість', () => {
  assert.equal(run('content', { type: 'shoot', duration: 'multi' }).custom, true);
  assert.deepEqual(range(run('content', { type: 'social', duration: 'multi' })), [950, 1200]);
});

test('Пріоритет: разом × 1.25, обидві межі від нової суми', () => {
  const r = run('sites', { type: 'corporate', pages: 10, languages: '2', copy: 'studio', pace: 'priority' });
  assert.equal(r.total, 8300 * 1.25);
  assert.deepEqual(range(r), [roundTo(10375), roundTo(10375 * 1.25)]);
});

test('Підтримка після запуску не входить у суму', () => {
  const r = run('sites', { type: 'landing', addons: ['support'] });
  assert.equal(r.total, 1900);
  assert.ok(r.lines.some((l) => l.kind === 'monthly'));
});

test('Друга платформа: +40 % від бази й екранів', () => {
  const r = run('uiux', { type: 'webservice', screens: 30, addons: ['platform2'] });
  assert.equal(r.total, 11000 + 4400);
});

test('Округлення до 50 €', () => {
  assert.equal(roundTo(6120), 6100);
  assert.equal(roundTo(3437.5), 3450);
  assert.equal(roundTo(1562.5), 1550);
  assert.equal(roundTo(10375), 10400);
});
