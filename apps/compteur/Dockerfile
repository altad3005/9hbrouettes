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
    pnpm install --frozen-lockfile --filter=compteur

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
ARG VITE_INSCRIPTION_URL
ENV VITE_INSCRIPTION_URL=$VITE_INSCRIPTION_URL
WORKDIR /app
COPY --from=deps /app/node_modules            ./node_modules
COPY --from=deps /app/apps/compteur/node_modules ./apps/compteur/node_modules
COPY apps/compteur ./apps/compteur
WORKDIR /app/apps/compteur
RUN pnpm build

# ── Serve with nginx ──────────────────────────────────────────────────────────
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/compteur/dist /usr/share/nginx/html
COPY apps/compteur/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
