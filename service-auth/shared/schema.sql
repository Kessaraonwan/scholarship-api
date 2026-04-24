-- shared/schema.sql
-- Database Schema กลาง — รันครั้งเดียวตอนตั้งระบบ
-- ใช้: psql -U postgres -d scholarship_db -f shared/schema.sql

-- ─── Users ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  password    VARCHAR(255) NOT NULL,  -- bcrypt hash
  tier        VARCHAR(10) NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── API Keys ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key                VARCHAR(255) UNIQUE NOT NULL,  -- sk-xxxxxxxxxxxx
  name               VARCHAR(100),                  -- ชื่อ key ที่ user ตั้ง
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  rate_limit_hour    INTEGER NOT NULL DEFAULT 100,  -- requests per hour
  rate_limit_day     INTEGER NOT NULL DEFAULT 1000, -- requests per day
  last_used          TIMESTAMP,
  created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── Scholarships ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scholarships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(500) NOT NULL,
  level       VARCHAR(50)  NOT NULL CHECK (level IN ('มัธยม','ปริญญาตรี','ปริญญาโท','ปริญญาเอก','ทุกระดับ')),
  field       VARCHAR(255) NOT NULL DEFAULT 'ทุกสาขา',
  country     VARCHAR(100) NOT NULL,
  deadline    DATE,
  amount      NUMERIC(12, 2),
  currency    VARCHAR(10),
  url         TEXT NOT NULL,
  source      VARCHAR(255) NOT NULL,
  description TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scholarships_level   ON scholarships(level);
CREATE INDEX IF NOT EXISTS idx_scholarships_field   ON scholarships(field);
CREATE INDEX IF NOT EXISTS idx_scholarships_country ON scholarships(country);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);

-- ─── Ingestion Logs (service-ingestion) ──────────────────────────
CREATE TABLE IF NOT EXISTS ingestion_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source       VARCHAR(255) NOT NULL,  -- เช่น "กยศ." | "Chevening"
  status       VARCHAR(20)  NOT NULL CHECK (status IN ('success', 'error', 'running')),
  count_new    INTEGER DEFAULT 0,      -- จำนวนทุนใหม่ที่ดึงเข้ามา
  error_msg    TEXT,
  started_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  finished_at  TIMESTAMP
);

-- ─── Notification Rules (service-notification) ───────────────────
CREATE TABLE IF NOT EXISTS notification_rules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field        VARCHAR(255),   -- null = ทุกสาขา
  level        VARCHAR(50),    -- null = ทุกระดับ
  country      VARCHAR(100),   -- null = ทุกประเทศ
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  webhook_url  TEXT,           -- สำหรับ Pro tier
  email        VARCHAR(255),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── Notification Logs (service-notification) ────────────────────
CREATE TABLE IF NOT EXISTS notification_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id         UUID NOT NULL REFERENCES notification_rules(id) ON DELETE CASCADE,
  scholarship_id  UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  type            VARCHAR(20) NOT NULL CHECK (type IN ('email', 'webhook')),
  status          VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  attempt         INTEGER NOT NULL DEFAULT 1,
  error_msg       TEXT,
  sent_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── API Usage (service-auth) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_usage (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id     UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint   VARCHAR(255) NOT NULL,
  method     VARCHAR(10)  NOT NULL,
  status     INTEGER NOT NULL,
  called_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_usage_key_id   ON api_usage(key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_called_at ON api_usage(called_at);
