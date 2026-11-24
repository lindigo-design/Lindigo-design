@AGENTS.md

# Lindigo Design — сайт-портфоліо студії

## Стек

- Astro 7, статична збірка. Команди: `npm run dev`, `npm run build`, `npm run preview`, `npm run check`.
- Стилі — звичайний CSS: компоненти `.astro` з власними стилями і CSS-змінні в `src/styles/global.css`. Tailwind і `@theme` у проєкті немає.
- Шрифти з `@fontsource-variable`: Unbounded (заголовки), Mulish (текст), Martian Mono (підписи).
- Блоки головної — `src/components/*.astro`, тексти трьома мовами — `src/i18n/ui.ts`, картинки — `src/assets/`.
- План сайту, тексти й рішення власниці: [docs/plan.md](docs/plan.md). Мобільний дизайн: [docs/figma-mobile-brief.md](docs/figma-mobile-brief.md).

## Мови (i18n)

- Французька — основна мова, за замовчуванням, без префікса в адресі (`/`).
- Англійська — `/en/`, українська — `/uk/`.
- Налаштовано в `astro.config.mjs`: `defaultLocale: 'fr'`, `prefixDefaultLocale: false`.
- Шляхи до сторінок будуються тільки через `localePath()` з `src/i18n/ui.ts`: вона додає префікс мови і враховує `import.meta.env.BASE_URL`.

## Публікація і адреси

- Сайт публікується на GitHub Pages через GitHub Actions (`.github/workflows/deploy.yml`): пуш у `main` або ручний запуск.
- Кінцева адреса — власний домен https://lindigo-design.com. Зараз там заглушка на WordPress; домен підключимо до GitHub Pages пізніше, коли сайт буде готовий.
- Для власного домену: `site` у `astro.config.mjs` = `https://lindigo-design.com`, `base` не потрібен, у `public/` має лежати файл `CNAME` з цим доменом.
- Тимчасове прев'ю до підключення домену: https://lindigo-design.github.io/Lindigo-design/ (`site: https://lindigo-design.github.io`, `base: /Lindigo-design`).
- Режимом прев'ю керує змінна `PUBLIC_PREVIEW`: workflow збирає сайт з `PUBLIC_PREVIEW=true`. У цьому режимі `src/layouts/Base.astro` додає `<meta name="robots" content="noindex, nofollow">`.
- Налаштування `site`, `base`, `CNAME` і workflow не змінювати без дозволу.

## Робота з Git

Єдина основна гілка — `main`. Напряму в неї не працюємо: пуш у `main` одразу публікує сайт.

- Кожне завдання — в окремій гілці від свіжого `main` (`feature/<назва>` або `fix/<назва>`).
- Коміти в цій гілці можна робити самостійно. Повідомлення комітів — українською, як в історії проєкту.
- Коли завдання готове: пуш гілки і PR у `main`. Перед пушем показати, що саме піде в PR.
- Merge PR робить тільки власниця вручну. Самостійно не мерджити PR і не пушити в `main`: пуш у `main` запускає GitHub Actions і публікує сайт.
- Ніколи не робити force push.
- `gh` на комп'ютері не встановлено: PR створювати через GitHub MCP.

## Токени

Усі токени — CSS-змінні в `src/styles/global.css`: `:root` — темна тема, `:root[data-theme='light']` — світла. Повний перелік зі значеннями й ролями — у скілі `lindigo-tokens` (`.claude/skills/lindigo-tokens/SKILL.md`).

Джерело правди — файл Figma «Lindigo design studio site» (змінні «Кольори», «Шрифти», «Відступи і радіуси» та текстові стилі Heading, Body, Title, Label). Якщо код і Figma розходяться — спитати, не виправляти самостійно.

### Кольори

- **Палітра** названа за іменами кольорів: `--indigo-950`, `--indigo-850`, `--indigo-800`, `--indigo-600`, `--beige-50`, `--cream-50`, `--gold`, `--orchid`, `--orchid-deep`, `--orange`, `--muted-dark`, `--muted-light`, `--muted-deep`, `--night`, `--grey-supplement`, `--card-accent-light`, `--orchid-dark`, `--blush-50` та ін.
- **Ролі** міняються з темою: `--bg`, `--fg`, `--text-soft`, `--text-muted`, `--accent-text`, `--section-bg`, `--card-bg`, `--rule`, `--btn-primary-bg`, `--danger` та ін.
- У компонентах беремо ролі; палітру напряму — тільки якщо колір однаковий в обох темах. Кожен колір перевіряти в обох темах; контраст тексту не нижче 4,5.

### Типографіка

- Стилі тексту — токени `--text-<стиль>` з частинами `--line-height`, `--font-weight`, `--letter-spacing` і готові класи `.type-<стиль>`.
- Десктоп: `h1`, `display`, `h2`, `h3`, `h3-s`, `h4`, `h5`, `h6`, `body-xl`, `body-lead`, `body-l`, `body-m`, `body-s`, `title-24`, `title-16`, `button-m`, `button-s`, `label-m`, `label-s`.
- Телефон: `h1-mobile`, `h2-mobile`, `h4-mobile`, `menu-mobile`, `quote-mobile`, `title-20`, `title-18`, `label-xs`.
- Розмір шрифту в rem (1rem = 16px, у коментарі — px), інтервал між рядками у відсотках. Виняток: `body` має `line-height: 1.6` без одиниць.

### Відступи

- Шкала `--space-*` за змінними Figma `Space/*`: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 120.
- Бічні поля блоків — тільки `padding-inline: var(--gutter)`.
- Блок зверху й знизу: 120 на десктопі, 56 на телефоні (до 640 px). Без винятків, крім одного: у блоку «Заклик до дії» (`Cta.astro`) згори 56 (рішення власниці, 24.11.2026).

