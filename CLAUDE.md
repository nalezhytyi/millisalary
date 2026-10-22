# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server on :3000, served under /millisalary/ (opens a browser)
npm run dev:host   # same, bound to 0.0.0.0 for testing on a phone
npm run build      # tsc -b (the only type check) + vite build into build/
npm run preview    # serve build/ — use this to test the service worker / install flow
npm run lint       # eslint over **/*.ts(x)
npm run deploy     # build, then gh-pages pushes build/ to the gh-pages branch
```

- There is no test suite. Verify changes in the running app; `.claude/launch.json` defines a `millisalary-dev` preview server on port 5174.
- Lint baseline is not clean: 2 `no-explicit-any` errors in `LightRays.tsx` and unused-disable warnings in `Aurora.tsx`/`Galaxy.tsx` predate current work. Don't treat them as regressions.
- `npm run deploy` publishes to https://nalezhytyi.github.io/millisalary/ (Pages takes ~1 min to pick it up). Never `git push` or deploy without the user's explicit approval for that specific push/deploy.
- Commit with the repo-local git identity (`nalezhytyi`), not the global work identity. Commit messages use Conventional Commits with a lowercase scope, e.g. `fix(pwa): …`, `feat(timepicker): …`.

## Architecture

Single-page React 19 + TypeScript + Tailwind app, no router and no global state library. Everything is deployed under the `/millisalary/` base path (`vite.config.ts` `base`, manifest `scope`/`start_url`/`id`).

**State flows through one hook.** `useAppState` (`src/hooks/useAppState.ts`) owns every setting and every change handler; `App.tsx` destructures it and passes props down to presentational components. Settings persist via `useLocalStorage` (JSON in `localStorage`, keys: `monthlySalary`, `monthlySalaryCurrency`, `earningsCurrency`, `workingHoursPerDay`, `workingDays`, `isInputsCollapsed`, `startHour`, `endHour`, `background`). Start/end times are stored as `"HH:mm"` strings and re-anchored to today on load; components and calculations work with `Date | null`, converted by `formatTimeInputValue` / `parseTimeInputValue` in `src/utils/salaryForm.ts`.

**Coupled schedule fields:** changing Start moves End forward by `workingHoursPerDay`; changing End recomputes `workingHoursPerDay` from the range; an End earlier than Start pulls Start back to it; editing hours/day moves End.

**Earnings ticker:** `useEarnings` recomputes every 100 ms with dayjs. Business days are Mon–Fri; completed days are capped at `workingDays`; today's share is the elapsed part of the start–end window; the total is capped at the monthly salary. The exchange rate is fetched from exchangerate-api.com (`src/api.ts`) whenever either currency changes, and every displayed amount is multiplied by it. Formatting uses the `uk-UA` locale (`formatCurrency` in `src/utils/calculations.ts`).

**Analytics:** `initAmplitude()` runs in `main.tsx` (autocapture + session replay at 100%). `trackAmplitudeEvent` is a no-op until init finishes. User-facing handlers in `useAppState`/`useBackground` emit snake_case events (`salary_currency_changed`, `background_changed`, …); new settings should follow that pattern.

**Backgrounds:** four WebGL shaders built on `ogl` under `src/components/backgrounds/`, chosen by `useBackground` and rendered into the fixed `.app-background` layer behind the UI.

**Components** each live in their own folder with an `index.ts` re-export and, when needed, a co-located `.css` file for things Tailwind can't express (webkit pseudo-elements, platform workarounds).

## PWA and platform quirks

- `vite-plugin-pwa` (generateSW, `autoUpdate`) builds the manifest from `vite.config.ts`; the service worker registers only in production (`main.tsx`). After asset changes, a stale SW cache can hide updates — hard reload or test via `build` + `preview`.
- **iOS standalone:** an inline script in `index.html` adds `html.ios-standalone` when `navigator.standalone` is true. In that mode WebKit clips `position: fixed` layers to a viewport shorter than the screen, so `src/index.css` switches the full-screen layers (`.app-background`, `.sidebar`, `.sidebar-overlay`) to absolute and makes `body` the scroller. Any new full-screen fixed layer must join that list. Don't size full-height layers with `100vh`; anchor `top`/`bottom` instead. The closed sidebar fades in place in standalone rather than sliding off-screen (an off-screen absolute box widens the document and iOS pans to it). The comments in `index.css` and `Sidebar.css` explain each rule.
- **Native time input** (`TimePicker`): `color-scheme: dark`, `appearance: none` and `min-width: 0` (plus `min-w-0` on its flex wrapper) keep iOS from overflowing the row. The Chromium clock icon is forced white with `filter: brightness(0) invert(1)` because Chromium versions disagree on whether `color-scheme` already lightens it.
- **Icons:** the master image is `public/images/money-face.png`, which is 433×480 (not square). Every square icon (`favicon.png`, `apple-touch-icon.png`, `pwa-192x192.png`, `pwa-512x512.png`) must be derived from it without stretching. Manifest icons keep ~10% transparent padding (emoji at ~80% of the canvas), because macOS draws non-squircle app icons on a plate and a full-bleed image fills it edge to edge.
- Chrome (144+) does not refresh an installed app's icon unless the manifest `icons` entries change (e.g. a new file name). Overwriting the PNGs in place only reaches new installs.

## Related

- `tasks/NNN-slug.md` hold task plans (written in Ukrainian) with epics, subtasks and acceptance criteria; keep a task's checkboxes and status current when working from one.
- The Electron desktop wrapper is a separate repo at `../electron-millisalary`.
