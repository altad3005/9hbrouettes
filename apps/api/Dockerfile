FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── Install deps ────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json         ./apps/api/package.json
COPY apps/inscription/package.json ./apps/inscription/package.json
COPY apps/compteur/package.json    ./apps/compteur/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=api

# ── Build ────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules         ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN node ace build

# ── Production runner ────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/api/build .
RUN npm install --omit=dev --ignore-scripts
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh
EXPOSE 3333
ENTRYPOINT ["./docker-entrypoint.sh"]
