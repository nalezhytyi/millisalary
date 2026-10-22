---
id: 002
title: Новий UI в стилі нативного iOS (shadcn, світла/темна тема)
status: in-progress
created: 2026-10-22
updated: 2026-10-22
---

# Task 002: Новий UI в стилі нативного iOS (shadcn, світла/темна тема)

## Context
Зараз інтерфейс — скляні панелі поверх WebGL-фонів, а налаштування й поля вводу займають головний екран. Хочемо UI як у референсі: живий циферблат заробітку, налаштування за кнопкою зліва, Breakdown за кнопкою справа. Кольори та контроли беремо з нативної iOS, а не зі скріншотів.

## Overview
У гілці `feat/ios-ui` переходимо на Tailwind v4 і shadcn, мапимо токени shadcn на системні кольори iOS (light/dark). Прибираємо чотири WebGL-фони й селектор фону, натомість додаємо тему «Система / Світла / Темна». Логіку розрахунків розширюємо до періодів (година/день/тиждень/місяць/рік), ставок і дати виплати. Головний екран будуємо заново: шапка з двома круглими кнопками, кільцевий циферблат, рядок Today / Week / Month і сегмент періодів. Налаштування й Breakdown відкриваються як iOS-шити знизу.

## Related files / references
- `src/App.tsx:42` — шар `.app-background` з WebGL-фоном, прибирається; тут же компонуємо новий екран
- `src/hooks/useAppState.ts:45` — `isInputsCollapsed` (ключ, хендлер, подія — прибираються); сюди йдуть `payday`, `theme`, `selectedPeriod`
- `src/hooks/useEarnings.ts:42` — тік кожні 100 мс, переходить на чисту функцію розрахунку
- `src/utils/calculations.ts:91` — `formatCurrency` (`uk-UA`); потрібні `formatToParts` і змінна точність для ставки за секунду
- `src/hooks/useBackground.tsx`, `src/components/backgrounds/*` — видаляються разом з `ogl`
- `src/components/Sidebar/*`, `EarningsSummary`, `InfoLabel`, `Header` — замінюються новими компонентами
- `src/components/SalaryInputs/SalaryInputs.tsx`, `src/components/CurrencySelect/CurrencySelect.tsx:12`, `src/components/TimePicker/*` — переїжджають у шит налаштувань
- `src/index.css:5` — `:root` (Lato, темний фон) → токени iOS
- `src/index.css:45` — список шарів для `.ios-standalone`: прибрати `.sidebar*` / `.app-background`, додати шари шита
- `index.html:11` — `apple-mobile-web-app-status-bar-style: black-translucent` дає білий текст статус-бару, у світлій темі він буде невидимий
- `vite.config.ts:20` — `theme_color` / `background_color` маніфесту
- `tasks/001-native-timepicker.md` — висновки про поведінку нативного time input на iOS

