-- CreateTable notification_rules
CREATE TABLE IF NOT EXISTS "notification_rules" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "triggers" JSONB NOT NULL,
  "channels" TEXT[],
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable webhooks
CREATE TABLE IF NOT EXISTS "webhooks" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "events" JSONB NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable notification_logs
CREATE TABLE IF NOT EXISTS "notification_logs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ruleId" TEXT,
  "userId" TEXT NOT NULL,
  "scholarshipId" TEXT,
  "scholarshipName" TEXT,
  "channel" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deliveredAt" TIMESTAMP(3),
  "errorMessage" TEXT,
  CONSTRAINT "notification_logs_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "notification_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndexes
CREATE INDEX IF NOT EXISTS "notification_rules_userId_idx" ON "notification_rules"("userId");
CREATE INDEX IF NOT EXISTS "notification_logs_userId_idx" ON "notification_logs"("userId");
CREATE INDEX IF NOT EXISTS "notification_logs_ruleId_idx" ON "notification_logs"("ruleId");
CREATE INDEX IF NOT EXISTS "notification_logs_sentAt_idx" ON "notification_logs"("sentAt");
CREATE INDEX IF NOT EXISTS "webhooks_userId_idx" ON "webhooks"("userId");
