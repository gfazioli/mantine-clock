# CLAUDE.md

## Project
`@gfazioli/mantine-clock` — a Mantine 9 analog Clock component and time-management hooks (`useClock`, `useClockCountDown`) for React/Mantine. Supports live ticking, static display, timezone conversion (via dayjs), sector arcs, and extensive styling via Mantine's Styles API.

## Commands
| Command | Purpose |
|---------|---------|
| `yarn build` | Build the npm package via Rollup |
| `yarn dev` | Start the Next.js docs dev server (port 9281) |
| `yarn test` | Full test suite (syncpack + oxfmt + typecheck + lint + jest) |
| `yarn jest` | Run only Jest unit tests |
| `yarn docgen` | Generate component API docs (docgen.json) |
| `yarn docs:build` | Build the Next.js docs site for production |
| `yarn docs:deploy` | Build and deploy docs to GitHub Pages |
| `yarn lint` | Run ESLint + Stylelint |
| `yarn format:write` | Format all files with oxfmt |
| `yarn storybook` | Start Storybook dev server |
| `yarn clean` | Remove build artifacts |
| `yarn release:patch` | Bump patch version and deploy docs |
| `diny yolo` | AI-assisted commit (stage all, generate message, commit + push) |

> **Important**: After changing the public API, always run `yarn clean && yarn build` before `yarn test`.

## Architecture

### Workspace Layout
Yarn workspaces monorepo with two workspaces: `package/` (npm package) and `docs/` (Next.js 15 documentation site).

### Package Source (`package/src/`)
- **`Clock.tsx`** — Main component using Mantine's `factory()` pattern with `createVarsResolver`. Renders an SSR-safe static shell before mount, then switches to `RealClock` for live rendering. Time parsing supports strings (`"HH:MM:SS"`), `Date`, and dayjs objects.
- **`ClockFaceStatic.tsx`** — `React.memo` component rendering static face elements (hour/minute ticks, primary/secondary numbers).
- **`RealClock.tsx`** — `React.memo` component handling live hand rotation, arc sectors, and SVG sector paths.
- **`ClockDigital.tsx`** — Compound sub-component (`Clock.Digital`) for digital time display.
- **`clock-utils.ts`** — Shared utilities: `parseTimeValue`, `round2`, `defaultClockProps`, layout constants.
- **`geometry.ts`** — Clock geometry calculations (tick positions, number positions, hand lengths, arc paths).
- **`hooks/use-clock.ts`** — `useClock` hook returning formatted time data.
- **`hooks/use-clock-count-down.ts`** — `useClockCountDown` hook for countdown timers.
- **`Clock.module.css`** / **`ClockDigital.module.css`** — CSS Modules styles.
- **`index.ts`** — Public API barrel file.

### Build Pipeline
Rollup bundles to dual ESM/CJS with `'use client'` banner. CSS modules hashed with `hash-css-selector` (prefix `me`). TypeScript declarations via `rollup-plugin-dts`. CSS split into `styles.css` and `styles.layer.css`.

## Component Details

### SSR Hydration Safety
The component renders a static shell (`!hasMounted`) to prevent hydration mismatches, then switches to live rendering after mount.

### CSS Variables
All visual properties are exposed as `--clock-*` CSS custom properties resolved through `varsResolver`. Color props go through `parseThemeColor()`.

### Timezone Support (dayjs)
Both the component and hooks use dayjs with `utc` and `timezone` plugins — never use raw `Date` for timezone operations.

### Geometry System (`geometry.ts`)
Calculates tick positions, number positions, hand lengths, and arc paths for the SVG clock face. This module is pure math with its own test file (`geometry.test.ts`).

### `useClock` Hook
Returns formatted time data (hours, minutes, seconds, amPm, day, week, etc.) with configurable timezone, 24h format, padding, and update frequency.

### `useClockCountDown` Hook
Countdown timer supporting both target dates and duration-based countdowns, with start/pause/resume/reset controls.

### Mantine Factory Pattern
The Clock component uses `factory<ClockFactory>()` with `useProps`, `useStyles`, and `createVarsResolver` — follow this same pattern for any new sub-components.

## Testing
Jest with `jsdom`, `esbuild-jest` transform, CSS mocked via `identity-obj-proxy`. Tests use `@mantine-tests/core` render helper. Test files are co-located with source (`*.test.tsx`). Storybook stories (`*.story.tsx`) are also co-located for visual development.

## Ecosystem
This repo is part of the Mantine Extensions ecosystem, derived from the `mantine-base-component` template. See the workspace `CLAUDE.md` (in the parent directory) for:
- Development checklist (code → test → build → docs → release)
- Cross-cutting patterns (compound components, responsive CSS, GitHub sync)
- Update packages workflow
- Release process
