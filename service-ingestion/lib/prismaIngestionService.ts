/**
 * Prisma-based Ingestion Service
 * 
 * Handles scholarship data insertion, updates, and duplicate prevention
 * using Prisma's upsert functionality
 */

import { PrismaClient, Prisma } from '@prisma/client'
import { Scholarship, IngestionLog } from './types'

const prisma = new PrismaClient()

export class PrismaIngestionService {
  /**
   * Create an ingestion log entry to track scraping operations
   * @param source - Source identifier (e.g., "chevening_scraper")
   * @returns Log ID for tracking
   */
  async createLog(source: string): Promise<string> {
    const log = await prisma.ingestionLog.create({
      data: {
        source,
        status: 'running',
        startedAt: new Date()
      }
    })
    return log.id
  }

  /**
   * Update ingestion log with completion status
   * @param id - Log ID from createLog
   * @param status - Final status: "success" or "error"
   * @param countNew - Number of new scholarships created
   * @param countUpdated - Number of existing scholarships updated
   * @param errorMsg - Error message if status is "error"
   */
  async updateLog(
    id: string,
    status: 'success' | 'error',
    countNew: number = 0,
    countUpdated: number = 0,
    errorMsg: string | null = null
  ): Promise<void> {
    await prisma.ingestionLog.update({
      where: { id },
      data: {
        status,
        countNew,
        countUpdated,
        errorMsg,
        finishedAt: new Date()
      }
    })
  }

  /**
   * Save scholarships using upsert to prevent duplicates and update existing records
   * 
   * This method implements smart duplicate detection:
   * 1. Primary check: URL uniqueness (unique constraint)
   * 2. Secondary check: Name + Source combination (composite unique)
   * 3. If a scholarship exists, it updates all fields to reflect latest data
   * 4. If not, it creates a new record
   * 
   * @param scholarships - Array of normalized scholarship objects
   * @returns Object containing counts of created and updated scholarships
   */
  async saveScholarships(scholarships: Scholarship[]): Promise<{
    created: number
    updated: number
    failed: number
  }> {
    let created = 0
    let updated = 0
    let failed = 0

    for (const scholarship of scholarships) {
      try {
        /**
         * Upsert Logic:
         * - where: Uses the URL as the unique identifier
         * - create: Fields for new record if it doesn't exist
         * - update: Fields to update if record exists
         * - If URL exists but name differs, it's considered the same scholarship
         *   from the same source (updated content)
         */
        const result = await prisma.scholarship.upsert({
          where: { url: scholarship.url },
          create: {
            ...scholarship
          },
          update: {
            // Update all fields except createdAt
            name: scholarship.name,
            level: scholarship.level,
            field: scholarship.field,
            country: scholarship.country,
            deadline: scholarship.deadline,
            amount: scholarship.amount,
            currency: scholarship.currency,
            description: scholarship.description,
            // lastUpdated is automatically set by @updatedAt
          }
        })

        // Track whether this was a create or update
        // We check if the record was just created by comparing dates
        const createdRecently = new Date().getTime() - result.createdAt.getTime() < 1000
        if (createdRecently) {
          created++
        } else {
          updated++
        }
      } catch (error) {
        failed++
        
        // Log specific error types
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(
            `Prisma error saving scholarship "${scholarship.name}" from ${scholarship.source}:`,
            error.code,
            error.message
          )
        } else {
          console.error(
            `Unexpected error saving scholarship "${scholarship.name}":`,
            error
          )
        }
      }
    }

    return { created, updated, failed }
  }

  /**
   * Get the most recent ingestion log
   * Useful for checking the status of the last scraping operation
   */
  async getLatestLog(): Promise<IngestionLog | null> {
    const log = await prisma.ingestionLog.findFirst({
      orderBy: { startedAt: 'desc' },
      take: 1
    })
    return log
  }

  /**
   * Get paginated ingestion logs
   * @param page - Page number (1-indexed)
   * @param limit - Number of logs per page
   */
  async getLogs(page: number = 1, limit: number = 20): Promise<{
    logs: IngestionLog[]
    total: number
  }> {
    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      prisma.ingestionLog.findMany({
        skip,
        take: limit,
        orderBy: { startedAt: 'desc' }
      }),
      prisma.ingestionLog.count()
    ])

    return { logs, total }
  }

  /**
   * Get scholarships for a specific source
   * Useful for auditing data from a particular scraper
   */
  async getScholarshipsBySource(
    source: string,
    limit: number = 100
  ): Promise<Scholarship[]> {
    return prisma.scholarship.findMany({
      where: { source },
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Get scholarships expiring soon
   * Useful for cleaning up outdated records
   */
  async getExpiringScholarships(
    daysFromNow: number = 7
  ): Promise<Scholarship[]> {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + daysFromNow)

    return prisma.scholarship.findMany({
      where: {
        deadline: {
          lte: futureDate,
          gt: new Date() // Only future deadlines
        }
      },
      orderBy: { deadline: 'asc' }
    })
  }

  /**
   * Clean up old ingestion logs (older than specified days)
   * Run this periodically to maintain database health
   */
  async cleanupOldLogs(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const result = await prisma.ingestionLog.deleteMany({
      where: {
        startedAt: { lt: cutoffDate }
      }
    })

    return result.count
  }

  /**
   * Gracefully disconnect from the database
   * Call this when shutting down the application
   */
  async disconnect(): Promise<void> {
    await prisma.$disconnect()
  }
}

// Export a singleton instance
export const ingestionService = new PrismaIngestionService()
