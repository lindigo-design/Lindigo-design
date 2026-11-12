// @ts-check
import { defineConfig } from 'astro/config';

// Основна мова — французька, за кореневою адресою. Англійська й українська — /en/ і /uk/.
export default defineConfig({
  site: 'https://lindigo-design.com',
  i18n: {
    locales: ['fr', 'en', 'uk'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
