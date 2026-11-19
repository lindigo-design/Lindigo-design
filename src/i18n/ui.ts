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
    // Заглушка сторінок, яких ще немає. ЧЕРНЕТКА — на вичитку
    stub: { text: 'Cette page est en cours de création.' },
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
      intro: 'Lindigo Design est un studio de design basé en France, aux racines ukrainiennes. Notre travail réunit stratégie, technologie et esthétique. Nous accompagnons des PME et des startups du monde entier, en français, en anglais et en ukrainien.',
      text: [
        `Nous menons votre projet de l’idée à la réalisation${NBSP}: de l’identité visuelle et des sites web aux produits numériques, à la photographie et à la création de contenu. Inutile de chercher séparément un designer, un développeur et un photographe${NBSP}: nous réunissons ces compétences pour créer un ensemble cohérent.`,
        'Nous aimons aller au-delà du brief pour mieux comprendre votre projet. C’est ainsi que naissent des solutions adaptées à vos besoins.',
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
        { title: 'Premier échange & Brief', text: 'Le premier appel est gratuit. Vous nous présentez votre projet et nous vous posons des questions sur votre activité et vos clients. Nous définissons ensemble les délais et la personne qui prendra les décisions de votre côté. Après l’appel, vous recevez un court récapitulatif écrit.' },
        { title: 'Proposition', text: 'Nous détaillons ce que nous allons réaliser, le coût, les délais et l’ordre des étapes. Vous signez la proposition et versez un acompte. Nous pouvons alors commencer.' },
        { title: 'Stratégie & Structure', text: `Nous commençons par bien comprendre votre projet. Nous étudions vos clients et votre marché pour définir la direction à prendre${NBSP}: la structure d’un site web, l’identité d’une marque ou le fonctionnement d’une application. Vous nous fournissez les éléments dont vous disposez déjà${NBSP}: textes, photos et accès nécessaires.` },
        { title: 'Design', text: `Nous vous présentons les premières propositions${NBSP}: une page d’accueil, des écrans d’application ou des esquisses de logo. Vous choisissez une direction et nous développons le design jusqu’à sa version finale. Trois séries de modifications sont incluses. Une fois le design validé, vous effectuez le paiement suivant.` },
        { title: 'Réalisation & Vérification', text: `Nous donnons vie au design validé${NBSP}: création du site web, préparation des fichiers de votre identité visuelle ou réalisation d’un prototype. Nous vérifions la qualité du résultat et sa conformité à ce que nous avons défini ensemble. Vous découvrez le travail finalisé avant sa livraison.` },
        { title: 'Lancement & Livraison', text: 'Nous mettons votre site en ligne sur votre domaine ou vous remettons les fichiers finalisés en vous expliquant comment les utiliser. Vous effectuez le dernier paiement et recevez tous les éléments nécessaires pour poursuivre votre projet en toute autonomie.' },
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
      leadMuted: 'Le design donne forme à vos idées.',
      lead: 'Et les met au service de vos objectifs.',
      body: [
        'Un bon design rend les choses complexes plus simples à comprendre et les interactions plus naturelles. Il aide les utilisateurs à trouver rapidement les informations dont ils ont besoin, à naviguer facilement dans les produits numériques et à reconnaître votre marque à travers différents points de contact. De la première découverte à l’utilisation quotidienne, chaque détail contribue à créer une expérience cohérente.',
        'Ces quatre principes guident les décisions que nous prenons dans chaque projet.',
      ],
      items: [
        { title: 'Chaque élément a sa raison d’être', text: `Chaque bouton, image et bloc a un rôle précis${NBSP}: aider les visiteurs à comprendre votre activité et à passer à l’étape suivante.` },
        { title: 'Votre public avant tout', text: 'Nous choisissons les typographies, les couleurs et les mises en page en fonction des personnes que vous souhaitez toucher.' },
        { title: 'Collaboration créative', text: 'Vous connaissez votre entreprise mieux que personne. Nous savons comment traduire cette connaissance en design. C’est en réunissant nos compétences que nous obtenons les meilleurs résultats.' },
        { title: 'Conçu pour évoluer', text: 'Nous créons un ensemble de couleurs, de typographies et d’éléments réutilisables. Lorsque vous avez besoin d’une nouvelle page ou d’un nouveau produit, vous pouvez l’ajouter facilement tout en conservant une identité visuelle cohérente.' },
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
          text: 'Une application ou un service web dans lequel les utilisateurs naviguent facilement, sans se perdre. Nous testons les parcours sur un prototype interactif avant de passer au développement.',
        },
        {
          title: 'Sites web clés en main',
          tags: ['Design', 'Développement', 'Lancement'],
          text: 'Un site web qui présente clairement votre activité et permet aux visiteurs de vous contacter ou de réserver facilement vos services. Nous prenons en charge le projet, de la structure à la mise en ligne sur votre domaine. Vous pouvez ensuite modifier vos textes et vos photos en toute autonomie.',
        },
        {
          title: 'Boutiques en ligne',
          tags: ['Shopify', 'Code sur mesure'],
          text: 'Une boutique en ligne où vos clients trouvent rapidement le produit recherché et passent commande en quelques étapes. De votre côté, la gestion des produits et des commandes reste simple.',
        },
        {
          title: 'Identité visuelle et logos',
          tags: ['Logo', 'Identité', 'Charte graphique'],
          text: 'Un logo et une identité visuelle qui reflètent la personnalité de votre marque et la rendent plus facilement reconnaissable. Un style cohérent sur votre site web, vos emballages, vos réseaux sociaux et vos supports imprimés.',
        },
        {
          title: 'Photo et contenu',
          tags: ['Fashion', 'Contenu pour les réseaux sociaux'],
          text: `Des photos, des vidéos et des publications pour les réseaux sociaux conçues pour un objectif précis${NBSP}: lancer un produit, enrichir votre site web ou développer votre présence sur Instagram. Nous planifions chaque séance en fonction de l’utilisation prévue des contenus.`,
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
      lead: `Votre entreprise a son histoire et ses objectifs. Nous les étudions et créons des sites, des interfaces et des marques qui répondent à vos${NBSP}enjeux.`,
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
    // Заглушка сторінок, яких ще немає. ЧЕРНЕТКА — на вичитку
    stub: { text: 'This page is under construction.' },
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
      intro: 'Lindigo Design is a French design studio with Ukrainian roots. Our work brings together strategy, technology and aesthetics. We work with small and medium-sized businesses and startups worldwide, in French, English and Ukrainian.',
      text: [
        'We take your project from idea to launch: from brand identity and websites to digital products, photography and content. No need to find a designer, developer and photographer separately — we bring everything together so it all works as one.',
        'We like to understand more than what’s written in the brief. That’s where thoughtful solutions begin.',
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
        { title: 'Introduction & Brief', text: 'The first call is free. You tell us about your project, and we ask questions about your business and your customers. We agree on timelines and who will make decisions on your side. After the call, you receive a short written summary.' },
        { title: 'Proposal', text: 'We outline what we’ll do, how much it will cost, the timeline and the order of work. You sign the proposal and pay a deposit. Then we get started.' },
        { title: 'Strategy & Structure', text: 'First, we get to the heart of your project. We study your customers and your market to define what the result should look like: a website structure, a brand identity or the logic behind an app. We’ll need the materials you already have, such as texts, photos and access details.' },
        { title: 'Design', text: 'We show you the first options: a homepage, app screens or logo sketches. You choose a direction, and we develop the design through to completion. Three rounds of revisions are included. Once you approve the design, the next payment is due.' },
        { title: 'Development & Testing', text: 'We bring the approved design to life: building your website, preparing brand files or creating a prototype. We check the quality and make sure everything matches what we’ve agreed on. You review the finished work before delivery.' },
        { title: 'Launch & Handover', text: 'We launch your website on your domain or deliver the finished files and show you how to use them. You make the final payment and receive everything you need to continue working with your project.' },
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
      leadMuted: 'Design gives shape to your ideas.',
      lead: 'And helps you turn them into results that matter.',
      body: [
        'Good design makes complex things easier to understand and interactions feel natural. It helps people quickly find the information they need, navigate digital products with ease and recognize your brand across different touchpoints. From the first impression to everyday use, every detail contributes to a consistent experience.',
        'These four principles guide the decisions we make in every project.',
      ],
      items: [
        { title: 'Every element has a job', text: 'Every button, image and block has a clear role: to help visitors understand you and take the next step.' },
        { title: 'Your audience first', text: 'We choose fonts, colours and layouts for the people you want to reach.' },
        { title: 'Creative collaboration', text: 'You know your business best. We know how to turn that knowledge into design. The strongest result comes when both work together.' },
        { title: 'Built to grow', text: 'We create a set of colours, fonts and ready-made elements. When you need a new page or product, it’s easy to add it in the same style.' },
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
          text: 'An app or web service where users can find their way without confusion. We test the logic on a clickable prototype before anything gets built.',
        },
        {
          title: 'Turnkey websites',
          tags: ['Design', 'Development', 'Launch'],
          text: 'A website that clearly explains what you do and makes it easy for visitors to contact you or book your services. We take it from structure to launch on your domain, and you can update texts and photos yourself.',
        },
        {
          title: 'Online stores',
          tags: ['Shopify', 'Custom code'],
          text: 'A store where customers quickly find the right product and check out in a few steps. On your side, managing products and orders stays simple.',
        },
        {
          title: 'Branding & logos',
          tags: ['Logo', 'Visual identity', 'Brand book'],
          text: 'A logo and visual identity that reflect your brand’s character and help people recognize it. One consistent style across your website, packaging, social media and print.',
        },
        {
          title: 'Photo & content',
          tags: ['Fashion', 'Social media content'],
          text: 'Photos, videos and social media posts made for a specific goal: launching a product, filling your website or growing your Instagram. We plan each shoot around what you need it for.',
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
      lead: `Your business has its own story and goals. We study them and create websites, interfaces and brands that fit your${NBSP}needs.`,
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
    // Заглушка сторінок, яких ще немає. ЧЕРНЕТКА — на вичитку
    stub: { text: 'Ця сторінка ще в роботі.' },
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
      intro: 'Lindigo Design — французька дизайн-студія з українським корінням. У нашій роботі поєднуються стратегія, технології та естетика. Працюємо з малим і середнім бізнесом та стартапами по всьому світу французькою, англійською та українською.',
      text: [
        'Ведемо проєкт від ідеї до реалізації: від айдентики та сайтів до цифрових продуктів, фотографії й контенту. Вам не потрібно окремо шукати дизайнера, розробника та фотографа — ми об’єднуємо ці напрями, щоб усе працювало як єдине ціле.',
        'Ми любимо розуміти більше, ніж написано в брифі. Саме з цього народжуються рішення, які працюють.',
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
        { title: 'Знайомство і брифінг', text: 'Перший дзвінок безкоштовний. Ви розповідаєте про проєкт, а ми ставимо запитання про ваш бізнес і клієнтів. Домовляємося про строки й про те, хто з вашого боку ухвалює рішення. Після дзвінка ви отримуєте короткий письмовий підсумок.' },
        { title: 'Пропозиція', text: 'Описуємо, що саме зробимо, скільки це коштуватиме, у які строки та в якій послідовності. Ви підписуєте пропозицію та вносите передоплату. Після цього починаємо роботу.' },
        { title: 'Стратегія і структура', text: 'Спочатку розбираємося в завданні. Вивчаємо ваших клієнтів і ринок та визначаємо, яким має бути результат: структура сайту, характер бренду чи логіка застосунку. Від вас потрібні матеріали, які вже є: тексти, фото, доступи.' },
        { title: 'Дизайн', text: 'Показуємо перші варіанти: стартову сторінку, екрани застосунку або ескізи логотипа. Ви обираєте напрям, і ми доводимо дизайн до кінця. У вартість входять три кола правок. Після затвердження дизайну — наступна частина оплати.' },
        { title: 'Реалізація і перевірка', text: 'Втілюємо затверджений дизайн: збираємо сайт, готуємо файли бренду або прототип. Перевіряємо якість і те, чи все відповідає вашим очікуванням та нашим домовленостям. Ви переглядаєте готову роботу перед передачею.' },
        { title: 'Запуск і передача', text: 'Запускаємо сайт на вашому домені або передаємо готові файли й показуємо, як ними користуватися. Ви вносите фінальну частину оплати й отримуєте все необхідне для подальшої роботи з вашим проєктом.' },
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
      leadMuted: 'Дизайн надає форму вашим ідеям.',
      lead: 'І спрямовує їх на досягнення ваших цілей.',
      body: [
        'Хороший дизайн робить складне зрозумілим, а взаємодію — природною. Він допомагає людям швидко знаходити потрібну інформацію, орієнтуватися в цифрових продуктах і впізнавати бренд у різних точках контакту. Від першого знайомства до щоденного використання кожна деталь формує цілісне враження.',
        'Ці чотири принципи визначають рішення, які ми приймаємо в кожному проєкті.',
      ],
      items: [
        { title: 'Кожен елемент має своє призначення', text: 'Кожна кнопка, зображення та блок мають чітку роль: допомогти відвідувачам зрозуміти вашу діяльність і зробити наступний крок.' },
        { title: 'Ваша аудиторія — на першому місці', text: 'Ми обираємо шрифти, кольори та композицію з урахуванням людей, до яких ви хочете звернутися.' },
        { title: 'Творча співпраця', text: 'Ви знаєте свій бізнес краще за всіх. Ми знаємо, як втілити ці знання в дизайні. Найкращий результат народжується тоді, коли ми працюємо разом.' },
        { title: 'Створено для розвитку', text: 'Ми створюємо систему кольорів, шрифтів і готових до використання елементів. Коли вам знадобиться нова сторінка або продукт, їх буде легко додати, зберігаючи єдиний візуальний стиль.' },
      ],
    },
    directions: {
      eyebrow: 'Що ми робимо',
      title: 'Напрями',
      more: 'Детальніше',
      items: [
        {
          title: 'UI/UX та прототипи',
          tags: ['UX', 'UI', 'Прототип'],
          text: 'Застосунок або вебсервіс, у якому користувачі легко орієнтуються та знаходять потрібну інформацію без зайвих труднощів. Ми перевіряємо логіку взаємодії на інтерактивному прототипі ще до початку розробки.',
        },
        {
          title: 'Сайти під ключ',
          tags: ['Дизайн', 'Розробка', 'Запуск'],
          text: 'Сайт, який зрозуміло представляє ваш бізнес і дозволяє відвідувачам легко зв’язатися з вами або забронювати послугу. Ми супроводжуємо проєкт від створення структури до запуску на вашому домені, а тексти й фотографії ви зможете оновлювати самостійно.',
        },
        {
          title: 'Інтернет-магазини',
          tags: ['Shopify', 'Власний код'],
          text: 'Інтернет-магазин, у якому покупці швидко знаходять потрібний товар і оформлюють замовлення за кілька кроків. А для вас керування товарами та замовленнями залишається простим.',
        },
        {
          title: 'Брендинг і логотипи',
          tags: ['Логотип', 'Стиль', 'Брендбук'],
          text: 'Логотип і фірмовий стиль, які відображають характер вашого бренду та допомагають зробити його впізнаваним. Єдина візуальна стилістика для сайту, пакування, соціальних мереж і друкованих матеріалів.',
        },
        {
          title: 'Фото та контент',
          tags: ['Fashion', 'Контент для соцмереж'],
          text: 'Фотографії, відео й публікації для соціальних мереж, створені під конкретну мету: запуск продукту, наповнення сайту або розвиток Instagram. Ми плануємо кожну зйомку з урахуванням того, як і для чого ви використовуватимете матеріали.',
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
      lead: `Ваш бізнес має власну історію та цілі. Ми вивчаємо їх та створюємо сайти, інтерфейси та бренди, які відповідають вашим${NBSP}задачам.`,
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
