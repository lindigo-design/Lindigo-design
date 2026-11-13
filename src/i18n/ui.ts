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
    process: {
      eyebrow: 'Six étapes, de l’appel au lancement',
      title: 'Notre méthode',
      steps: [
        { title: 'Rencontre et brief', text: `Le premier appel est gratuit. Vous nous présentez votre projet, nous vous posons des questions sur votre activité et vos clients. Nous convenons de qui prend les décisions chez vous et des délais. Après l’appel, vous recevez un court compte rendu écrit.` },
        { title: 'Proposition', text: `Nous décrivons ce que nous allons faire, le coût et l’ordre des étapes. Vous signez le devis et versez un acompte de 30${NBSP}%. Ensuite, nous commençons.` },
        { title: 'Stratégie et structure', text: `C’est le travail avant le design. Nous étudions vos clients et votre marché. Nous en tirons l’arborescence et des maquettes en noir et blanc. Nous avons besoin de vos textes, photos et accès. Trois séries de corrections sont prévues.` },
        { title: 'Design', text: `Nous présentons deux propositions de page d’accueil. Vous en choisissez une, et nous dessinons le reste pour ordinateur et mobile. Trois séries de corrections sont prévues. Après validation, deuxième paiement${NBSP}: 50${NBSP}%.` },
        { title: 'Développement et tests', text: `Nous construisons le site et ajoutons les animations. Nous le testons sur mobile, vérifions la vitesse et les formulaires. Vous consultez le site via un lien de test.` },
        { title: 'Lancement', text: `Nous mettons le site en ligne sur votre domaine et vous montrons comment modifier les textes et les photos. Vous réglez les 20${NBSP}% restants.` },
      ],
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    works: {
      eyebrow: 'Réalisations',
      title: 'Projets choisis',
      all: 'Toutes les réalisations',
      caseLabel: 'Projet',
      view: 'Voir le projet',
      taskLabel: 'La demande du client',
      foundLabel: 'Ce que nous avons appris avant le design',
      prev: 'Projet précédent',
      next: 'Projet suivant',
      items: [
        {
          slug: 'datatixx',
          name: 'DataTixx',
          tags: ['Branding', 'Site web', 'Design de service web'],
          task: 'Présenter clairement un système qui, à partir des données des marchés publics, évalue la direction de l’économie dans différents secteurs.',
          found: `Qui utilise la plateforme et ce que chacun veut voir en premier${NBSP}: dirigeant de petite entreprise, analyste ou banque.`,
        },
      ],
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    principles: {
      eyebrow: 'Nos principes',
      leadMuted: 'Les solutions universelles n’existent pas.',
      lead: 'Votre entreprise n’a pas à se plier à un modèle.',
      body: 'Chaque projet a son contexte, ses défis et son public. Ce qui fonctionne pour une marque ne fonctionnera pas forcément pour une autre.',
      bodyMuted: 'C’est pourquoi nous partons du fond, pas de la forme. Nous cherchons à comprendre ce qui compte pour vous et à le traduire en un design réfléchi.',
      items: [
        { title: 'D’abord comprendre', text: 'Avant de proposer une solution, nous étudions votre activité, votre public et votre environnement concurrentiel.' },
        { title: 'Chaque choix a une raison', text: 'La structure, les fonctionnalités et le langage visuel doivent répondre à des besoins concrets, pas seulement aux tendances du design.' },
        { title: 'Le dialogue plutôt que les suppositions', text: 'Vous connaissez votre activité. Nous vous aidons à transformer vos connaissances, vos objectifs et vos idées en une solution de design claire.' },
        { title: 'Un design tourné vers l’avenir', text: 'Nous créons des solutions qui tiennent compte des besoins actuels, mais aussi des possibilités de développement.' },
      ],
    },
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
    process: {
      eyebrow: 'Six steps from the first call to launch',
      title: 'How we work',
      steps: [
        { title: 'Introduction & brief', text: 'The first call is free. You tell us about your project, and we ask about your business and your clients. We agree on who makes decisions on your side and on timelines. After the call, you get a short written summary.' },
        { title: 'Proposal', text: `We write down what we’ll do, how much it costs and in what order. You sign the proposal and pay a 30${NBSP}% deposit. Then we get started.` },
        { title: 'Strategy & structure', text: 'This is the work before design. We study your clients and your market, and turn that into a sitemap and black-and-white wireframes. We’ll need your texts, photos and access details. Three rounds of revisions are included.' },
        { title: 'Design', text: `We show two options for the home page. You pick one, and we design the rest for desktop and mobile. Three rounds of revisions are included. After approval comes the second payment, 50${NBSP}%.` },
        { title: 'Development & testing', text: 'We build the site and add the animations. We test it on phones and check speed and forms. You review the site via a test link.' },
        { title: 'Launch', text: `We move the site to your domain and show you how to update texts and photos. You pay the remaining 20${NBSP}%.` },
      ],
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    works: {
      eyebrow: 'Work',
      title: 'Selected work',
      all: 'All work',
      caseLabel: 'Case',
      view: 'View case',
      taskLabel: 'Client’s goal',
      foundLabel: 'What we learned before designing',
      prev: 'Previous case',
      next: 'Next case',
      items: [
        {
          slug: 'datatixx',
          name: 'DataTixx',
          tags: ['Branding', 'Website', 'Web service design'],
          task: 'Clearly present a system that uses public contract data to assess where the economy is heading across sectors.',
          found: 'Who uses the platform and what each of them wants to see first: a small business owner, an analyst or a bank.',
        },
      ],
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    principles: {
      eyebrow: 'Our principles',
      leadMuted: 'There are no universal solutions.',
      lead: 'Your business shouldn’t have to fit a template.',
      body: 'Every project has its own context, challenges and audience. What works for one brand won’t necessarily work for another.',
      bodyMuted: 'That’s why we start with substance, not form. We aim to understand what matters to you and turn that understanding into thoughtful design.',
      items: [
        { title: 'Understanding first', text: 'Before proposing a solution, we study your business, your audience and your competitive landscape.' },
        { title: 'Every decision has a reason', text: 'Structure, functionality and visual language should meet real needs, not just design trends.' },
        { title: 'Dialogue, not guesswork', text: 'You know your business. We help turn your knowledge, goals and ideas into a clear design solution.' },
        { title: 'Design with the future in mind', text: 'We create solutions that consider not only today’s tasks but also room to grow.' },
      ],
    },
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
    process: {
      eyebrow: 'Шість кроків від дзвінка до запуску',
      title: 'Як ми працюємо',
      steps: [
        { title: 'Знайомство і брифінг', text: 'Перший дзвінок безкоштовний. Ви розповідаєте про задачу, ми ставимо питання про ваш бізнес і ваших клієнтів. Домовляємось, хто у вас приймає рішення і які строки. Після дзвінка ви отримуєте короткий підсумок на письмі.' },
        { title: 'Пропозиція', text: `Пишемо, що зробимо, скільки це коштує і в якому порядку. Ви підписуєте пропозицію й вносите 30${NBSP}%. Після цього починаємо.` },
        { title: 'Стратегія і структура', text: 'Це робота ще до дизайну. Вивчаємо ваших клієнтів і ваш ринок. З цього складаємо карту сторінок і чорно-білі макети. Від вас потрібні тексти, фото й доступи. На правки є три кола.' },
        { title: 'Дизайн', text: `Показуємо два варіанти стартової сторінки. Ви обираєте один, і ми малюємо решту для комп’ютера й телефону. На правки є три кола. Після погодження другий платіж, 50${NBSP}%.` },
        { title: 'Розробка і перевірка', text: 'Збираємо сайт і додаємо анімацію. Перевіряємо його на телефонах, дивимось швидкість і форми. Ви дивитесь сайт за тестовим посиланням.' },
        { title: 'Запуск', text: `Переносимо сайт на ваш домен і показуємо, як міняти тексти й фото. Ви оплачуєте останні 20${NBSP}%.` },
      ],
    },
    works: {
      eyebrow: 'Роботи',
      title: 'Вибрані роботи',
      all: 'Усі роботи',
      caseLabel: 'Кейс',
      view: 'Дивитися кейс',
      taskLabel: 'Задача клієнта',
      foundLabel: 'Що з’ясували до дизайну',
      prev: 'Попередній кейс',
      next: 'Наступний кейс',
      // Кейси Luigi Contessi, «Логотипи» й Frelia є в макеті лише назвами на вкладках — чекаємо на зміст
      items: [
        {
          slug: 'datatixx',
          name: 'DataTixx',
          tags: ['Брендинг', 'Сайт', 'Дизайн вебсервісу'],
          task: 'Показати зрозуміло систему, яка за даними публічних контрактів оцінює, куди рухається економіка в різних секторах.',
          found: 'Хто користується платформою і що кожен хоче побачити першим: власник малого бізнесу, аналітик чи банк.',
        },
      ],
    },
    principles: {
      eyebrow: 'Наші принципи',
      leadMuted: 'Універсальних рішень не існує.',
      lead: 'Ваш бізнес не повинен підлаштовуватися під шаблон.',
      body: 'У кожного проєкту свій контекст, свої виклики та своя аудиторія. Те, що працює для одного бренду, не обов’язково спрацює для іншого.',
      bodyMuted: 'Тому ми починаємо зі змісту, а не з форми. Прагнемо зрозуміти, що важливо саме для вас, і перетворити це розуміння на продуманий дизайн.',
      items: [
        { title: 'Спочатку розуміння', text: 'Перш ніж пропонувати рішення, ми досліджуємо ваш бізнес, аудиторію та конкурентне середовище.' },
        { title: 'Кожне рішення має причину', text: 'Структура, функціональність і візуальна мова повинні відповідати конкретним потребам, а не лише дизайнерським трендам.' },
        { title: 'Діалог замість здогадок', text: 'Ви знаєте свій бізнес. Ми допомагаємо перетворити ваші знання, цілі та ідеї на зрозуміле дизайнерське рішення.' },
        { title: 'Дизайн із перспективою', text: 'Створюємо рішення, які враховують не лише поточні завдання, а й можливості подальшого розвитку.' },
      ],
    },
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
