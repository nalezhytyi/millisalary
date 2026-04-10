# Millisalary

Millisalary is a small React app for tracking salary progress in real time.  
You enter your monthly salary, working schedule, and preferred display currency, and the app estimates:

- current earnings
- earnings for today
- full daily earnings
- monthly salary in the selected display currency

It also includes installable PWA support and animated backgrounds.

## Features

- Real-time salary progress based on your workday start and end time
- Configurable `Working Days / Month` and `Working Hours / Day`
- Currency conversion for salary display
- Installable PWA setup with service worker and manifest
- Multiple animated background themes
- Amplitude Analytics + Session Replay instrumentation
- Mobile-friendly time input behavior

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- `react-datepicker`
- `vite-plugin-pwa`

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite dev server runs on:

```bash
http://localhost:3000
```

## Available Scripts

Run the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

Deploy to GitHub Pages:

```bash
npm run deploy
```

## PWA Notes

This project is configured as a PWA with:

- `manifest.webmanifest`
- generated service worker
- installable app icons
- standalone display mode

For the most accurate PWA testing locally, use:

```bash
npm run build
npm run preview
```

The app is configured with:

- `base: /millisalary/`
- `start_url: /millisalary/`
- `scope: /millisalary/`

That setup is intended for GitHub Pages deployment under the `millisalary` path.

## Project Structure

Main app composition:

- [src/App.tsx](/Users/tab/Projects/pet/milli/millisalary/src/App.tsx)

Hooks:

- [src/hooks/useAppState.ts](/Users/tab/Projects/pet/milli/millisalary/src/hooks/useAppState.ts)
- [src/hooks/useBackground.tsx](/Users/tab/Projects/pet/milli/millisalary/src/hooks/useBackground.tsx)
- [src/hooks/useEarnings.ts](/Users/tab/Projects/pet/milli/millisalary/src/hooks/useEarnings.ts)
- [src/hooks/useLocalStorage.ts](/Users/tab/Projects/pet/milli/millisalary/src/hooks/useLocalStorage.ts)

UI components:

- [src/components/SalaryInputs/SalaryInputs.tsx](/Users/tab/Projects/pet/milli/millisalary/src/components/SalaryInputs/SalaryInputs.tsx)
- [src/components/EarningsSummary/EarningsSummary.tsx](/Users/tab/Projects/pet/milli/millisalary/src/components/EarningsSummary/EarningsSummary.tsx)
- [src/components/Sidebar/Sidebar.tsx](/Users/tab/Projects/pet/milli/millisalary/src/components/Sidebar/Sidebar.tsx)
- [src/components/Header/Header.tsx](/Users/tab/Projects/pet/milli/millisalary/src/components/Header/Header.tsx)

## Defaults

Default schedule values are defined in:

- [src/constants.ts](/Users/tab/Projects/pet/milli/millisalary/src/constants.ts)

Current defaults:

- `WORKING_HOURS_PER_DAY = 8`
- `WORKING_DAYS = 22`

## Notes

- `Monthly Salary` is treated as the entered monthly salary value and does not change when working days or working hours are adjusted.
- `Current earnings` and `Daily` values are derived from the configured schedule.
- If you change PWA or frontend assets and do not see updates immediately, clear the service worker cache or do a hard reload.
