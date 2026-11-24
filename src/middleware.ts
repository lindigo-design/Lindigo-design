/**
 * Title Case для заголовків h1–h3 і кнопок на всіх сторінках (src/i18n/title-case.ts).
 * Працює і в `npm run dev`, і під час статичної збірки: кожна HTML-сторінка проходить тут перед записом.
 */
import { defineMiddleware } from 'astro:middleware';
import { titleCasePage } from './i18n/title-case';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = await response.text();
  return new Response(titleCasePage(html), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
