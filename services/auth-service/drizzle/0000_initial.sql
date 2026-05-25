CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "role" text NOT NULL DEFAULT 'user',
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "token" text PRIMARY KEY,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_user" ON "refresh_tokens" ("user_id");
