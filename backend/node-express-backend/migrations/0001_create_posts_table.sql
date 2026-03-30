-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- Seed data
INSERT INTO "Post" ("title", "body") VALUES
  ('Getting Started with D1', 'Cloudflare D1 is a serverless SQL database based on SQLite that runs at the edge.'),
  ('Prisma ORM Integration', 'Prisma provides a type-safe ORM that works with Cloudflare D1 via the driver adapter.'),
  ('Full-Stack with Workers', 'Build full-stack applications using Cloudflare Workers for both frontend and backend.'),
  ('Edge Computing', 'Run your code closer to your users with Cloudflare''s global edge network.'),
  ('Modern Web Development', 'Combine TanStack Start, Express, and Cloudflare for a modern full-stack setup.');
