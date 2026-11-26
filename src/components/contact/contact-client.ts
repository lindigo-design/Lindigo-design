/**
 * Форма сторінки «Контакти»: перевірка полів, файл, «Скопіювати» email, відправка на public/api/contact-request.php.
 * На прев'ю GitHub Pages PHP не працює — тоді показуємо збій із посиланням на лист із заповненим текстом (як у калькуляторі).
 */
import { titleCase, type TitleLocale } from '../../i18n/title-case';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const FILE_EXT = /\.(pdf|jpe?g|png)$/i;

interface Texts {
  sending: string;
  errName: string;
  errEmail: string;
  errConsent: string;
  errFileSize: string;
  errFileType: string;
  fileChosen: string;
  failed: string;
  subject: string;
  thanksTitle: string;
  thanksText: string;
  copy: string;
  copied: string;
  interest: Record<string, string>;
  budget: Record<string, string>;
  labels: { interest: string; budget: string; company: string; site: string };
}

const fill = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

function formatSize(bytes: number, locale: string): string {
  const mb = bytes / (1024 * 1024);
  const unit = locale === 'fr' ? 'Mo' : locale === 'uk' ? 'МБ' : 'MB';
  if (mb >= 1) return `${mb.toLocaleString(locale, { maximumFractionDigits: 1 })} ${unit}`;
  const kb = Math.max(1, Math.round(bytes / 1024));
  return `${kb} ${locale === 'fr' ? 'Ko' : locale === 'uk' ? 'КБ' : 'KB'}`;
}

