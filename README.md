# Millisalary

Millisalary is a small React app for tracking salary progress in real time.  
You enter your monthly salary, working schedule, and preferred display currency, and the app estimates:

- earnings for the current hour, day, week, month and year
- your rate per second, minute, hour and day
- the next payday and how many days are left

The UI follows native iOS conventions (system colors, bottom sheets, segmented control) with light and dark themes. It is also an installable PWA.

## Features

- Real-time salary progress based on your workday start and end time
- Configurable `Working Days / Month` and `Working Hours / Day`
- Currency conversion for salary display
- Installable PWA setup with service worker and manifest
- Light, dark or system theme
- Settings and Breakdown bottom sheets
- Configurable payday
- Amplitude Analytics + Session Replay instrumentation
- Native time input for workday start/end

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui (Radix, vaul)
- `vite-plugin-pwa`

## Getting Started

Install dependencies (the project uses pnpm; `packageManager` is pinned in `package.json`, so `corepack enable` picks the right version):

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

Expose the dev server on your network:

```bash
pnpm run dev:host
```

The Vite dev server runs on:

```bash
http://localhost:3000
```

## Available Scripts

Run the local development server:

```bash
pnpm run dev
```

Run the local development server and bind to `0.0.0.0`:

```bash
pnpm run dev:host
```

Create a production build:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

Run linting:

```bash
pnpm run lint
```

Deploy to GitHub Pages:

```bash
pnpm run deploy
```

## PWA Notes

This project is configured as a PWA with:

- `manifest.webmanifest`
- generated service worker
- installable app icons
- standalone display mode

For the most accurate PWA testing locally, use:

```bash
pnpm run build
pnpm run preview
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
- [src/hooks/useTheme.ts](/Users/tab/Projects/pet/milli/millisalary/src/hooks/useTheme.ts)
- [src/hooks/useEarnings.ts](/Users/tab/Projects/pet/milli/millisalary/src/hooks/useEarnings.ts)
- [src/hooks/useLocalStorage.ts](/Users/tab/Projects/pet/milli/millisalary/src/hooks/useLocalStorage.ts)

UI components:

- [src/components/EarningsDial/EarningsDial.tsx](/Users/tab/Projects/pet/milli/millisalary/src/components/EarningsDial/EarningsDial.tsx)
- [src/components/SettingsSheet/SettingsSheet.tsx](/Users/tab/Projects/pet/milli/millisalary/src/components/SettingsSheet/SettingsSheet.tsx)
- [src/components/BreakdownSheet/BreakdownSheet.tsx](/Users/tab/Projects/pet/milli/millisalary/src/components/BreakdownSheet/BreakdownSheet.tsx)
- [src/components/Header/Header.tsx](/Users/tab/Projects/pet/milli/millisalary/src/components/Header/Header.tsx)
- [src/components/ui/](/Users/tab/Projects/pet/milli/millisalary/src/components/ui) — shadcn components

Calculations:

- [src/utils/calculations.ts](/Users/tab/Projects/pet/milli/millisalary/src/utils/calculations.ts)

## Defaults

Default schedule values are defined in:

- [src/constants.ts](/Users/tab/Projects/pet/milli/millisalary/src/constants.ts)

Current defaults:

- `WORKING_HOURS_PER_DAY = 8`
- `WORKING_DAYS = 22`

## Notes

- `Monthly Salary` is treated as the entered monthly salary value and does not change when working days or working hours are adjusted.
- Hour, day, week, month and year earnings are derived from the configured schedule; the Breakdown sheet shows all of them with your per-second to per-day rate.
- If you change PWA or frontend assets and do not see updates immediately, clear the service worker cache or do a hard reload.
