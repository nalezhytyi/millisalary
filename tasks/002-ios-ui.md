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
**Status:** approved

**Description:** Тему визначає система, але її можна перевизначити вручну. Фони та `ogl` прибираємо.

**Subtasks:**
- [x] Хук `useTheme`: `'system' | 'light' | 'dark'` у localStorage під ключем `theme`, клас `.dark` на `<html>`, слухач `matchMedia('(prefers-color-scheme: dark)')`, подія `theme_changed`
- [x] Інлайн-скрипт в `index.html`, який ставить `.dark` до першого рендера (без спалаху)
- [x] `<meta name="theme-color">` під активну тему; `color-scheme` на `html`
- [x] ~~Статус-бар iOS standalone для обох тем~~ — перенесено в Epic 7 (за рішенням користувача)
- [x] Видалити `useBackground`, `src/components/backgrounds/`, залежність `ogl`, шар `.app-background` і ключ `background`

**Acceptance criteria:**
- [x] Системна тема застосовується при завантаженні (dark→`.dark`, light→без нього). Живе перемикання без перезавантаження **не перевірено**: емуляція colorScheme у вбудованому браузері не шле `change`-події (власний тестовий listener теж нічого не отримав), логіка — стандартний `matchMedia().addEventListener`
- [x] `localStorage.theme = '"light"'` тримає світлу тему, навіть коли система в темній
- [x] Під час завантаження немає спалаху іншої теми (скрипт стоїть у `<head>` до рендера; окремо спалах не вимірювався)
- [x] `npm run lint` чистий (попередні помилки в `LightRays`/`Aurora`/`Galaxy` зникають разом з файлами)

