import '../src/styles/global.css';
import './preview.css';

/** Перемикач теми на панелі Storybook: темна (:root) і світла (data-theme="light"), як на сайті */
const preview = {
  globalTypes: {
    theme: {
      description: 'Тема сайту',
      toolbar: {
        title: 'Тема',
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'Темна' },
          { value: 'light', title: 'Світла' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme ?? 'dark';
      if (theme === 'light') document.documentElement.dataset.theme = 'light';
      else delete document.documentElement.dataset.theme;
      return story();
    },
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    options: {
      storySort: { order: ['Вступ', 'Токени', 'Компоненти'] },
    },
  },
};

export default preview;
