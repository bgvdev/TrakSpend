# Expense Tracker — Frontend

Next.js 15 (App Router) / React 19 / TypeScript / Tailwind CSS client for the
[Expense Tracker](../README.md). Deployed on Vercel at
https://trakspend.vercel.app.

## Features

- **Dashboard** — this month's spending, recent expenses and category breakdown.
- **Expenses** — paginated, sortable table with search and filters (categories,
  payment methods, date range, amount range). Filtering, sorting and totals are
  computed by the API. Opens on the current month; "Clear all" shows all time.
  CSV export of every matching row.
- **Categories** — your own categories with a color and icon, alongside the
  shared defaults.
- **Reports** — charts of spending by category, payment method, day and month.
- **Settings** — profile, password, and appearance.
- **Admin** — platform stats, activity, user roles and global categories
  (admins only).
- **Auth** — register, login, forgot/reset password by emailed code.
- **Theming** — light, dark or system mode, combined with one of four color
  palettes (Classic, Ocean, Forest, Sunset), picked in Settings → Appearance.
  Both choices are stored in `localStorage` and applied before first paint, so
  the page never flashes the wrong theme.

## Running locally

### With Docker (recommended)

From the repo root, `docker compose up --build` serves the app on
http://localhost:13000 and proxies `/api/*` to the `api` container. See the
[root README](../README.md#getting-started).

### Standalone

```bash
npm install
cp .env.example .env.local   # set BACKEND_URL, e.g. http://localhost:8000
npm run dev                  # http://localhost:3000
```

## How API calls work

The browser never calls the backend directly. `src/lib/api.ts` uses relative
`/api/*` URLs, and the rewrite in `next.config.ts` proxies them to
`BACKEND_URL`, so there is no CORS. To point at a different backend, change
`BACKEND_URL`; never hard-code a URL in `api.ts`.

`BACKEND_URL` is read at **build** time. It defaults to
`http://localhost:8000` in dev and has no production fallback: a production
build fails if it is unset. On Vercel, set it for both Production and Preview.

The auth token is kept in `localStorage` and sent as a Bearer header.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `BACKEND_URL` | production builds | Proxy target for `/api/*` (build time) |
| `NEXT_PUBLIC_SENTRY_DSN` | no | Enables Sentry; empty disables it |
| `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | no | Source-map upload at build time |

See `.env.example` and
[docs/ENVIRONMENT_VARIABLES.md](../docs/ENVIRONMENT_VARIABLES.md).

## Layout

```
src/
  app/                 # pages: dashboard, expenses, categories, reports, settings, admin, auth pages
  components/          # feature components (ExpenseList, ExpenseFilters, CategoryPanel, charts/, …)
  components/ui/       # design-system primitives: Button, Input, Field, Card, SidePanel, Select, …
  components/layout/   # AppShell, Page, AuthCard, RequireAuth, BackgroundShapes
  hooks/               # useAuth, useExpenses, useExpenseStats, useCategories, useTheme, useToast, …
  lib/                 # api.ts, expenseQuery.ts (filters → query params), types.ts, format.ts
```

## Styling rules

Colors come from semantic tokens (`background`, `surface`, `border`,
`foreground`, `muted`, `primary`, `accent`, `danger`, …) defined in
`src/app/globals.css` and mapped in `tailwind.config.ts`. Each palette
overrides those tokens under `[data-palette="…"]`, separately for light and
dark.

- Use the tokens and the `components/ui/` primitives. Never use raw palette
  classes (`indigo-…`, `white/…`) or hex values in markup.
- The only inline colors are data-driven ones (category colors, palette preview
  swatches).
- To add a palette: add light and dark token blocks in `globals.css`, then add
  it to `PALETTES` in `hooks/useTheme.tsx` and to `PALETTE_OPTIONS` in
  `components/ui/ThemeToggle.tsx`.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build (needs BACKEND_URL)
npm run lint    # ESLint
```

There is no CI, so run `npm run lint` and `npm run build` before pushing. In
Docker, run lint inside the container (`docker compose exec web npm run lint`),
but **never** run `npm run build` in the running `web` container: it overwrites
the dev server's `.next/`. Use instead:

```bash
docker compose run --rm --no-deps -e BACKEND_URL=http://api:8000 web npm run build
```
