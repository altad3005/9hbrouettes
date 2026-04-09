# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**9h Brouette** is an event management system for a Belgian wheelbarrow race (27 June 2026, Villers-le-Bouillet). It's a pnpm + Turborepo monorepo with three apps:

- **`apps/api`** — AdonisJS v7 backend (TypeScript), serves REST + WebSocket
- **`apps/compteur`** — React 19 + Vite + Tailwind v4 SPA for event staff (leaderboard, QR scan, admin)
- **`apps/inscription`** — React 19 + Vite SPA for participant registration (public-facing)

## Commands

All commands run from the repo root unless noted.

```bash
# Install dependencies
pnpm install

# Run all apps in dev mode (parallel via Turborepo)
pnpm dev

# Build all apps
pnpm build
```

### Per-app commands (run from `apps/<name>/`)

```bash
# API (AdonisJS)
node ace serve --hmr       # dev server with HMR
node ace build             # production build
node ace test              # run tests (Japa)
node ace migration:run     # run DB migrations
node ace migration:rollback
eslint .                   # lint
prettier --write .         # format
tsc --noEmit               # typecheck

# compteur / inscription (Vite + React)
pnpm dev                   # dev server
pnpm build                 # production build
pnpm lint                  # eslint
```

## Architecture

### API (`apps/api`)

AdonisJS v7 with Lucid ORM. Routes are defined in `start/routes.ts` — all prefixed `/api`. The API has no authentication; access control is entirely client-side in the compteur app.

**Models:**
- `Team` — a competing team (`id` UUID, `nom`, `tours` lap count)
- `Inscription` — a registered participant (prenom, nom, email, telephone, dateNaissance, repas, equipe)
- `Config` — key/value store for event config (`startTime`, `endTime`)

**Real-time via WebSocket:** `app/services/ws_service.ts` boots a `ws` WebSocket server on `/ws`. On connection it pushes current teams and config; controllers call `WsService.broadcast()` after mutations. The `compteur` frontend maintains a persistent WebSocket connection and reacts to `{ type: 'teams' | 'config', data: ... }` messages.

**Path aliases** (defined in `package.json#imports`): `#controllers/*`, `#models/*`, `#services/*`, `#validators/*`, `#database/*`, etc.

### Frontend apps

Both are plain React + React Router v7 SPAs with no shared package between them.

**`compteur`**: Tailwind v4, routes: `/` (Classement/leaderboard), `/scan` (QR code lap recording, staff-only), `/inscriptions` (registrant list, admin-only), `/admin` (team management + config). Real-time data flows through the singleton `api` object in `src/api.js` (WebSocket client with HTTP fallback for mutations). A `Countdown` page is shown until `config.startTime` is reached.

**`inscription`**: Registration form (public) + `/reglement` rules page. No Tailwind — uses plain CSS (`App.css`). Calls `/api/teams` and `/api/inscriptions` directly via axios.

### Database

- **Development:** PostgreSQL (configured in `apps/api/.env` — host `127.0.0.1:5432`, db `9hbrouette`, user `brouette`)
- **Production:** PostgreSQL via Docker Compose (`docker-compose.yml`)
- **Tests:** in-memory session driver; DB connection from `.env.test`

### Production Deployment

`docker-compose.yml` runs postgres + api + inscription + compteur + adminer behind **Traefik** (via `dokploy-network`). Copy `.env.production.example` → `.env.production` and fill `DOMAIN`, `APP_KEY`, `DB_PASSWORD`. The `compteur` image receives `VITE_INSCRIPTION_URL` as a build arg pointing to the inscription subdomain.
