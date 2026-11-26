/**
 * Тексти сторінки «Контакти» (/contact/). Figma «UI дизайн»: «Контакти — UI (темна)» 450:5297, «(світла)» 453:6272.
 * UK — з макета. FR і EN — переклад (Claude, 26.11.2026, з дозволу Яни), на вичитку.
 *
 * Плейсхолдери: {name}, {email}, {size}.
 * Нерозривні пробіли (N): перед « : ; ? ! » і всередині « » у французькій, між числом і словом.
 * Вузький нерозривний пробіл (T) — між тисячами в сумах (як у калькуляторі).
 */
import type { Locale } from './ui';

const N = ' ';
const T = ' ';

/** Контакти студії, однакові для всіх мов */
export const contactInfo = {
  email: 'contact@lindigo-design.com',
  /** Telegram: нік без @. Поки порожній — рядка «Месенджер» на сторінці немає */
  telegram: '',
  /** PHP-скрипт форми (працює на Hostinger; на прев'ю GitHub Pages — запасний варіант із листом) */
  endpoint: 'api/contact-request.php',
  /** Найбільший файл у вкладенні, МБ */
  maxFileMb: 10,
  fileAccept: '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png',
};

export interface ContactText {
  meta: { title: string; description: string };
  hero: {
    crumbs: [string, string];
    crumbsLabel: string;
    title: string;
    lead: string;
    /** Речення з посиланням на калькулятор після опису: «{before} <a>{link}</a>{after}» */
    calc: { before: string; link: string; after: string };
  };
  form: {
    eyebrow: string;
    title: string;
    lead: string;
    interest: { title: string; hint: string; options: { value: string; label: string }[] };
    name: string;
    email: string;
    company: string;
    site: string;
    budget: { title: string; hint: string; options: { value: string; label: string }[] };
    message: string;
    messagePlaceholder: string;
    file: string;
    fileChosen: string;
    fileRemove: string;
    consent: string;
    privacy: string;
    submit: string;
    sending: string;
    note: string;
    errName: string;
    errEmail: string;
    errConsent: string;
    errFileSize: string;
    errFileType: string;
    failedTitle: string;
    /** {email} — посилання на лист із заповненим текстом */
    failed: string;
    subject: string;
  };
  thanks: { title: string; text: string; works: string };
  aside: {
    title: string;
    email: string;
    copy: string;
    copied: string;
    messenger: string;
    social: string;
    where: string;
    place: string;
    world: string;
    languages: string;
    languagesList: string;
    newTab: string;
  };
  next: { eyebrow: string; title: string; lead: string; items: { title: string; text: string }[] };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
}

