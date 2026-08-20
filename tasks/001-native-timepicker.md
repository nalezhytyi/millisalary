---
id: 001
title: Нативний time picker для Start/End Time
status: review
created: 2026-08-19
updated: 2026-08-19
---

# Task 001: Нативний time picker для Start/End Time

## Context
Start Time / End Time зараз рендеряться через `react-datepicker` (`showTimeSelectOnly`, інтервал 30 хв) з хаком — на мобільних інпуту примусово ставиться `readOnly`, щоб не вилазила клавіатура. Це тягне зайву залежність, кастомні CSS-оверрайди й дає гірший UX, ніж нативне колесо iOS / clock-діалог Android.

## Overview
Замінюємо всередині `TimePicker` `react-datepicker` на нативний `<input type="time">`, залишаючи публічний API компонента (`selected: Date | null`, `onChange: (date: Date | null) => void`) незмінним — тож `SalaryInputs`, `useAppState`, `useEarnings` і вся логіка розрахунків не змінюються. Конвертацію `Date ⇄ "HH:mm"` кладемо в наявний `src/utils/salaryForm.ts`. Далі прибираємо `react-datepicker` (імпорт CSS, оверрайди в `index.css`, залежність) і оновлюємо README.

## Related files / references
- `src/components/TimePicker/TimePicker.tsx:33` — DatePicker, який замінюємо
- `src/components/TimePicker/TimePicker.tsx:12` — мобільний `readOnly`-хак на `navigator.userAgent`, який зникає
- `src/components/SalaryInputs/SalaryInputs.tsx:119` — два виклики TimePicker (Start/End), API не змінюється
- `src/components/SalaryInputs/SalaryInputs.tsx:30` — `fieldClasses`, спільний стиль полів (той самий клас уже дублюється в TimePicker)
- `src/hooks/useAppState.ts:111` — `handleStartHourChange` / `handleEndHourChange`, працюють з `Date | null`
- `src/utils/salaryForm.ts:48` — `formatEventTime`, поруч додаємо `formatTimeInputValue` / `parseTimeInputValue`
- `src/index.css:63` — блоки `.react-datepicker*` (рядки 63–95) на видалення
- `src/main.tsx:6` — `import 'react-datepicker/dist/react-datepicker.css'` на видалення
- `src/utils/calculations.ts:5` — `getWorkingDayMilliseconds`, споживач `Date`
- `src/components/Sidebar/Sidebar.css` — приклад конвенції «CSS-файл поруч з компонентом»

## Ключові рішення
- **Крок часу:** `step={60}` (будь-яка хвилина) замість поточних 30-хвилинних інтервалів — розрахунки вже працюють з дробовими годинами (`calculateWorkingHoursPerDayValue` → `toFixed(2)`). Півгодинна сітка при потребі повертається через `step={1800}`.
- **12/24 години:** нативний інпут показує формат за локаллю ОС (на en-US девайсі — AM/PM), `value` завжди `HH:mm`. Форсувати 24h нативно неможливо — приймаємо як тредоф.
- **Стилі:** webkit-псевдоелементи (`::-webkit-date-and-time-value`, `::-webkit-calendar-picker-indicator`) виносимо в новий `src/components/TimePicker/TimePicker.css`, як зроблено для `Sidebar`.

## Epics

### Epic 1: Нативний time input у TimePicker
**Status:** approved

**Description:** Замінити `react-datepicker` на `<input type="time">` зі збереженням контракту компонента і поведінки Start→End / End→hours.

**Subtasks:**
- [x] Додати в `src/utils/salaryForm.ts`: `formatTimeInputValue(date: Date | null): string` (→ `"HH:mm"` або `''`) і `parseTimeInputValue(value: string, reference: Date | null): Date | null` (порожнє значення → `null`, дата-частина береться з `reference` або з сьогодні)
- [x] Переписати `TimePicker.tsx`: `<input type="time" value={formatTimeInputValue(selected)} onChange={...} step={60}>`, зберегти рендер `InfoLabel`/`label`
- [x] Прибрати `ref`-хак з `navigator.userAgent` і `readOnly`
- [x] Застосувати ті самі класи поля, що й `fieldClasses` у `SalaryInputs`
- [x] Додати `src/components/TimePicker/TimePicker.css`: `appearance: none`, `color-scheme: dark`, `min-height` (щоб iOS не стискав поле), вирівнювання `::-webkit-date-and-time-value` по лівому краю, інвертована іконка `::-webkit-calendar-picker-indicator` для темного фону

