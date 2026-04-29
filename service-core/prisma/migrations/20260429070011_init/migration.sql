-- CreateTable scholarships
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

-- CreateIndexes
CREATE INDEX IF NOT EXISTS scholarships_source_idx ON scholarships("source");
CREATE INDEX IF NOT EXISTS scholarships_deadline_idx ON scholarships("deadline");
CREATE INDEX IF NOT EXISTS scholarships_field_idx ON scholarships("field");
