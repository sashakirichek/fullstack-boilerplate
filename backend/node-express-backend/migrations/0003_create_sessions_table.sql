-- Migration: create Session table for express-session with a D1 backing store.
-- Stores serialised session JSON and an expiry timestamp (epoch ms) for cleanup.

CREATE TABLE IF NOT EXISTS "Session" (
    "sid" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "expires_at" INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS "Session_expires_at_idx"
    ON "Session" ("expires_at");
