/**
 * Тексти калькулятора вартості (сторінка /calculator/). Ключі — id напрямів, питань і варіантів з src/data/calculator.ts.
 * UK — з макета Figma «Калькулятор — UI dark (1512)» і специфікації; тексти для напрямів, яких немає в макеті
 * (UI/UX, магазин, брендинг, фото), і блок «Що входить» для них — ЧЕРНЕТКА, на вичитку.
 * FR і EN — ЧЕРНЕТКА перекладу (Claude, 24.11.2026), на вичитку.
 *
 * Плейсхолдери: {n} — число, {price}, {full}, {design}, {low}, {high} — суми (форматує компонент за мовою), {name} — назва.
 * Нерозривні пробіли (N): перед « : ; ? ! » у французькій, між числом і словом, між двома останніми словами.
 */
import type { Locale } from './ui';

const N = ' ';

export interface CalcOptionText {
  title: string;
  text?: string;
  /** Як варіант звучить у рядку «З чого складається» (за замовчуванням — title) */
  line?: string;
}
export interface CalcQuestionText {
  title: string;
  hint?: string;
  /** Коротка назва у зведенні запиту: «Бренд: лише логотип» */
  short?: string;
  options?: Record<string, CalcOptionText>;
}
export interface CalcIncludedItem {
  title: string;
  text: string;
}

export interface CalcTexts {
  meta: { title: string; description: string };
  hero: { crumbs: [string, string]; crumbsLabel: string; title: string; lead: string };
  steps: [string, string, string, string, string, string];
  stepsLabel: string;
  /** «Крок {n} · {name}» */
  stepLabel: string;
  serviceQuestion: string;
  services: Record<string, { title: string; text: string }>;
  questions: Record<string, Record<string, CalcQuestionText>>;
  price: { from: string; perPage: string; plus: string; perMonth: string; custom: string; percent: string };
  counter: { minus: string; plus: string; over: string };
  languages: Record<string, string>;
  lines: { screens: string; pages: string; copy: string; copyLanding: string; pace: string; products: string; monthly: string };
  summary: {
    label: string;
    tax: string;
    breakdown: string;
    empty: string;
    custom: string;
    customText: string;
    note: string;
    vat: string;
    advice: string;
    call: string;
    restart: string;
    /** Для екранного читача: «Орієнтовно: від {low} до {high} HT» */
    range: string;
  };
  included: { eyebrow: string; lead: string; titles: Record<string, string>; items: Record<string, CalcIncludedItem[]> };
  mobile: { bar: string; toResult: string };
  /** Покроковий показ */
  flow: {
    next: string;
    back: string;
    change: string;
    /** Кнопка панелі за номером наступного кроку: nextTo[n - 1] — «Далі: <крок n>» */
    nextTo: [string, string, string, string, string, string];
    recommended: string;
    nothing: string;
    units: { screens: string; pages: string };
    dateLabel: string;
    /** Чому «Далі» неактивна на кроці 1 */
    needChoice: string;
  };
  contact: {
    title: string;
    name: string;
    email: string;
    comment: string;
    commentHint: string;
    callTitle: string;
    callHint: string;
    yes: string;
    no: string;
    callLink: string;
    submit: string;
    sending: string;
    note: string;
    privacy: string;
    errName: string;
    errEmail: string;
    /** Посилання на сайт (крок 6, лише якщо сайт є) */
    site: string;
    siteShort: string;
    errSite: string;
    /** {email} — адреса студії */
    failed: string;
    failedLink: string;
    /** Тема листа: {service} */
    subject: string;
  };
  thanks: { eyebrow: string; title: string; text: string; summary: string; call: string };
  noscript: { text: string; link: string };
  estimate: { service: string; total: string };
}

// TVA: на всіх мовах той самий французький текст (специфікація, правило 5)
const VAT = 'TVA non applicable, art. 293 B du CGI';

