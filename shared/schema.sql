-- shared/schema.sql
-- Database Schema กลาง — อ้างอิงจาก Prisma schemas จริงของแต่ละ service
-- หมายเหตุ: Prisma จัดการ migration เอง ไฟล์นี้ใช้เป็น reference เท่านั้น
-- อย่ารัน SQL นี้โดยตรง ให้ใช้: npx prisma migrate deploy

-- ─── service-auth ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,               -- cuid()
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,           -- bcrypt hash
  first_name  VARCHAR(255) NOT NULL,
  last_name   VARCHAR(255) NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'user',   -- 'user' | 'admin'
  tier        VARCHAR(20) NOT NULL DEFAULT 'free',   -- 'free' | 'pro'
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key          VARCHAR(255) UNIQUE NOT NULL,   -- sk_live_xxxx (ควร hash ในอนาคต)
  name         VARCHAR(100) NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  last_used_at TIMESTAMP,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  api_key_id    TEXT NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint      VARCHAR(255) NOT NULL,
  method        VARCHAR(10) NOT NULL,
  status_code   INTEGER NOT NULL,
  response_time INTEGER NOT NULL,
  ip_address    VARCHAR(45) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── service-core + service-ingestion (shared table) ──────────────

CREATE TABLE IF NOT EXISTS scholarships (
  id           TEXT PRIMARY KEY,
  name         VARCHAR(500) NOT NULL,
  level        VARCHAR(50) NOT NULL,
  field        VARCHAR(255) NOT NULL,
  country      VARCHAR(100) NOT NULL,
  deadline     TIMESTAMP,                    -- nullable
  amount       INTEGER,                      -- nullable
  currency     VARCHAR(10) NOT NULL DEFAULT 'USD',
  url          TEXT UNIQUE NOT NULL,
  source       VARCHAR(255) NOT NULL,
  description  TEXT,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (name, source)
);

CREATE INDEX IF NOT EXISTS idx_scholarships_source   ON scholarships(source);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_field    ON scholarships(field);

-- ─── service-ingestion ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ingestion_logs (
  id            TEXT PRIMARY KEY,
  source        VARCHAR(255) NOT NULL,
  status        VARCHAR(20) NOT NULL,        -- 'running' | 'success' | 'error'
  count_new     INTEGER NOT NULL DEFAULT 0,
  count_updated INTEGER NOT NULL DEFAULT 0,
  error_msg     TEXT,
  started_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  finished_at   TIMESTAMP
);

-- ─── service-notification ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notification_rules (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field       VARCHAR(255),
  level       VARCHAR(50),
  country     VARCHAR(100),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  webhook_url TEXT,
  email       VARCHAR(255),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_logs (
  id             TEXT PRIMARY KEY,
  rule_id        TEXT NOT NULL REFERENCES notification_rules(id) ON DELETE CASCADE,
  scholarship_id TEXT NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  type           VARCHAR(20) NOT NULL,
  status         VARCHAR(20) NOT NULL,
  attempt        INTEGER NOT NULL DEFAULT 1,
  error_msg      TEXT,
  sent_at        TIMESTAMP NOT NULL DEFAULT NOW()
);
