/**
 * Тексти сторінки «Послуги» (/services/). Figma «UI дизайн»: «Послуги — UI (темна)» 413:5734, «(світла)» 439:2913.
 * UK — з макета. FR і EN — від Яни (Lindigo_Services_FR.md, Lindigo_Services_EN.md, 25.11.2026).
 * UK доповнено з Lindigo_Services_UK.md (25.11.2026): картки рішень для ситуацій 2–8 і всі вкладки етапів.
 * Нерозривні пробіли (N): у французькій перед « : ; ? ! », між числом і %, між двома останніми словами.
 */
import type { Locale } from './ui';

const N = ' '; // нерозривний пробіл

/** Порядок напрямів: як directionPaths у ui.ts (UI/UX, сайти, магазини, брендинг, фото) */
export type DirectionKey = 'uiux' | 'sites' | 'shop' | 'branding' | 'photo';

export interface ServicesText {
  meta: { title: string; description: string };
  hero: { crumbs: [string, string]; title: string; lead: string };
  situations: {
    eyebrow: string;
    title: string;
    lead: string;
    /** Підпис списку для скрінрідера */
    listLabel: string;
    link: string;
    items: { title: string; direction: DirectionKey; solution?: { title: string; text: string } }[];
    /** Поки немає тексту рішення: показуємо назву напряму і цей рядок */
    pending: string;
  };
  projects: { eyebrow: string; title: string; all: string; items: { slug: 'datatixx' | 'frelia'; caption: string }[] };
  directions: {
    eyebrow: string;
    title: string;
    lead: string;
    includes: string;
    items: Record<DirectionKey, { title: string; more: string; text: string; caption: string; points: { title: string; text: string }[] }>;
  };
  stages: {
    eyebrow: string;
    title: string;
    lead: string;
    /** «Етап {n} / {total}» */
    counter: string;
    items: { title: string; tabs: { title: string; text: string; draft?: boolean }[] }[];
  };
  faq: { eyebrow: string; title: string; items: { q: string; a: string; link?: { lead: string; text: string; path: string } }[] };
  cta: { title: string; text: string[]; call: string; message: string };
}

