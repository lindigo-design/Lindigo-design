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
    // Сторінка послуги «UI/UX дизайн і прототипування» (Figma «UI дизайн», 231:3260 / 243:866). Переклад від Яни, 23.11.2026
    uiux: {
      meta: {
        title: 'Design UI/UX et prototypage — Lindigo Design Studio',
      },
      hero: {
        crumbs: ['Services', 'Design UI/UX et prototypage'],
        crumbsLabel: 'Fil d’Ariane',
        title: 'Design UI/UX et prototypage',
        lead: 'Nous concevons des applications web, des applications mobiles et des sites web complexes. Nous aidons les utilisateurs à trouver rapidement ce dont ils ont besoin et à accomplir leurs tâches sans étapes inutiles.',
        tags: ['Recherche UX', 'Design UI', 'Prototypage', 'Applications web', 'Applications mobiles'],
        primary: 'Discuter de votre projet',
        secondary: 'Voir nos réalisations',
      },
      audience: {
        eyebrow: `Pour qui${NBSP}?`,
        title: `Quand avez-vous besoin d’un design UI/UX${NBSP}?`,
        lead: 'Pas besoin d’un cahier des charges finalisé. Il suffit de savoir quel problème votre produit doit résoudre.',
        items: [
          { title: 'Nouveau produit', text: `Vous avez une idée d’application mobile ou web${NBSP}? Nous vous aidons à définir les fonctionnalités essentielles et à visualiser son fonctionnement avant le développement.` },
          { title: 'Refonte d’un produit', text: `Vos utilisateurs se perdent dans la navigation ou ne trouvent pas les fonctionnalités recherchées${NBSP}? Nous identifions les points de difficulté et proposons des améliorations.` },
          { title: 'Prototype de présentation', text: `Vous souhaitez présenter une idée à votre équipe, à vos partenaires ou à des investisseurs${NBSP}? Nous créons un prototype interactif qu’ils pourront explorer et tester.` },
        ],
      },
      projects: {
        eyebrow: 'Nos réalisations',
        title: ['Des défis complexes.', 'Des solutions claires.'],
        lead: 'Nous transformons les processus complexes en interfaces intuitives et les idées d’entreprise en produits agréables à utiliser.',
        // назва групи фільтрів для читачів екрана — з назви шару Figma «Фільтр за сферою». ЧЕРНЕТКА
        filterLabel: 'Filtrer par secteur',
        all: 'Tous',
        categories: { finance: 'Finance et analyse', education: 'Éducation et culture', ecommerce: 'E-commerce et marketplaces', health: 'Santé et bien-être', gardening: 'Jardinage' },
        platforms: { app: 'Application', web: 'Application web' },
        clientGroup: 'Projets clients',
        ownGroup: 'Nos projets et concepts',
        whatLabel: 'Présentation',
        didLabel: 'Notre travail',
        industryLabel: 'Secteur',
        viewCase: 'Voir le projet',
        more: 'Voir plus de projets',
        texts: {
          datatixx: {
            what: 'La plateforme Datixxia utilise les données des appels d’offres publics pour calculer la rentabilité de n’importe quel secteur d’activité, dans n’importe quelle région.',
            did: 'Recherche UX, design d’application web (NDA), site web, identité de marque',
          },
          frelia: `Une plateforme de carnet de santé numérique pour animaux${NBSP}: vaccinations, documents et suivi vétérinaire.`,
          solvia: 'Une plateforme dédiée à la santé mentale.',
          atlasona: 'Une marketplace d’expériences avec Atlas, un compagnon IA.',
          'stary-lev': 'Acheter, lire et écouter des livres dans une seule application.',
          greenthumbhub: 'Une application web pour les passionnés de jardinage.',
          smart: 'Un espace étudiant et un carnet de notes pour les enseignants d’une école informatique.',
        },
      },
      stages: {
        eyebrow: 'Étapes et livrables',
        title: 'De la recherche au design final',
        lead: 'Chaque étape aboutit à un livrable concret. Vous savez ce qui a été réalisé et ce qui vient ensuite.',
        resultLabel: 'Livrable',
        steps: [
          { title: 'Recherche UX', text: 'Nous étudions votre public cible, vos concurrents et les objectifs du produit. Nous identifions les besoins des utilisateurs et les difficultés qu’ils pourraient rencontrer.', result: 'Résultats de la recherche et recommandations.' },
          { title: 'Parcours utilisateurs et structure', text: 'Nous définissons les pages et les fonctionnalités nécessaires. Nous concevons le parcours de l’utilisateur, du premier écran jusqu’à l’action souhaitée.', result: 'Arborescence du site et parcours utilisateurs.' },
          { title: 'Wireframes', text: 'Nous créons des schémas d’écrans sans habillage graphique superflu. Nous vérifions l’emplacement des informations, des boutons et des éléments de navigation.', result: 'Wireframes en noir et blanc des écrans clés.' },
          { title: 'Design UI', text: 'Nous choisissons les couleurs, les typographies et les composants, puis concevons les écrans. Nous créons une identité visuelle cohérente pour l’interface.', result: 'Maquettes graphiques dans Figma.' },
          { title: 'Prototype et vérification', text: 'Nous réalisons un prototype interactif. Nous vérifions la logique de navigation et la clarté des actions principales, puis corrigeons les problèmes identifiés.', result: 'Prototype interactif et maquettes finales.' },
          { title: 'Transmission aux développeurs', text: 'Nous préparons les fichiers de design, les composants et les explications nécessaires à l’équipe de développement.', result: 'Projet Figma organisé pour la mise en œuvre.' },
        ],
        action: 'Discuter de votre besoin',
      },
      pricing: {
        eyebrow: 'Tarifs',
        title: `Combien coûte un design UI/UX${NBSP}?`,
        lead: 'Le tarif dépend du nombre d’écrans, de la complexité des fonctionnalités et de l’étendue des recherches. Voici ce qui est inclus dans le prix de départ de chaque prestation.',
        includedLabel: `Inclus dans le prix de départ${NBSP}:`,
        from: 'À partir de',
        tax: 'HT',
        plans: [
          {
            title: 'Prototype d’un parcours clé',
            for: 'Pour valider une idée avant le développement ou la présenter à des investisseurs.',
            price: `3${NBSP}200${NBSP}€`,
            items: ['Un parcours utilisateur principal, par exemple l’inscription ou la commande', `Jusqu’à 10${NBSP}écrans`, 'Analyse succincte du public cible et des concurrents', 'Wireframes et design visuel adapté à votre marque', 'Prototype interactif dans Figma, à explorer et à tester', `3${NBSP}séries de modifications`],
            action: 'Discuter d’un prototype',
          },
          {
            title: 'Design d’une application web',
            for: 'Pour les plateformes en ligne, les espaces personnels et les outils internes des entreprises.',
            price: `9${NBSP}500${NBSP}€`,
            items: ['Entretiens avec les utilisateurs ou analyse des données existantes', 'Structure des écrans et principaux parcours utilisateurs', `Jusqu’à 25${NBSP}écrans pour ordinateur et versions mobiles des écrans clés`, `Bibliothèque de composants${NBSP}: boutons, formulaires, tableaux et leurs états`, 'Prototype interactif et fichiers de design pour les développeurs', `3${NBSP}séries de modifications à chaque étape`],
            action: 'Discuter d’une application web',
          },
          {
            title: 'Design d’une application mobile',
            for: 'Pour les produits destinés à être utilisés sur smartphone.',
            price: `8${NBSP}500${NBSP}€`,
            items: ['Principaux parcours utilisateurs et navigation de l’application', `Jusqu’à 20${NBSP}écrans pour une seule plateforme — iOS ou Android`, `Bibliothèque de composants${NBSP}: boutons, formulaires, cartes et leurs états`, 'Prototype interactif consultable sur smartphone', 'Fichiers de design pour les développeurs', `3${NBSP}séries de modifications à chaque étape`],
            action: 'Discuter d’une application mobile',
          },
        ],
        notes: [
          'Le prix de départ couvre les prestations indiquées dans chaque carte. Les écrans supplémentaires et les modifications hors du périmètre convenu font l’objet d’un devis distinct, validé avant le début des travaux concernés.',
          `Vous ne savez pas quelle formule choisir${NBSP}? Parlez-nous de votre projet. Après un court échange, nous définirons le périmètre nécessaire et préparerons une proposition.`,
        ],
        small: 'Tous les prix sont indiqués hors taxes (HT). TVA non applicable, art. 293 B du CGI.',
        banner: {
          title: `Besoin d’une landing page ou d’un site vitrine${NBSP}?`,
          text: 'Pour les petits sites, nous proposons une prestation distincte, de la conception au développement et à la mise en ligne.',
          action: 'Sites web clés en main',
        },
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'Questions sur le design UI/UX',
        items: [
          { q: `Quelle est la différence entre UX et UI${NBSP}?`, a: `L’UX concerne le fonctionnement du produit${NBSP}: où se trouvent les fonctionnalités et à quel point elles sont faciles à utiliser. L’UI concerne l’apparence des écrans${NBSP}: couleurs, boutons, typographies et autres éléments. Ensemble, ils constituent l’interface.` },
          { q: `Développez-vous également des applications${NBSP}?`, a: 'Nous réalisons le design UX/UI et les prototypes d’applications web et mobiles. Le développement informatique fait l’objet d’un accord séparé.' },
          { q: `De quoi avez-vous besoin pour démarrer un projet${NBSP}?`, a: 'Expliquez-nous ce que vous souhaitez créer, à qui le produit s’adresse et quel problème il doit résoudre. Si vous avez des exemples, de la documentation ou des éléments existants, transmettez-les-nous. Sinon, nous commencerons par en discuter.' },
          { q: `Peut-on commander uniquement une recherche UX${NBSP}?`, a: 'Oui. La recherche UX est disponible comme prestation indépendante. Vous recevrez des conclusions et des recommandations pour définir les prochaines étapes.' },
          { q: `Peut-on modifier le design en cours de projet${NBSP}?`, a: `Oui. Chaque étape comprend 3${NBSP}séries de modifications. Si des changements supplémentaires sont nécessaires, nous conviendrons de leur portée et de leur coût à l’avance.` },
          { q: `Combien de temps prend un projet de design UI/UX${NBSP}?`, a: 'Cela dépend de la complexité du produit, du nombre d’écrans et des vérifications nécessaires. Après le briefing, nous définissons les étapes et convenons des délais.' },
          { q: `Puis-je transmettre vos maquettes à mes propres développeurs${NBSP}?`, a: 'Oui. Vous recevez un fichier Figma contenant tous les écrans validés, les composants et leurs différents états, afin que votre équipe puisse commencer le développement immédiatement.' },
        ],
      },
      cta: {
        title: 'Parlez-nous de votre projet',
        text: [`Vous avez une idée, un cahier des charges prêt ou un produit existant à moderniser${NBSP}?`, 'Parlez-nous-en, et nous vous aiderons à déterminer par où commencer.'],
        call: 'Réserver un appel',
        message: 'Nous contacter',
      },
    },
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
      // ЧЕРНЕТКА: пояснення до вимкнених стрілок (озвучує читач екрана), на вичитку
      navDisabled: 'Pour l’instant, il n’y a qu’un seul avis.',
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
      view: 'Voir le projet',
      taskLabel: 'Le besoin du client',
      foundLabel: 'Ce que nous avons identifié avant de concevoir le design',
      prev: 'Projet précédent',
      next: 'Projet suivant',
      // ЧЕРНЕТКА: пояснення до вимкнених стрілок (озвучує читач екрана), на вичитку
      navDisabled: 'Pour l’instant, il n’y a qu’un seul projet.',
      items: [
        {
          slug: 'datatixx',
          // Напрям: site | shop | branding | app. На головній — найновіша робота кожного напряму (перша в списку)
          direction: 'site',
          name: 'DataTixx',
          tab: 'Site web',
          tags: ['Identité de marque', 'Site web', 'Design de service web'],
          task: 'Expliquer sur le site ce que fait datixxia, la plateforme de DataTixx. Le service utilise les données des appels d’offres publics pour estimer les bénéfices de n’importe quel secteur d’activité, dans n’importe quelle région.',
          found: 'Qui visite le site et ce que chaque public doit comprendre en premier. Une entreprise veut savoir où le marché se développe. Une banque ou un assureur cherche à évaluer la fiabilité d’un secteur. Une chambre de commerce veut connaître la situation des entreprises de sa région.',
          // Для майбутньої сторінки кейсу (на головній не показується)
          pageNote: 'Nous avons également conçu l’application web de la plateforme. Les écrans ne peuvent pas être présentés, car le produit est soumis à un accord de confidentialité (NDA).',
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
    // Сторінка послуги «UI/UX дизайн і прототипування». Переклад від Яни, 23.11.2026
    uiux: {
      meta: {
        title: 'UI/UX Design & Prototyping — Lindigo Design Studio',
      },
      hero: {
        crumbs: ['Services', 'UI/UX Design & Prototyping'],
        crumbsLabel: 'Breadcrumbs',
        title: 'UI/UX Design & Prototyping',
        lead: 'We design web applications, mobile apps, and complex websites. We help users find what they need quickly and complete tasks without unnecessary steps.',
        tags: ['UX Research', 'UI Design', 'Prototyping', 'Web Applications', 'Mobile Apps'],
        primary: 'Discuss Your Project',
        secondary: 'View Our Work',
      },
      audience: {
        eyebrow: 'Who it’s for',
        title: 'When Do You Need UI/UX Design?',
        lead: 'You don’t need a finished technical brief. It’s enough to know what problem your product needs to solve.',
        items: [
          { title: 'New Product', text: 'Have an idea for an app or web application? We’ll help you define the core features and show how everything will work before development begins.' },
          { title: 'Product Redesign', text: 'Are users getting lost in the navigation or struggling to find key features? We’ll identify where they run into difficulties and suggest improvements.' },
          { title: 'Presentation Prototype', text: 'Need to present an idea to your team, partners, or investors? We’ll create an interactive prototype they can explore and test.' },
        ],
      },
      projects: {
        eyebrow: 'Our work',
        title: ['Complex Challenges.', 'Clear Solutions.'],
        lead: 'We turn complex processes into intuitive interfaces and business ideas into products that are a pleasure to use.',
        // назва групи фільтрів для читачів екрана — з назви шару Figma «Фільтр за сферою». ЧЕРНЕТКА
        filterLabel: 'Filter by industry',
        all: 'All',
        categories: { finance: 'Finance & Analytics', education: 'Education & Culture', ecommerce: 'E-commerce & Marketplaces', health: 'Health & Wellbeing', gardening: 'Gardening' },
        platforms: { app: 'App', web: 'Web Application' },
        clientGroup: 'Client projects',
        ownGroup: 'Our projects & concepts',
        whatLabel: 'What it is',
        didLabel: 'What we did',
        industryLabel: 'Industry',
        viewCase: 'View Case Study',
        more: 'More Projects',
        texts: {
          datatixx: {
            what: 'The Datixxia platform uses public tender data to calculate the profitability of any industry in any region.',
            did: 'UX research, web application design (NDA), website, branding',
          },
          frelia: 'A digital pet passport platform for vaccinations, documents, and veterinary care.',
          solvia: 'A mental health platform.',
          atlasona: 'An experiences marketplace with Atlas, an AI companion.',
          'stary-lev': 'Buy, read, and listen to books in one app.',
          greenthumbhub: 'A web application for gardeners.',
          smart: 'A student dashboard and teacher gradebook for an IT school.',
        },
      },
      stages: {
        eyebrow: 'Stages & deliverables',
        title: 'From Research to Final Design',
        lead: 'Every stage has a clear deliverable. You’ll know what’s been completed and what comes next.',
        resultLabel: 'Deliverable',
        steps: [
          { title: 'UX Research', text: 'We study your audience, competitors and product goals. We identify what users need and where they might encounter difficulties.', result: 'Research findings and recommendations.' },
          { title: 'User Flows & Structure', text: 'We define the necessary pages and features. We map the user’s journey from the first screen to their intended action.', result: 'Sitemap and user flows.' },
          { title: 'Wireframes', text: 'We create screen layouts without unnecessary visual styling. We check how information, buttons and navigation are arranged.', result: 'Black-and-white wireframes of key screens.' },
          { title: 'UI Design', text: 'We choose colours, typography and components, and design the screens. We establish a consistent visual language for the interface.', result: 'Design mockups in Figma.' },
          { title: 'Prototyping & Testing', text: 'We build an interactive prototype. We check navigation logic and whether key actions are easy to understand, then address the issues we find.', result: 'Interactive prototype and final designs.' },
          { title: 'Developer Handoff', text: 'We prepare design files, components and the necessary explanations for developers.', result: 'An organised Figma project ready for implementation.' },
        ],
        action: 'Discuss Your Requirements',
      },
      pricing: {
        eyebrow: 'Pricing',
        title: 'How Much Does UI/UX Design Cost?',
        lead: 'The price depends on the number of screens, feature complexity and scope of research. Here’s what’s included in the starting price for each service.',
        includedLabel: 'Included in the starting price:',
        from: 'From',
        tax: 'excl. VAT',
        plans: [
          {
            title: 'Key User Flow Prototype',
            for: 'To validate an idea before development or present it to investors.',
            price: '€3,200',
            items: ['One core user flow, such as registration or checkout', 'Up to 10 screens', 'Brief analysis of the target audience and competitors', 'Wireframes and visual design aligned with your brand', 'An interactive Figma prototype you can explore and test', '3 rounds of revisions'],
            action: 'Discuss a Prototype',
          },
          {
            title: 'Web Application Design',
            for: 'For online platforms, user dashboards and internal company systems.',
            price: '€9,500',
            items: ['User interviews or analysis of existing data', 'Screen structure and key user flows', 'Up to 25 desktop screens and mobile versions of key screens', 'Component library: buttons, forms, tables and their states', 'Interactive prototype and design files for developers', '3 rounds of revisions at each stage'],
            action: 'Discuss a Web Application',
          },
          {
            title: 'Mobile App Design',
            for: 'For products designed to be used on smartphones.',
            price: '€8,500',
            items: ['Core user flows and app navigation', 'Up to 20 screens for one platform — iOS or Android', 'Component library: buttons, forms, cards and their states', 'Interactive prototype for viewing on a smartphone', 'Design files for developer handoff', '3 rounds of revisions at each stage'],
            action: 'Discuss a Mobile App',
          },
        ],
        notes: [
          'The starting price covers the work listed in each card. Additional screens and changes outside the agreed scope are priced separately and approved before the work begins.',
          'Not sure which option is right for you? Tell us about your project. After a short conversation, we’ll define the scope and prepare a proposal.',
        ],
        small: 'All prices exclude VAT. TVA non applicable, art. 293 B du CGI.',
        banner: {
          title: 'Need a Landing Page or a Simple Business Website?',
          text: 'We offer a separate service for smaller websites — from design through development to launch.',
          action: 'Complete Website Solutions',
        },
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'Questions About UI/UX Design',
        items: [
          { q: 'What’s the difference between UX and UI?', a: 'UX is how a product works: where users find features and how easy they are to use. UI is how the screens look: colours, buttons, typography and other elements. Together, they shape the interface.' },
          { q: 'Do you also develop apps?', a: 'We create UX/UI designs and prototypes for web applications and mobile apps. Software development is agreed separately.' },
          { q: 'What do you need to start a project?', a: 'Tell us what you want to create, who it’s for and what problem the product should solve. If you have examples, documentation or existing materials, send them over. If not, we’ll start with a conversation.' },
          { q: 'Can I order UX research only?', a: 'Yes. UX research is available as a standalone service. You’ll receive findings and recommendations to help determine the next steps.' },
          { q: 'Can the design be changed during the project?', a: 'Yes. Each stage includes 3 rounds of revisions. If more changes are needed, we’ll discuss their scope and cost in advance.' },
          { q: 'How long does UI/UX design take?', a: 'It depends on the product’s complexity, number of screens and necessary testing. After the briefing, we define the stages and agree on a timeline.' },
          { q: 'Can I hand your designs over to my own developers?', a: 'Yes. You’ll receive a Figma file with all approved screens, components and their states, so your team can start development right away.' },
        ],
      },
      cta: {
        title: 'Tell Us About Your Project',
        text: ['Have an idea, a ready-made brief or an existing product that needs an update?', 'Tell us about it, and we’ll help you figure out where to start.'],
        call: 'Book a Call',
        message: 'Contact Us',
      },
    },
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
      navDisabled: 'There is only one testimonial for now.',
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
      view: 'View project',
      taskLabel: 'Client’s challenge',
      foundLabel: 'What we learned before designing',
      prev: 'Previous case',
      next: 'Next case',
      navDisabled: 'There is only one project for now.',
      items: [
        {
          slug: 'datatixx',
          // Напрям: site | shop | branding | app. На головній — найновіша робота кожного напряму (перша в списку)
          direction: 'site',
          name: 'DataTixx',
          tab: 'Website',
          tags: ['Branding', 'Website', 'Web service design'],
          task: 'Explain what datixxia, the DataTixx platform, does through its website. The service uses public tender data to estimate profits for any industry in any region.',
          found: 'Who visits the website and what each audience needs to understand first. A company wants to know where the market is growing. A bank or insurer wants to assess how reliable an industry is. A chamber of commerce wants to understand how businesses in its region are performing.',
          // Для майбутньої сторінки кейсу (на головній не показується)
          pageNote: 'We also designed the platform’s web application. The screens cannot be shown because the product is under NDA.',
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
    // Сторінка послуги «UI/UX дизайн і прототипування» — тексти з макета Figma
    uiux: {
      meta: {
        title: 'UI/UX дизайн і прототипування — Lindigo Design Studio',
      },
      hero: {
        crumbs: ['Послуги', 'UI/UX дизайн і прототипування'],
        crumbsLabel: 'Хлібні крихти',
        title: 'UI/UX дизайн і прототипування',
        lead: 'Проєктуємо вебсервіси, мобільні застосунки та складні сайти. Робимо так, щоб людина швидко знаходила потрібне і виконувала дію без зайвих кроків.',
        tags: ['UX-дослідження', 'UI-дизайн', 'Прототипування', 'Вебсервіси', 'Застосунки'],
        primary: 'Обговорити проєкт',
        secondary: 'Переглянути роботи',
      },
      audience: {
        eyebrow: 'Для кого',
        title: 'Коли потрібен UI/UX дизайн',
        lead: 'Не обов’язково мати готове технічне завдання. Достатньо розуміти, яку проблему має вирішити продукт.',
        items: [
          { title: 'Новий продукт', text: 'Маєте ідею застосунку чи вебсервісу? Допоможемо визначити основні функції та показати, як усе працюватиме, ще до розробки.' },
          { title: 'Оновлення продукту', text: 'Користувачі плутаються в меню або не знаходять потрібні функції? Перевіримо, де виникають труднощі, і запропонуємо зміни.' },
          { title: 'Прототип для презентації', text: 'Потрібно показати ідею команді, партнерам чи інвесторам? Створимо інтерактивний прототип, який можна відкрити й протестувати.' },
        ],
      },
      projects: {
        eyebrow: 'Роботи',
        title: ['Складні завдання.', 'Зрозумілі рішення.'],
        lead: 'Перетворюємо складні процеси на зручні інтерфейси, а бізнес-ідеї — на продукти, якими приємно користуватися.',
        filterLabel: 'Фільтр за сферою',
        all: 'Усі',
        categories: { finance: 'Фінанси й аналітика', education: 'Освіта й культура', ecommerce: 'E-commerce і маркетплейси', health: 'Здоров’я й добробут', gardening: 'Садівництво' },
        platforms: { app: 'Застосунок', web: 'Вебсервіс' },
        clientGroup: 'Клієнтські проєкти',
        ownGroup: 'Власні проєкти та концепти',
        whatLabel: 'Що це',
        didLabel: 'Що зробили',
        industryLabel: 'Сфера',
        viewCase: 'Дивитися кейс',
        more: 'Більше проєктів',
        texts: {
          datatixx: {
            what: 'Платформа datixxia: за даними публічних тендерів рахує прибуток будь-якої галузі в будь-якому регіоні.',
            did: 'UX-дослідження, дизайн вебсервісу (NDA), сайт, брендинг',
          },
          frelia: 'Платформа-паспорт для домашніх тварин: щеплення, документи, ветеринар.',
          solvia: 'Платформа для ментального здоров’я.',
          atlasona: 'Маркетплейс вражень з AI-компаньйоном Atlas.',
          'stary-lev': 'Купити, читати й слухати книги в одному застосунку.',
          greenthumbhub: 'Вебсервіс для садівників.',
          smart: 'Кабінет студента й журнал викладача для IT-школи.',
        },
      },
      stages: {
        eyebrow: 'Етапи і результат',
        title: 'Від дослідження до готового дизайну',
        lead: 'Кожен етап має свій результат. Ви бачите, що вже зроблено і що буде далі.',
        resultLabel: 'Результат',
        steps: [
          { title: 'UX-дослідження', text: 'Вивчаємо вашу аудиторію, конкурентів і завдання продукту. З’ясовуємо, що людям потрібно та які труднощі можуть виникнути.', result: 'Висновки дослідження та рекомендації.' },
          { title: 'Сценарії та структура', text: 'Визначаємо, які сторінки й функції потрібні. Продумуємо шлях користувача від першого екрана до потрібної дії.', result: 'Карта сторінок і сценарії користування.' },
          { title: 'Схеми екранів', text: 'Створюємо схеми екранів без зайвого оформлення. Перевіряємо розташування інформації, кнопок і переходів.', result: 'Чорно-білі схеми ключових екранів.' },
          { title: 'UI-дизайн', text: 'Підбираємо кольори, шрифти, компоненти та оформлюємо екрани. Створюємо єдиний візуальний стиль інтерфейсу.', result: 'Дизайн-макети у Figma.' },
          { title: 'Прототип і перевірка', text: 'Збираємо інтерактивний прототип. Перевіряємо логіку переходів і зрозумілість основних дій, виправляємо знайдені проблеми.', result: 'Інтерактивний прототип і фінальні макети.' },
          { title: 'Передача в розробку', text: 'Готуємо дизайн-файли, компоненти та необхідні пояснення для розробників.', result: 'Організований Figma-проєкт для реалізації.' },
        ],
        action: 'Обговорити завдання',
      },
      pricing: {
        eyebrow: 'Вартість',
        title: 'Скільки коштує UI/UX дизайн',
        lead: 'Вартість залежить від кількості екранів, складності функцій та обсягу досліджень. Нижче показано, що входить у стартову ціну кожної послуги.',
        includedLabel: 'Що входить у стартову ціну',
        from: 'від',
        tax: 'HT',
        plans: [
          {
            title: 'Прототип ключового сценарію',
            for: 'Щоб перевірити ідею до початку розробки або представити її інвесторам.',
            price: `3${NBSP}200${NBSP}€`,
            items: ['Один основний сценарій — наприклад, реєстрація або оформлення замовлення', `До 10${NBSP}екранів`, 'Короткий аналіз цільової аудиторії та конкурентів', 'Схеми екранів і візуальний дизайн у стилі вашого бренду', 'Інтерактивний прототип у Figma, який можна переглянути та протестувати', `3${NBSP}раунди правок`],
            action: 'Обговорити прототип',
          },
          {
            title: 'Дизайн вебсервісу',
            for: 'Для онлайн-платформ, особистих кабінетів і внутрішніх систем компаній.',
            price: `9${NBSP}500${NBSP}€`,
            items: ['Інтерв’ю з користувачами або аналіз наявних даних', 'Структура екранів і основні сценарії користування', `До 25${NBSP}екранів для комп’ютера та мобільна версія ключових екранів`, 'Бібліотека компонентів: кнопки, форми, таблиці та їхні стани', 'Інтерактивний прототип і дизайн-файли для розробників', `3${NBSP}раунди правок на кожному етапі`],
            action: 'Обговорити вебсервіс',
          },
          {
            title: 'Дизайн мобільного застосунку',
            for: 'Для продуктів, якими користуватимуться зі смартфона.',
            price: `8${NBSP}500${NBSP}€`,
            items: ['Основні сценарії та навігація застосунку', `До 20${NBSP}екранів для однієї платформи — iOS або Android`, 'Бібліотека компонентів: кнопки, форми, картки та їхні стани', 'Інтерактивний прототип для перегляду на смартфоні', 'Дизайн-файли для передачі розробникам', `3${NBSP}раунди правок на кожному етапі`],
            action: 'Обговорити застосунок',
          },
        ],
        notes: [
          'Стартова ціна охоплює роботи, перелічені в картці. Додаткові екрани та зміни поза погодженим обсягом оцінюємо окремо й узгоджуємо до початку роботи.',
          'Не впевнені, який формат вам підходить? Розкажіть про свій проєкт. Після короткої розмови ми визначимо необхідний обсяг робіт і підготуємо пропозицію.',
        ],
        small: 'Усі ціни вказані без ПДВ (HT). TVA non applicable, art. 293 B du CGI.',
        banner: {
          title: 'Потрібен лендинг або сайт-візитівка?',
          text: 'Для невеликих сайтів у нас є окрема послуга — від дизайну до розробки та запуску.',
          action: 'Сайти під ключ',
        },
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'Питання про UI/UX дизайн',
        items: [
          { q: 'Чим UX відрізняється від UI?', a: 'UX — це те, як працює продукт: де знаходяться потрібні функції та наскільки легко ними користуватися. UI — це те, як виглядають екрани: кольори, кнопки, шрифти та інші елементи. Разом вони формують інтерфейс.' },
          { q: 'Ви також розробляєте застосунки?', a: 'Ми створюємо UX/UI дизайн і прототипи вебсервісів та мобільних застосунків. Програмна розробка узгоджується окремо.' },
          { q: 'Що потрібно для початку проєкту?', a: 'Розкажіть, що хочете створити, для кого і яку задачу має вирішувати продукт. Якщо є приклади, документація чи готові матеріали — надішліть їх. Якщо ні, почнемо з обговорення.' },
          { q: 'Чи можна замовити лише UX-дослідження?', a: 'Так. Дослідження можна замовити як окрему послугу. Ви отримаєте висновки та рекомендації, які допоможуть визначити подальші кроки.' },
          { q: 'Чи можна змінювати дизайн під час роботи?', a: `Так. На кожному етапі передбачено 3${NBSP}раунди правок. Якщо змін потрібно більше, обговорюємо їхній обсяг і вартість заздалегідь.` },
          { q: 'Скільки часу займає UI/UX дизайн?', a: 'Це залежить від складності продукту, кількості екранів і необхідних перевірок. Після брифінгу визначаємо етапи та погоджуємо строки.' },
          { q: 'Чи можна передати ваш дизайн своїм розробникам?', a: 'Так. Ви отримуєте Figma-файл з усіма погодженими екранами, компонентами та їхніми станами, тож ваша команда може одразу почати розробку.' },
        ],
      },
      cta: {
        title: 'Розкажіть про свій проєкт',
        text: ['Маєте ідею, готове завдання чи продукт, який потрібно оновити?', 'Розкажіть про нього, і ми підкажемо, з чого почати.'],
        call: 'Записатися на дзвінок',
        message: 'Написати нам',
      },
    },
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
      navDisabled: 'Поки що тут один відгук.',
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
      view: 'Дивитися кейс',
      taskLabel: 'Задача клієнта',
      foundLabel: 'Що з’ясували до дизайну',
      prev: 'Попередній кейс',
      next: 'Наступний кейс',
      navDisabled: 'Поки що тут одна робота.',
      // Кейси Luigi Contessi, «Логотипи» й Frelia є в макеті лише назвами на вкладках — чекаємо на зміст
      items: [
        {
          slug: 'datatixx',
          // Напрям: site | shop | branding | app. На головній — найновіша робота кожного напряму (перша в списку)
          direction: 'site',
          name: 'DataTixx',
          tab: 'Сайт',
          tags: ['Брендинг', 'Сайт', 'Дизайн вебсервісу'],
          task: 'Пояснити на сайті, що робить datixxia. Сервіс бере дані публічних тендерів і за ними рахує прибуток будь-якої галузі в будь-якому регіоні.',
          found: 'Хто приходить на сайт і що кожен має зрозуміти першим. Компанія хоче знати, де ринок росте. Банк чи страхова — наскільки надійна галузь. Торгова палата — як почуваються бізнеси її регіону.',
          // Для майбутньої сторінки кейсу (на головній не показується)
          pageNote: 'Також ми спроєктували вебсервіс платформи. Екрани не показуємо: продукт під NDA.',
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
