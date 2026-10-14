# TrakSpend — Backend API

Laravel 13 / PHP 8.3 REST API for [TrakSpend](../README.md). Serves
JSON under `/api/*` to the Next.js frontend, which proxies every request through
its own origin, so the API never deals with CORS from the browser.

| | |
|---|---|
| Framework | Laravel 13, PHP 8.3 |
| Auth | Laravel Sanctum — stateless Bearer tokens (no cookies, no CSRF) |
| Database | PostgreSQL 15 (Neon in production) |
| Runtime | Nginx + PHP-FPM in Docker, deployed on Render |
| Monitoring | Sentry (`sentry/sentry-laravel`) |

## Features

- **Auth** — register, login, logout, profile and password updates, and
  password reset by emailed one-time code (single-use, 15-minute expiry,
  discarded after 5 wrong attempts). Tokens expire after
  `SANCTUM_TOKEN_EXPIRATION` minutes (default 7 days); changing the password
  revokes every token and issues a new one.
- **Expenses** — CRUD with server-side search, filtering (categories, payment
  methods, date range, amount range), sorting and pagination.
  `GET /api/expenses/stats` returns aggregates (totals, per-category,
  per-payment-method, daily/monthly series) over the same filters.
- **Categories** — shared global defaults plus each user's own categories.
  A category in use by expenses cannot be deleted.
- **Payment methods** — read-only reference data.
- **Admin** — platform stats, recent activity, user role management and CRUD
  over the global categories, gated on `user.is_admin`.
- **Rate limiting** — every route is limited by the `api` limiter
  (`API_RATE_LIMIT`, default 120/min per user, falling back to IP); the public
  auth routes are additionally limited to 10/min per IP.
- **Health check** — `GET /api/health` verifies the database and returns 503
  when it is unreachable. Render gates traffic on it.

The full route table is in [CLAUDE.md](../CLAUDE.md#api-routes).

## Layout

```
app/Http/Controllers/Api/  # Auth, Expense, Category, PaymentMethod, Admin
app/Http/Requests/         # validation; ExpenseFilterRequest owns the shared list/stats filters
app/Http/Resources/        # ExpenseResource ({ data: [...] }, ISO 8601 dates)
app/Models/                # User, Expense, Category, PaymentMethod
database/migrations/       # idempotent, PostgreSQL-safe
database/seeders/          # CategorySeeder, PaymentMethodSeeder, DatabaseSeeder
routes/api.php             # every route
tests/Feature/             # runs on Postgres, in <DB_DATABASE>_test
```

Tables are **singular** (`user`, `category`, `expense`, `payment_method`), and
every model declares `protected $table`. New models must do the same.

## Running locally

### With Docker (recommended)

From the repo root, `docker compose up --build` starts the API on
http://localhost:18000 together with Postgres and the frontend. See the
[root README](../README.md#getting-started).

### Standalone

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed     # categories, payment methods + test user (test@example.com / password)
php artisan serve       # http://localhost:8000
```

Variables are documented in `.env.example` and
[docs/ENVIRONMENT_VARIABLES.md](../docs/ENVIRONMENT_VARIABLES.md).

## Tests and lint

```bash
php artisan test                    # whole suite
php artisan test --filter TestName  # one test
./vendor/bin/pint --test            # lint check
./vendor/bin/pint                   # auto-format
```

The suite runs on PostgreSQL in a separate `<DB_DATABASE>_test` database and
refuses to run against any database whose name does not end in `_test`. In
Docker, run these inside the `api` container after a one-time
`composer install && php artisan package:discover` (the image is built
`--no-dev`).

There is no CI, so run both before pushing.

## Seeding

- **Always:** `CategorySeeder` (6 global categories) and `PaymentMethodSeeder`
  (6 payment methods). Both are idempotent and run on every container boot,
  production included.
- **Test fixtures only:** `DatabaseSeeder` creates `test@example.com` when
  `SEED_TEST_USER=true`. Never set it in production.

## Deployment

Pushing to `main` makes Render build `Dockerfile` (described in
[`render.yaml`](../render.yaml)). On boot, `docker-entrypoint.sh` waits for the
database, runs `migrate --force` and the reference seeders, and only then
starts PHP-FPM and Nginx. If migrations never succeed, the container exits
instead of serving. Render's free tier has no shell, so migrations must stay
automatic.

After editing `docker-entrypoint.sh`, run `docker compose build api`: the
script is baked into the image, so the bind mount does not pick it up.

More: [docs/DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md),
[RUNBOOK.md](../RUNBOOK.md), [MONITORING.md](../MONITORING.md).