const uk: ServicesText = {
  meta: {
    title: 'Послуги — Lindigo Design Studio',
    description: 'Допомагаємо бізнесу створювати нові продукти, розвивати наявні та будувати впізнаваний бренд.',
  },
  hero: {
    crumbs: ['Головна', 'Послуги'],
    // фраза замість «Послуги» (рішення Яни 26.11.2026); «Послуги» лишається в хлібних крихтах і назві сторінки
    title: 'Надаємо форму вашим ідеям',
    lead: 'Допомагаємо бізнесу створювати нові продукти, розвивати наявні та будувати впізнаваний бренд. Поєднуємо брендинг, дизайн, технології та візуальний контент відповідно до ваших бізнес-завдань.',
  },
  situations: {
    eyebrow: 'Підбір',
    title: 'Почніть з вашої ситуації',
    lead: 'Не завжди очевидно, яка саме послуга потрібна бізнесу. Оберіть ситуацію, яка вам найближча, щоб побачити можливе рішення.',
    listLabel: 'Ситуації',
    link: 'Дивитися напрям',
    pending: '',
    items: [
      {
        title: 'Відвідувачі заходять на сайт, але не залишають заявок',
        direction: 'sites',
        solution: {
          title: 'Сайти під ключ',
          text: 'Аналізуємо, що заважає відвідувачам стати клієнтами. Оновлюємо структуру, зміст і дизайн сайту, щоб спростити шлях до звернення.',
        },
      },
      {
        title: 'Ви запускаєте бізнес або оновлюєте його образ',
        direction: 'branding',
        solution: { title: 'Брендинг і сайт', text: 'Допомагаємо сформувати візуальний образ компанії та представити її онлайн. Бренд і сайт розробляємо як частини одного проєкту.' },
      },
      {
        title: 'Сайт, соцмережі та документи виглядають по-різному',
        direction: 'branding',
        solution: { title: 'Брендбук', text: 'Створюємо зрозумілі правила оформлення матеріалів, якими зможуть користуватися ваша команда та підрядники.' },
      },
      {
        title: 'Товари є, але онлайн-продажі залишаються низькими',
        direction: 'shop',
        solution: { title: 'Інтернет-магазин і фото', text: 'Перевіряємо, як покупці обирають товари та оформлюють замовлення. Покращуємо представлення асортименту й усуваємо перешкоди на шляху до покупки.' },
      },
      {
        title: 'Потрібно представити ідею інвесторам до розробки',
        direction: 'uiux',
        solution: { title: 'Інтерактивний прототип', text: 'Створюємо модель майбутнього продукту, з якою можна взаємодіяти. Це допоможе продемонструвати ідею без витрат на повноцінну розробку.' },
      },
      {
        title: 'Користувачі реєструються в сервісі, але не користуються ним',
        direction: 'uiux',
        solution: { title: 'UX-аудит і редизайн', text: 'Досліджуємо, на яких етапах користувачі втрачають інтерес або стикаються з труднощами. Пропонуємо зміни на основі отриманих висновків.' },
      },
      {
        title: 'Продукт розвивається і потребує нових функцій',
        direction: 'uiux',
        solution: { title: 'Розвиток продукту', text: 'Інтегруємо нові можливості в наявний інтерфейс, зберігаючи його логіку та звичні для користувачів способи взаємодії.' },
      },
      {
        title: 'Потрібні професійні матеріали для сайту або реклами',
        direction: 'photo',
        solution: { title: 'Фото й контент', text: 'Створюємо візуальні матеріали, які допомагають представити ваші товари, послуги та команду потенційним клієнтам.' },
      },
    ],
  },
  projects: {
    eyebrow: 'Портфоліо',
    title: 'Вибрані проєкти',
    all: 'Усі проєкти',
    items: [
      { slug: 'datatixx', caption: 'DataTixx — сайт' },
      { slug: 'frelia', caption: 'Frelia — застосунок і брендинг' },
    ],
  },
  directions: {
    eyebrow: 'Напрями',
    title: 'Дизайн і технології для бізнесу',
    lead: 'Кожну послугу можна замовити окремо або поєднати з іншими залежно від потреб вашого бізнесу.',
    includes: 'Що входить',
    items: {
      uiux: {
        title: 'UI/UX дизайн і прототипування',
        more: 'Детальніше про UI/UX',
        text: 'Проєктуємо вебсервіси, мобільні застосунки та складні сайти. Допомагаємо визначити, які функції потрібні продукту, як вони мають працювати та як представити їх користувачам у зрозумілому інтерфейсі.',
        caption: 'Frelia — застосунок і брендинг',
        points: [
          { title: 'UX-дослідження', text: 'Говоримо з користувачами й вивчаємо конкурентів, щоб знайти, де люди губляться.' },
          { title: 'Структура і сценарії', text: 'Вирішуємо, які екрани потрібні і як людина доходить до потрібної дії.' },
          { title: 'UI-дизайн', text: 'Усі екрани в одному стилі, з компонентами, зручними для розробника.' },
          { title: 'Прототипування', text: 'Клікабельна модель, на якій видно, чи зручно користуватися продуктом, ще до розробки.' },
        ],
      },
      sites: {
        title: 'Сайти під ключ',
        more: 'Детальніше про сайти',
        text: 'Створюємо лендинги, сайти-візитівки та корпоративні сайти, які допомагають представити компанію, пояснити переваги її послуг і налагодити контакт із клієнтами. Ви отримуєте готовий до роботи сайт на власному домені.',
        caption: 'DataTixx — сайт',
        points: [
          { title: 'Структура і тексти', text: 'Плануємо сторінки й пишемо тексти, які пояснюють, чим ви корисні.' },
          { title: 'Вебдизайн', text: 'Сайт у стилі вашого бренду, зручний і на комп’ютері, і на телефоні.' },
          { title: 'Веброзробка', text: 'Швидкий сайт з потрібними функціями: форми, бронювання, оплата.' },
          { title: 'SEO та аналітика', text: 'Вас знаходять у Google, а ви бачите, звідки приходять клієнти.' },
        ],
      },
      shop: {
        title: 'Інтернет-магазини',
        more: 'Детальніше про інтернет-магазини',
        text: 'Розробляємо інтернет-магазини для бізнесів, які починають продавати онлайн або хочуть покращити наявний магазин. Враховуємо особливості асортименту, потреби покупців і процеси обробки замовлень.',
        caption: 'Luigi Contessi — персональний сайт з e-commerce',
        points: [
          { title: 'Каталог і пошук', text: 'Категорії й фільтри, щоб товар знаходився за кілька кліків.' },
          { title: 'Картки товарів', text: 'Фото, ціна, характеристики й доставка в одному місці, щоб покупцю не довелося перепитувати.' },
          { title: 'Кошик і оплата', text: 'Коротке оформлення замовлення й зручні способи оплати.' },
          { title: 'Платформа та розробка', text: 'Shopify, WordPress + WooCommerce або власний код: обираємо під ваш асортимент і бюджет.' },
        ],
      },
      branding: {
        title: 'Брендинг і логотипи',
        more: 'Детальніше про брендинг',
        text: 'Розробляємо візуальну ідентичність бренду на основі його характеру, цінностей та позиціонування. Допомагаємо компанії відрізнятися від конкурентів і формувати впізнаваний образ.',
        caption: 'Marishami — салон краси в Каннах',
        points: [
          { title: 'Логотип', text: 'Знак, який читається і на вивісці, і на маленькій іконці.' },
          { title: 'Фірмовий стиль', text: 'Кольори, шрифти й графіка, за якими вас впізнають.' },
          { title: 'Брендбук', text: 'Правила, щоб команда й підрядники робили все в одному стилі.' },
          { title: 'Брендовані матеріали', text: 'Візитки, шаблони для соцмереж і презентацій, готові до використання.' },
        ],
      },
      photo: {
        title: 'Фото й контент',
        more: 'Детальніше про контент',
        text: 'Створюємо фото, відео та візуальні матеріали для комерційних проєктів. Допомагаємо показати особливості ваших товарів і послуг, передати атмосферу бренду та підготувати контент для різних каналів комунікації.',
        caption: 'Fashion-зйомка',
        points: [
          { title: 'Комерційна фотозйомка', text: 'Fashion і предметна зйомка, щоб товари виглядали так, що їх хочеться купити.' },
          { title: 'Відеоконтент', text: 'Короткі ролики, які привертають увагу в соцмережах і на сайті.' },
          { title: 'Контент для соцмереж', text: 'Публікації й шаблони у вашому стилі, щоб сторінка виглядала цілісно.' },
          { title: 'Постобробка', text: 'Ретуш і кольорокорекція, щоб усі фото виглядали як одна серія.' },
        ],
      },
    },
  },
  stages: {
    eyebrow: 'Як ми працюємо',
    title: 'Від першої розмови до запуску',
    lead: 'Для кожного проєкту визначаємо необхідні етапи, строки та результати роботи. Ви заздалегідь знаєте, як буде організована співпраця та коли потрібна ваша участь.',
    counter: 'Етап {n} / {total}',
    items: [
      {
        title: 'Підготовка',
        tabs: [
          { title: 'Знайомство', text: 'Обговорюємо ваші цілі, очікування, бюджет і строки. Перша консультація безкоштовна.' },
          { title: 'Дослідження', text: 'Збираємо інформацію, необхідну для прийняття обґрунтованих рішень.' },
          { title: 'План роботи', text: 'Визначаємо обсяг проєкту, етапи та результати, які ви отримаєте.' },
        ],
      },
      {
        title: 'Дизайн',
        tabs: [
          { title: 'Концепція', text: 'Представляємо візуальні рішення та разом обираємо напрям подальшої роботи.' },
          { title: 'Деталізація', text: 'Розвиваємо обрану концепцію відповідно до погодженого обсягу проєкту.' },
          { title: 'Погодження', text: 'Переглядаємо результат разом із вами та вносимо необхідні коригування.' },
        ],
      },
      {
        title: 'Реалізація',
        tabs: [
          { title: 'Розробка', text: 'Для сайтів та інтернет-магазинів реалізуємо погоджений дизайн і функціонал.' },
          { title: 'Підготовка матеріалів', text: 'Для брендингу та контенту готуємо файли у форматах, необхідних для подальшого використання.' },
          { title: 'Передача в розробку', text: 'Для UI/UX-проєктів організовуємо дизайн-файли та пояснення для вашої команди розробників.' },
        ],
      },
      {
        title: 'Завершення і запуск',
        tabs: [
          { title: 'Перевірка', text: 'Перевіряємо відповідність результату погодженим вимогам і готовність до використання.' },
          { title: 'Передача проєкту', text: 'Передаємо фінальні матеріали або запускаємо сайт. За потреби пояснюємо, як працювати з готовим рішенням.' },
          { title: 'Після запуску', text: 'Для розроблених нами сайтів протягом місяця безкоштовно усуваємо помилки, що виникли з нашого боку.' },
        ],
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Часті питання',
    items: [
      {
        q: 'Скільки коштує проєкт?',
        a: 'Вартість залежить від обсягу робіт, складності завдання та необхідних послуг. Остаточну пропозицію готуємо після обговорення проєкту.',
        link: { lead: 'Орієнтовний бюджет можна розрахувати в', text: `калькуляторі${N}вартості`, path: '/calculator/' },
      },
      { q: 'Що потрібно підготувати перед початком роботи?', a: 'Достатньо описати ваш бізнес, цілі та очікуваний результат. Якщо у вас є технічне завдання, брендбук або інші матеріали, вони допоможуть нам швидше розібратися в проєкті.' },
      { q: 'Скільки часу займає робота над проєктом?', a: 'Тривалість залежить від обсягу робіт і складності проєкту. Строки визначаємо до початку співпраці та погоджуємо разом із вами.' },
      { q: 'Чи можна почати з невеликого замовлення?', a: 'Так. Ви можете окремо замовити UX-аудит, дослідження або розробку логотипа. Якщо після завершення аналізу вирішите не продовжувати проєкт, оплачуєте лише виконану роботу.' },
      { q: 'Як проходить оплата?', a: `Оплата здійснюється частинами. Для сайтів: 30${N}% на початку роботи, 50${N}% після погодження дизайну та 20${N}% після завершення проєкту. Для логотипів: 70${N}% на початку та 30${N}% після завершення.` },
      { q: 'Скільки правок входить у вартість?', a: 'На кожному етапі передбачено три раунди правок. Зміни, що виходять за межі погодженого завдання, зокрема повна зміна концепції, оцінюються окремо.' },
      { q: 'Чи працюєте ви з клієнтами з інших країн?', a: 'Так. Наша студія розташована у Франції та приймає замовлення від клієнтів з інших країн. Усі етапи співпраці, від першої консультації до передачі готового проєкту, можуть проходити дистанційно.' },
    ],
  },
  cta: {
    title: 'Розкажіть про свій проєкт',
    text: ['Обговоримо ваші цілі, можливі рішення та бюджет.', 'Після зустрічі ви отримаєте пропозицію з обсягом робіт, вартістю та строками реалізації.'],
    call: 'Записатися на дзвінок',
    message: 'Написати нам',
  },
};

const en: ServicesText = {
  meta: {
    title: 'Services — Lindigo Design Studio',
    description: 'We help businesses create new products, develop existing ones and build a recognisable brand.',
  },
  hero: {
    crumbs: ['Home', 'Services'],
    title: 'We give shape to your ideas',
    lead: 'We help businesses create new products, develop existing ones and build a recognisable brand. We combine branding, design, technology and visual content to meet your business needs.',
  },
  situations: {
    eyebrow: 'Find your solution',
    title: 'Start with your situation',
    lead: 'It is not always clear which service your business needs. Choose the situation that best describes yours to discover a possible solution.',
    listLabel: 'Situations',
    link: 'Explore this service',
    pending: '',
    items: [
      {
        title: 'Visitors come to your website but don’t get in touch',
        direction: 'sites',
        solution: { title: 'End-to-end website development', text: 'We identify what prevents visitors from becoming customers. We improve your website’s structure, content and design to make it easier for people to contact you.' },
      },
      {
        title: 'You are launching a business or refreshing its image',
        direction: 'branding',
        solution: { title: 'Branding and website', text: 'We help shape your company’s visual identity and establish its online presence. We develop your brand and website as parts of a single project.' },
      },
      {
        title: 'Your website, social media and documents look inconsistent',
        direction: 'branding',
        solution: { title: 'Brand guidelines', text: 'We create clear guidelines for designing materials that your team and external partners can follow.' },
      },
      {
        title: 'You have products, but online sales remain low',
        direction: 'shop',
        solution: { title: 'Online store and photography', text: 'We examine how customers choose products and place orders. We improve how your range is presented and remove obstacles along the path to purchase.' },
      },
      {
        title: 'You need to present an idea to investors before development',
        direction: 'uiux',
        solution: { title: 'Interactive prototype', text: 'We create an interactive model of your future product. It helps you demonstrate your idea without the expense of full-scale development.' },
      },
      {
        title: 'Users sign up for your service but don’t use it',
        direction: 'uiux',
        solution: { title: 'UX audit and redesign', text: 'We investigate where users lose interest or encounter difficulties. We recommend changes based on our findings.' },
      },
      {
        title: 'Your product is growing and needs new features',
        direction: 'uiux',
        solution: { title: 'Product development', text: 'We integrate new features into the existing interface while preserving its logic and familiar interaction patterns.' },
      },
      {
        title: 'You need professional visuals for your website or advertising',
        direction: 'photo',
        solution: { title: 'Photography and content', text: 'We create visual materials that help introduce your products, services and team to potential customers.' },
      },
    ],
  },
  projects: {
    eyebrow: 'Portfolio',
    title: 'Selected projects',
    all: 'All projects',
    items: [
      { slug: 'datatixx', caption: 'DataTixx — website' },
      { slug: 'frelia', caption: 'Frelia — app and branding' },
    ],
  },
  directions: {
    eyebrow: 'Areas of expertise',
    title: 'Design and technology for business',
    lead: 'Each service can be commissioned separately or combined with others, depending on your business needs.',
    includes: 'What’s included',
    items: {
      uiux: {
        title: 'UI/UX design and prototyping',
        more: 'Explore UI/UX design',
        text: 'We design web applications, mobile apps and complex websites. We help determine which features your product needs, how they should work and how to present them through an intuitive interface.',
        caption: 'Frelia — app and branding',
        points: [
          { title: 'UX research', text: 'We speak with users and study competitors to identify where people encounter difficulties.' },
          { title: 'Structure and user flows', text: 'We determine which screens are needed and how users reach their goals.' },
          { title: 'UI design', text: 'Consistent screen designs with components that developers can easily work with.' },
          { title: 'Prototyping', text: 'A clickable model to assess usability before development begins.' },
        ],
      },
      sites: {
        title: 'End-to-end website development',
        more: 'Explore website development',
        text: 'We create landing pages, business showcase websites and corporate websites that introduce your company, explain the benefits of your services and help you connect with customers. You receive a ready-to-use website on your own domain.',
        caption: 'DataTixx — website',
        points: [
          { title: 'Structure and copywriting', text: 'We plan your pages and write copy that explains how you can help your customers.' },
          { title: 'Web design', text: 'A website that reflects your brand and is easy to use on desktop and mobile.' },
          { title: 'Web development', text: 'A fast website with the features you need: forms, bookings and payments.' },
          { title: 'SEO and analytics', text: 'Help customers find you on Google and see where they come from.' },
        ],
      },
      shop: {
        title: 'Online stores',
        more: 'Explore online stores',
        text: 'We develop online stores for businesses starting to sell online or looking to improve an existing store. We take into account your product range, customer needs and order processing workflows.',
        caption: 'Luigi Contessi — personal website with e-commerce',
        points: [
          { title: 'Catalogue and search', text: 'Categories and filters that help customers find products in a few clicks.' },
          { title: 'Product pages', text: 'Photos, prices, specifications and delivery information in one place, so customers don’t need to ask for additional details.' },
          { title: 'Cart and payment', text: 'A streamlined checkout and convenient payment options.' },
          { title: 'Platform and development', text: 'Shopify, WordPress + WooCommerce or custom code, selected to suit your product range and budget.' },
        ],
      },
      branding: {
        title: 'Branding and logo design',
        more: 'Explore branding',
        text: 'We develop your brand’s visual identity based on its character, values and positioning. We help your company stand out from competitors and build a recognisable image.',
        caption: 'Marishami — beauty salon in Cannes',
        points: [
          { title: 'Logo', text: 'A mark that remains clear on both a shop sign and a small icon.' },
          { title: 'Visual identity', text: 'Colours, typography and graphics that make your brand recognisable.' },
          { title: 'Brand guidelines', text: 'Rules that help your team and external partners maintain a consistent style.' },
          { title: 'Branded materials', text: 'Ready-to-use business cards, social media templates and presentation templates.' },
        ],
      },
      photo: {
        title: 'Photography and content',
        more: 'Explore content services',
        text: 'We create photography, video and visual materials for commercial projects. We help showcase your products and services, convey your brand’s atmosphere and prepare content for different communication channels.',
        caption: 'Fashion photoshoot',
        points: [
          { title: 'Commercial photography', text: 'Fashion and product photography that makes your products appealing to buyers.' },
          { title: 'Video content', text: 'Short videos that capture attention on social media and your website.' },
          { title: 'Social media content', text: 'Posts and templates in your brand’s style for a cohesive online presence.' },
          { title: 'Post-production', text: 'Retouching and colour correction for a consistent series of photographs.' },
        ],
      },
    },
  },
  stages: {
    eyebrow: 'How we work',
    title: 'From the first conversation to launch',
    lead: 'For each project, we define the necessary stages, timelines and deliverables. You know in advance how we will work together and when your input is needed.',
    counter: 'Stage {n} / {total}',
    items: [
      {
        title: 'Preparation',
        tabs: [
          { title: 'Getting to know your project', text: 'We discuss your goals, expectations, budget and timeline. The first consultation is free.' },
          { title: 'Research', text: 'We gather the information needed to make informed decisions.' },
          { title: 'Project plan', text: 'We define the project scope, stages and deliverables.' },
        ],
      },
      {
        title: 'Design',
        tabs: [
          { title: 'Concept', text: 'We present visual solutions and choose the direction together.' },
          { title: 'Refinement', text: 'We develop the selected concept within the agreed project scope.' },
          { title: 'Approval', text: 'We review the result with you and make the necessary adjustments.' },
        ],
      },
      {
        title: 'Implementation',
        tabs: [
          { title: 'Development', text: 'For websites and online stores, we implement the agreed design and functionality.' },
          { title: 'Asset preparation', text: 'For branding and content projects, we prepare files in the formats needed for future use.' },
          { title: 'Developer handoff', text: 'For UI/UX projects, we organise design files and documentation for your development team.' },
        ],
      },
      {
        title: 'Completion and launch',
        tabs: [
          { title: 'Quality checks', text: 'We check that the result meets the agreed requirements and is ready to use.' },
          { title: 'Project handover', text: 'We deliver the final materials or launch your website. Where needed, we explain how to use the finished solution.' },
          { title: 'After launch', text: 'For websites we develop, we fix issues caused by our work free of charge for one month.' },
        ],
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    items: [
      {
        q: 'How much does a project cost?',
        a: 'The cost depends on the scope, complexity and services required. We prepare a final proposal after discussing your project.',
        link: { lead: 'You can estimate your budget using our', text: `pricing${N}calculator`, path: '/calculator/' },
      },
      { q: 'What do I need to prepare before we start?', a: 'Simply describe your business, goals and expected outcome. If you have a project brief, brand guidelines or other materials, they will help us understand your project more quickly.' },
      { q: 'How long does a project take?', a: 'The timeline depends on the scope and complexity of the project. We establish and agree on deadlines with you before work begins.' },
      { q: 'Can I start with a small project?', a: 'Yes. You can commission a UX audit, research or logo design as a standalone service. If you decide not to continue after the analysis, you only pay for the work completed.' },
      { q: 'How does payment work?', a: `Payment is made in instalments. For websites: 30${N}% at the start, 50${N}% after design approval and 20${N}% upon completion. For logos: 70${N}% at the start and 30${N}% upon completion.` },
      { q: 'How many revisions are included?', a: 'Three rounds of revisions are included at each stage. Changes outside the agreed scope, including a complete change of concept, are priced separately.' },
      { q: 'Do you work with international clients?', a: 'Yes. Our studio is based in France and accepts projects from clients in other countries. Every stage of collaboration, from the initial consultation to final delivery, can take place remotely.' },
    ],
  },
  cta: {
    title: 'Tell us about your project',
    text: ['We will discuss your goals, possible solutions and budget.', 'After the meeting, you will receive a proposal outlining the scope, cost and project timeline.'],
    call: 'Book a call',
    message: 'Contact us',
  },
};

const fr: ServicesText = {
  meta: {
    title: 'Services — Lindigo Design Studio',
    description: 'Nous aidons les entreprises à créer de nouveaux produits, à faire évoluer ceux qui existent déjà et à construire une marque reconnaissable.',
  },
  hero: {
    crumbs: ['Accueil', 'Services'],
    title: 'Nous donnons forme à vos idées',
    lead: 'Nous aidons les entreprises à créer de nouveaux produits, à faire évoluer ceux qui existent déjà et à construire une marque reconnaissable. Nous associons branding, design, technologie et contenu visuel pour répondre à vos besoins.',
  },
  situations: {
    eyebrow: 'Trouver une solution',
    title: 'Partons de votre situation',
    lead: 'Il n’est pas toujours évident de savoir de quel service votre entreprise a besoin. Choisissez la situation qui vous correspond le mieux pour découvrir une solution possible.',
    listLabel: 'Situations',
    link: 'Découvrir le service',
    pending: '',
    items: [
      {
        title: 'Votre site attire des visiteurs, mais vous recevez peu de demandes',
        direction: 'sites',
        solution: { title: 'Création de sites web clés en main', text: 'Nous analysons ce qui empêche les visiteurs de devenir clients. Nous améliorons la structure, le contenu et le design de votre site pour faciliter la prise de contact.' },
      },
      {
        title: 'Vous lancez votre entreprise ou souhaitez renouveler son image',
        direction: 'branding',
        solution: { title: 'Branding et site web', text: 'Nous vous aidons à définir l’identité visuelle de votre entreprise et à la présenter en ligne. Nous concevons votre marque et votre site dans le cadre d’un même projet.' },
      },
      {
        title: 'Votre site, vos réseaux sociaux et vos documents manquent de cohérence',
        direction: 'branding',
        solution: { title: 'Charte graphique', text: 'Nous créons des règles de présentation claires que votre équipe et vos prestataires pourront appliquer à leurs supports.' },
      },
      {
        title: 'Vous avez des produits, mais vos ventes en ligne restent faibles',
        direction: 'shop',
        solution: { title: 'Boutique en ligne et photographie', text: 'Nous étudions la manière dont les clients choisissent leurs produits et passent commande. Nous améliorons la présentation de votre offre et supprimons les obstacles à l’achat.' },
      },
      {
        title: 'Vous devez présenter une idée à des investisseurs avant le développement',
        direction: 'uiux',
        solution: { title: 'Prototype interactif', text: 'Nous créons une maquette interactive de votre futur produit. Elle vous permet de présenter votre idée sans engager les frais d’un développement complet.' },
      },
      {
        title: 'Les utilisateurs s’inscrivent à votre service, mais ne l’utilisent pas',
        direction: 'uiux',
        solution: { title: 'Audit UX et refonte', text: 'Nous identifions les étapes où les utilisateurs perdent leur intérêt ou rencontrent des difficultés. Nous proposons des améliorations à partir de nos observations.' },
      },
      {
        title: 'Votre produit évolue et nécessite de nouvelles fonctionnalités',
        direction: 'uiux',
        solution: { title: 'Évolution du produit', text: 'Nous intégrons de nouvelles fonctionnalités à l’interface existante tout en préservant sa logique et les habitudes des utilisateurs.' },
      },
      {
        title: 'Vous avez besoin de visuels professionnels pour votre site ou vos publicités',
        direction: 'photo',
        solution: { title: 'Photographie et contenu', text: 'Nous créons des supports visuels qui vous aident à présenter vos produits, vos services et votre équipe à vos futurs clients.' },
      },
    ],
  },
  projects: {
    eyebrow: 'Portfolio',
    title: 'Sélection de projets',
    all: 'Tous les projets',
    items: [
      { slug: 'datatixx', caption: 'DataTixx — site web' },
      { slug: 'frelia', caption: 'Frelia — application et branding' },
    ],
  },
  directions: {
    eyebrow: 'Domaines d’expertise',
    title: 'Design et technologies pour les entreprises',
    lead: 'Chaque prestation peut être commandée séparément ou associée à d’autres, selon les besoins de votre entreprise.',
    includes: 'Ce qui est inclus',
    items: {
      uiux: {
        title: 'Design UI/UX et prototypage',
        more: 'Découvrir le design UI/UX',
        text: 'Nous concevons des applications web, des applications mobiles et des sites complexes. Nous vous aidons à définir les fonctionnalités nécessaires à votre produit, leur fonctionnement et la manière de les présenter dans une interface intuitive.',
        caption: 'Frelia — application et branding',
        points: [
          { title: 'Recherche UX', text: 'Nous échangeons avec les utilisateurs et étudions les concurrents pour identifier les difficultés rencontrées.' },
          { title: 'Structure et parcours utilisateurs', text: 'Nous définissons les écrans nécessaires et les étapes qui permettent aux utilisateurs d’atteindre leur objectif.' },
          { title: 'Design UI', text: 'Des écrans au style cohérent, avec des composants faciles à exploiter par les développeurs.' },
          { title: 'Prototypage', text: 'Une maquette cliquable pour vérifier la facilité d’utilisation du produit avant le développement.' },
        ],
      },
      sites: {
        title: 'Création de sites web clés en main',
        more: 'Découvrir la création de sites web',
        text: 'Nous créons des landing pages, des sites vitrines et des sites institutionnels pour présenter votre entreprise, expliquer les avantages de vos services et faciliter le contact avec vos clients. Vous disposez d’un site prêt à l’emploi sur votre propre nom de domaine.',
        caption: 'DataTixx — site web',
        points: [
          { title: 'Structure et rédaction', text: 'Nous organisons les pages et rédigeons des textes qui expliquent ce que vous apportez à vos clients.' },
          { title: 'Webdesign', text: 'Un site à l’image de votre marque, facile à utiliser sur ordinateur comme sur mobile.' },
          { title: 'Développement web', text: `Un site rapide avec les fonctionnalités nécessaires${N}: formulaires, réservation, paiement.` },
          { title: 'SEO et suivi d’audience', text: 'Aider vos clients à vous trouver sur Google et identifier d’où ils viennent.' },
        ],
      },
      shop: {
        title: 'Boutiques en ligne',
        more: 'Découvrir les boutiques en ligne',
        text: 'Nous développons des boutiques en ligne pour les entreprises qui souhaitent se lancer dans la vente en ligne ou améliorer leur boutique existante. Nous tenons compte de votre gamme de produits, des besoins de vos clients et de vos processus de gestion des commandes.',
        caption: 'Luigi Contessi — site personnel avec espace e-commerce',
        points: [
          { title: 'Catalogue et recherche', text: 'Des catégories et des filtres pour trouver un produit en quelques clics.' },
          { title: 'Fiches produits', text: 'Photos, prix, caractéristiques et informations de livraison réunis au même endroit pour éviter aux clients d’avoir à demander des précisions.' },
          { title: 'Panier et paiement', text: 'Un parcours de commande simplifié et des moyens de paiement pratiques.' },
          { title: 'Plateforme et développement', text: 'Shopify, WordPress + WooCommerce ou développement sur mesure, selon votre gamme de produits et votre budget.' },
        ],
      },
      branding: {
        title: 'Branding et création de logos',
        more: 'Découvrir le branding',
        text: 'Nous développons l’identité visuelle de votre marque à partir de son caractère, de ses valeurs et de son positionnement. Nous aidons votre entreprise à se distinguer de ses concurrents et à construire une image reconnaissable.',
        caption: 'Marishami — institut de beauté à Cannes',
        points: [
          { title: 'Logo', text: 'Un signe graphique lisible aussi bien sur une enseigne que sur une petite icône.' },
          { title: 'Identité visuelle', text: 'Des couleurs, des typographies et des éléments graphiques qui rendent votre marque reconnaissable.' },
          { title: 'Charte graphique', text: 'Des règles permettant à votre équipe et à vos prestataires de conserver un style cohérent.' },
          { title: 'Supports de communication', text: 'Cartes de visite, modèles pour les réseaux sociaux et présentations, prêts à l’emploi.' },
        ],
      },
      photo: {
        title: 'Photographie et création de contenu',
        more: 'Découvrir la création de contenu',
        text: 'Nous créons des photos, des vidéos et des supports visuels pour vos projets commerciaux. Nous vous aidons à mettre en valeur vos produits et services, à transmettre l’univers de votre marque et à préparer du contenu pour différents canaux de communication.',
        caption: 'Séance photo de mode',
        points: [
          { title: 'Photographie commerciale', text: 'Photographie de mode et de produits pour donner envie d’acheter.' },
          { title: 'Contenu vidéo', text: 'Des vidéos courtes qui attirent l’attention sur les réseaux sociaux et votre site.' },
          { title: 'Contenu pour les réseaux sociaux', text: 'Des publications et des modèles à l’image de votre marque pour une présence en ligne cohérente.' },
          { title: 'Postproduction', text: 'Retouche et correction colorimétrique pour obtenir une série de photos homogène.' },
        ],
      },
    },
  },
  stages: {
    eyebrow: 'Notre méthode de travail',
    title: 'Du premier échange au lancement',
    lead: 'Pour chaque projet, nous définissons les étapes nécessaires, les délais et les livrables. Vous savez à l’avance comment la collaboration sera organisée et à quels moments votre participation sera nécessaire.',
    counter: 'Étape {n} / {total}',
    items: [
      {
        title: 'Préparation',
        tabs: [
          { title: 'Premier échange', text: 'Nous discutons de vos objectifs, de vos attentes, de votre budget et de vos délais. La première consultation est gratuite.' },
          { title: 'Recherche', text: 'Nous recueillons les informations nécessaires pour prendre des décisions éclairées.' },
          { title: 'Plan de travail', text: 'Nous définissons le périmètre du projet, les étapes et les livrables.' },
        ],
      },
      {
        title: 'Design',
        tabs: [
          { title: 'Concept', text: 'Nous présentons des pistes visuelles et choisissons ensemble la direction à suivre.' },
          { title: 'Approfondissement', text: 'Nous développons le concept retenu dans le respect du périmètre convenu.' },
          { title: 'Validation', text: 'Nous examinons le résultat avec vous et apportons les ajustements nécessaires.' },
        ],
      },
      {
        title: 'Réalisation',
        tabs: [
          { title: 'Développement', text: 'Pour les sites et boutiques en ligne, nous intégrons le design et les fonctionnalités validés.' },
          { title: 'Préparation des supports', text: 'Pour le branding et le contenu, nous préparons les fichiers dans les formats nécessaires à leur utilisation.' },
          { title: 'Transmission aux développeurs', text: 'Pour les projets UI/UX, nous organisons les fichiers de design et les explications destinées à votre équipe de développement.' },
        ],
      },
      {
        title: 'Finalisation et lancement',
        tabs: [
          { title: 'Vérification', text: 'Nous vérifions que le résultat répond aux exigences convenues et qu’il est prêt à être utilisé.' },
          { title: 'Livraison du projet', text: 'Nous remettons les supports finaux ou mettons votre site en ligne. Si nécessaire, nous vous expliquons comment utiliser la solution livrée.' },
          { title: 'Après le lancement', text: 'Pour les sites que nous développons, nous corrigeons gratuitement pendant un mois les erreurs imputables à notre travail.' },
        ],
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions fréquentes',
    items: [
      {
        q: `Combien coûte un projet${N}?`,
        a: 'Le prix dépend du périmètre des travaux, de la complexité du projet et des prestations nécessaires. Nous préparons une proposition définitive après avoir échangé sur votre projet.',
        link: { lead: 'Vous pouvez estimer votre budget grâce à notre', text: `calculateur${N}de${N}prix`, path: '/calculator/' },
      },
      { q: `Que faut-il préparer avant de commencer${N}?`, a: 'Il suffit de nous présenter votre entreprise, vos objectifs et le résultat attendu. Si vous disposez d’un cahier des charges, d’une charte graphique ou d’autres documents, ils nous aideront à comprendre votre projet plus rapidement.' },
      { q: `Combien de temps dure un projet${N}?`, a: 'La durée dépend du périmètre et de la complexité du projet. Nous définissons les délais avant le début de la collaboration et les validons avec vous.' },
      { q: `Puis-je commencer par une petite prestation${N}?`, a: 'Oui. Vous pouvez commander séparément un audit UX, une étude ou la création d’un logo. Si vous décidez de ne pas poursuivre le projet après l’analyse, vous ne payez que le travail effectué.' },
      { q: `Comment se déroule le paiement${N}?`, a: `Le paiement s’effectue en plusieurs fois. Pour les sites web${N}: 30${N}% au démarrage, 50${N}% après validation du design et 20${N}% à la livraison. Pour les logos${N}: 70${N}% au démarrage et 30${N}% à la livraison.` },
      { q: `Combien de séries de modifications sont incluses dans le prix${N}?`, a: 'Trois séries de modifications sont prévues à chaque étape. Les changements qui dépassent le périmètre convenu, notamment une modification complète du concept, font l’objet d’une estimation séparée.' },
      { q: `Travaillez-vous avec des clients à l’international${N}?`, a: 'Oui. Notre studio est basé en France et accepte des projets de clients situés dans d’autres pays. Toutes les étapes de la collaboration, de la première consultation à la livraison finale, peuvent se dérouler à distance.' },
    ],
  },
  cta: {
    title: 'Parlez-nous de votre projet',
    text: ['Nous échangerons sur vos objectifs, les solutions possibles et votre budget.', 'À l’issue de cet échange, vous recevrez une proposition précisant le périmètre des travaux, le coût et les délais de réalisation.'],
    call: 'Réserver un appel',
    message: 'Nous écrire',
  },
};

export const servicesText: Record<Locale, ServicesText> = { fr, en, uk };
