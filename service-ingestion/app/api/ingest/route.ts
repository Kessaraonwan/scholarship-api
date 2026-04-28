/**
 * Next.js API Route: POST /api/ingest
 * 
 * Comprehensive data ingestion endpoint with:
 * - Robust error handling (try-catch with graceful degradation)
 * - Data normalization (cleaning messy scraped data)
 * - Duplicate prevention (Prisma upsert pattern)
 * - Rate limiting (delays between batch operations)
 * - Detailed logging and status tracking
 * 
 * Usage:
 *   POST /api/ingest
 *   Body: {
 *     "source": "chevening_scraper",
 *     "scholarships": [
 *       {
 *         "name": "Chevening Award",
 *         "level": "Master",
 *         "field": "Engineering",
 *         "country": "United Kingdom",
 *         "deadline": "15 March 2025",
 *         "amount": "$50,000",
 *         "url": "https://example.com/chevening",
 *         "source": "chevening_scraper",
 *         "description": "Full scholarship for postgraduates..."
 *       }
 *     ]
 *   }
 */

import { NextRequest, NextResponse } from 'next/server'
import { ingestionService } from '@/lib/prismaIngestionService'
import { normalizeScholarship } from '@/lib/dataNormalizer'
import { Scholarship } from '@/lib/types'

/**
 * Rate limiting utility: Sleep for specified milliseconds
 * Used to add politeness delays between requests and batch operations
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Validate request source parameter
 * Prevents arbitrary data from being ingested without proper tracking
 */
function validateSource(source: unknown): source is string {
  return (
    typeof source === 'string' &&
    source.length > 0 &&
    source.length <= 100 &&
    /^[a-z0-9_-]+$/.test(source)
  )
}

/**
 * POST /api/ingest
 * 
 * Main ingestion handler with comprehensive error handling
 */
