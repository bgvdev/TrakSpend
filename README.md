# TrakSpend

A full-stack expense tracking web app — log expenses by category and payment
method, search and filter your history, see reports, and manage your account.

**Live app:** https://trakspend.vercel.app

## Features

- Expenses with server-side search, filters, sorting, pagination and CSV export
- Personal categories (color + icon) alongside shared defaults
- Dashboard and reports with charts by category, payment method, day and month
- Accounts with password reset by emailed code
- Light/dark/system theme and four color palettes (Classic, Ocean, Forest, Sunset)
- Admin panel for users, roles and global categories

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| Backend | Laravel 13, PHP 8.3, Laravel Sanctum |
| Database | PostgreSQL 15 |
| Infra | Docker Compose (local), Vercel (frontend), Render (backend), Neon (database) |

Each app has its own README with more detail:
[frontend/README.md](frontend/README.md) · [backend/README.md](backend/README.md)

## Getting started

### Full stack (Docker)

Docker Compose reads the **repo-root** `.env` — not `backend/.env` — so
`DB_PASSWORD` and `APP_KEY` must be set there before the first run:

```bash
cp .env.example .env
docker compose run --rm api php artisan key:generate --show   # paste into APP_KEY
# then set DB_PASSWORD in .env to any value

docker compose up --build              # first run
docker compose up                      # subsequent runs
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:13000 |
| API | http://localhost:18000/api/health |
| PostgreSQL | `localhost:15432` |

Host ports are deliberately off the defaults so this stack can run alongside
others; override with `WEB_HOST_PORT` / `API_HOST_PORT` / `DB_HOST_PORT`.

Seeded test login (only when `SEED_TEST_USER=true`): `test@example.com` / `password`.

### Backend only
```bash
cd backend
cp .env.example .env        # configures Laravel itself, separate from the root .env
php artisan key:generate
composer install
php artisan migrate
php artisan db:seed         # seeds categories, payment methods + test user
php artisan serve           # http://localhost:8000
```

### Frontend only
```bash
cd frontend
npm install
cp .env.example .env.local  # set BACKEND_URL to your API, e.g. http://localhost:8000
npm run dev                 # http://localhost:3000
```

`BACKEND_URL` is the proxy target for the `/api/*` rewrite and is read at
**build** time. It has no production fallback — a production build fails if it is
unset, rather than silently proxying to the live backend.

## Deployment

- **Frontend** → [Vercel](https://trakspend.vercel.app)
- **Backend API** → [Render](https://expense-tracker-singapore.onrender.com)
- **Database** → [Neon](https://neon.tech) (PostgreSQL 15)

Pushing to `main` deploys both apps; there is no CI, so run the backend tests
and pint, and the frontend lint and build, before pushing. See
[docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for full setup instructions.
