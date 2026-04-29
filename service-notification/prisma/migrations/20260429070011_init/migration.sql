-- CreateTable notification_rules
CREATE TABLE IF NOT EXISTS notification_rules (
  id TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  name TEXT NOT NULL,
  triggers TEXT NOT NULL,
  channels TEXT[],
  active BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable notification_logs
CREATE TABLE IF NOT EXISTS notification_logs (
  id TEXT NOT NULL PRIMARY KEY,
  "ruleId" TEXT NOT NULL,
  "scholarshipId" TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  attempt INTEGER NOT NULL DEFAULT 1,
  "errorMsg" TEXT,
  "sentAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndexes
CREATE INDEX IF NOT EXISTS notification_rules_userId_idx ON notification_rules("userId");
CREATE INDEX IF NOT EXISTS notification_logs_ruleId_idx ON notification_logs("ruleId");