### Радіуси

- `--radius-8`, `--radius-12`, `--radius-16`, `--radius-20`, `--radius-24`, `--radius-28`, `--radius-32`, `--radius-48`, `--radius-full` (999).
- Кнопки й `.ring-hover` — `--radius-full` для всього сайту (рішення власниці, 20.11.2026).

### Пропорції

- `aspect-ratio` тільки через `--aspect-*`, назва за роллю картинки: `--aspect-case-cover`, `--aspect-work-card`, `--aspect-about-photo`, `--aspect-principles-photo`, `--aspect-review-photo`, `--aspect-photo-wide`, `--aspect-process-jelly`.

## Компоненти

Спільні компоненти: `Button`, `Field`, `WorkCard`, `SliderNav`, `Header`, `Menu`, `Footer`, `ThemeSwitch`, `LangSwitch`, `Logo`. Новий блок збираємо з них і з токенів (скіл `build-screen`).

### Компоненти зі станами (обов'язкова вимога)

Мінімум три компоненти з чотирьох, кнопка обов'язкова.

- **Кнопка** (`src/components/Button.astro`) і **поле форми** (`src/components/Field.astro`) мають стилі hover, focus (видимий, не прибраний контур) і disabled.
- Вимкнена кнопка зроблена через `aria-disabled` з поясненням через `aria-describedby` (не через атрибут `disabled`).
- Поле форми має ще стан помилки: колір danger (`--danger`), текст помилки під полем.
- **Картка** і **навігація** мають hover і focus: те, що видно при наведенні, видно й при фокусі з клавіатури.
- Контур фокусу (`:focus-visible` у `src/styles/global.css`) ніде не прибирати.

### Перегляд компонентів

**Storybook** (`@storybook/html-vite`, HTML-компоненти) — демонстрація токенів і компонентів дизайн-системи.

- Робота над історіями з живим оновленням: `npm run storybook` → http://localhost:6006.
- `npm run dev` і `npm run build` спершу збирають його в `public/storybook` (тека в `.gitignore`), тож він відкривається як окрема сторінка сайту `/storybook/index.html` — і локально, і на опублікованому сайті (з `noindex`). Окремо зібрати: `npm run build-storybook`.
- У меню сайту — п'ятий пункт «05 Storybook» (`src/components/Menu.astro`). Через нього пункти меню на телефоні стиснуто до 48 px заввишки без проміжків, щоб меню вміщалося на 390 × 667.
- Налаштування — `.storybook/`, історії — `stories/`. Розмітка в історіях — звичайний HTML, стилі беруться з тих самих файлів `.astro` (`stories/lib/astro.js`), токени — прямо з `global.css` (`stories/lib/tokens.js`).
- Тимчасово: потім приберемо. Для цього видалити пункт меню (і повернути на телефоні проміжок `--space-4` між пунктами й `padding: var(--space-8) 0`), теки `.storybook/`, `stories/`, скрипти `storybook` і `build-storybook`, повернути `"dev": "astro dev"` і `"build": "astro build"`, видалити `public/storybook/` і видалити пакети `storybook` та `@storybook/*`.
- Новий компонент зі станами додаємо в Storybook і на службову сторінку станів.

Службова сторінка станів (тільки в `npm run dev`, у збірку не потрапляє): http://localhost:4321/design-system/states/ (`src/pages/design-system/[page].astro`).

## Правила

- Готовий дизайн і готові тексти не змінюй без мого запиту. Якщо щось незрозуміло, спершу запитай.
- Не чіпай логотип.
- Заголовки h1–h3, текст кнопок (`.btn`) і біжучі стрічки (атрибут `data-title-case` на списку) — Title Case у всіх трьох мовах (рішення власниці, 24.11.2026): кожне значуще слово з великої, короткі службові слова з малої («Discuter de Votre Projet», «Quand Avez-Vous Besoin d’un Design UI/UX ?», «Сайти під Ключ»). Робить це одна функція `src/i18n/title-case.ts` через `src/middleware.ts` для всіх сторінок; тексти в `src/i18n/` пишемо звичайними реченнями. Списки службових слів — у `title-case.ts`. Якщо скрипт сам змінює текст заголовка в браузері, обгортати в `titleCase()` (як у `calculator-client.ts`). Звичайні посилання, підписи й абзаци — як речення.
- На телефоні (до 640 px) хлібні крихти не показуємо: `display: none` у мобільних стилях блоку (рішення власниці, 24.11.2026). На планшеті й комп'ютері вони лишаються.
- **Тільки токени.** Кольори, розміри тексту, відступи, радіуси й пропорції беруться тільки зі змінних системи. Числа й кольори напряму (`24px`, `#fff`, `rgba(…)`, `aspect-ratio: 4 / 3`) у стилях компонентів не вписуємо.
  - Відступи — тільки зі шкали `--space-*`. Значення поза шкалою не використовуємо; нові змінні додаємо тільки з дозволу.
  - Дозволені винятки: `0`, `50%` для кіл, `1px` для ліній і закруглених кінців, `inherit`, пропорція логотипа, кольори декоративних плям світіння в `Breath.astro`.
  - Старі компоненти ще мають відступи й розміри тексту, вписані числами. Їх переводимо на змінні окремим завданням, так щоб вигляд не змінився.
- Розміри шрифтів тільки цілі числа (у px, з яких рахується rem).
- У текстах не повинно бути рядків з одним словом. Для цього використовуй нерозривні пробіли. Дотримуйся французької типографіки.
- Не пиши обіцянок щодо термінів і регулярності («щотижня», «щоп'ятниці»).