export function initContact(root: HTMLElement) {
  const t = JSON.parse(root.querySelector('[data-contact-texts]')!.textContent || '{}') as Texts;
  const locale = root.dataset.locale || 'fr';
  const email = root.dataset.email || '';
  const maxBytes = Number(root.dataset.maxMb || 10) * 1024 * 1024;
  const form = root.querySelector<HTMLFormElement>('[data-contact-form]')!;
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submitLabel = submitBtn.querySelector<HTMLElement>('.btn__label')!;
  const failed = root.querySelector<HTMLElement>('[data-failed]')!;
  const failedText = root.querySelector<HTMLElement>('[data-failed-text]')!;
  const thanks = root.querySelector<HTMLElement>('[data-thanks]')!;
  const thanksTitle = root.querySelector<HTMLElement>('[data-thanks-title]')!;
  const thanksText = root.querySelector<HTMLElement>('[data-thanks-text]')!;

  /* ---------- Помилки полів (як у калькуляторі: aria-invalid + текст під полем через aria-describedby) ---------- */
  function setError(input: HTMLInputElement, message: string) {
    const wrap = input.closest<HTMLElement>('.field, .checkbox, .file-field')!;
    const err = wrap.querySelector<HTMLElement>('[data-field-error]');
    wrap.classList.toggle(wrap.classList.contains('file-field') ? 'file-field--error' : 'field--error', !!message);
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    if (!err) return;
    err.textContent = message;
    err.hidden = !message;
    const ids = new Set((input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
    if (message) ids.add(err.id);
    else ids.delete(err.id);
    if (ids.size) input.setAttribute('aria-describedby', [...ids].join(' '));
    else input.removeAttribute('aria-describedby');
  }

  const nameOk = () => !!field('name').value.trim();
  const emailOk = () => EMAIL_RE.test(field('email').value.trim());
  const consentOk = () => field('consent').checked;

  // помилка зникає, щойно поле виправлено
  field('name').addEventListener('input', () => nameOk() && setError(field('name'), ''));
  field('email').addEventListener('input', () => emailOk() && setError(field('email'), ''));
  field('consent').addEventListener('change', () => consentOk() && setError(field('consent'), ''));

  /* ---------- Файл ---------- */
  const fileInput = field('attachment');
  const chosen = root.querySelector<HTMLElement>('[data-file-chosen]')!;
  const chosenName = chosen.querySelector<HTMLElement>('[data-file-name]')!;
  let fileError = '';

  function checkFile() {
    const file = fileInput.files?.[0];
    fileError = !file ? '' : !(FILE_TYPES.includes(file.type) || FILE_EXT.test(file.name)) ? t.errFileType : file.size > maxBytes ? t.errFileSize : '';
    setError(fileInput, fileError);
    chosen.hidden = !file;
    chosenName.textContent = file ? fill(t.fileChosen, { name: file.name, size: formatSize(file.size, locale) }) : '';
  }
  fileInput.addEventListener('change', checkFile);
  chosen.querySelector('[data-file-remove]')!.addEventListener('click', () => {
    fileInput.value = '';
    checkFile();
    fileInput.focus();
  });

  /* ---------- «Скопіювати» email ---------- */
  const copyWrap = root.parentElement!.querySelector<HTMLElement>('[data-copy]');
  const copyStatus = root.parentElement!.querySelector<HTMLElement>('[data-copy-status]');
  const copyBtn = copyWrap?.querySelector<HTMLButtonElement>('button');
  const copyLabel = copyBtn?.querySelector<HTMLElement>('.btn__label');
  let copyTimer = 0;
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyWrap!.dataset.copy || email);
    } catch {
      return; // без доступу до буфера: адреса лишається посиланням поруч
    }
    if (copyLabel) copyLabel.textContent = titleCase(t.copied, locale as TitleLocale);
    if (copyStatus) copyStatus.textContent = t.copied;
    clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => {
      if (copyLabel) copyLabel.textContent = titleCase(t.copy, locale as TitleLocale);
      if (copyStatus) copyStatus.textContent = '';
    }, 2000);
  });

  /* ---------- Текст листа (для запасного варіанта і для листа з сервера) ---------- */
  function summary(): string {
    const data = new FormData(form);
    const interest = data.getAll('interest[]').map((v) => t.interest[String(v)] ?? String(v));
    const budget = data.get('budget');
    const lines = [
      `${field('name').value.trim()} <${field('email').value.trim()}>`,
      field('company').value.trim() && `${t.labels.company}: ${field('company').value.trim()}`,
      field('site').value.trim() && `${t.labels.site}: ${field('site').value.trim()}`,
      interest.length ? `${t.labels.interest}: ${interest.join(', ')}` : '',
      budget ? `${t.labels.budget}: ${t.budget[String(budget)] ?? budget}` : '',
      '',
      field('message').value.trim(),
    ];
    return lines.filter((l, i) => l !== '' || i === 5).join('\n').trim();
  }

  function mailtoHref(): string {
    const subject = fill(t.subject, { name: field('name').value.trim() });
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary())}`;
  }

  function showFailed(show: boolean) {
    failed.hidden = !show;
    if (!show) {
      failedText.replaceChildren();
      return;
    }
    const [before, after] = t.failed.split('{email}');
    const link = document.createElement('a');
    link.href = mailtoHref();
    link.textContent = email;
    failedText.replaceChildren(before ?? '', link, after ?? '');
  }

  /* ---------- Відправка ---------- */
  function validate(): boolean {
    setError(field('name'), nameOk() ? '' : t.errName);
    setError(field('email'), emailOk() ? '' : t.errEmail);
    setError(field('consent'), consentOk() ? '' : t.errConsent);
    const firstBad = !nameOk() ? field('name') : !emailOk() ? field('email') : fileError ? fileInput : !consentOk() ? field('consent') : null;
    firstBad?.focus();
    return !firstBad;
  }

  let sending = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    showFailed(false);
    if (!validate()) return;

    // посилання на сайт без https:// доповнюємо самі
    const site = field('site');
    const url = site.value.trim();
    if (url && !/^https?:\/\//i.test(url)) site.value = `https://${url}`;

    const data = new FormData(form);
    data.set('name', field('name').value.trim());
    data.set('email', field('email').value.trim());
    data.set('summary', summary());
    data.set('subject', fill(t.subject, { name: field('name').value.trim() }));
    data.set('locale', locale);
    data.set('page', location.href);
    if (!fileInput.files?.length) data.delete('attachment');

    sending = true;
    const label = submitLabel.textContent;
    submitLabel.textContent = t.sending;
    submitBtn.setAttribute('aria-disabled', 'true');
    let ok = false;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 30000);
      const res = await fetch(root.dataset.endpoint || '', { method: 'POST', body: data, signal: ctrl.signal, headers: { Accept: 'application/json' } });
      clearTimeout(timer);
      const json = res.ok ? ((await res.json().catch(() => null)) as { ok?: boolean } | null) : null;
      ok = !!json?.ok;
    } catch {
      ok = false;
    }
    sending = false;
    submitLabel.textContent = label;
    submitBtn.removeAttribute('aria-disabled');

    if (!ok) {
      showFailed(true);
      return;
    }

    // подяка на місці форми
    const vars = { name: field('name').value.trim(), email: field('email').value.trim() };
    thanksTitle.textContent = titleCase(fill(t.thanksTitle, vars), locale as TitleLocale);
    thanksText.textContent = fill(t.thanksText, vars);
    form.hidden = true;
    thanks.hidden = false;
    thanksTitle.focus();
  });
}
