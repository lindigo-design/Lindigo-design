import { directionPaths, menuPaths } from '../i18n/ui';
import { featuredWorks } from './featured';
import { uiuxProjects } from './uiux-projects';

/**
 * Сторінки, на які вже ведуть посилання, але яких ще немає. Для кожної мови збирається заглушка (StubPage),
 * щоб не було 404. Коли справжня сторінка готова — прибери її шлях звідси.
 */
export const stubPaths: string[] = [
  ...new Set([
    ...menuPaths,
    ...directionPaths.filter((p) => p !== '/services/ui-ux/'), // сторінка UI/UX готова: src/pages/services/ui-ux.astro
    ...featuredWorks.map((w) => `/realisations/${w.slug}/`),
    ...uiuxProjects.map((p) => `/realisations/${p.slug}/`),
    '/mentions-legales/',
    '/confidentialite/',
  ]),
];

/** "/services/ui-ux/" → "services/ui-ux" (параметр [...stub]) */
export const stubParams = () => stubPaths.map((p) => ({ params: { stub: p.replace(/^\/|\/$/g, '') } }));
