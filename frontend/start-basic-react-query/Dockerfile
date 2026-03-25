# ── Build stage ────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy workspace manifests first for layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY frontend/start-basic-react-query/package.json ./frontend/start-basic-react-query/

RUN pnpm install --frozen-lockfile --filter tanstack-start-example-basic-react-query

COPY frontend/start-basic-react-query ./frontend/start-basic-react-query

WORKDIR /app/frontend/start-basic-react-query
RUN pnpm build

# ── Runtime stage ───────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY frontend/start-basic-react-query/package.json ./frontend/start-basic-react-query/

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/start-basic-react-query/node_modules ./frontend/start-basic-react-query/node_modules

COPY --from=builder /app/frontend/start-basic-react-query/dist ./frontend/start-basic-react-query/dist

WORKDIR /app/frontend/start-basic-react-query

EXPOSE 3000

CMD ["pnpm", "start"]
