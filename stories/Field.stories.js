import { useStyles } from './lib/astro.js';

/**
 * Поле форми — `src/components/Field.astro`: підпис, поле, підказка й текст помилки під полем.
 *
 * Стани: наведення (обводка кольору тексту), фокус (контур :focus-visible + акцентна обводка),
 * вимкнене (атрибут disabled), помилка (колір `--danger`, `aria-invalid`, текст помилки через `aria-describedby`).
 */
function fieldHtml({ id, label, type = 'text', value = '', placeholder = '', hint = '', error = '', disabled = false }) {
  const hintId = hint ? `${id}-hint` : '';
  const errorId = error ? `${id}-error` : '';
  const describedBy = [hintId, errorId].filter(Boolean).join(' ');
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    'class="field__control"',
    placeholder && `placeholder="${placeholder}"`,
    disabled && 'disabled',
    error && 'aria-invalid="true"',
    describedBy && `aria-describedby="${describedBy}"`,
  ]
    .filter(Boolean)
    .join(' ');
  const control = type === 'textarea' ? `<textarea ${attrs} rows="5">${value}</textarea>` : `<input ${attrs} type="${type}" value="${value}" />`;
  const cls = ['field', error && 'field--error', disabled && 'field--disabled'].filter(Boolean).join(' ');
  return `<div class="${cls}">
    <label class="field__label" for="${id}">${label}</label>
    ${control}
    ${hint ? `<p class="field__hint" id="${hintId}">${hint}</p>` : ''}
    ${error ? `<p class="field__error" id="${errorId}">${error}</p>` : ''}
  </div>`;
}

function render(markup) {
  useStyles('Field');
  const form = document.createElement('form');
  form.noValidate = true;
  form.className = 'sb-stack';
  form.style.maxWidth = '560px';
  form.innerHTML = markup;
  form.addEventListener('submit', (e) => e.preventDefault());
  return form;
}

export default {
  title: 'Компоненти/Поле форми',
  tags: ['autodocs'],
  render: (args) => render(fieldHtml({ id: 'field', ...args })),
  argTypes: {
    label: { control: 'text' },
    type: { control: 'inline-radio', options: ['text', 'email', 'tel', 'textarea'] },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text', description: 'Підказка під полем' },
    error: { control: 'text', description: 'Текст помилки: є — поле в стані помилки' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Ім’я', type: 'text', value: '', placeholder: 'Як до вас звертатися', hint: '', error: '', disabled: false },
};

export const Default = { name: 'Звичайне' };

export const WithHint = { name: 'З підказкою', args: { label: 'Email', type: 'email', placeholder: 'name@example.com', hint: 'На цю адресу надішлемо відповідь.' } };

export const WithError = {
  name: 'Помилка',
  args: { label: 'Email', type: 'email', value: 'anna@', hint: 'На цю адресу надішлемо відповідь.', error: 'Перевірте адресу: у ній бракує домену, наприклад @gmail.com.' },
};

export const Disabled = { name: 'Вимкнене', args: { label: 'Телефон', type: 'tel', value: '+33 6 00 00 00 00', disabled: true, hint: 'Поле вимкнене.' } };

export const Textarea = { name: 'Багаторядкове', args: { label: 'Повідомлення', type: 'textarea', placeholder: 'Розкажіть про проєкт' } };
