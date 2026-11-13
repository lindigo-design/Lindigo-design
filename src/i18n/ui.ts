export const locales = ['fr', 'en', 'uk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

/**
 * Адреса сторінки для мови: французька — без префікса, інші — /en/, /uk/.
 * Спереду додається base сайту (import.meta.env.BASE_URL): на тимчасовій копії GitHub Pages це
 * /Lindigo-design, на справжньому домені base порожній — адреси не змінюються.
 */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const local = locale === defaultLocale ? clean : `/${locale}${clean}`;
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
  return `${base}${local}`;
}

const NBSP = ' ';

/** Назви мов завжди їхньою мовою, не перекладаються */
export const languageNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  uk: 'Українська',
};

/**
 * Тексти першого екрана.
 * FR і UK — з макетів Figma (рішення Яни, 12.11.2026).
 * EN — чернетка перекладу, потребує вичитки.
 * Нерозривні пробіли (NBSP): перед « : » у французькій і між двома останніми словами абзацу.
 */
export const ui = {
  fr: {
    menu: {
      label: 'Menu',
      close: 'Fermer le menu',
      nav: ['Réalisations', 'Services', 'Studio', 'Contact'],
      contactTitle: 'Nous joindre',
      call: 'Réserver un appel',
      message: 'Envoyer un message',
      socialTitle: 'Réseaux',
    },
    theme: {
      label: 'Thème sombre',
    },
    footer: {
      rights: 'Tous droits réservés',
    },
    meta: {
      title: 'Lindigo Design Studio — d’abord la stratégie, ensuite le design',
      description:
        'Nous concevons des services web, des sites et des marques pour les startups et les PME. Chaque choix dans la maquette a une raison.',
    },
    header: {
      bookCall: 'Réserver un appel',
      menu: 'Ouvrir le menu',
      langButton: `Langue${NBSP}: français. Changer de langue`,
      languages: 'Langue du site',
      home: 'Lindigo Design Studio, accueil',
    },
    hero: {
      title: ['D’abord la stratégie.', 'Ensuite un design', 'qui fonctionne.'],
      // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
      lead: `Votre entreprise a son histoire et ses objectifs. Nous les étudions et créons des sites, des interfaces et des marques qui répondent à vos enjeux, pas à des modèles tout${NBSP}faits.`,
      leadWidth: '680px',
      primary: 'Parler de votre projet',
      secondary: 'Voir les réalisations',
      latest: 'Dernière réalisation',
      openCase: 'Voir le projet',
    },
  },
  en: {
    menu: {
      label: 'Menu',
      close: 'Close menu',
      nav: ['Work', 'Services', 'Studio', 'Contact'],
      contactTitle: 'Get in touch',
      call: 'Book a call',
      message: 'Send a message',
      socialTitle: 'Social',
    },
    theme: {
      label: 'Dark theme',
    },
    footer: {
      rights: 'All rights reserved',
    },
    meta: {
      title: 'Lindigo Design Studio — strategy first, then design',
      description:
        'We design web services, websites and brands for startups and small and medium-sized businesses. Every choice in the mockup has a reason.',
    },
    header: {
      bookCall: 'Book a call',
      menu: 'Open menu',
      langButton: 'Language: English. Change language',
      languages: 'Site language',
      home: 'Lindigo Design Studio, home',
    },
    hero: {
      title: ['Strategy first.', 'Then a design', 'that works.'],
      // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
      lead: `Your business has its own story and goals. We study them and create websites, interfaces and brands that fit your needs, not${NBSP}templates.`,
      leadWidth: '665px',
      primary: 'Discuss your project',
      secondary: 'See our work',
      latest: 'Latest project',
      openCase: 'View project',
    },
  },
  uk: {
    menu: {
      label: 'Меню',
      close: 'Закрити меню',
      nav: ['Роботи', 'Послуги', 'Студія', 'Контакт'],
      contactTitle: 'Зв’язок',
      call: 'Записатися на дзвінок',
      message: 'Надіслати повідомлення',
      socialTitle: 'Соцмережі',
    },
    theme: {
      label: 'Темна тема',
    },
    footer: {
      rights: 'Усі права захищені',
    },
    meta: {
      title: 'Lindigo Design Studio — спочатку стратегія, потім дизайн',
      description:
        'Проєктуємо вебсервіси, сайти й бренди для стартапів, малого й середнього бізнесу. Кожне рішення в макеті має причину.',
    },
    header: {
      bookCall: 'Записатися на дзвінок',
      menu: 'Відкрити меню',
      langButton: 'Мова: українська. Змінити мову',
      languages: 'Мова сайту',
      home: 'Lindigo Design Studio, головна',
    },
    hero: {
      title: ['Спочатку стратегія.', 'Потім дизайн,', 'який працює.'],
      lead: `Ваш бізнес має власну історію та цілі. Ми вивчаємо їх та створюємо сайти, інтерфейси та бренди, які відповідають вашим задачам, а не${NBSP}шаблонам.`,
      leadWidth: '665px',
      primary: 'Обговорити проєкт',
      secondary: 'Дивитися роботи',
      latest: 'Остання робота',
      openCase: 'Відкрити кейс',
    },
  },
} satisfies Record<Locale, unknown>;

export type UI = (typeof ui)[Locale];

/** Адреси пунктів меню: однакові для всіх мов, лише з мовним префіксом */
export const menuPaths = ['/realisations/', '/services/', '/studio/', '/contact/'] as const;

export const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/yana-levchenko-ua/' },
  { name: 'Behance', href: 'https://www.behance.net/lindigo-design' },
  { name: 'Instagram', href: 'https://www.instagram.com/lindigo_webstudio' },
] as const;
