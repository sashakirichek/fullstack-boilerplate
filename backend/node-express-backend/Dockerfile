# ── Build stage ────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy workspace manifests first for layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY backend/node-express-backend/package.json ./backend/node-express-backend/

RUN pnpm install --frozen-lockfile --filter node-express-backend

COPY backend/node-express-backend ./backend/node-express-backend

WORKDIR /app/backend/node-express-backend
RUN pnpm build

# ── Runtime stage ───────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/node-express-backend/package.json ./backend/node-express-backend/

RUN pnpm install --frozen-lockfile --filter node-express-backend --prod

COPY --from=builder /app/backend/node-express-backend/dist ./backend/node-express-backend/dist

WORKDIR /app/backend/node-express-backend

EXPOSE 3001

CMD ["node", "dist/index.js"]
