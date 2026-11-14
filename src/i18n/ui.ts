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
    // ЧЕРНЕТКА перекладу — на вичитку
    cta: { title: 'Parlez-nous de votre projet', text: 'Le premier appel est gratuit. Nous commencerons par des questions sur votre activité.' },
    footerNav: { site: 'Site', social: 'Réseaux', contact: 'Nous joindre', email: 'E-mail', messenger: 'Messagerie', legal: 'Mentions légales', privacy: 'Confidentialité' },
    // ЧЕРНЕТКА перекладу — на вичитку (відповіді 2–8 з рішень у плані)
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions fréquentes',
      items: [
        { q: `Combien coûte un projet${NBSP}?`, a: `Le prix dépend du type de projet, de sa complexité et du volume de travail. Nous donnons le prix définitif après le brief${NBSP}: il dépend des besoins de votre projet.` },
        { q: `Comment se passe le paiement${NBSP}?`, a: `En plusieurs fois. Pour un site${NBSP}: 30${NBSP}% au démarrage, 50${NBSP}% après validation du design et 20${NBSP}% à la livraison. Pour un logo${NBSP}: 70${NBSP}% au démarrage et 30${NBSP}% à la livraison.` },
        { q: `Combien de corrections sont incluses${NBSP}?`, a: 'Trois séries de corrections à chaque étape. Si vous changez entièrement de concept, il s’agit d’un nouveau travail, facturé séparément.' },
        { q: `Peut-on s’arrêter après l’analyse${NBSP}?`, a: `Oui. Après l’étape stratégie et structure, vous pouvez vous arrêter. Vous ne payez alors que l’acompte de 30${NBSP}% et repartez avec les résultats de l’analyse${NBSP}: l’arborescence et les maquettes en noir et blanc.` },
        { q: `Quand le site sera-t-il prêt${NBSP}?`, a: `Le délai est inscrit dans la proposition pour votre projet. Il court à partir du jour où vous nous transmettez tous les éléments${NBSP}: textes, photos et accès.` },
        { q: `Que se passe-t-il après le lancement${NBSP}?`, a: `Pendant un mois après le lancement, nous corrigeons gratuitement nos erreurs. Ensuite, au choix${NBSP}: une maintenance payante ou 5 heures de formation gratuite pour gérer votre site.` },
        { q: `De quoi avez-vous besoin pour commencer${NBSP}?`, a: `Pour le premier appel${NBSP}: nous présenter votre activité et ce qui existe déjà. Pour le travail sur le site${NBSP}: vos textes, photos et accès.` },
        { q: `Sous quel délai répondez-vous${NBSP}?`, a: 'Sous deux jours ouvrés.' },
      ],
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    about: {
      eyebrow: 'Le studio',
      leadMuted: 'Un beau design attire l’attention.',
      lead: 'Un design réfléchi fait la différence.',
      intro: 'Votre entreprise est plus qu’un produit ou un service. C’est une idée, des ambitions, des personnes et une histoire qui mérite d’être racontée.',
      text: [
        'Nous cherchons à comprendre cette histoire avant de lui donner une forme visuelle. Nous étudions, remettons en question l’évidence et cherchons le lien entre ce dont votre entreprise a besoin et ce qu’attendent vos clients.',
        'C’est pourquoi chaque choix a une raison. Et chaque projet, sa propre logique, son caractère et son objectif.',
      ],
      more: 'Le studio',
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    reviews: {
      eyebrow: 'Avis',
      title: 'Ce que disent nos clients',
      view: 'Voir le projet',
      prev: 'Avis précédent',
      next: 'Avis suivant',
      items: [
        {
          slug: 'datatixx',
          quote: 'Lindigo a créé notre identité et notre site, et a participé au design de notre service web. Elle a d’abord étudié notre activité et nos utilisateurs, puis elle a commencé à dessiner.',
          author: 'Malcolm Duff, PDG SaS DataTixx',
          meta: 'datixxia · branding, site web, design de service web',
        },
      ],
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    photos: { eyebrow: 'Photo et contenu', title: 'Des photos au service de votre marque', more: 'Voir les photos', strip: 'Exemples de photos' },
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
        { title: 'Le dialogue avant tout', text: 'Vous connaissez votre activité. Nous vous aidons à transformer vos connaissances, vos objectifs et vos idées en une solution de design claire.' },
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
    // ЧЕРНЕТКА перекладу — на вичитку
    cta: { title: 'Tell us about your project', text: 'The first call is free. We’ll start with questions about your business.' },
    footerNav: { site: 'Site', social: 'Social', contact: 'Get in touch', email: 'Email', messenger: 'Messenger', legal: 'Legal notice', privacy: 'Privacy' },
    // ЧЕРНЕТКА перекладу — на вичитку (відповіді 2–8 з рішень у плані)
    faq: {
      eyebrow: 'FAQ',
      title: 'FAQ',
      items: [
        { q: 'How much does a project cost?', a: 'The price depends on the type of project, its complexity and the amount of work. We give the final price after the brief: it depends on what your project needs.' },
        { q: 'How does payment work?', a: `In instalments. For a website: 30${NBSP}% upfront, 50${NBSP}% after the design is approved and 20${NBSP}% on delivery. For a logo: 70${NBSP}% upfront and 30${NBSP}% on delivery.` },
        { q: 'How many revisions are included?', a: 'Three rounds of revisions at each stage. If you change the concept entirely, that’s new work and is billed separately.' },
        { q: 'Can I stop after the analysis?', a: `Yes. After the strategy and structure stage you can stop. You then pay only the 30${NBSP}% deposit and keep the results of the analysis: the sitemap and black-and-white wireframes.` },
        { q: 'When will the website be ready?', a: 'The timeline is set in the proposal for your project. It starts from the day you send us all the materials: texts, photos and access details.' },
        { q: 'What happens after launch?', a: 'For one month after launch we fix our own errors free of charge. After that, your choice: paid website support or 5 hours of free training on how to manage it.' },
        { q: 'What do you need from me to get started?', a: 'For the first call: tell us about your business and show what you already have. For the website work: texts, photos and access details.' },
        { q: 'How quickly do you reply?', a: 'Within two business days.' },
      ],
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    about: {
      eyebrow: 'About the studio',
      leadMuted: 'Beautiful design gets attention.',
      lead: 'Thoughtful design makes a difference.',
      intro: 'Your business is more than a product or a service. It’s an idea, ambitions, people and a story worth telling.',
      text: [
        'We aim to understand that story before giving it visual form. We research, question the obvious and look for the link between what your business needs and what your clients expect.',
        'That’s why every decision has a reason. And every project has its own logic, character and purpose.',
      ],
      more: 'About the studio',
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    reviews: {
      eyebrow: 'Testimonials',
      title: 'What clients say',
      view: 'View case',
      prev: 'Previous testimonial',
      next: 'Next testimonial',
      items: [
        {
          slug: 'datatixx',
          quote: 'Lindigo created our identity and website and contributed to the design of our web service. She first studied our business and users, and only then started designing.',
          author: 'Malcolm Duff, PDG SaS DataTixx',
          meta: 'datixxia · branding, website, web service design',
        },
      ],
    },
    // ЧЕРНЕТКА перекладу з української (Figma, варіант 2) — на вичитку
    photos: { eyebrow: 'Photo & content', title: 'Photos that work for your brand', more: 'See photos', strip: 'Photo examples' },
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
    cta: { title: 'Розкажіть про свій проєкт', text: 'Перший дзвінок безкоштовний. Почнемо з питань про ваш бізнес.' },
    footerNav: { site: 'Сайт', social: 'Соцмережі', contact: 'Зв’язок', email: 'Email', messenger: 'Месенджер', legal: 'Mentions légales', privacy: 'Confidentialité' },
    // Відповідь 1 — з макета (без цін «від [XX €]»: їх ще не визначено). Відповіді 2–8 — ЧЕРНЕТКА з рішень у плані (розділи 11, 13)
    faq: {
      eyebrow: 'FAQ',
      title: 'Часті питання',
      items: [
        { q: 'Скільки коштує проєкт?', a: 'Вартість залежить від типу проєкту, його складності й обсягу роботи. Остаточну вартість називаємо після брифінгу: вона залежить від потреб вашого проєкту.' },
        { q: 'Як проходить оплата?', a: `Частинами. Для сайту: 30${NBSP}% на старті, 50${NBSP}% після погодження дизайну і 20${NBSP}% під час здачі. Для логотипа: 70${NBSP}% на старті і 30${NBSP}% під час здачі.` },
        { q: 'Скільки правок входить у вартість?', a: 'Три кола правок на кожному етапі. Якщо ви повністю міняєте концепцію, це вже нова робота, і вона оплачується окремо.' },
        { q: 'Чи можна зупинитися після аналізу?', a: `Так. Після етапу стратегії й структури ви можете зупинитись. Тоді ви платите лише передоплату 30${NBSP}% і забираєте результати аналізу: карту сайту й чорно-білі макети.` },
        { q: 'Коли сайт буде готовий?', a: 'Строк записуємо в пропозиції для вашого проєкту. Він рахується від дня, коли ви передали всі матеріали: тексти, фото й доступи.' },
        { q: 'Що буде після запуску?', a: 'Місяць після запуску безкоштовно виправляємо свої помилки. Далі на вибір: платна підтримка сайту або 5 годин безкоштовного навчання, як із ним працювати.' },
        { q: 'Що потрібно від мене для початку роботи?', a: 'Для першого дзвінка — розповісти про бізнес і показати, що вже є. Для роботи над сайтом — тексти, фото й доступи.' },
        { q: 'Як швидко ви відповідаєте?', a: 'Протягом двох робочих днів.' },
      ],
    },
    about: {
      eyebrow: 'Про студію',
      leadMuted: 'Красивий дизайн привертає увагу.',
      lead: 'Продуманий — має значення.',
      intro: 'Ваш бізнес — це більше, ніж продукт чи послуга. Це ідея, амбіції, люди та історія, яку варто розповісти.',
      text: [
        'Ми прагнемо зрозуміти цю історію, перш ніж надати їй візуальної форми. Досліджуємо, ставимо під сумнів очевидне, шукаємо зв’язок між тим, що потрібно вашому бізнесу, і тим, чого очікують ваші клієнти.',
        'Тому кожне рішення має свою причину. А кожен проєкт — власну логіку, характер і мету.',
      ],
      more: 'Про студію',
    },
    reviews: {
      eyebrow: 'Відгуки',
      title: 'Що кажуть клієнти',
      view: 'Дивитися кейс',
      prev: 'Попередній відгук',
      next: 'Наступний відгук',
      // У макеті лічильник «01 / 03», але заповнений лише один відгук
      items: [
        {
          slug: 'datatixx',
          quote: 'Lindigo створила нашу айдентику й сайт і долучилась до дизайну вебсервісу. Спершу вона вивчила наш бізнес і користувачів, а потім почала малювати.',
          author: 'Malcolm Duff, PDG SaS DataTixx',
          meta: 'datixxia · брендинг, сайт, дизайн вебсервісу',
        },
      ],
    },
    photos: { eyebrow: 'Фото й контент', title: 'Фото, які працюють на бренд', more: 'Дивитися фото', strip: 'Приклади фото' },
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
