/**
 * Тестові ціни калькулятора (draft: true у src/data/calculator.ts).
 * Перед запуском калькулятора список має бути порожнім. Запуск: npm run calc:drafts
 */
import { listDrafts } from '../src/data/calculator.ts';

const drafts = listDrafts();
if (drafts.length === 0) {
  console.log('Чернеток немає: усі ціни з таблиці.');
} else {
  console.log(`Тестові ціни (${drafts.length}) — замінити цінами з таблиці перед запуском:`);
  for (const d of drafts) console.log(`  • ${d}`);
}
