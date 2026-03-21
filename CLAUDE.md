# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

`@gfazioli/mantine-clock` — an analog Clock component and time-management hooks (`useClock`, `useClockCountDown`) for React/Mantine. Supports live ticking, static display, timezone conversion (via dayjs), sector arcs, and extensive styling via Mantine's Styles API.

## Commands

| Command | Purpose |
|---------|---------|
| `yarn build` | Build the npm package (Rollup → `package/dist/`) |
| `yarn dev` | Start Next.js docs dev server (port 9281) |
| `yarn test` | Full suite: syncpack + prettier + typecheck + lint + jest |
| `yarn jest` | Run Jest tests only |
| `yarn jest --testPathPattern=Clock.test` | Run a single test file |
| `yarn docgen` | Generate component API docs (docgen.json) |
| `yarn eslint` | ESLint (cached) |
| `yarn stylelint` | Stylelint for CSS (cached) |
| `yarn prettier:check` | Check formatting |
| `yarn prettier:write` | Fix formatting |
| `yarn typecheck` | TypeScript check (root + docs) |
| `yarn clean && yarn build` | Clean rebuild |
| `yarn docs:deploy` | Build docs + deploy to GitHub Pages |
| `yarn release:patch` | Bump patch version + deploy docs |
| `diny yolo` | AI-assisted auto-commit (stages all, generates message, commits) |

## Architecture

This is a Yarn workspaces monorepo with two workspaces: `package/` (the npm library) and `docs/` (Next.js documentation site).

### Package (`package/src/`)

- **`Clock.tsx`** — Main component. Uses Mantine's `factory()` pattern with `createVarsResolver` for CSS variable theming. Internally splits into an SSR-safe shell (renders static markup before mount) and a `RealClock` sub-component that handles live hand rotation via `setInterval`. Time parsing supports strings (`"HH:MM:SS"`), `Date`, and dayjs objects. Timezone conversion uses `dayjs/plugin/timezone`. Arc sectors are rendered as SVG paths.
- **`Clock.module.css`** — CSS Modules styles, scoped with `hash-css-selector` (prefix `me`).
- **`hooks/use-clock.ts`** — `useClock` hook: returns formatted time data (hours, minutes, seconds, amPm, day, week, etc.) with configurable timezone, 24h format, padding, and update frequency.
- **`hooks/use-clock-count-down.ts`** — `useClockCountDown` hook: countdown timer supporting both target dates and duration-based countdowns, with start/pause/resume/reset controls.
- **`index.ts`** — Public API barrel file. All exports go through here.

### Build Pipeline

Rollup (`rollup.config.mjs`) produces ESM (`.mjs`) and CJS (`.cjs`) output with source maps. CSS Modules are extracted and minimized via `rollup-plugin-postcss`. Non-index chunks get a `'use client'` banner. Types are generated separately via `scripts/generate-dts`.

### Docs (`docs/`)

Next.js 15 site deployed to GitHub Pages. Demo components live in `docs/demos/`. Shared shell/footer components in `docs/components/`.

## Key Patterns

- **Mantine Factory Pattern**: The Clock component uses `factory<ClockFactory>()` with `useProps`, `useStyles`, and `createVarsResolver` — follow this same pattern for any new sub-components.
- **SSR Hydration Safety**: The component renders a static shell (`!hasMounted`) to prevent hydration mismatches, then switches to live rendering after mount.
- **CSS Variables**: All visual properties are exposed as `--clock-*` CSS custom properties resolved through `varsResolver`. Color props go through `parseThemeColor()`.
- **dayjs for Timezone**: Both the component and hooks use dayjs with `utc` and `timezone` plugins — never use raw `Date` for timezone operations.

## Testing

Tests use Jest + `@testing-library/react` + `@mantine-tests/core`. Test files are co-located with source (`*.test.tsx`). The `jest-environment-jsdom` environment is used. Storybook stories (`*.story.tsx`) are also co-located for visual development.
