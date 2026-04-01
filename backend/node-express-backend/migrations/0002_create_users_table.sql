-- Migration: create User table for SSO-based authentication
-- Stores only the provider type and provider-issued subject ID (data minimisation).

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "created_at" TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_provider_provider_id_key"
    ON "User" ("provider", "provider_id");
