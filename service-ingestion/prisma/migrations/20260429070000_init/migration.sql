-- CreateTable scholarships (if not exists)
CREATE TABLE IF NOT EXISTS scholarships (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  field TEXT NOT NULL,
  country TEXT NOT NULL,
  deadline TIMESTAMP,
  amount INTEGER,
  currency TEXT DEFAULT 'USD',
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  description TEXT,
  "lastUpdated" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("name", source)
);

-- CreateTable ingestion_logs
CREATE TABLE IF NOT EXISTS ingestion_logs (
  id TEXT NOT NULL PRIMARY KEY,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  "countNew" INTEGER DEFAULT 0,
  "countUpdated" INTEGER DEFAULT 0,
  "errorMsg" TEXT,
  "startedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP
);

-- CreateIndexes
CREATE INDEX IF NOT EXISTS scholarships_source_idx ON scholarships("source");
CREATE INDEX IF NOT EXISTS scholarships_deadline_idx ON scholarships("deadline");
CREATE INDEX IF NOT EXISTS scholarships_field_idx ON scholarships("field");
CREATE INDEX IF NOT EXISTS ingestion_logs_source_idx ON ingestion_logs("source");
CREATE INDEX IF NOT EXISTS ingestion_logs_startedAt_idx ON ingestion_logs("startedAt");
