-- Migration: remove seed rows from Post table that were added by 0001.
-- Keeps the schema intact; only deletes the five hard-coded development rows
-- so production databases start empty.

DELETE FROM "Post" WHERE "title" IN (
    'Getting Started with D1',
    'Prisma ORM Integration',
    'Full-Stack with Workers',
    'Edge Computing',
    'Modern Web Development'
);