**Примітки до виконання:**
- `useTheme` повертає `{ theme, setTheme }`; поки що в `App` викликається лише заради ефекту — UI-перемикач з'явиться в Epic 5 (секція Appearance). До того тему можна задати через `localStorage.theme = '"light"'`.
- Тимчасовий `class="dark"` з Epic 1 прибрано. **Старий UI тепер нечитабельний у світлій темі** (він стилізований лише під темний) — це очікувано, його повністю замінюють Epic 4–5.
- З `Sidebar` видалено секцію Background і відповідний CSS; `useBackground`, `src/components/backgrounds/` і залежність `ogl` прибрано. Ключ `background` у localStorage лишається в користувачів — чистимо в Epic 7.
- `theme-color` у `<meta>` і `manifest` (`theme_color`, `background_color`) — світлі (#f2f2f7). Маніфест статичний, тож сплеш при встановленому PWA буде світлим навіть у темній темі; динамічно змінюється лише `<meta>`.
- **Статус-бар iOS standalone не досліджено**: `black-translucent` дає білий текст, у світлій темі він буде невидимий. Варіант `default` (текст за системною темою) змінює геометрію viewport і може зачепити хак `.ios-standalone`, а зміна meta після запуску iOS не підхоплює — це треба перевіряти на симуляторі (рецепт у пам'яті). Пропозиція: не блокувати цим Epic 2, а зробити разом з повною iOS-перевіркою в Epic 7 (перенести підзадачу туди).
- Lint: 0 помилок, 2 warning у згенерованих `ui/button.tsx` і `ui/tabs.tsx`. Базові помилки `LightRays`/`Aurora`/`Galaxy` зникли разом з файлами.


### Epic 3: Розрахунки по періодах, ставки й день виплати
**Status:** approved

**Description:** Один об'єкт з усіма цифрами для циферблата, рядка статистики й Breakdown.

**Subtasks:**
- [x] Чиста функція `calculateEarnings(now, settings)` у `src/utils/calculations.ts` → `{ hour, day, week, month, year }` (кожен `{ earned, total }`), `rates` (за секунду / хвилину / годину / день), `nextPayday` (дата, сума, днів залишилось)
- [x] `useEarnings` переходить на неї: один `useState` замість чотирьох, тік 100 мс і курс валют як зараз
- [x] Налаштування `payday` (день місяця 1–31, за замовчуванням 1): якщо в місяці менше днів — останній день; якщо виплата сьогодні — «сьогодні»
- [x] `formatCurrency`: точність як параметр (4 знаки для ставки за секунду) і розбиття на частини (символ / ціла / дробова)

**Acceptance criteria:**
- [x] Разовий скрипт `/private/tmp/claude-501/-Users-tab--claude-spares-spare-VEaGWg/95986945-0180-4393-be4a-875655c18265/scratchpad/check-earnings.ts` (`npx tsx`, не в репо) з фіксованим `now` перевіряє чотири сценарії (середа 13:00, субота, до початку робочого дня, після кінця): `day` і `month` збігаються з дослівною копією старої логіки `useEarnings`, `week` / `year` / `hour` відповідають формулам. 60+ перевірок, усі PASS у `TZ=Europe/Kyiv` і `TZ=America/New_York`
- [x] `payday` = 31 у лютому повертає 28/29 лютого (2026 → 28.02, 2028 → 29.02; також перехід через рік, «сьогодні», DST)

**Примітки до виконання:**
- `useEarnings` тепер повертає `{ earnings, exchangeRate }`. Для старого головного екрана `useAppState` лишає застарілі поля (`currentEarnings` = місяць, `dayEarnings`, `totalDayEarnings`, `monthEarnings`) — вони зникнуть в Epic 4. Нове поле `earnings` вже віддається з `useAppState`.
- `payday` у `useAppState`: ключ localStorage `payday` (за замовчуванням 1), `handleSetPayday` з `normalizePayday` (ціле 1–31), подія `payday_changed`. UI-поле — Epic 5.
- Рішення в моделі, яких не було в плані:
  - вікно start/end прив'язується до **сьогоднішньої дати** (старий код брав дати як є, тож після півночі з відкритою вкладкою вони були «вчорашні» і день рахувався як завершений); це змінює результат лише в такому застарілому стані;
  - «запланований день» = пн–пт і лише поки в місяці не вичерпано `workingDays`; для тижня правило застосовується до місяця кожного дня, тож тиждень на межі місяців рахується коректно;
  - якщо end ≤ start, вікно = start + `workingHoursPerDay`;
  - `hour.earned` = мілісекунди поточної години всередині вікна × ставка; на рівній годині (13:00:00.000) це 0.
- `formatCurrency(amount, currency, fractionDigits = 2)`; новий `formatCurrencyParts` повертає `{ symbol, symbolPosition, sign, integer, decimal, fraction }`. Символ валюти залежить від ICU: у Node (`tsx`) UAH дав «₴», а в браузері — «грн».
- У браузері старий UI показує живі суми через новий хук (зарплата 6000, вікно 00:00–23:59). Курс валют у цьому середовищі не завантажується (мережа), тож перевірено з курсом 1; консоль показує `ERR_CONNECTION_REFUSED` — це зовнішні запити, не зміни цього епіку.
- `npm run build` проходить; lint: 0 помилок, 2 попередні warning у `ui/*`.


### Epic 4: Головний екран — шапка, циферблат, статистика, сегмент
**Status:** approved

**Description:** Новий головний екран без полів вводу.

**Subtasks:**
- [x] Шапка: кругла кнопка налаштувань зліва, по центру «Millisalary» з підписом, кругла кнопка Breakdown справа (shadcn `Button` size icon, `rounded-full`, тло `secondary`, гліф акцентного кольору)
- [x] `EarningsDial` на SVG: трек `tertiarySystemFill` і дуга `systemBlue` з `stroke-linecap: round`; у центрі `money-face.png`, велика сума (дробова частина дрібніше, `secondaryLabel`) і підпис «of X per hour / today / this week…»
- [x] Рядок Today / This week / This month у три колонки з вертикальними розділювачами
- [x] Сегмент Hour / Day / Week / Month / Year на shadcn `Tabs` у стилі UISegmentedControl: перемикає період циферблата, вибір у localStorage під ключем `selectedPeriod` (за замовчуванням `day`), подія `period_changed`
- [x] Верстка на всю висоту з safe-area-відступами, `max-w-md` по центру; розмір циферблата залежить від висоти, щоб на iPhone SE усе вміщалося без скролу
- [x] Порожній стан: коли `monthlySalary === 0`, під циферблатом підказка й кнопка, що відкриває налаштування
- [x] Видалити старі `Header`, `EarningsSummary` і використання `money-flying.gif`

**Acceptance criteria:**
- [x] У preview з шириною 375 і 430 обидві теми мають iOS-вигляд, без горизонтального скролу
- [x] Кожен сегмент змінює дугу й підпис; сума тікає
- [x] Скріншоти обох тем: переглянуто в сесії (375 dark/light, 430, 320×568), у файл **не вкладено** — у репо їх зберігати нема куди; скажи, якщо потрібно покласти в `tasks/`

**Примітки до виконання:**
- Нові компоненти: `Header` (переписаний), `EarningsDial`, `StatsRow`, `PeriodTabs`, `SetupHint`; видалено `EarningsSummary`, `money-flying.gif` і `money-face.gif` (останній використовував лише старий `Header`).
- Іконки: налаштування — наявний SVG із повзунками зі старого `Header`; Breakdown — `ChartNoAxesColumn` з `lucide-react` (як домовлялись); монета — `money-face.png`. Тики на циферблаті зі скріншота не робив (iOS-нативніше без них).
- **Кнопка Breakdown поки `disabled`** (шита ще немає, Epic 6); `Header` приймає `onBreakdownClick` — Epic 6 його підключає.
- **Тимчасова заглушка до Epic 5:** поля вводу тепер у старому `Sidebar` (він приймає `children`), бо з головного екрана вони зникли. Старий `Sidebar` темний і напівпрозорий, у світлій темі виглядає мутно, а шириною 380px трохи ширший за 375px екран — це ок, Epic 5 його видаляє.
- Підзадачі Epic 5 про видалення `isInputsCollapsed`, ключа та події `inputs_collapsed_toggled` уже виконано тут (тумблер Layout втратив сенс). Ключ у localStorage у користувачів лишається — чистимо в Epic 7.
- З `useAppState` прибрано застарілі поля `currentEarnings`, `monthEarnings`, `dayEarnings`, `totalDayEarnings`; додано `selectedPeriod`/`handlePeriodChange` (ключ `selectedPeriod`, подія `period_changed`). `Period` тип лежить у `utils/calculations.ts`.
- Знайдено й виправлено: закритий старий `Sidebar` (`translateX(100%)`) підсвічував правий край `box-shadow`-ом — тепер `visibility: hidden` у закритому стані.
- Перевірено: 375×812 dark і light, 430×932 dark, 320×568 dark; горизонтального скролу немає, на 320×568 нічого не обрізається й не скролиться; кожен сегмент міняє дугу, підпис і значення (перевірено aria-label: hour 17% від 11,37, week 78%, month 72%, year 81%); довгі суми в UAH (2 430 488,57 грн, 3 000 000,00 грн) вміщаються в циферблат. Шість-цифрові суми в рядку статистики на 375px переносять «грн» на другий рядок — прийнятно.
- `npm run build` проходить, lint: 0 помилок, 2 попередні warning у `ui/*`.
- Не перевірено: iOS Simulator standalone (план — Epic 7), реальний курс валют (мережа недоступна в цьому середовищі, перевіряв з курсом 1), перемикання системної теми наживо.


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
- [ ] Статус-бар iOS standalone для обох тем (перенесено з Epic 2): зараз `black-translucent` дає білий текст, у світлій темі він невидимий. Порівняти на симуляторі `default` (текст за системною темою) і `black-translucent`; врахувати, що зміна стилю змінює геометрію viewport і може зробити частину хака `.ios-standalone` зайвою, а зміну meta після запуску iOS не підхоплює — досліджуємо, а не вгадуємо
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
- 2026-10-22 — Epic 2 work complete (крім статус-бару iOS), awaiting approval
- 2026-10-22 — Epic 2 approved; підзадачу про статус-бар iOS перенесено в Epic 7
- 2026-10-22 — Epic 3 work complete, awaiting approval
- 2026-10-22 — Epic 3 approved
- 2026-10-22 — Epic 4 work complete, awaiting approval
- 2026-10-22 — Epic 4 approved