const uk: ContactText = {
  meta: {
    title: 'Контакти — Lindigo Design Studio',
    description: 'Розкажіть про проєкт у формі. Ми прочитаємо особисто і відповімо протягом двох робочих днів.',
  },
  hero: {
    crumbs: ['Головна', 'Контакти'],
    crumbsLabel: 'Хлібні крихти',
    title: 'Обговоримо ваш проєкт',
    lead: 'Розкажіть про проєкт у формі нижче. Ми прочитаємо особисто і відповімо протягом двох робочих днів.',
    calc: { before: 'Хочете спершу дізнатися ціну — є ', link: 'калькулятор', after: '.' },
  },
  form: {
    eyebrow: 'Написати нам',
    title: 'Розкажіть про проєкт',
    lead: 'Обов’язкові лише ім’я та email. Решта допоможе нам підготуватися до розмови.',
    interest: {
      title: 'Мене цікавить',
      hint: 'Можна обрати кілька.',
      options: [
        { value: 'uiux', label: 'UI/UX і прототипи' },
        { value: 'site', label: 'Сайт' },
        { value: 'shop', label: 'Інтернет-магазин' },
        { value: 'branding', label: 'Брендинг і логотип' },
        { value: 'photo', label: 'Фото й контент' },
        { value: 'unsure', label: 'Ще не знаю' },
      ],
    },
    name: 'Ім’я',
    email: 'Email',
    company: 'Компанія',
    site: 'Посилання на ваш сайт',
    budget: {
      title: 'Орієнтовний бюджет',
      hint: `Необов’язково. Якщо не знаєте, оберіть «Ще не${N}знаю».`,
      options: [
        { value: 'lt2000', label: `До 2${T}000${N}€` },
        { value: '2000-5000', label: `2${T}000–5${T}000${N}€` },
        { value: '5000-10000', label: `5${T}000–10${T}000${N}€` },
        { value: 'gt10000', label: `Понад 10${T}000${N}€` },
        { value: 'unsure', label: 'Ще не знаю' },
      ],
    },
    message: 'Повідомлення',
    messagePlaceholder: 'Розкажіть про проєкт: що ви робите, для кого, що вже є і що хочете змінити',
    file: `Додати файл: бриф, презентація або приклади, які вам подобаються. PDF, JPG, PNG, до 10${N}МБ.`,
    fileChosen: 'Файл: {name} ({size})',
    fileRemove: 'Прибрати файл',
    consent: 'Я погоджуюсь, що студія збереже мої дані, щоб відповісти на запит.',
    privacy: 'Політика конфіденційності',
    submit: 'Надіслати запит',
    sending: 'Надсилаємо…',
    note: 'Кожен запит ми читаємо особисто і відповідаємо протягом двох робочих днів.',
    errName: 'Напишіть, як до вас звертатися.',
    errEmail: 'Перевірте email: схоже, в ньому помилка.',
    errConsent: 'Поставте позначку, щоб ми могли зберегти ваші дані й відповісти.',
    errFileSize: `Файл більший за 10${N}МБ. Оберіть менший або додайте посилання в повідомлення.`,
    errFileType: 'Підходять лише PDF, JPG і PNG.',
    failedTitle: 'Не вдалося надіслати запит',
    failed: 'Ваші відповіді збереглися. Спробуйте ще раз або напишіть нам на {email}.',
    subject: 'Запит із сайту: {name}',
  },
  thanks: {
    title: 'Дякуємо, {name}! Запит у нас.',
    text: 'Ми прочитаємо його і відповімо протягом двох робочих днів на {email}. Якщо лист не прийде, перевірте папку «Спам».',
    works: 'Подивитися наші роботи',
  },
  aside: {
    title: 'Інші способи',
    email: 'Email',
    copy: 'Скопіювати',
    copied: 'Скопійовано',
    messenger: 'Месенджер',
    social: 'Соцмережі',
    where: 'Де ми',
    place: 'Нормандія, Франція',
    world: 'Працюємо з клієнтами з усього світу',
    languages: 'Мови',
    languagesList: 'Français · English · Українська',
    newTab: 'відкриється в новій вкладці',
  },
  next: {
    eyebrow: 'Що далі',
    title: 'Що буде після запиту',
    lead: 'Три кроки. Ви ні до чого не зобов’язані, доки не погодите пропозицію.',
    items: [
      { title: 'Відповідь', text: 'Протягом двох робочих днів. Пише людина, а не робот.' },
      { title: 'Дзвінок 30 хвилин', text: 'Безкоштовно. Розпитуємо про задачу, ваших клієнтів і бажані строки.' },
      { title: 'Пропозиція', text: 'Що зробимо, скільки це коштує і скільки часу займе. Рішення за вами.' },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Часті питання',
    items: [
      { q: 'Що підготувати до дзвінка?', a: 'Нічого складного. Розкажіть, чим займаєтесь і що хочете отримати. Якщо є сайт, приклади або бриф — надішліть посилання.' },
      { q: 'Перший дзвінок платний?', a: 'Ні, він безкоштовний. 30 хвилин, щоб зрозуміти задачу і чи підходимо ми одне одному.' },
      { q: 'Я не знаю свій бюджет. Це проблема?', a: `Ні. Оберіть «Ще не${N}знаю». На дзвінку розкажемо, від чого залежить ціна, і запропонуємо кілька варіантів обсягу.` },
      { q: 'Якими мовами ви працюєте? З якими країнами?', a: 'Французькою, англійською та українською. Працюємо з клієнтами з будь-якої країни: зустрічі онлайн, документи французькою або англійською.' },
      { q: 'Ви підписуєте NDA?', a: 'Так. Якщо проєкт конфіденційний, підпишемо угоду про нерозголошення ще до того, як ви розкажете деталі.' },
    ],
  },
};

const fr: ContactText = {
  meta: {
    title: 'Contact — Lindigo Design Studio',
    description: `Parlez-nous de votre projet dans le formulaire. Nous le lisons personnellement et répondons sous deux jours${N}ouvrés.`,
  },
  hero: {
    crumbs: ['Accueil', 'Contact'],
    crumbsLabel: 'Fil d’Ariane',
    title: 'Parlons de votre projet',
    lead: `Parlez-nous de votre projet dans le formulaire ci-dessous. Nous le lirons personnellement et vous répondrons sous deux jours${N}ouvrés.`,
    calc: { before: `Vous voulez d’abord connaître le prix${N}? Essayez le `, link: 'calculateur', after: '.' },
  },
  form: {
    eyebrow: 'Nous écrire',
    title: 'Parlez-nous de votre projet',
    lead: 'Seuls le nom et l’e-mail sont obligatoires. Le reste nous aide à préparer notre échange.',
    interest: {
      title: 'Ce qui m’intéresse',
      hint: 'Plusieurs choix possibles.',
      options: [
        { value: 'uiux', label: 'UI/UX et prototypes' },
        { value: 'site', label: 'Site web' },
        { value: 'shop', label: 'Boutique en ligne' },
        { value: 'branding', label: 'Branding et logo' },
        { value: 'photo', label: 'Photo et contenu' },
        { value: 'unsure', label: 'Je ne sais pas encore' },
      ],
    },
    name: 'Nom',
    email: 'E-mail',
    company: 'Entreprise',
    site: 'Lien vers votre site',
    budget: {
      title: 'Budget approximatif',
      hint: `Facultatif. Si vous ne savez pas, choisissez «${N}Je ne sais pas encore${N}».`,
      options: [
        { value: 'lt2000', label: `Moins de 2${T}000${N}€` },
        { value: '2000-5000', label: `2${T}000–5${T}000${N}€` },
        { value: '5000-10000', label: `5${T}000–10${T}000${N}€` },
        { value: 'gt10000', label: `Plus de 10${T}000${N}€` },
        { value: 'unsure', label: 'Je ne sais pas encore' },
      ],
    },
    message: 'Message',
    messagePlaceholder: `Parlez-nous de votre projet${N}: ce que vous faites, pour qui, ce qui existe déjà et ce que vous voulez changer`,
    file: `Ajouter un fichier${N}: brief, présentation ou exemples qui vous plaisent. PDF, JPG, PNG, 10${N}Mo maximum.`,
    fileChosen: `Fichier${N}: {name} ({size})`,
    fileRemove: 'Retirer le fichier',
    consent: 'J’accepte que le studio conserve mes données pour répondre à ma demande.',
    privacy: 'Politique de confidentialité',
    submit: 'Envoyer la demande',
    sending: 'Envoi…',
    note: `Nous lisons chaque demande personnellement et répondons sous deux jours${N}ouvrés.`,
    errName: 'Indiquez votre nom.',
    errEmail: `Vérifiez l’e-mail${N}: il semble contenir une erreur.`,
    errConsent: 'Cochez la case pour que nous puissions conserver vos données et vous répondre.',
    errFileSize: `Le fichier dépasse 10${N}Mo. Choisissez-en un plus léger ou ajoutez un lien dans le message.`,
    errFileType: 'Seuls les fichiers PDF, JPG et PNG sont acceptés.',
    failedTitle: 'La demande n’a pas pu être envoyée',
    failed: 'Vos réponses sont conservées. Réessayez ou écrivez-nous à {email}.',
    subject: `Demande depuis le site${N}: {name}`,
  },
  thanks: {
    title: `Merci, {name}${N}! Nous avons bien reçu votre demande.`,
    text: `Nous la lirons et vous répondrons sous deux jours ouvrés à {email}. Si vous ne recevez rien, vérifiez vos courriers indésirables.`,
    works: 'Voir nos réalisations',
  },
  aside: {
    title: 'Autres moyens',
    email: 'E-mail',
    copy: 'Copier',
    copied: 'Copié',
    messenger: 'Messagerie',
    social: 'Réseaux',
    where: 'Où nous trouver',
    place: 'Normandie, France',
    world: 'Nous travaillons avec des clients du monde entier',
    languages: 'Langues',
    languagesList: 'Français · English · Українська',
    newTab: 's’ouvre dans un nouvel onglet',
  },
  next: {
    eyebrow: 'Et ensuite',
    title: 'Ce qui se passe après votre demande',
    lead: 'Trois étapes. Vous ne vous engagez à rien tant que vous n’avez pas accepté la proposition.',
    items: [
      { title: 'Réponse', text: 'Sous deux jours ouvrés. C’est une personne qui vous écrit, pas un robot.' },
      { title: 'Appel de 30 minutes', text: 'Gratuit. Nous parlons de votre projet, de vos clients et des délais souhaités.' },
      { title: 'Proposition', text: 'Ce que nous ferons, combien cela coûte et combien de temps cela prendra. La décision vous appartient.' },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions fréquentes',
    items: [
      { q: `Que dois-je préparer pour l’appel${N}?`, a: 'Rien de compliqué. Dites-nous ce que vous faites et ce que vous souhaitez obtenir. Si vous avez un site, des exemples ou un brief, envoyez-nous le lien.' },
      { q: `Le premier appel est-il payant${N}?`, a: 'Non, il est gratuit. 30 minutes pour comprendre votre besoin et voir si nous sommes faits pour travailler ensemble.' },
      { q: `Je ne connais pas mon budget. Est-ce un problème${N}?`, a: `Non. Choisissez «${N}Je ne sais pas encore${N}». Pendant l’appel, nous vous expliquerons de quoi dépend le prix et vous proposerons plusieurs options.` },
      { q: `Dans quelles langues travaillez-vous${N}? Avec quels pays${N}?`, a: `En français, en anglais et en ukrainien. Nous travaillons avec des clients de tous les pays${N}: réunions en ligne, documents en français ou en anglais.` },
      { q: `Signez-vous un accord de confidentialité (NDA)${N}?`, a: 'Oui. Si le projet est confidentiel, nous signons un accord de confidentialité avant que vous nous donniez les détails.' },
    ],
  },
};

const en: ContactText = {
  meta: {
    title: 'Contact — Lindigo Design Studio',
    description: 'Tell us about your project in the form. We read every request personally and reply within two business days.',
  },
  hero: {
    crumbs: ['Home', 'Contact'],
    crumbsLabel: 'Breadcrumbs',
    title: 'Let’s talk about your project',
    lead: 'Tell us about your project in the form below. We’ll read it personally and reply within two business days.',
    calc: { before: 'Want to know the price first? Try the ', link: 'calculator', after: '.' },
  },
  form: {
    eyebrow: 'Write to us',
    title: 'Tell us about your project',
    lead: 'Only your name and email are required. The rest helps us prepare for the conversation.',
    interest: {
      title: 'I’m interested in',
      hint: 'You can choose several.',
      options: [
        { value: 'uiux', label: 'UI/UX and prototypes' },
        { value: 'site', label: 'Website' },
        { value: 'shop', label: 'Online store' },
        { value: 'branding', label: 'Branding and logo' },
        { value: 'photo', label: 'Photo and content' },
        { value: 'unsure', label: 'Not sure yet' },
      ],
    },
    name: 'Name',
    email: 'Email',
    company: 'Company',
    site: 'Link to your website',
    budget: {
      title: 'Approximate budget',
      hint: 'Optional. If you don’t know, choose “Not sure yet”.',
      options: [
        { value: 'lt2000', label: 'Under €2,000' },
        { value: '2000-5000', label: '€2,000–5,000' },
        { value: '5000-10000', label: '€5,000–10,000' },
        { value: 'gt10000', label: 'Over €10,000' },
        { value: 'unsure', label: 'Not sure yet' },
      ],
    },
    message: 'Message',
    messagePlaceholder: 'Tell us about your project: what you do, who it’s for, what already exists and what you want to change',
    file: `Add a file: a brief, a presentation or examples you like. PDF, JPG, PNG, up to 10${N}MB.`,
    fileChosen: 'File: {name} ({size})',
    fileRemove: 'Remove file',
    consent: 'I agree that the studio may store my data to reply to my request.',
    privacy: 'Privacy policy',
    submit: 'Send request',
    sending: 'Sending…',
    note: 'We read every request personally and reply within two business days.',
    errName: 'Tell us what to call you.',
    errEmail: 'Check your email: it looks like there’s a mistake.',
    errConsent: 'Tick the box so we can store your data and reply.',
    errFileSize: `The file is larger than 10${N}MB. Choose a smaller one or add a link in the message.`,
    errFileType: 'Only PDF, JPG and PNG files are accepted.',
    failedTitle: 'We couldn’t send your request',
    failed: 'Your answers are saved. Try again or write to us at {email}.',
    subject: 'Website request: {name}',
  },
  thanks: {
    title: 'Thank you, {name}! We’ve got your request.',
    text: 'We’ll read it and reply within two business days to {email}. If our email doesn’t arrive, check your spam folder.',
    works: 'See our work',
  },
  aside: {
    title: 'Other ways',
    email: 'Email',
    copy: 'Copy',
    copied: 'Copied',
    messenger: 'Messenger',
    social: 'Social',
    where: 'Where we are',
    place: 'Normandy, France',
    world: 'We work with clients worldwide',
    languages: 'Languages',
    languagesList: 'Français · English · Українська',
    newTab: 'opens in a new tab',
  },
  next: {
    eyebrow: 'What’s next',
    title: 'What happens after your request',
    lead: 'Three steps. You’re not committed to anything until you approve the proposal.',
    items: [
      { title: 'Reply', text: 'Within two business days. A person writes to you, not a bot.' },
      { title: '30-minute call', text: 'Free. We ask about your task, your clients and your preferred timeline.' },
      { title: 'Proposal', text: 'What we’ll do, what it costs and how long it takes. The decision is yours.' },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    items: [
      { q: 'What should I prepare for the call?', a: 'Nothing complicated. Tell us what you do and what you want to achieve. If you have a website, examples or a brief, send us the link.' },
      { q: 'Is the first call paid?', a: 'No, it’s free. 30 minutes to understand the task and whether we’re a good fit.' },
      { q: 'I don’t know my budget. Is that a problem?', a: 'No. Choose “Not sure yet”. On the call we’ll explain what the price depends on and suggest a few scope options.' },
      { q: 'Which languages do you work in? Which countries?', a: 'French, English and Ukrainian. We work with clients from any country: meetings online, documents in French or English.' },
      { q: 'Do you sign an NDA?', a: 'Yes. If the project is confidential, we’ll sign a non-disclosure agreement before you share the details.' },
    ],
  },
};

export const contactText: Record<Locale, ContactText> = { fr, en, uk };
