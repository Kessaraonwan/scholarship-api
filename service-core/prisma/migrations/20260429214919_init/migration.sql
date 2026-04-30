-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "amount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingestion_logs" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "countNew" INTEGER NOT NULL DEFAULT 0,
    "countUpdated" INTEGER NOT NULL DEFAULT 0,
    "errorMsg" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ingestion_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_url_key" ON "Scholarship"("url");

-- CreateIndex
CREATE INDEX "Scholarship_source_idx" ON "Scholarship"("source");

-- CreateIndex
CREATE INDEX "Scholarship_deadline_idx" ON "Scholarship"("deadline");

-- CreateIndex
CREATE INDEX "Scholarship_field_idx" ON "Scholarship"("field");

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_name_source_key" ON "Scholarship"("name", "source");

-- CreateIndex
CREATE INDEX "ingestion_logs_source_idx" ON "ingestion_logs"("source");

-- CreateIndex
CREATE INDEX "ingestion_logs_startedAt_idx" ON "ingestion_logs"("startedAt");
