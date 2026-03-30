# D1 Database Migrations

This project uses [Cloudflare D1](https://developers.cloudflare.com/d1/) with
[Prisma ORM](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1).

Migrations are plain SQL files in `backend/node-express-backend/migrations/`.

## Prerequisites

```bash
# Create the D1 database (one-time)
cd backend/node-express-backend
npx wrangler d1 create fullstack-db
```

After creating, copy the `database_id` into `wrangler.toml` under `[[d1_databases]]`.

## Creating a New Migration

1. **Update the Prisma schema** in `prisma/schema.prisma`

2. **Create a migration file:**

   ```bash
   npx wrangler d1 migrations create fullstack-db <migration_name>
   ```

3. **Generate SQL from schema diff:**

   ```bash
   npx prisma migrate diff \
     --from-local-d1 \
     --to-schema ./prisma/schema.prisma \
     --script \
     --output migrations/<migration_file>.sql
   ```

   For the first migration (empty → schema), use `--from-empty` instead of `--from-local-d1`.

4. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

## Applying Migrations

```bash
# Apply to local D1 (for development)
pnpm db:migrate:local

# Apply to remote D1 (for production)
pnpm db:migrate:remote
```

## Rolling Back

D1 does not support automatic rollback. To revert a migration:

1. Write a new migration with the reverse SQL (e.g., `DROP TABLE`, `ALTER TABLE DROP COLUMN`).
2. Apply the new migration using the commands above.

**Example rollback migration:**

```sql
-- Revert: drop the Post table
DROP TABLE IF EXISTS "Post";
```

## Useful Commands

```bash
# Check local database contents
npx wrangler d1 execute fullstack-db --local --command "SELECT * FROM Post"

# Check remote database contents
npx wrangler d1 execute fullstack-db --remote --command "SELECT * FROM Post"

# List applied migrations
npx wrangler d1 migrations list fullstack-db --local
npx wrangler d1 migrations list fullstack-db --remote
```
