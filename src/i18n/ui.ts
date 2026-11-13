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
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    directions: {
      eyebrow: 'Ce que nous faisons',
      title: 'Nos expertises',
      more: 'En savoir plus',
      items: [
        {
          title: 'UI/UX et prototypes',
          tags: ['UX', 'UI', 'Prototype'],
          text: 'Pour qu’une application ou un service web soit compréhensible dès le premier écran. Nous découvrons d’abord qui sont les utilisateurs et ce dont ils ont besoin, puis nous concevons.',
        },
        {
          title: 'Sites clés en main',
          tags: ['Design', 'Développement', 'Lancement'],
          text: 'Un site qui présente clairement votre activité et guide le client vers l’étape suivante. De la structure à la mise en ligne sur votre domaine.',
        },
        {
          title: 'Boutiques en ligne',
          tags: ['Shopify', 'Code sur mesure'],
          text: 'Une boutique où le client trouve facilement un produit et passe commande, et où vous gérez simplement le catalogue et les commandes.',
        },
        {
          title: 'Branding et logos',
          tags: ['Logo', 'Identité', 'Charte graphique'],
          text: 'Un logo et une identité qui traduisent le caractère de votre marque et la rendent reconnaissable. Nous partons de votre secteur et de votre public.',
        },
        {
          title: 'Photo et contenu',
          tags: ['Fashion', 'Contenu pour les réseaux sociaux'],
          text: 'Des photos et vidéos qui montrent le caractère de votre marque et aident à raconter son histoire. Nous planifions le tournage selon votre objectif.',
        },
      ],
    },
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
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    directions: {
      eyebrow: 'What we do',
      title: 'Expertise',
      more: 'Learn more',
      items: [
        {
          title: 'UI/UX & prototypes',
          tags: ['UX', 'UI', 'Prototype'],
          text: 'So your app or web service makes sense from the very first screen. First we find out who your users are and what they need, then we design.',
        },
        {
          title: 'Turnkey websites',
          tags: ['Design', 'Development', 'Launch'],
          text: 'A website that clearly explains your business and leads clients to the next step. From structure to launch on your domain.',
        },
        {
          title: 'Online stores',
          tags: ['Shopify', 'Custom code'],
          text: 'A store where customers easily find a product and place an order, and where you can manage your catalog and orders with ease.',
        },
        {
          title: 'Branding & logos',
          tags: ['Logo', 'Visual identity', 'Brand book'],
          text: 'A logo and identity that convey your brand’s character and make it recognizable. We start with your niche and audience.',
        },
        {
          title: 'Photo & content',
          tags: ['Fashion', 'Social media content'],
          text: 'Photos and videos that show your brand’s character and help tell its story. We plan each shoot around your goal.',
        },
      ],
    },
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
    directions: {
      eyebrow: 'Що ми робимо',
      title: 'Напрями',
      more: 'Детальніше',
      items: [
        {
          title: 'UI/UX і прототипи',
          tags: ['UX', 'UI', 'Прототип'],
          text: 'Щоб застосунок чи вебсервіс був зрозумілий з першого екрана. Спершу з’ясовуємо, хто користувачі й що їм потрібно, потім проєктуємо.',
        },
        {
          title: 'Сайти під ключ',
          tags: ['Дизайн', 'Розробка', 'Запуск'],
          text: 'Сайт, який зрозуміло розповідає про ваш бізнес і веде клієнта до наступного кроку. Від структури до запуску на вашому домені.',
        },
        {
          title: 'Інтернет-магазини',
          tags: ['Shopify', 'Власний код'],
          text: 'Магазин, де покупцю легко знайти товар і оформити замовлення, а вам зручно керувати каталогом і замовленнями.',
        },
        {
          title: 'Брендинг і логотипи',
          tags: ['Логотип', 'Стиль', 'Брендбук'],
          text: 'Логотип і стиль, які передають характер вашого бренду й роблять його впізнаваним. Починаємо з вашої ніші та аудиторії.',
        },
        {
          title: 'Фото й контент',
          tags: ['Fashion', 'Контент для соцмереж'],
          text: 'Фото та відео, які показують характер вашого бренду й допомагають розповісти його історію. Зйомку плануємо під вашу задачу.',
        },
      ],
    },
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

/**
 * Сторінки напрямів (Figma «Варіант 2», блок «Напрями»). Сайти й магазини ведуть на одну сторінку (план, розділ 3).
 * Адреси попередні: сторінок послуг ще немає.
 */
export const directionPaths = ['/services/ui-ux/', '/services/sites/', '/services/sites/', '/services/branding/', '/services/photo/'] as const;

/** Нерозривний пробіл між двома останніми словами: на рядку не лишається одне слово */
export const keepLastWords = (text: string) => text.replace(/ (\S+)$/, '\u00A0$1');

export const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/yana-levchenko-ua/' },
  { name: 'Behance', href: 'https://www.behance.net/lindigo-design' },
  { name: 'Instagram', href: 'https://www.instagram.com/lindigo_webstudio' },
] as const;
