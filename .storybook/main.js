/**
 * Storybook — демонстрація компонентів і токенів дизайн-системи (HTML-компоненти, без фреймворку).
 * Стилі беруться з тих самих файлів, що й на сайті: src/styles/global.css і <style> з .astro.
 * Збирається разом із сайтом у dist/storybook (npm run build), тож відкривається як окрема сторінка /storybook/.
 * Щоб прибрати: видалити .storybook/, stories/, скрипти storybook у package.json і пакети storybook.
 */
/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/html-vite', options: {} },
  core: { disableTelemetry: true },
};

export default config;
