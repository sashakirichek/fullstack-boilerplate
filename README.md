# fullstack-boilerplate

ReactJS / NodeJS application aimed to get hands-on expirience/refresh knowledge on monorepo structure and CI/CD (+
quality gate) pipelines setup. Also will include SSG docs. Potenially also Storybook and database examples (Prisma) with
REST and GraphQL.

## Shared types

Frontend / Backend should share types where applicable to avoid duplication

## Monorepo

Example Vite: https://github.com/vitejs/vite/blob/main/pnpm-workspace.yaml

## SSG vitepress project in packages / docs

Example fron Vite codebase: https://github.com/vitejs/vite/tree/main/docs Docs:
https://vitepress.dev/guide/getting-started Playground: https://vitepress.new/

## Storybook in packages / storybook

## db

### 1. Install deps

pnpm install

### 2. Create D1 database

cd backend/node-express-backend npx wrangler d1 create fullstack-db

### Copy the database_id into wrangler.toml

### 3. Generate Prisma client

pnpm prisma:generate

### 4. Apply migration locally

pnpm db:migrate:local

### 5. Start dev

cd ../.. pnpm dev