**Acceptance criteria:**
- [x] `npm run build` і `npm run lint` — чисто (lint-помилки в `LightRays.tsx`/`Aurora.tsx`/`Galaxy.tsx` — попередні, не пов'язані з цією зміною, файли не торкались)
- [x] У Chrome (desktop, через preview): клік по полю відкриває нативний time-дропдаун; зміна Start оновлює End на `workingHoursPerDay` вперед (перевірено: Start 09:00 → End 17:00); зміна End перераховує `Working Hours / Day` (End 18:30 → 9.5); End раніше Start підтягує Start (End 08:00 при Start 09:00 → обидва 08:00)
- [x] На iOS Safari — спершу **знайдено регресію**: intrinsic-ширина нативного `input[type="time"]` на iOS перевищує половину вьюпорта, а `min-width: auto` у flex не давав полям стиснутись — Start/End наїжджали одне на одне і виходили за правий край. Виправлено `min-w-0` на flex-обгортці + `appearance: none; min-width: 0` в `TimePicker.css`. **Перевірено на симуляторі iPhone 17 Pro / iOS 26**: поля стоять окремо з відступом у межах екрана; тап відкриває нативне колесо (клавіатури немає, 24h, хвилини по одній); зміна End колесом на 19:00 перерахувала `Working Hours / Day` на 10
- [x] Earnings продовжують тікати після зміни часу (перевірено: зміна Monthly Salary + Start Time одразу відбилась на Current/Daily/Monthly earnings)
- [ ] Amplitude-події — формат `formatEventTime` не змінювався, візуально не перевірялось окремо (ризик низький, той самий `Date`-об'єкт передається в `onChange`)

### Epic 2: Прибирання react-datepicker
**Status:** approved

**Description:** Видалити залежність і всі її сліди після того, як Epic 1 підтверджено робочим.

**Subtasks:**
- [x] Прибрати `import 'react-datepicker/dist/react-datepicker.css'` з `src/main.tsx`
- [x] Видалити блоки `.react-datepicker*` з `src/index.css` (рядки 63–95)
- [x] `npm uninstall react-datepicker`
- [x] Перевірити `grep -rn "date-fns" src/` — якщо `date-fns` / `date-fns-tz` ніде не використовуються (наразі в коді лише `dayjs`), знести і їх (підтверджено: 0 використань, знесено разом з `react-datepicker`)
- [x] Оновити README: секція Tech Stack (без `react-datepicker`) і рядок про «Mobile-friendly time input behavior» → нативні пікери

**Acceptance criteria:**
- [x] `grep -rni "react-datepicker" src/ index.html package.json README.md` — нічого (перевірено, exit 1 для обох `react-datepicker` і `date-fns`)
- [x] `npm run build` проходить; бандл не більший за поточний (PWA precache: 979.68 KiB → 956.91 KiB)
- [x] Візуальна перевірка: поля Start/End виглядають так само, як інші інпути форми (скріншот у preview, TimePicker.css вантажиться 200 OK)

### Epic 3: (Опційно) Персистенс Start/End часу
**Status:** approved

**Description:** Зараз `startHour`/`endHour` живуть у `useState(new Date())`, тож після кожного перезавантаження start = end = «зараз», діапазон нульовий і розрахунок падає на фолбек `workingHoursPerDay`. З рядковим `"HH:mm"` це лагодиться майже безкоштовно. Ролловер дати для застосунку, залишеного відкритим через полуніч, — поза скоупом.

**Subtasks:**
- [x] Перевести `startHour`/`endHour` на `useLocalStorage` з ключами `startHour`/`endHour`, зберігаючи рядки `"HH:mm"` (дефолти — `09:00` і `09:00 + WORKING_HOURS_PER_DAY` = `17:00`)
- [x] Виводити `Date`-значення для `useEarnings` через `useMemo`, прив'язуючи час до сьогоднішньої дати

**Acceptance criteria:**
- [x] Після reload значення Start/End збігаються з введеними раніше (перевірено: End встановлено на 18:30, після `navigate` reload лишилось 18:30, `localStorage.startHour`/`endHour` = `"09:00"`/`"18:30"`)
- [x] `Current earnings` після reload рахуються з реального діапазону, а не з фолбеку — **уточнення плану:** реагує саме `Today` (`dayEarnings`), а не `Daily` (`totalDayEarnings` = `monthlySalary / workingDays`, за дизайном не залежить від годин); перевірено: зміна End 18:30→19:30 після reload змінила `Today` з 101 818,18 на 95 265,80 грн

## Execution log
- 2026-08-19 — created, plan agreed with user
- 2026-08-19 — Epic 1 work complete, awaiting approval
- 2026-08-19 — Epic 1 approved (перевірку на iOS Safari та Amplitude-події свідомо відкладено — див. незакриті пункти acceptance criteria)
- 2026-08-19 — Epic 2 work complete, awaiting approval
- 2026-08-19 — Epic 2 approved
- 2026-08-19 — Epic 3 work complete, awaiting approval
- 2026-08-19 — Epic 3 approved; усі епіки закриті, файл переведено в `review`
- 2026-08-19 — iOS-регресія layout (Start/End наїжджали одне на одне на телефоні): додано `min-w-0` на flex-обгортку в `TimePicker.tsx` і `appearance: none; min-width: 0` в `TimePicker.css`. Причина — intrinsic-ширина нативного time-інпута на iOS Safari > доступного слоту, а `min-width: auto` блокував flex-shrink
- 2026-08-19 — фікс і решта поведінки підтверджені на симуляторі iPhone 17 Pro / iOS 26 (layout, нативне колесо без клавіатури, перерахунок `Working Hours / Day`, персистенс Start/End після reload); iOS-пункт acceptance criteria Epic 1 закрито
- 2026-08-19 — **поза скоупом задачі** (сусідній PWA-баг, знайдений користувачем): у standalone тап по `Working Hours / Day` зсував увесь застосунок вправо. Причина — `.ios-standalone` робить сайдбар `position: absolute`, і закрита панель, зсунута `translateX(100%)`, розширювала документ на 380px вправо; iOS панить візуальний вьюпорт до фокусованого інпута й туди «заїжджав» сайдбар. У браузері бага не було, бо там панель `fixed` і scroll-область не розширює. Фікс у `src/index.css`: у standalone закрита панель лишається на місці (`transform: none`) і ховається через `opacity: 0` + `pointer-events: none` замість виїзду за екран. Перевірено в реальному standalone PWA на симуляторі
