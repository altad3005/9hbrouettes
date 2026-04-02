FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── Install deps ─────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json         ./apps/api/package.json
COPY apps/inscription/package.json ./apps/inscription/package.json
COPY apps/compteur/package.json    ./apps/compteur/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=inscription

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules               ./node_modules
COPY --from=deps /app/apps/inscription/node_modules ./apps/inscription/node_modules
COPY apps/inscription ./apps/inscription
WORKDIR /app/apps/inscription
RUN pnpm build

# ── Serve with nginx ──────────────────────────────────────────────────────────
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/inscription/dist /usr/share/nginx/html
COPY apps/inscription/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
