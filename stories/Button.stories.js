import { buttonHtml, renderButtons } from './lib/button.js';

/**
 * Кнопка — `src/components/Button.astro`.
 *
 * Стани: наведення (коло градієнта від курсора / градієнтне кільце), фокус з клавіатури
 * (видимий контур :focus-visible), натискання, вимкнена (`aria-disabled` + пояснення через `aria-describedby`).
 */
export default {
  title: 'Компоненти/Кнопка',
  tags: ['autodocs'],
  render: (args) => {
    const note = args.disabled ? '<p class="sb-note" id="btn-note">Кнопка стане активною, коли всі поля заповнені.</p>' : '';
    const root = renderButtons(buttonHtml({ ...args, describedBy: args.disabled ? 'btn-note' : undefined }) + note);
    return root;
  },
  argTypes: {
    label: { control: 'text', description: 'Текст кнопки' },
    variant: { control: 'inline-radio', options: ['primary', 'secondary'], description: 'primary — залита зі стрілкою, secondary — з обводкою' },
    size: { control: 'inline-radio', options: ['md', 'sm'], description: 'md — 56 px, sm — 48 px' },
    href: { control: 'text', description: 'Є — посилання <a>; порожньо — <button>' },
    disabled: { control: 'boolean', description: 'Вимкнена: aria-disabled="true", не атрибут disabled' },
  },
  args: { label: 'Обговорити проєкт', variant: 'primary', size: 'md', href: '#', disabled: false },
};

export const Primary = { name: 'Основна' };

export const Secondary = { name: 'Друга', args: { variant: 'secondary', label: 'Наші роботи' } };

export const Small = { name: 'Мала (шапка)', args: { size: 'sm', label: 'Зв’язатися' } };

export const Disabled = { name: 'Вимкнена', args: { disabled: true, label: 'Надіслати', href: '' } };

/** Усі стани поруч. Наведіть мишею, пройдіть клавішею Tab — контур фокусу видно і на вимкнених. */
export const AllStates = {
  name: 'Усі стани',
  render: () =>
    renderButtons(`
      <div class="sb-stack">
        <div class="sb-row">
          ${buttonHtml({ label: 'Основна' })}
          ${buttonHtml({ label: 'Друга', variant: 'secondary' })}
          ${buttonHtml({ label: 'Кнопка форми', href: '', type: 'submit' })}
          ${buttonHtml({ label: 'Мала', size: 'sm' })}
        </div>
        <div class="sb-row">
          ${buttonHtml({ label: 'Основна, вимкнена', disabled: true, describedBy: 'all-note' })}
          ${buttonHtml({ label: 'Друга, вимкнена', variant: 'secondary', disabled: true, describedBy: 'all-note' })}
          ${buttonHtml({ label: 'Надіслати', href: '', type: 'submit', disabled: true, describedBy: 'all-note' })}
        </div>
        <p class="sb-note" id="all-note">Кнопка стане активною, коли всі поля заповнені.</p>
      </div>`),
};