## Ключові рішення
- **Tailwind v4.** Поточний shadcn CLI (4.22) генерує компоненти під v4, тому мігруємо через `@tailwindcss/upgrade`. `@tailwindcss/vite` замінює PostCSS і autoprefixer, додаємо аліас `@/`.
- **Палітра iOS.** Фон `systemGroupedBackground`, картки `secondarySystemGroupedBackground`, текст `label` / `secondaryLabel`, лінії `separator`, треки `tertiarySystemFill`, акцент `systemBlue` (#007AFF / #0A84FF). Шрифт системний (`-apple-system, system-ui`), Lato прибираємо. Без світіння й неоморфізму.
- **Тема.** Система + ручне перевизначення (`'system' | 'light' | 'dark'`), перемикач у налаштуваннях.
- **Іконки.** Наявна SVG налаштувань (повзунки з `Header`), хрестик і галочка. Замість монети в циферблаті та на картці виплати — `money-face.png`. Для кнопки Breakdown наявної іконки немає, тому беремо одну з `lucide-react` (вона й так приходить як іконкова бібліотека shadcn). Якщо треба строго наявні — `info.svg`.
- **Модель розрахунків лишається поточною:** пн–пт, години між start і end, обмеження `workingDays`. Тиждень = 5 × денна ставка; рік = 12 × місячна, завершені місяці рахуються повними; «ця година» = відпрацьовані хвилини поточної години в межах робочого вікна, від годинної ставки. Рядок **«This pay period» не робимо**: період від виплати до виплати перетинає календарні місяці, а модель `workingDays` календарна.
- **Головний екран:** сегмент Hour/Day/Week/Month/Year є, тумблера Tracking немає — заробіток тікає завжди.
- **Нативні поля.** `<select>` і `<input type="time">` лишаються нативними (на iOS — системне колесо), стилізуємо їх під рядки iOS-списку.
- **Шити.** shadcn `Drawer` (vaul): нижній шит з грабером і кнопкою Done. Він `position: fixed`, тож потрапляє під iOS-standalone-хак з `index.css`. Це головний ризик UI, перевіряємо на симуляторі.
- **Коміти** окремі на кожен епік (`feat(ui): …`, `refactor(earnings): …`, `chore(deps): …`). Push і deploy — тільки після окремого дозволу.

## Epics

### Epic 1: Tailwind v4 + shadcn + токени iOS
**Status:** approved

**Description:** Інфраструктура для всіх наступних епіків. Старий UI після цього епіку ще має рендеритися.

**Subtasks:**
- [x] Створити гілку `feat/ios-ui` від `main`
- [x] Мігрувати на Tailwind v4 через `npx @tailwindcss/upgrade`, перейти на `@tailwindcss/vite`, прибрати `postcss.config.js`, `tailwind.config.js` і autoprefixer
- [x] Додати аліас `@/*` у `tsconfig.app.json` і `vite.config.ts`
- [x] `npx shadcn@latest init`: `components.json`, `src/lib/utils.ts` (`cn`), `src/components/ui/`
- [x] Задати токени shadcn (`--background`, `--card`, `--foreground`, `--muted-foreground`, `--primary`, `--border`, `--ring`, `--secondary`) значеннями iOS для `:root` і `.dark`; додати `@custom-variant dark`
- [x] Системний шрифт, `tabular-nums` для сум (на `html`)
- [x] Додати компоненти: `button`, `drawer`, `tabs`, `progress`, `input`, `separator`, а також `native-select`, якщо він є в реєстрі (інакше власна обгортка)

**Acceptance criteria:**
- [x] `npm run build` проходить
- [x] Старий UI відкривається в preview без зламаної верстки (перевірено в браузері, консоль чиста)
- [x] Тестова `<Button>` бере колір з токена `--primary` (dark: rgb(10,132,255), light: rgb(0,122,255) → див. примітки; тестову кнопку прибрано)

**Примітки до виконання:**
- shadcn CLI 4.22 згенерував `src/lib/utils.ts` і всі `ui/*` з `import { cn } from "cn"` — це випадковий сторонній npm-пакет. Замінив на стандартний `cn` через `clsx` + `tailwind-merge`, імпорти переписав на `@/lib/utils`, пакет `cn` прибрав. **Після кожного `shadcn add` треба перевіряти це знову** (`grep -rn 'from "cn"' src/`).
- Стиль shadcn: `radix-nova`, бібліотека `radix-ui`; шрифт Geist, який додав CLI, прибрано (системний шрифт).
- Тимчасово `class="dark"` на `<html>` в `index.html`, щоб старий UI з WebGL лишався темним до Epic 2 (там з'являється `useTheme` і інлайн-скрипт). Фон перенесено з `body` на `html` (canvas), щоб не перекривав WebGL-шар.
- Додано `.claude/launch.json` (`millisalary-dev`, порт 5174): CLAUDE.md згадує його, але файла в репо не було; він не відстежується git.
- Lint: поза базовими помилками (`LightRays`) з'явилися 2 warning `react-refresh/only-export-components` у згенерованих `ui/button.tsx` і `ui/tabs.tsx` (стандартний вигляд shadcn).
- Додані компоненти: `button`, `drawer` (vaul), `tabs`, `progress`, `input`, `separator`, `native-select`.


### Epic 2: Світла й темна тема замість WebGL-фонів
**Status:** pending

**Description:** Тему визначає система, але її можна перевизначити вручну. Фони та `ogl` прибираємо.

**Subtasks:**
- [ ] Хук `useTheme`: `'system' | 'light' | 'dark'` у localStorage під ключем `theme`, клас `.dark` на `<html>`, слухач `matchMedia('(prefers-color-scheme: dark)')`, подія `theme_changed`
- [ ] Інлайн-скрипт в `index.html`, який ставить `.dark` до першого рендера (без спалаху)
- [ ] `<meta name="theme-color">` під активну тему; `color-scheme` на `html`
- [ ] Статус-бар iOS standalone для обох тем: варіанти `default` + `theme-color` або динамічна зміна. Зміна стилю статус-бару може зробити частину standalone-хака зайвою — досліджуємо, а не вгадуємо
- [ ] Видалити `useBackground`, `src/components/backgrounds/`, залежність `ogl`, шар `.app-background` і ключ `background`

**Acceptance criteria:**
- [ ] Перемикання Appearance у macOS/iOS одразу міняє тему
- [ ] `localStorage.theme = '"light"'` тримає світлу тему, навіть коли система в темній
- [ ] Під час завантаження немає спалаху іншої теми
- [ ] `npm run lint` чистий (попередні помилки в `LightRays`/`Aurora`/`Galaxy` зникають разом з файлами)

### Epic 3: Розрахунки по періодах, ставки й день виплати
**Status:** pending

**Description:** Один об'єкт з усіма цифрами для циферблата, рядка статистики й Breakdown.

**Subtasks:**
- [ ] Чиста функція `calculateEarnings(now, settings)` у `src/utils/calculations.ts` → `{ hour, day, week, month, year }` (кожен `{ earned, total }`), `rates` (за секунду / хвилину / годину / день), `nextPayday` (дата, сума, днів залишилось)
- [ ] `useEarnings` переходить на неї: один `useState` замість чотирьох, тік 100 мс і курс валют як зараз
- [ ] Налаштування `payday` (день місяця 1–31, за замовчуванням 1): якщо в місяці менше днів — останній день; якщо виплата сьогодні — «сьогодні»
- [ ] `formatCurrency`: точність як параметр (4 знаки для ставки за секунду) і розбиття на частини (символ / ціла / дробова)

**Acceptance criteria:**
- [ ] Разовий скрипт у scratchpad (`npx tsx`) з фіксованим `now` перевіряє чотири сценарії (середа 13:00, субота, до початку робочого дня, після кінця): `day` і `month` збігаються з поточним `useEarnings`, `week` / `year` / `hour` відповідають формулам із «Ключових рішень»
- [ ] `payday` = 31 у лютому повертає 28/29 лютого

### Epic 4: Головний екран — шапка, циферблат, статистика, сегмент
**Status:** pending

**Description:** Новий головний екран без полів вводу.

**Subtasks:**
- [ ] Шапка: кругла кнопка налаштувань зліва, по центру «Millisalary» з підписом, кругла кнопка Breakdown справа (shadcn `Button` size icon, `rounded-full`, тло `secondary`, гліф акцентного кольору)
- [ ] `EarningsDial` на SVG: трек `tertiarySystemFill` і дуга `systemBlue` з `stroke-linecap: round`; у центрі `money-face.png`, велика сума (дробова частина дрібніше, `secondaryLabel`) і підпис «of X per hour / today / this week…»
- [ ] Рядок Today / This week / This month у три колонки з вертикальними розділювачами
- [ ] Сегмент Hour / Day / Week / Month / Year на shadcn `Tabs` у стилі UISegmentedControl: перемикає період циферблата, вибір у localStorage під ключем `selectedPeriod` (за замовчуванням `day`), подія `period_changed`
- [ ] Верстка на всю висоту з safe-area-відступами, `max-w-md` по центру; розмір циферблата залежить від висоти, щоб на iPhone SE усе вміщалося без скролу
- [ ] Порожній стан: коли `monthlySalary === 0`, під циферблатом підказка й кнопка, що відкриває налаштування
- [ ] Видалити старі `Header`, `EarningsSummary` і використання `money-flying.gif`

**Acceptance criteria:**
- [ ] У preview з шириною 375 і 430 обидві теми мають iOS-вигляд, без горизонтального скролу
- [ ] Кожен сегмент змінює дугу й підпис; сума тікає
- [ ] Скріншоти обох тем приклеєні в execution log

### Epic 5: Шит налаштувань (кнопка зліва)
**Status:** pending

**Description:** Усі поля з `SalaryInputs` переїжджають у згрупований список у стилі iOS.

**Subtasks:**
- [ ] `Drawer` із заголовком «Settings» і кнопкою Done
- [ ] Секція Salary: місячна зарплата (числове поле, вирівняне праворуч), валюта зарплати, валюта виводу
- [ ] Секція Schedule: робочих днів на місяць, годин на день, Start, End (зв'язки між полями як зараз)
- [ ] Секція Payday: день виплати
- [ ] Секція Appearance: сегмент System / Light / Dark
- [ ] Підказки з `InfoLabel` (hover на iOS не працює) → підписи під секціями, як в iOS; видалити `InfoLabel`
- [ ] Видалити `Sidebar` разом із `Sidebar.css`, `isInputsCollapsed` і подію `inputs_collapsed_toggled`
- [ ] Перевести `CurrencySelect` і `TimePicker` на токени (`color-scheme` за темою, а не жорстко `dark`)

**Acceptance criteria:**
- [ ] Зміна будь-якого поля одразу відбивається на циферблаті
- [ ] Зв'язки Start → End → години/день працюють, як у task 001
- [ ] На iOS Simulator (standalone, за рецептом з пам'яті) шит не обрізаний знизу; фокус на полі не зсуває додаток убік; тап по select і time відкриває нативне колесо

### Epic 6: Шит Breakdown (кнопка справа)
**Status:** pending

**Description:** Детальна розбивка в стилі другого скріншоту, на iOS-кольорах.

**Subtasks:**
- [ ] `Drawer` із заголовком «Breakdown» і кнопкою Done; подія `breakdown_opened`
- [ ] Картка Next payday: `money-face.png`, дата (`dddd, MMMM D`), сума, «N days» акцентним кольором
- [ ] Секція «Earned so far»: This hour / Today / This week / This month / This year — заробіток, «of total» і тонкий `Progress` (трек `tertiarySystemFill`, заповнення `systemBlue`)
- [ ] Секція «Your rate»: ставка за секунду / хвилину / годину / день
- [ ] Внизу пояснення моделі (робочі години, пн–пт) і курс валют

**Acceptance criteria:**
- [ ] Цифри збігаються з циферблатом і рядком статистики
- [ ] Значення тікають при відкритому шиті
- [ ] Довгі суми в UAH не переносяться криво
- [ ] На iOS standalone шит скролиться всередині й не обрізаний

### Epic 7: Прибирання, PWA та документація
**Status:** pending

**Description:** Хвости після переходу, iOS-специфіка і документи.

**Subtasks:**
- [ ] Оновити список шарів `.ios-standalone` в `index.css` під нову структуру, прибрати мертві правила
- [ ] Кольори маніфесту; `-webkit-app-region: no-drag` на кнопках і шитах для Electron-обгортки
- [ ] Прибрати застарілі ключі localStorage (`background`, `isInputsCollapsed`) при старті
- [ ] Оновити `CLAUDE.md` (shadcn, теми, шити, ключі, розрахунки, нове чисте lint-базове значення) і `README`

**Acceptance criteria:**
- [ ] `npm run build` і `npm run lint` чисті
- [ ] `build` + `preview`: оновлення SW проходить без застарілого кешу
- [ ] Повна перевірка на iOS Simulator у standalone в обох темах: статус-бар читається, внизу немає смуги, шити відкриваються й закриваються

## Execution log
- 2026-10-22 — created, plan agreed with user
- 2026-10-22 — Epic 1 work complete, awaiting approval
- 2026-10-22 — Epic 1 approved