export async function POST(request: NextRequest) {
  let logId: string | null = null

  try {
    // === STEP 1: Validate request ===
    // Parse JSON request body with error handling
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 400 }
      )
    }

    // Validate required fields
    const { source, scholarships } = body

    if (!validateSource(source)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or missing "source" field. Must be a string with alphanumeric characters, hyphens, and underscores only.'
        },
        { status: 400 }
      )
    }

    if (!Array.isArray(scholarships)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or missing "scholarships" field. Must be an array.'
        },
        { status: 400 }
      )
    }

    if (scholarships.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Scholarships array is empty. At least one scholarship must be provided.'
        },
        { status: 400 }
      )
    }

    // === STEP 2: Create ingestion log ===
    // This allows us to track the ingestion operation even if it fails partway through
    try {
      logId = await ingestionService.createLog(source)
    } catch (error) {
      console.error('Failed to create ingestion log:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to initialize ingestion log. Database connection issue.'
        },
        { status: 500 }
      )
    }

    // === STEP 3: Normalize and validate data ===
    // This step cleans messy scraped data and catches data quality issues early
    const normalizedScholarships: Scholarship[] = []
    const normalizationErrors: {
      index: number
      reason: string
      originalData: any
    }[] = []

    scholarships.forEach((rawScholarship, index) => {
      try {
        const normalized = normalizeScholarship(rawScholarship)
        
        if (normalized) {
          // Add source if not already present (allows flexibility in input)
          normalized.source = normalized.source || source
          normalizedScholarships.push(normalized)
        } else {
          normalizationErrors.push({
            index,
            reason: 'Failed to normalize required fields (name, url, source)',
            originalData: rawScholarship
          })
        }
      } catch (error) {
        // Graceful error handling: Log the error but continue processing other items
        normalizationErrors.push({
          index,
          reason: error instanceof Error ? error.message : 'Unknown normalization error',
          originalData: rawScholarship
        })
        console.error(
          `Error normalizing scholarship at index ${index}:`,
          error,
          rawScholarship
        )
      }
    })

    // Log normalization issues (don't fail the entire request, but warn the client)
    if (normalizationErrors.length > 0) {
      console.warn(
        `${normalizationErrors.length} out of ${scholarships.length} scholarships failed normalization:`,
        normalizationErrors
      )
    }

    // If we have no valid scholarships after normalization, fail the request
    if (normalizedScholarships.length === 0) {
      await ingestionService.updateLog(
        logId,
        'error',
        0,
        0,
        `No scholarships could be normalized. All ${scholarships.length} items had validation errors.`
      )

      return NextResponse.json(
        {
          success: false,
          error: 'No valid scholarships to ingest',
          details: normalizationErrors,
          logId
        },
        { status: 400 }
      )
    }

    // === STEP 4: Insert/Update data with rate limiting ===
    // Use upsert to prevent duplicates while updating existing records
    // Add small delays to be respectful to the database
    let saveResults = { created: 0, updated: 0, failed: 0 }

    try {
      // Process scholarships in batches to avoid overwhelming the database
      const batchSize = 25
      for (let i = 0; i < normalizedScholarships.length; i += batchSize) {
        const batch = normalizedScholarships.slice(i, i + batchSize)
        
        const batchResults = await ingestionService.saveScholarships(batch)
        saveResults.created += batchResults.created
        saveResults.updated += batchResults.updated
        saveResults.failed += batchResults.failed

        // Add rate limiting delay between batches (be polite to database)
        // Skip delay for last batch
        if (i + batchSize < normalizedScholarships.length) {
          await sleep(100) // 100ms delay between batches
        }
      }
    } catch (error) {
      // Database error: Log it and mark the ingestion as failed
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown database error'
      
      console.error('Database error during scholarship save:', error)
      
      await ingestionService.updateLog(
        logId,
        'error',
        saveResults.created,
        saveResults.updated,
        errorMessage
      )

      return NextResponse.json(
        {
          success: false,
          error: 'Database error occurred during ingestion',
          details: errorMessage,
          logId,
          partialResults: saveResults
        },
        { status: 500 }
      )
    }

    // === STEP 5: Finalize logging ===
    // Update the ingestion log with final results
    try {
      await ingestionService.updateLog(
        logId,
        'success',
        saveResults.created,
        saveResults.updated,
        null
      )
    } catch (error) {
      console.error('Failed to update ingestion log:', error)
      // Don't fail the entire request just because we couldn't update the log
      // (the ingestion actually succeeded)
    }

    // === STEP 6: Return success response ===
    return NextResponse.json(
      {
        success: true,
        message: 'Ingestion completed successfully',
        logId,
        summary: {
          totalProcessed: scholarships.length,
          totalNormalized: normalizedScholarships.length,
          normalizationFailures: normalizationErrors.length,
          results: {
            created: saveResults.created,
            updated: saveResults.updated,
            failed: saveResults.failed
          }
        },
        warnings: normalizationErrors.length > 0 ? {
          count: normalizationErrors.length,
          details: normalizationErrors.slice(0, 5) // Return first 5 errors
        } : undefined
      },
      { status: 200 }
    )
  } catch (error) {
    // === Final catch-all error handler ===
    // This catches any unexpected errors that weren't handled above
    
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    
    console.error('Unexpected error in ingestion endpoint:', error)

    // Try to update the log if it was created
    if (logId) {
      try {
        await ingestionService.updateLog(
          logId,
          'error',
          0,
          0,
          `Unexpected error: ${errorMessage}`
        )
      } catch (logError) {
        console.error('Failed to update error log:', logError)
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected server error during ingestion',
        details: errorMessage,
        logId: logId || undefined
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ingest
 * Optional: Return ingestion status and recent logs
 * Remove this if not needed for your use case
 */
export async function GET(request: NextRequest) {
  try {
    const latestLog = await ingestionService.getLatestLog()
    const logs = await ingestionService.getLogs(1, 10)

    return NextResponse.json({
      success: true,
      latest: latestLog,
      recentLogs: logs.logs,
      total: logs.total
    })
  } catch (error) {
    console.error('Error fetching ingestion logs:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ingestion logs'
      },
      { status: 500 }
    )
  }
}
