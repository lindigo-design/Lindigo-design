/**
 * Кнопка (src/components/Button.astro) як HTML-розмітка + її поведінка з того самого компонента:
 * коло градієнта від курсора і блокування кліку у вимкненої кнопки (aria-disabled).
 */
import arrowOnGold from '../../src/assets/hero/arrow-cta-dark.svg';
import arrowOnIndigo from '../../src/assets/hero/arrow-cta-light.svg';
import { useStyles } from './astro.js';

export function buttonHtml({ label = 'Обговорити проєкт', variant = 'primary', size = 'md', href = '#', disabled = false, describedBy, type = 'button' } = {}) {
  const tag = href ? 'a' : 'button';
  const attrs = [];
  if (href) attrs.push(disabled ? 'role="link" tabindex="0"' : `href="${href}"`);
  else attrs.push(`type="${type}"`);
  if (disabled) attrs.push('aria-disabled="true"');
  if (describedBy) attrs.push(`aria-describedby="${describedBy}"`);
  const cls = ['btn', `btn--${variant}`, `btn--${size}`, variant === 'secondary' ? 'ring-hover' : ''].filter(Boolean).join(' ');
  const fill = variant === 'primary' ? '<span class="btn__fill" aria-hidden="true"></span>' : '';
  const arrow =
    variant === 'primary'
      ? `<span class="btn__arrow" aria-hidden="true"><img src="${arrowOnGold}" width="18" height="18" alt="" data-theme-only="dark" /><img src="${arrowOnIndigo}" width="18" height="18" alt="" data-theme-only="light" /></span>`
      : '';
  return `<${tag} ${attrs.join(' ')} class="${cls}" data-btn>${fill}<span class="btn__label">${label}</span>${arrow}</${tag}>`;
}

function placeFill(btn, clientX, clientY) {
  const r = btn.getBoundingClientRect();
  const x = clientX - r.left;
  const y = clientY - r.top;
  const radius = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
  btn.style.setProperty('--x', `${x}px`);
  btn.style.setProperty('--y', `${y}px`);
  btn.style.setProperty('--r', `${Math.ceil(radius) + 1}px`);
}

/** Та сама поведінка, що в <script> Button.astro */
export function initButtons(root) {
  root.querySelectorAll('[data-btn]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // у Storybook посилання нікуди не ведуть
      if (btn.getAttribute('aria-disabled') === 'true') e.stopImmediatePropagation();
    });
    btn.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') placeFill(btn, e.clientX, e.clientY);
    });
    btn.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') placeFill(btn, e.clientX, e.clientY);
    });
    btn.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || btn.getAttribute('aria-disabled') === 'true') return;
      placeFill(btn, e.clientX, e.clientY);
      btn.classList.add('is-pressed');
    });
    const release = () => window.setTimeout(() => btn.classList.remove('is-pressed'), 350);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('focus', () => {
      btn.style.removeProperty('--x');
      btn.style.removeProperty('--y');
      btn.style.removeProperty('--r');
    });
  });
}

/** Обгортка для історії: стилі + розмітка + поведінка */
export function renderButtons(markup) {
  useStyles('Button');
  const root = document.createElement('div');
  root.className = 'sb-row';
  root.innerHTML = markup;
  initButtons(root);
  return root;
}
