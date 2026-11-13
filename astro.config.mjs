// @ts-check
import { defineConfig } from 'astro/config';

// Тимчасова копія для перегляду на GitHub Pages: збірка з PUBLIC_PREVIEW=true
// (див. .github/workflows/deploy.yml). Без цієї змінної — справжній домен, без base.
const preview = process.env.PUBLIC_PREVIEW === 'true';

// Основна мова — французька, за кореневою адресою. Англійська й українська — /en/ і /uk/.
export default defineConfig({
  site: preview ? 'https://lindigo-design.github.io' : 'https://lindigo-design.com',
  ...(preview ? { base: '/Lindigo-design' } : {}),
  i18n: {
    locales: ['fr', 'en', 'uk'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