export const calcUi: Record<Locale, CalcTexts> = {
  uk: {
    meta: {
      title: 'Калькулятор вартості проєкту — Lindigo Design Studio',
      description: 'Оберіть, що потрібно, і дайте відповідь на кілька питань. Ви одразу побачите орієнтовну вартість і з чого вона складається.',
    },
    hero: {
      crumbs: ['Головна', 'Калькулятор'],
      crumbsLabel: 'Хлібні крихти',
      title: 'Скільки коштує ваш проєкт?',
      lead: 'Оберіть, що потрібно, і дайте відповідь на кілька питань. Ви одразу побачите орієнтовну вартість і з чого вона складається. Точну ціну назвемо після короткої розмови.',
    },
    steps: ['Напрям', 'Параметри', 'Доповнення', 'Про проєкт', 'Темп', 'Контакти'],
    stepsLabel: 'Кроки калькулятора',
    stepLabel: 'Крок {n} · {name}',
    serviceQuestion: 'Що потрібно?',
    services: {
      uiux: { title: 'UI/UX і прототипи', text: 'Застосунки, вебсервіси, прототипи' },
      sites: { title: 'Сайт під ключ', text: 'Лендинг, візитівка, корпоративний' },
      shop: { title: 'Інтернет-магазин', text: 'Shopify або власний код' },
      branding: { title: 'Брендинг і логотипи', text: 'Логотип, стиль, брендбук' },
      content: { title: 'Фото й контент', text: 'Зйомка й публікації для соцмереж' },
    },
    questions: {
      uiux: {
        type: {
          title: 'Що проєктуємо?',
          options: {
            prototype: { title: 'Клікабельний прототип', text: `Ключовий сценарій, до 10${N}екранів` },
            mobile: { title: 'Мобільний застосунок', text: `Одна платформа, до 20${N}екранів` },
            webservice: { title: 'Вебсервіс', text: `Кабінет чи платформа, до 25${N}екранів` },
          },
        },
        screens: {
          title: 'Скільки екранів?',
          hint: `До {n}${N}екранів уже у вартості. Кожен наступний — +{price}. Екран — це окремий вид: головна, профіль, кошик, налаштування.`,
        },
        addons: {
          title: 'Що додати?',
          hint: 'Можна нічого не обирати.',
          options: {
            interviews: { title: 'Інтерв’ю з користувачами', text: 'Дізнаємося, що людям справді потрібно' },
            testing: { title: 'Тестування прототипу з користувачами', text: 'Перевіряємо, чи все зрозуміло без підказок' },
            ds: { title: 'Дизайн-система для розробників', text: 'Компоненти, стани й правила в одному файлі' },
            platform2: { title: 'Друга платформа', text: 'Вебверсія й застосунок разом' },
          },
        },
      },
      sites: {
        siteGoal: {
          title: 'Що хочете зробити із сайтом?',
          short: 'Що зробити',
          options: {
            redesign: { title: 'Оновити дизайн', text: 'Сторінки й тексти лишаються, змінюється вигляд і зручність', line: 'оновити дизайн' },
            rebuild: { title: 'Зробити новий сайт замість старого', text: 'Новий сайт з нуля, старий — лише відправна точка', line: 'новий сайт замість старого' },
            partial: { title: 'Змінити окремі сторінки або додати функцію', text: 'Нова сторінка, форма, запис, блог у наявному сайті', line: 'змінити окремі сторінки або додати функцію' },
          },
        },
        type: {
          title: 'Який сайт?',
          options: {
            landing: { title: 'Лендинг', text: 'Одна сторінка про один продукт або послугу' },
            vitrine: { title: 'Сайт-візитівка', text: `До 5${N}сторінок: про вас, послуги, контакти` },
            corporate: { title: 'Корпоративний сайт', text: `До 10${N}сторінок, кілька розділів` },
          },
        },
        scope: {
          title: 'Що потрібно для сайту?',
          options: {
            design: { title: 'Лише дизайн', text: 'Макети для вашого розробника', line: 'лише дизайн' },
            full: { title: 'Дизайн і розробка', text: 'Готовий сайт на вашому домені', line: 'дизайн і розробка' },
          },
        },
        pages: {
          title: 'Скільки сторінок?',
          hint: `До {n}${N}сторінок уже у вартості. Кожна наступна — +{full}, лише дизайн — +{design}.`,
        },
        languages: {
          title: 'Скільки мов?',
          hint: 'Кожна мова понад першу — +{price}. Переклад робите ви, або оцінимо його окремо.',
        },
        copy: {
          title: 'Хто пише тексти?',
          options: {
            ready: { title: 'Тексти вже готові', text: 'Ви надсилаєте тексти, ми розміщуємо їх на сайті' },
            studio: { title: 'Тексти від студії', text: 'Пишемо просто й зрозуміло, під ваших клієнтів' },
          },
        },
        addons: {
          title: 'Що додати?',
          hint: 'Можна нічого не обирати.',
          options: {
            content_migration: { title: 'Перенесення вмісту зі старого сайту', text: 'Тексти, фото й сторінки переносимо самі' },
            logo: { title: 'Потрібен логотип', text: 'Логотип з логобуком: правила, як ним користуватися' },
            rebrand: { title: 'Потрібен ребрендинг', text: 'Новий логотип і фірмовий стиль замість старого' },
            blog: { title: 'Блог', text: 'Публікації, які ви додаєте самі' },
            booking: { title: 'Онлайн-запис', text: 'Клієнти бронюють час просто на сайті' },
            support: { title: 'Підтримка після запуску', text: 'Оновлення, резервні копії, дрібні правки. Оплата щомісяця, у суму не входить' },
          },
        },
      },
      shop: {
        siteGoal: {
          title: 'Що хочете зробити з магазином?',
          short: 'Що зробити',
          options: {
            redesign: { title: 'Оновити дизайн магазину', text: 'Сторінки й тексти лишаються, змінюється вигляд і зручність', line: 'оновити дизайн магазину' },
            rebuild: { title: 'Зробити новий магазин замість старого', text: 'Новий магазин з нуля, старий — лише відправна точка', line: 'новий магазин замість старого' },
            partial: { title: 'Змінити окремі сторінки або додати функцію', text: 'Нова сторінка, форма, запис, блог у наявному магазині', line: 'змінити окремі сторінки або додати функцію' },
          },
        },
        platform: {
          title: 'На чому зробити магазин?',
          options: {
            shopify: { title: 'Shopify', text: 'Готова платформа для продажів онлайн' },
            custom: { title: 'Власний код', text: 'Магазин, зроблений саме під вас' },
            unsure: { title: 'Не знаю — порадьте', text: 'Підкажемо на дзвінку, що вам краще' },
          },
        },
        products: {
          title: 'Скільки товарів?',
          options: {
            upTo50: { title: 'До 50', line: 'до 50' },
            upTo300: { title: '50–300', line: '50–300' },
            over300: { title: 'Понад 300', line: 'понад 300' },
          },
        },
        languages: {
          title: 'Скільки мов?',
          hint: 'Кожна мова понад першу — +{price}. Переклад робите ви, або оцінимо його окремо.',
        },
        addons: {
          title: 'Що додати?',
          hint: 'Можна нічого не обирати.',
          options: {
            content_migration: { title: 'Перенесення товарів і сторінок зі старого магазину', text: 'Товари, фото й сторінки переносимо самі' },
            photos: { title: 'Фото товарів від студії', text: 'Зйомка пів дня з обробкою' },
            logo: { title: 'Потрібен логотип', text: 'Логотип з логобуком: правила, як ним користуватися' },
            rebrand: { title: 'Потрібен ребрендинг', text: 'Новий логотип і фірмовий стиль замість старого' },
          },
        },
      },
      branding: {
        type: {
          title: 'Що саме потрібно?',
          options: {
            logo: { title: 'Логотип з логобуком', text: 'Логотип і правила, як ним користуватися' },
            identity: { title: 'Логотип і фірмовий стиль', text: 'Логотип, кольори, шрифти й графіка' },
            full: { title: 'Повний брендинг', text: 'Логотип, стиль і брендбук' },
            logobook: { title: 'Логобук для готового логотипа', text: 'У вас уже є логотип, але немає правил, як ним користуватися' },
            brandbook: { title: 'Брендбук для готового стилю', text: 'У вас уже є логотип і стиль, але кожен підрядник застосовує їх по-своєму' },
          },
        },
        media: {
          title: 'Що ще оформити?',
          hint: 'Можна нічого не обирати.',
          options: {
            card: { title: 'Візитка', text: 'Макет і файл для друкарні' },
            social: { title: 'Шаблони для соцмереж', text: 'Дописи й сторіз у вашому стилі' },
            deck: { title: 'Шаблон презентації', text: 'Слайди, які легко заповнити самим' },
          },
        },
      },
      content: {
        type: {
          title: 'Що саме потрібно?',
          options: {
            shoot: { title: 'Зйомка', text: 'Fashion, товари, портрет' },
            social: { title: 'Контент для соцмереж', text: 'Пакет публікацій' },
          },
        },
        duration: {
          title: 'Скільки триває зйомка?',
          options: {
            half: { title: 'Пів дня', text: 'З обробкою', line: 'пів дня' },
            full: { title: 'Повний день', text: 'З обробкою', line: 'повний день' },
            multi: { title: 'Кілька днів', text: 'Оцінимо індивідуально', line: 'кілька днів' },
          },
        },
        addons: {
          title: 'Що додати?',
          hint: 'Можна нічого не обирати.',
          options: {
            video: { title: 'Короткі відео для соцмереж', text: `До 3${N}відео` },
            retouch: { title: 'Розширена ретуш', text: 'Детальна обробка кожного кадру' },
          },
        },
      },
      common: {
        pace: {
          title: 'Який темп?',
          options: {
            normal: { title: 'Звичайний', text: 'Проєкт іде в роботу за чергою', line: 'звичайний' },
            priority: { title: 'Пріоритет', text: 'Ваш проєкт іде першим у черзі', line: 'пріоритет' },
          },
        },
        hasSite: {
          title: 'Чи є у вас сайт?',
          short: 'Сайт є',
          options: { yes: { title: 'Так', line: 'так' }, no: { title: 'Ні', line: 'ні' } },
        },
        sitePains: {
          title: 'Що зараз не працює?',
          hint: 'Можна пропустити. Це допоможе нам підготуватися до розмови.',
          short: 'Що не працює',
          options: {
            outdated: { title: 'Застарілий вигляд', line: 'застарілий вигляд' },
            few_leads: { title: 'Мало заявок', line: 'мало заявок' },
            mobile: { title: 'Незручно з телефону', line: 'незручно з телефону' },
            hard_to_update: { title: 'Важко оновлювати самим', line: 'важко оновлювати самим' },
            slow: { title: 'Повільно завантажується', line: 'повільно завантажується' },
            off_brand: { title: 'Не схожий на наш бренд', line: 'не схожий на наш бренд' },
          },
        },
        brand: {
          title: 'Чи є у вас бренд?',
          short: 'Бренд',
          options: {
            none: { title: 'Ще немає', line: 'ще немає' },
            logo: { title: 'Лише логотип', line: 'лише логотип' },
            full: { title: 'Логотип і брендбук', line: 'логотип і брендбук' },
            rebrand: { title: 'Потрібен ребрендинг', line: 'потрібен ребрендинг' },
          },
        },
        start: {
          title: 'Коли плануєте почати?',
          hint: 'Точний строк погоджуємо в пропозиції для вашого проєкту.',
          short: 'Початок',
          options: {
            exploring: { title: 'Поки вивчаю варіанти', line: 'поки вивчаю варіанти' },
            soon: { title: 'Найближчим часом', line: 'найближчим часом' },
            months: { title: `За 1–3${N}місяці`, line: `за 1–3${N}місяці` },
            later: { title: 'Пізніше', line: 'пізніше' },
          },
        },
        deadline: {
          title: 'Чи є бажаний термін завершення?',
          short: 'Термін',
          options: { flexible: { title: 'Гнучкий', line: 'гнучкий' }, date: { title: 'Є конкретна дата', line: 'конкретна дата' } },
        },
        sea: {
          title: 'Що ви любите більше: море чи гори?',
          hint: 'Необов’язкове питання. Нам просто цікаво.',
          short: 'Море чи гори',
          options: { sea: { title: 'Море', line: 'море' }, mountains: { title: 'Гори', line: 'гори' }, both: { title: 'Обидва', line: 'обидва' } },
        },
        budget: {
          title: 'Ця сума вам підходить?',
          short: 'Сума',
          options: {
            yes: { title: 'Так', line: 'так' },
            cheaper: { title: 'Хочу дешевший варіант', line: 'хочу дешевший варіант' },
            discuss: { title: 'Обговоримо', line: 'обговоримо' },
          },
        },
      },
    },
    price: { from: 'від {price}', perPage: '+ {price} за сторінку', plus: '+ {price}', perMonth: 'від {price} / міс.', custom: 'Індивідуально', percent: '+ {n} %' },
    counter: { minus: 'Менше', plus: 'Більше', over: 'Понад {n} — оцінимо індивідуально.' },
    languages: { '1': '1 мова', '2': '2 мови', '3': '3 мови' },
    lines: {
      screens: 'Додаткові екрани: {n}',
      pages: 'Додаткові сторінки: {n}',
      copy: `Тексти від студії, {n}${N}стор.`,
      copyLanding: 'Тексти від студії',
      pace: 'Темп: {name}',
      products: 'Товарів: {name}',
      monthly: 'від {price} / міс.',
    },
    summary: {
      label: 'Орієнтовна вартість',
      tax: 'HT',
      breakdown: 'З чого складається',
      empty: 'Оберіть напрям, і тут з’явиться орієнтовна вартість.',
      custom: 'Потрібна індивідуальна оцінка',
      customText: 'Такий проєкт виходить за межі звичайних пакетів. Розкажіть про нього, і ми підготуємо оцінку.',
      note: 'Це орієнтовна вартість. Точну назвемо після короткої розмови, коли дізнаємося деталі проєкту.',
      vat: VAT,
      advice: 'Платформу підкажемо на дзвінку.',
      call: 'Записатися на дзвінок',
      restart: 'Почати спочатку',
      range: 'Орієнтовно: від {low} до {high} HT',
    },
    included: {
      eyebrow: 'Що входить',
      lead: 'Кожен етап уже враховано у вартості.',
      titles: {
        uiux: 'Що входить в UI/UX-дизайн',
        sites: 'Що входить у сайт під ключ',
        shop: 'Що входить в інтернет-магазин',
        branding: 'Що входить у брендинг',
        content: 'Що входить у зйомку',
      },
      items: {
        uiux: [
          { title: 'Дослідження', text: 'Вивчаємо ваших користувачів і конкурентів.' },
          { title: 'Структура', text: 'Плануємо екрани й шлях користувача до мети.' },
          { title: 'Дизайн', text: 'Екрани у стилі вашого бренду, з усіма станами.' },
          { title: 'Прототип', text: 'Клікабельний прототип, який можна показати команді.' },
        ],
        sites: [
          { title: 'Структура', text: 'Плануємо сторінки й шлях відвідувача до заявки.' },
          { title: 'Дизайн', text: 'Макети для комп’ютера й телефона у стилі вашого бренду.' },
          { title: 'Розробка', text: 'Швидкий сайт, який добре видно в пошуку Google.' },
          { title: 'Запуск', text: 'Підключаємо домен і аналітику, показуємо, як оновлювати сайт.' },
        ],
        'sites-design': [
          { title: 'Структура', text: 'Плануємо сторінки й шлях відвідувача до заявки.' },
          { title: 'Дизайн', text: 'Макети для комп’ютера й телефона у стилі вашого бренду.' },
          { title: 'Прототип', text: 'Клікабельні макети, щоб побачити сайт до розробки.' },
          { title: 'Передача', text: 'Готуємо файли й пояснення для вашого розробника.' },
        ],
        shop: [
          { title: 'Структура', text: 'Плануємо каталог і шлях покупця до оплати.' },
          { title: 'Дизайн', text: 'Макети для комп’ютера й телефона у стилі вашого бренду.' },
          { title: 'Налаштування', text: 'Каталог, кошик, оплата й доставка.' },
          { title: 'Запуск', text: 'Підключаємо домен і аналітику, показуємо, як додавати товари.' },
        ],
        branding: [
          { title: 'Дослідження', text: 'Вивчаємо ваш ринок, конкурентів і клієнтів.' },
          { title: 'Концепції', text: 'Показуємо кілька напрямів і обираємо разом.' },
          { title: 'Дизайн', text: 'Доводимо обраний варіант до готових файлів.' },
          { title: 'Правила', text: 'Пояснюємо, як користуватися логотипом і стилем.' },
        ],
        content: [
          { title: 'Підготовка', text: 'Плануємо зйомку під мету: сайт, запуск, соцмережі.' },
          { title: 'Зйомка', text: 'Знімаємо в студії або на локації.' },
          { title: 'Обробка', text: 'Колір і базова ретуш кожного кадру.' },
          { title: 'Передача', text: 'Готові файли для сайту й соцмереж.' },
        ],
      },
    },
    mobile: { bar: 'Орієнтовно', toResult: 'До результату' },
    flow: {
      next: 'Далі',
      back: 'Назад',
      change: 'Змінити',
      nextTo: ['Далі: напрям', 'Далі: параметри', 'Далі: доповнення', 'Далі: про ваш проєкт', 'Далі: темп', 'Далі: контакти'],
      recommended: 'Рекомендовано',
      nothing: 'нічого не обрано',
      units: { screens: `{n}${N}екранів`, pages: `{n}${N}стор.` },
      dateLabel: 'Бажана дата завершення',
      needChoice: 'Оберіть варіант, щоб продовжити.',
    },
    contact: {
      title: 'Куди надіслати точну оцінку?',
      name: 'Ім’я',
      email: 'Email',
      comment: 'Розкажіть про проєкт',
      commentHint: 'Ваш вибір у калькуляторі вже тут — можете доповнити.',
      callTitle: 'Подзвонити вам, щоб обговорити оцінку?',
      callHint: 'Якщо так, ви оберете зручний час для дзвінка.',
      yes: 'Так',
      no: 'Ні',
      callLink: 'Обрати час для дзвінка',
      submit: 'Надіслати повідомлення',
      sending: 'Надсилаємо…',
      note: 'Кожен запит ми переглядаємо особисто і відповідаємо протягом двох робочих днів.',
      privacy: `Політика${N}конфіденційності`,
      errName: 'Напишіть, як до вас звертатися.',
      errEmail: 'Перевірте email: схоже, в ньому помилка.',
      site: 'Посилання на ваш сайт',
      siteShort: 'Посилання',
      errSite: 'Схоже, в адресі помилка. Перевірте, будь ласка.',
      failed: `Не вдалося надіслати запит. Напишіть нам на {email}: ваш вибір уже в${N}листі.`,
      failedLink: 'Відкрити лист',
      subject: 'Запит з калькулятора: {service}',
    },
    thanks: {
      eyebrow: 'Запит надіслано',
      title: 'Дякуємо! Ми отримали ваш запит',
      text: 'Переглянемо його особисто й відповімо протягом двох робочих днів.',
      summary: 'Ваш вибір',
      call: 'Дзвінок',
    },
    noscript: { text: 'Увімкніть JavaScript, щоб скористатися калькулятором, або напишіть нам.', link: 'Написати нам' },
    estimate: { service: 'Напрям', total: 'Орієнтовно' },
  },

  fr: {
    meta: {
      title: 'Calculateur de coût de projet — Lindigo Design Studio',
      description: 'Choisissez ce dont vous avez besoin et répondez à quelques questions. Vous verrez tout de suite le coût estimé et ce qui le compose.',
    },
    hero: {
      crumbs: ['Accueil', 'Calculateur'],
      crumbsLabel: 'Fil d’Ariane',
      title: `Combien coûte votre projet${N}?`,
      lead: 'Choisissez ce dont vous avez besoin et répondez à quelques questions. Vous verrez tout de suite le coût estimé et ce qui le compose. Nous vous donnerons le prix exact après un court échange.',
    },
    steps: ['Domaine', 'Paramètres', 'Options', 'Votre projet', 'Rythme', 'Contact'],
    stepsLabel: 'Étapes du calculateur',
    stepLabel: 'Étape {n} · {name}',
    serviceQuestion: `De quoi avez-vous besoin${N}?`,
    services: {
      uiux: { title: 'UI/UX et prototypes', text: 'Applications, services web, prototypes' },
      sites: { title: 'Site clés en main', text: 'Landing page, site vitrine, site d’entreprise' },
      shop: { title: 'Boutique en ligne', text: 'Shopify ou développement sur mesure' },
      branding: { title: 'Branding et logos', text: 'Logo, identité visuelle, charte graphique' },
      content: { title: 'Photo et contenu', text: 'Shootings et publications pour les réseaux sociaux' },
    },
    questions: {
      uiux: {
        type: {
          title: `Que concevons-nous${N}?`,
          options: {
            prototype: { title: 'Prototype interactif', text: `Un parcours clé, jusqu’à 10${N}écrans` },
            mobile: { title: 'Application mobile', text: `Une plateforme, jusqu’à 20${N}écrans` },
            webservice: { title: 'Application web', text: `Espace client ou plateforme, jusqu’à 25${N}écrans` },
          },
        },
        screens: {
          title: `Combien d’écrans${N}?`,
          hint: `Jusqu’à {n}${N}écrans inclus dans le prix. Chaque écran supplémentaire${N}: +{price}. Un écran est une vue distincte${N}: accueil, profil, panier, paramètres.`,
        },
        addons: {
          title: `Que souhaitez-vous ajouter${N}?`,
          hint: 'Vous pouvez ne rien choisir.',
          options: {
            interviews: { title: 'Entretiens utilisateurs', text: 'Pour comprendre ce dont les gens ont vraiment besoin' },
            testing: { title: 'Tests du prototype avec des utilisateurs', text: 'Nous vérifions que tout est clair sans explications' },
            ds: { title: 'Design system pour les développeurs', text: 'Composants, états et règles dans un seul fichier' },
            platform2: { title: 'Deuxième plateforme', text: 'Version web et application ensemble' },
          },
        },
      },
      sites: {
        siteGoal: {
          title: `Que voulez-vous faire de votre site${N}?`,
          short: 'À faire',
          options: {
            redesign: { title: 'Refaire le design', text: 'Les pages et les textes restent, l’apparence et l’ergonomie changent', line: 'refaire le design' },
            rebuild: { title: 'Créer un nouveau site à la place de l’ancien', text: 'Un nouveau site de zéro, l’ancien sert de point de départ', line: 'nouveau site à la place de l’ancien' },
            partial: { title: 'Modifier des pages ou ajouter une fonction', text: 'Une nouvelle page, un formulaire, la réservation, un blog sur votre site actuel', line: 'modifier des pages ou ajouter une fonction' },
          },
        },
        type: {
          title: `Quel site${N}?`,
          options: {
            landing: { title: 'Landing page', text: 'Une page pour un produit ou un service' },
            vitrine: { title: 'Site vitrine', text: `Jusqu’à 5${N}pages${N}: à propos, services, contact` },
            corporate: { title: 'Site d’entreprise', text: `Jusqu’à 10${N}pages, plusieurs rubriques` },
          },
        },
        scope: {
          title: `De quoi avez-vous besoin pour le site${N}?`,
          options: {
            design: { title: 'Design seul', text: 'Maquettes pour votre développeur', line: 'design seul' },
            full: { title: 'Design et développement', text: 'Un site prêt à l’emploi sur votre domaine', line: 'design et développement' },
          },
        },
        pages: {
          title: `Combien de pages${N}?`,
          hint: `Jusqu’à {n}${N}pages incluses dans le prix. Chaque page supplémentaire${N}: +{full}, design seul${N}: +{design}.`,
        },
        languages: {
          title: `Combien de langues${N}?`,
          hint: `Chaque langue en plus de la première${N}: +{price}. La traduction est à votre charge, ou nous l’estimons séparément.`,
        },
        copy: {
          title: `Qui rédige les textes${N}?`,
          options: {
            ready: { title: 'Textes déjà prêts', text: 'Vous nous envoyez les textes, nous les intégrons au site' },
            studio: { title: 'Textes rédigés par le studio', text: 'Des textes simples et clairs, pensés pour vos clients' },
          },
        },
        addons: {
          title: `Que souhaitez-vous ajouter${N}?`,
          hint: 'Vous pouvez ne rien choisir.',
          options: {
            content_migration: { title: 'Migration du contenu de l’ancien site', text: 'Nous transférons nous-mêmes les textes, les photos et les pages' },
            logo: { title: 'Besoin d’un logo', text: `Logo avec logobook${N}: les règles pour bien l’utiliser` },
            rebrand: { title: 'Besoin d’un rebranding', text: 'Un nouveau logo et une nouvelle identité à la place des anciens' },
            blog: { title: 'Blog', text: 'Des articles que vous publiez vous-même' },
            booking: { title: 'Réservation en ligne', text: 'Vos clients réservent directement sur le site' },
            support: { title: 'Maintenance après la mise en ligne', text: 'Mises à jour, sauvegardes, petites modifications. Paiement mensuel, non inclus dans le total' },
          },
        },
      },
      shop: {
        siteGoal: {
          title: `Que voulez-vous faire de votre boutique${N}?`,
          short: 'À faire',
          options: {
            redesign: { title: 'Refaire le design de la boutique', text: 'Les pages et les textes restent, l’apparence et l’ergonomie changent', line: 'refaire le design de la boutique' },
            rebuild: { title: 'Créer une nouvelle boutique à la place de l’ancienne', text: 'Une nouvelle boutique de zéro, l’ancienne sert de point de départ', line: 'nouvelle boutique à la place de l’ancienne' },
            partial: { title: 'Modifier des pages ou ajouter une fonction', text: 'Une nouvelle page, un formulaire, la réservation, un blog sur votre boutique actuelle', line: 'modifier des pages ou ajouter une fonction' },
          },
        },
        platform: {
          title: `Sur quelle plateforme${N}?`,
          options: {
            shopify: { title: 'Shopify', text: 'Une plateforme prête pour la vente en ligne' },
            custom: { title: 'Développement sur mesure', text: 'Une boutique conçue spécialement pour vous' },
            unsure: { title: 'Je ne sais pas — conseillez-moi', text: 'Nous en parlerons lors de l’appel' },
          },
        },
        products: {
          title: `Combien de produits${N}?`,
          options: {
            upTo50: { title: `Jusqu’à 50`, line: 'jusqu’à 50' },
            upTo300: { title: '50 à 300', line: '50 à 300' },
            over300: { title: 'Plus de 300', line: 'plus de 300' },
          },
        },
        languages: {
          title: `Combien de langues${N}?`,
          hint: `Chaque langue en plus de la première${N}: +{price}. La traduction est à votre charge, ou nous l’estimons séparément.`,
        },
        addons: {
          title: `Que souhaitez-vous ajouter${N}?`,
          hint: 'Vous pouvez ne rien choisir.',
          options: {
            content_migration: { title: 'Migration des produits et des pages de l’ancienne boutique', text: 'Nous transférons nous-mêmes les produits, les photos et les pages' },
            photos: { title: 'Photos produits par le studio', text: 'Une demi-journée de shooting, retouches comprises' },
            logo: { title: 'Besoin d’un logo', text: `Logo avec logobook${N}: les règles pour bien l’utiliser` },
            rebrand: { title: 'Besoin d’un rebranding', text: 'Un nouveau logo et une nouvelle identité à la place des anciens' },
          },
        },
      },
      branding: {
        type: {
          title: `De quoi avez-vous besoin exactement${N}?`,
          options: {
            logo: { title: 'Logo avec logobook', text: 'Le logo et les règles pour l’utiliser' },
            identity: { title: 'Logo et identité visuelle', text: 'Logo, couleurs, typographies et éléments graphiques' },
            full: { title: 'Branding complet', text: 'Logo, identité visuelle et charte graphique' },
            logobook: { title: 'Logobook pour un logo existant', text: 'Vous avez déjà un logo, mais pas de règles pour l’utiliser' },
            brandbook: { title: 'Charte graphique pour une identité existante', text: 'Vous avez déjà un logo et un style, mais chaque prestataire les applique à sa façon' },
          },
        },
        media: {
          title: `Quels supports créer${N}?`,
          hint: 'Vous pouvez ne rien choisir.',
          options: {
            card: { title: 'Carte de visite', text: 'Maquette et fichier pour l’imprimeur' },
            social: { title: 'Modèles pour les réseaux sociaux', text: 'Publications et stories à votre image' },
            deck: { title: 'Modèle de présentation', text: 'Des slides faciles à remplir vous-même' },
          },
        },
      },
      content: {
        type: {
          title: `De quoi avez-vous besoin exactement${N}?`,
          options: {
            shoot: { title: 'Shooting', text: 'Mode, produits, portrait' },
            social: { title: 'Contenu pour les réseaux sociaux', text: 'Un pack de publications' },
          },
        },
        duration: {
          title: `Quelle durée de shooting${N}?`,
          options: {
            half: { title: 'Demi-journée', text: 'Retouches comprises', line: 'demi-journée' },
            full: { title: 'Journée complète', text: 'Retouches comprises', line: 'journée complète' },
            multi: { title: 'Plusieurs jours', text: 'Estimation sur mesure', line: 'plusieurs jours' },
          },
        },
        addons: {
          title: `Que souhaitez-vous ajouter${N}?`,
          hint: 'Vous pouvez ne rien choisir.',
          options: {
            video: { title: 'Vidéos courtes pour les réseaux sociaux', text: `Jusqu’à 3${N}vidéos` },
            retouch: { title: 'Retouche avancée', text: 'Un travail détaillé sur chaque image' },
          },
        },
      },
      common: {
        pace: {
          title: `Quel rythme${N}?`,
          options: {
            normal: { title: 'Standard', text: 'Le projet démarre selon notre planning', line: 'standard' },
            priority: { title: 'Prioritaire', text: 'Votre projet passe en premier', line: 'prioritaire' },
          },
        },
        hasSite: {
          title: `Avez-vous déjà un site${N}?`,
          short: 'Site existant',
          options: { yes: { title: 'Oui', line: 'oui' }, no: { title: 'Non', line: 'non' } },
        },
        sitePains: {
          title: `Qu’est-ce qui ne fonctionne pas aujourd’hui${N}?`,
          hint: 'Vous pouvez passer cette question. Elle nous aide à préparer l’échange.',
          short: 'Ce qui ne va pas',
          options: {
            outdated: { title: 'Un look daté', line: 'un look daté' },
            few_leads: { title: 'Peu de demandes', line: 'peu de demandes' },
            mobile: { title: 'Pas pratique sur mobile', line: 'pas pratique sur mobile' },
            hard_to_update: { title: 'Difficile à mettre à jour', line: 'difficile à mettre à jour' },
            slow: { title: 'Lent à charger', line: 'lent à charger' },
            off_brand: { title: 'Ne ressemble pas à notre marque', line: 'ne ressemble pas à notre marque' },
          },
        },
        brand: {
          title: `Avez-vous déjà une identité de marque${N}?`,
          short: 'Marque',
          options: {
            none: { title: 'Pas encore', line: 'pas encore' },
            logo: { title: 'Seulement un logo', line: 'seulement un logo' },
            full: { title: 'Logo et charte graphique', line: 'logo et charte graphique' },
            rebrand: { title: 'Besoin d’un rebranding', line: 'besoin d’un rebranding' },
          },
        },
        start: {
          title: `Quand souhaitez-vous commencer${N}?`,
          hint: 'Le délai précis est fixé dans la proposition pour votre projet.',
          short: 'Démarrage',
          options: {
            exploring: { title: 'Je compare les options', line: 'je compare les options' },
            soon: { title: 'Dès que possible', line: 'dès que possible' },
            months: { title: `Dans 1 à 3${N}mois`, line: `dans 1 à 3${N}mois` },
            later: { title: 'Plus tard', line: 'plus tard' },
          },
        },
        deadline: {
          title: `Avez-vous une date de fin souhaitée${N}?`,
          short: 'Échéance',
          options: { flexible: { title: 'Flexible', line: 'flexible' }, date: { title: 'Une date précise', line: 'date précise' } },
        },
        sea: {
          title: `Vous préférez la mer ou la montagne${N}?`,
          hint: 'Question facultative. Simple curiosité.',
          short: 'Mer ou montagne',
          options: { sea: { title: 'La mer', line: 'la mer' }, mountains: { title: 'La montagne', line: 'la montagne' }, both: { title: 'Les deux', line: 'les deux' } },
        },
        budget: {
          title: `Ce montant vous convient-il${N}?`,
          short: 'Montant',
          options: {
            yes: { title: 'Oui', line: 'oui' },
            cheaper: { title: 'Je cherche moins cher', line: 'je cherche moins cher' },
            discuss: { title: 'À discuter', line: 'à discuter' },
          },
        },
      },
    },
    price: { from: 'à partir de {price}', perPage: '+ {price} par page', plus: '+ {price}', perMonth: 'à partir de {price} / mois', custom: 'Sur mesure', percent: `+ {n}${N}%` },
    counter: { minus: 'Moins', plus: 'Plus', over: `Plus de {n}${N}: estimation sur mesure.` },
    languages: { '1': `1${N}langue`, '2': `2${N}langues`, '3': `3${N}langues` },
    lines: {
      screens: `Écrans supplémentaires${N}: {n}`,
      pages: `Pages supplémentaires${N}: {n}`,
      copy: `Textes par le studio, {n}${N}p.`,
      copyLanding: 'Textes par le studio',
      pace: `Rythme${N}: {name}`,
      products: `Produits${N}: {name}`,
      monthly: 'dès {price} / mois',
    },
    summary: {
      label: 'Coût estimé',
      tax: 'HT',
      breakdown: 'Détail',
      empty: 'Choisissez un domaine pour voir le coût estimé.',
      custom: 'Estimation sur mesure nécessaire',
      customText: 'Ce projet sort du cadre de nos formules. Parlez-nous-en, et nous préparerons une estimation.',
      note: 'Il s’agit d’un coût estimé. Nous vous donnerons le prix exact après un court échange, une fois les détails du projet connus.',
      vat: VAT,
      advice: 'Nous vous conseillerons sur la plateforme lors de l’appel.',
      call: 'Réserver un appel',
      restart: 'Recommencer',
      range: `Coût estimé${N}: de {low} à {high} HT`,
    },
    included: {
      eyebrow: 'Ce qui est inclus',
      lead: 'Chaque étape est déjà comprise dans le prix.',
      titles: {
        uiux: 'Ce qui est inclus dans le design UI/UX',
        sites: 'Ce qui est inclus dans un site clés en main',
        shop: 'Ce qui est inclus dans une boutique en ligne',
        branding: 'Ce qui est inclus dans le branding',
        content: 'Ce qui est inclus dans un shooting',
      },
      items: {
        uiux: [
          { title: 'Recherche', text: 'Nous étudions vos utilisateurs et vos concurrents.' },
          { title: 'Structure', text: 'Nous planifions les écrans et le parcours de l’utilisateur.' },
          { title: 'Design', text: 'Des écrans à l’image de votre marque, avec tous leurs états.' },
          { title: 'Prototype', text: 'Un prototype interactif à montrer à votre équipe.' },
        ],
        sites: [
          { title: 'Structure', text: 'Nous planifions les pages et le parcours du visiteur jusqu’à la demande de contact.' },
          { title: 'Design', text: 'Des maquettes pour ordinateur et smartphone à l’image de votre marque.' },
          { title: 'Développement', text: 'Un site rapide et bien visible dans Google.' },
          { title: 'Mise en ligne', text: 'Nous connectons le domaine et les statistiques, et vous montrons comment mettre le site à jour.' },
        ],
        'sites-design': [
          { title: 'Structure', text: 'Nous planifions les pages et le parcours du visiteur jusqu’à la demande de contact.' },
          { title: 'Design', text: 'Des maquettes pour ordinateur et smartphone à l’image de votre marque.' },
          { title: 'Prototype', text: 'Des maquettes cliquables pour voir le site avant le développement.' },
          { title: 'Transmission', text: 'Nous préparons les fichiers et les explications pour votre développeur.' },
        ],
        shop: [
          { title: 'Structure', text: 'Nous planifions le catalogue et le parcours de l’acheteur jusqu’au paiement.' },
          { title: 'Design', text: 'Des maquettes pour ordinateur et smartphone à l’image de votre marque.' },
          { title: 'Configuration', text: 'Catalogue, panier, paiement et livraison.' },
          { title: 'Mise en ligne', text: 'Nous connectons le domaine et les statistiques, et vous montrons comment ajouter des produits.' },
        ],
        branding: [
          { title: 'Recherche', text: 'Nous étudions votre marché, vos concurrents et vos clients.' },
          { title: 'Pistes', text: 'Nous présentons plusieurs directions et choisissons ensemble.' },
          { title: 'Design', text: 'Nous finalisons la piste retenue jusqu’aux fichiers prêts à l’emploi.' },
          { title: 'Règles', text: 'Nous expliquons comment utiliser le logo et l’identité visuelle.' },
        ],
        content: [
          { title: 'Préparation', text: `Nous planifions le shooting selon l’objectif${N}: site, lancement, réseaux sociaux.` },
          { title: 'Shooting', text: 'En studio ou en extérieur.' },
          { title: 'Retouche', text: 'Couleurs et retouche de base sur chaque image.' },
          { title: 'Livraison', text: 'Des fichiers prêts pour le site et les réseaux sociaux.' },
        ],
      },
    },
    mobile: { bar: 'Estimation', toResult: 'Voir le résultat' },
    flow: {
      next: 'Suivant',
      back: 'Retour',
      change: 'Modifier',
      nextTo: [`Suivant${N}: domaine`, `Suivant${N}: paramètres`, `Suivant${N}: options`, `Suivant${N}: votre projet`, `Suivant${N}: rythme`, `Suivant${N}: contact`],
      recommended: 'Recommandé',
      nothing: 'rien de choisi',
      units: { screens: `{n}${N}écrans`, pages: `{n}${N}pages` },
      dateLabel: 'Date de fin souhaitée',
      needChoice: 'Choisissez une option pour continuer.',
    },
    contact: {
      title: `Où envoyer l’estimation précise${N}?`,
      name: 'Nom',
      email: 'E-mail',
      comment: 'Parlez-nous de votre projet',
      commentHint: `Vos choix dans le calculateur sont déjà là${N}: complétez-les si vous le souhaitez.`,
      callTitle: `Souhaitez-vous qu’on vous appelle pour en parler${N}?`,
      callHint: 'Si oui, vous choisirez un créneau qui vous convient.',
      yes: 'Oui',
      no: 'Non',
      callLink: 'Choisir un créneau',
      submit: 'Envoyer le message',
      sending: 'Envoi…',
      note: 'Nous lisons chaque demande personnellement et répondons sous deux jours ouvrés.',
      privacy: `Politique de${N}confidentialité`,
      errName: 'Indiquez votre nom.',
      errEmail: `Vérifiez l’adresse e-mail${N}: elle semble incorrecte.`,
      site: 'Lien vers votre site',
      siteShort: 'Lien',
      errSite: 'L’adresse semble incorrecte. Vérifiez-la, s’il vous plaît.',
      failed: `La demande n’a pas pu être envoyée. Écrivez-nous à {email}${N}: vos choix sont déjà dans le${N}message.`,
      failedLink: 'Ouvrir le message',
      subject: `Demande depuis le calculateur${N}: {service}`,
    },
    thanks: {
      eyebrow: 'Demande envoyée',
      title: `Merci${N}! Nous avons bien reçu votre demande`,
      text: 'Nous la lisons personnellement et vous répondons sous deux jours ouvrés.',
      summary: 'Vos choix',
      call: 'Appel',
    },
    noscript: { text: 'Activez JavaScript pour utiliser le calculateur, ou écrivez-nous.', link: 'Nous écrire' },
    estimate: { service: 'Domaine', total: 'Estimation' },
  },

  en: {
    meta: {
      title: 'Project cost calculator — Lindigo Design Studio',
      description: 'Choose what you need and answer a few questions. You’ll see the estimated cost right away, and what it’s made of.',
    },
    hero: {
      crumbs: ['Home', 'Calculator'],
      crumbsLabel: 'Breadcrumbs',
      title: 'How much does your project cost?',
      lead: 'Choose what you need and answer a few questions. You’ll see the estimated cost right away, and what it’s made of. We’ll give you the exact price after a short call.',
    },
    steps: ['Service', 'Details', 'Extras', 'Your project', 'Pace', 'Contact'],
    stepsLabel: 'Calculator steps',
    stepLabel: 'Step {n} · {name}',
    serviceQuestion: 'What do you need?',
    services: {
      uiux: { title: 'UI/UX and prototypes', text: 'Apps, web services, prototypes' },
      sites: { title: 'Turnkey website', text: 'Landing page, small business site, corporate site' },
      shop: { title: 'Online store', text: 'Shopify or custom code' },
      branding: { title: 'Branding and logos', text: 'Logo, visual identity, brand book' },
      content: { title: 'Photo and content', text: 'Photo shoots and social media posts' },
    },
    questions: {
      uiux: {
        type: {
          title: 'What are we designing?',
          options: {
            prototype: { title: 'Clickable prototype', text: `One key user flow, up to 10${N}screens` },
            mobile: { title: 'Mobile app', text: `One platform, up to 20${N}screens` },
            webservice: { title: 'Web app', text: `Client area or platform, up to 25${N}screens` },
          },
        },
        screens: {
          title: 'How many screens?',
          hint: `Up to {n}${N}screens are included. Each extra screen is +{price}. A screen is one separate view: home, profile, cart, settings.`,
        },
        addons: {
          title: 'What would you like to add?',
          hint: 'You can leave this empty.',
          options: {
            interviews: { title: 'User interviews', text: 'We find out what people really need' },
            testing: { title: 'Prototype testing with users', text: 'We check that everything is clear without help' },
            ds: { title: 'Design system for developers', text: 'Components, states and rules in one file' },
            platform2: { title: 'Second platform', text: 'Web version and app together' },
          },
        },
      },
      sites: {
        siteGoal: {
          title: 'What do you want to do with your website?',
          short: 'Goal',
          options: {
            redesign: { title: 'Refresh the design', text: 'Pages and copy stay; the look and usability change', line: 'refresh the design' },
            rebuild: { title: 'Build a new site to replace the old one', text: 'A new site from scratch; the old one is just a starting point', line: 'a new site to replace the old one' },
            partial: { title: 'Change some pages or add a feature', text: 'A new page, a form, booking or a blog on your current site', line: 'change some pages or add a feature' },
          },
        },
        type: {
          title: 'Which website?',
          options: {
            landing: { title: 'Landing page', text: 'One page about one product or service' },
            vitrine: { title: 'Small business site', text: `Up to 5${N}pages: about, services, contact` },
            corporate: { title: 'Corporate website', text: `Up to 10${N}pages, several sections` },
          },
        },
        scope: {
          title: 'What do you need for the website?',
          options: {
            design: { title: 'Design only', text: 'Mockups for your developer', line: 'design only' },
            full: { title: 'Design and development', text: 'A ready website on your domain', line: 'design and development' },
          },
        },
        pages: {
          title: 'How many pages?',
          hint: `Up to {n}${N}pages are included. Each extra page is +{full}, or +{design} for design only.`,
        },
        languages: {
          title: 'How many languages?',
          hint: 'Each language after the first is +{price}. You provide the translation, or we quote it separately.',
        },
        copy: {
          title: 'Who writes the copy?',
          options: {
            ready: { title: 'The copy is ready', text: 'You send us the texts, we put them on the site' },
            studio: { title: 'Copy by the studio', text: 'Simple, clear texts written for your clients' },
          },
        },
        addons: {
          title: 'What would you like to add?',
          hint: 'You can leave this empty.',
          options: {
            content_migration: { title: 'Content migration from the old site', text: 'We move the copy, photos and pages for you' },
            logo: { title: 'I need a logo', text: 'Logo with a logo book: rules on how to use it' },
            rebrand: { title: 'I need a rebrand', text: 'A new logo and visual identity to replace the old ones' },
            blog: { title: 'Blog', text: 'Posts you add yourself' },
            booking: { title: 'Online booking', text: 'Clients book a time right on the site' },
            support: { title: 'Support after launch', text: 'Updates, backups, small edits. Paid monthly, not included in the total' },
          },
        },
      },
      shop: {
        siteGoal: {
          title: 'What do you want to do with your store?',
          short: 'Goal',
          options: {
            redesign: { title: 'Refresh the store design', text: 'Pages and copy stay; the look and usability change', line: 'refresh the store design' },
            rebuild: { title: 'Build a new store to replace the old one', text: 'A new store from scratch; the old one is just a starting point', line: 'a new store to replace the old one' },
            partial: { title: 'Change some pages or add a feature', text: 'A new page, a form, booking or a blog on your current store', line: 'change some pages or add a feature' },
          },
        },
        platform: {
          title: 'Which platform?',
          options: {
            shopify: { title: 'Shopify', text: 'A ready platform for selling online' },
            custom: { title: 'Custom code', text: 'A store built just for you' },
            unsure: { title: 'Not sure — advise me', text: 'We’ll help you choose on the call' },
          },
        },
        products: {
          title: 'How many products?',
          options: {
            upTo50: { title: 'Up to 50', line: 'up to 50' },
            upTo300: { title: '50–300', line: '50–300' },
            over300: { title: 'Over 300', line: 'over 300' },
          },
        },
        languages: {
          title: 'How many languages?',
          hint: 'Each language after the first is +{price}. You provide the translation, or we quote it separately.',
        },
        addons: {
          title: 'What would you like to add?',
          hint: 'You can leave this empty.',
          options: {
            content_migration: { title: 'Moving products and pages from the old store', text: 'We move the products, photos and pages for you' },
            photos: { title: 'Product photos by the studio', text: 'A half-day shoot with editing' },
            logo: { title: 'I need a logo', text: 'Logo with a logo book: rules on how to use it' },
            rebrand: { title: 'I need a rebrand', text: 'A new logo and visual identity to replace the old ones' },
          },
        },
      },
      branding: {
        type: {
          title: 'What exactly do you need?',
          options: {
            logo: { title: 'Logo with a logo book', text: 'A logo and rules on how to use it' },
            identity: { title: 'Logo and visual identity', text: 'Logo, colours, fonts and graphics' },
            full: { title: 'Full branding', text: 'Logo, visual identity and brand book' },
            logobook: { title: 'Logo book for an existing logo', text: 'You already have a logo, but no rules on how to use it' },
            brandbook: { title: 'Brand book for an existing identity', text: 'You already have a logo and style, but every contractor uses them differently' },
          },
        },
        media: {
          title: 'What else should we design?',
          hint: 'You can leave this empty.',
          options: {
            card: { title: 'Business card', text: 'Design and print-ready file' },
            social: { title: 'Social media templates', text: 'Posts and stories in your style' },
            deck: { title: 'Presentation template', text: 'Slides that are easy to fill in yourself' },
          },
        },
      },
      content: {
        type: {
          title: 'What exactly do you need?',
          options: {
            shoot: { title: 'Photo shoot', text: 'Fashion, products, portrait' },
            social: { title: 'Social media content', text: 'A pack of posts' },
          },
        },
        duration: {
          title: 'How long is the shoot?',
          options: {
            half: { title: 'Half a day', text: 'Editing included', line: 'half a day' },
            full: { title: 'Full day', text: 'Editing included', line: 'full day' },
            multi: { title: 'Several days', text: 'Custom quote', line: 'several days' },
          },
        },
        addons: {
          title: 'What would you like to add?',
          hint: 'You can leave this empty.',
          options: {
            video: { title: 'Short videos for social media', text: `Up to 3${N}videos` },
            retouch: { title: 'Advanced retouching', text: 'Detailed work on every image' },
          },
        },
      },
      common: {
        pace: {
          title: 'What pace?',
          options: {
            normal: { title: 'Standard', text: 'Your project joins our queue', line: 'standard' },
            priority: { title: 'Priority', text: 'Your project goes first in the queue', line: 'priority' },
          },
        },
        hasSite: {
          title: 'Do you already have a website?',
          short: 'Existing site',
          options: { yes: { title: 'Yes', line: 'yes' }, no: { title: 'No', line: 'no' } },
        },
        sitePains: {
          title: 'What isn’t working right now?',
          hint: 'You can skip this. It helps us prepare for the call.',
          short: 'What isn’t working',
          options: {
            outdated: { title: 'Outdated look', line: 'outdated look' },
            few_leads: { title: 'Too few leads', line: 'too few leads' },
            mobile: { title: 'Hard to use on a phone', line: 'hard to use on a phone' },
            hard_to_update: { title: 'Hard to update ourselves', line: 'hard to update ourselves' },
            slow: { title: 'Slow to load', line: 'slow to load' },
            off_brand: { title: 'Doesn’t match our brand', line: 'doesn’t match our brand' },
          },
        },
        brand: {
          title: 'Do you have a brand?',
          short: 'Brand',
          options: {
            none: { title: 'Not yet', line: 'not yet' },
            logo: { title: 'Logo only', line: 'logo only' },
            full: { title: 'Logo and brand book', line: 'logo and brand book' },
            rebrand: { title: 'Need a rebrand', line: 'need a rebrand' },
          },
        },
        start: {
          title: 'When do you plan to start?',
          hint: 'We agree on the exact timeline in the proposal for your project.',
          short: 'Start',
          options: {
            exploring: { title: 'Still exploring', line: 'still exploring' },
            soon: { title: 'As soon as possible', line: 'as soon as possible' },
            months: { title: `In 1–3${N}months`, line: `in 1–3${N}months` },
            later: { title: 'Later', line: 'later' },
          },
        },
        deadline: {
          title: 'Do you have a target completion date?',
          short: 'Deadline',
          options: { flexible: { title: 'Flexible', line: 'flexible' }, date: { title: 'A specific date', line: 'specific date' } },
        },
        sea: {
          title: 'Which do you prefer: the sea or the mountains?',
          hint: 'Optional question. We’re just curious.',
          short: 'Sea or mountains',
          options: { sea: { title: 'The sea', line: 'the sea' }, mountains: { title: 'The mountains', line: 'the mountains' }, both: { title: 'Both', line: 'both' } },
        },
        budget: {
          title: 'Does this amount work for you?',
          short: 'Amount',
          options: {
            yes: { title: 'Yes', line: 'yes' },
            cheaper: { title: 'I’d like a cheaper option', line: 'a cheaper option' },
            discuss: { title: 'Let’s discuss', line: 'let’s discuss' },
          },
        },
      },
    },
    price: { from: 'from {price}', perPage: '+ {price} per page', plus: '+ {price}', perMonth: 'from {price} / month', custom: 'Custom quote', percent: '+ {n}%' },
    counter: { minus: 'Fewer', plus: 'More', over: 'Over {n} — custom quote.' },
    languages: { '1': '1 language', '2': '2 languages', '3': '3 languages' },
    lines: {
      screens: 'Extra screens: {n}',
      pages: 'Extra pages: {n}',
      copy: 'Copy by the studio, {n} pages',
      copyLanding: 'Copy by the studio',
      pace: 'Pace: {name}',
      products: 'Products: {name}',
      monthly: 'from {price} / mo',
    },
    summary: {
      label: 'Estimated cost',
      tax: 'excl. VAT',
      breakdown: 'What it’s made of',
      empty: 'Choose a service to see the estimated cost here.',
      custom: 'Custom quote needed',
      customText: 'This project goes beyond our standard packages. Tell us about it, and we’ll prepare a quote.',
      note: 'This is an estimated cost. We’ll give you the exact price after a short call, once we know the project details.',
      vat: VAT,
      advice: 'We’ll help you choose the platform on the call.',
      call: 'Book a call',
      restart: 'Start over',
      range: 'Estimated: {low} to {high}, excl. VAT',
    },
    included: {
      eyebrow: 'What’s included',
      lead: 'Every stage is already included in the price.',
      titles: {
        uiux: 'What’s included in UI/UX design',
        sites: 'What’s included in a turnkey website',
        shop: 'What’s included in an online store',
        branding: 'What’s included in branding',
        content: 'What’s included in a photo shoot',
      },
      items: {
        uiux: [
          { title: 'Research', text: 'We study your users and competitors.' },
          { title: 'Structure', text: 'We plan the screens and the user’s path to their goal.' },
          { title: 'Design', text: 'Screens in your brand style, with all their states.' },
          { title: 'Prototype', text: 'A clickable prototype you can show your team.' },
        ],
        sites: [
          { title: 'Structure', text: 'We plan the pages and the visitor’s path to an enquiry.' },
          { title: 'Design', text: 'Desktop and mobile mockups in your brand style.' },
          { title: 'Development', text: 'A fast website that is easy to find on Google.' },
          { title: 'Launch', text: 'We connect the domain and analytics, and show you how to update the site.' },
        ],
        'sites-design': [
          { title: 'Structure', text: 'We plan the pages and the visitor’s path to an enquiry.' },
          { title: 'Design', text: 'Desktop and mobile mockups in your brand style.' },
          { title: 'Prototype', text: 'Clickable mockups to see the site before development.' },
          { title: 'Handover', text: 'We prepare the files and notes for your developer.' },
        ],
        shop: [
          { title: 'Structure', text: 'We plan the catalogue and the buyer’s path to checkout.' },
          { title: 'Design', text: 'Desktop and mobile mockups in your brand style.' },
          { title: 'Setup', text: 'Catalogue, cart, payment and delivery.' },
          { title: 'Launch', text: 'We connect the domain and analytics, and show you how to add products.' },
        ],
        branding: [
          { title: 'Research', text: 'We study your market, competitors and clients.' },
          { title: 'Concepts', text: 'We show several directions and choose one together.' },
          { title: 'Design', text: 'We turn the chosen concept into ready-to-use files.' },
          { title: 'Rules', text: 'We explain how to use the logo and visual identity.' },
        ],
        content: [
          { title: 'Preparation', text: 'We plan the shoot around its goal: website, launch, social media.' },
          { title: 'Shoot', text: 'In a studio or on location.' },
          { title: 'Editing', text: 'Colour and basic retouching for every image.' },
          { title: 'Delivery', text: 'Files ready for your website and social media.' },
        ],
      },
    },
    mobile: { bar: 'Estimate', toResult: 'See result' },
    flow: {
      next: 'Next',
      back: 'Back',
      change: 'Change',
      nextTo: ['Next: service', 'Next: details', 'Next: extras', 'Next: your project', 'Next: pace', 'Next: contact'],
      recommended: 'Recommended',
      nothing: 'nothing selected',
      units: { screens: `{n}${N}screens`, pages: `{n}${N}pages` },
      dateLabel: 'Target completion date',
      needChoice: 'Choose an option to continue.',
    },
    contact: {
      title: 'Where should we send the exact quote?',
      name: 'Name',
      email: 'Email',
      comment: 'Tell us about your project',
      commentHint: 'Your calculator choices are already here. Add anything you like.',
      callTitle: 'Shall we call you to discuss the estimate?',
      callHint: 'If yes, you’ll pick a time that suits you.',
      yes: 'Yes',
      no: 'No',
      callLink: 'Pick a time for a call',
      submit: 'Send message',
      sending: 'Sending…',
      note: 'We review every request personally and reply within two working days.',
      privacy: `Privacy${N}policy`,
      errName: 'Please tell us your name.',
      errEmail: 'Please check your email: it looks incorrect.',
      site: 'Link to your website',
      siteShort: 'Link',
      errSite: 'The address looks wrong. Please check it.',
      failed: `We couldn’t send your request. Write to us at {email}: your choices are already in the${N}message.`,
      failedLink: 'Open the email',
      subject: 'Calculator request: {service}',
    },
    thanks: {
      eyebrow: 'Request sent',
      title: 'Thank you! We’ve received your request',
      text: 'We’ll review it personally and reply within two working days.',
      summary: 'Your choices',
      call: 'Call',
    },
    noscript: { text: 'Turn on JavaScript to use the calculator, or write to us.', link: 'Write to us' },
    estimate: { service: 'Service', total: 'Estimate' },
  },
};

/** Підставляє {ключ} у шаблон */
export const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
