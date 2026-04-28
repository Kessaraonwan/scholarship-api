/**
 * Ingestion Client & Usage Examples
 * 
 * This file demonstrates how to use the ingestion API from various contexts:
 * - Direct Node.js script
 * - Next.js API route
 * - Cron job scheduler
 */

import axios, { AxiosError } from 'axios'

/**
 * Type definitions for the ingestion API
 */
interface ScholarshipData {
  name: string
  level: string
  field: string
  country: string
  deadline?: string
  amount?: string
  url: string
  source: string
  description?: string
}

interface IngestionRequest {
  source: string
  scholarships: ScholarshipData[]
}

interface IngestionResponse {
  success: boolean
  message?: string
  error?: string
  logId?: string
  summary?: {
    totalProcessed: number
    totalNormalized: number
    normalizationFailures: number
    results: {
      created: number
      updated: number
      failed: number
    }
  }
  warnings?: {
    count: number
    details: any[]
  }
  details?: any[]
}

/**
 * Client class for interacting with the ingestion API
 */
export class IngestionClient {
  private apiBaseUrl: string
  private apiKey?: string

  constructor(apiBaseUrl: string = 'http://localhost:3002', apiKey?: string) {
    this.apiBaseUrl = apiBaseUrl.replace(/\/$/, '') // Remove trailing slash
    this.apiKey = apiKey
  }

  /**
   * Send scholarships to the ingestion API
   * 
   * @param source - Source identifier (e.g., "chevening_scraper")
   * @param scholarships - Array of scholarship objects
   * @returns Response from the API
   */
  async ingest(
    source: string,
    scholarships: ScholarshipData[]
  ): Promise<IngestionResponse> {
    try {
      const payload: IngestionRequest = {
        source,
        scholarships
      }

      const config: any = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      // Add API key if provided
      if (this.apiKey) {
        config.headers['X-API-Key'] = this.apiKey
      }

      const response = await axios.post(
        `${this.apiBaseUrl}/api/ingest`,
        payload,
        config
      )

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError

      // Handle error responses from the API
      if (axiosError.response) {
        return {
          success: false,
          error: (axiosError.response.data as any)?.error || 'Unknown API error',
          details: (axiosError.response.data as any)?.details
        }
      }

      // Handle network errors
      return {
        success: false,
        error: `Network error: ${axiosError.message}`
      }
    }
  }

  /**
   * Get ingestion status and recent logs
   */
  async getStatus(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/api/ingest`,
        {
          headers: this.apiKey ? { 'X-API-Key': this.apiKey } : {}
        }
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch ingestion status:', error)
      return null
    }
  }
}

/**
 * ============================================================================
 * EXAMPLE 1: Direct API Usage (Node.js Script)
 * ============================================================================
 * 
 * Run as: npx ts-node lib/ingestionClient.ts
 */
async function exampleDirectApiUsage() {
  const client = new IngestionClient('http://localhost:3002')

  const sampleScholarships: ScholarshipData[] = [
    {
      name: 'Chevening Scholarship',
      level: 'Master',
      field: 'Engineering',
      country: 'United Kingdom',
      deadline: '2025-03-15',
      amount: '$50,000 GBP',
      url: 'https://www.chevening.org/scholarships/',
      source: 'chevening_scraper',
      description: 'Full scholarship for postgraduate studies in the UK'
    },
    {
      name: 'KYOS Scholarship',
      level: 'Undergraduate',
      field: 'Business',
      country: 'South Korea',
      deadline: '2025-04-30',
      amount: '₩50,000,000',
      url: 'https://www.kyos.org/',
      source: 'kyos_scraper',
      description: 'Scholarship for international students in South Korea'
    }
  ]

  console.log('Sending scholarships to ingestion API...')
  const result = await client.ingest('example_scraper', sampleScholarships)

  if (result.success) {
    console.log('✓ Ingestion successful!')
    console.log('Summary:', result.summary)
  } else {
    console.error('✗ Ingestion failed:', result.error)
    console.error('Details:', result.details)
  }
}

/**
 * ============================================================================
 * EXAMPLE 2: Using with a Real Scraper
 * ============================================================================
 */
async function exampleWithScraper() {
  const { ExampleScholarshipScraper } = await import('./scrapers/exampleScholarshipScraper')

  const scraper = new ExampleScholarshipScraper()
  const client = new IngestionClient('http://localhost:3002')

  try {
    console.log('Starting scraper...')
    const scholarships = await scraper.scrape()

    if (scholarships.length === 0) {
      console.warn('Scraper returned no results')
      return
    }

    console.log(`Scraped ${scholarships.length} scholarships. Sending to API...`)
    const result = await client.ingest('example_scholarship_scraper', scholarships)

    if (result.success) {
      console.log('✓ Ingestion successful!')
      console.log(`Created: ${result.summary?.results.created}, Updated: ${result.summary?.results.updated}`)
    } else {
      console.error('✗ Ingestion failed:', result.error)
    }
  } catch (error) {
    console.error('Error in scraper/ingest workflow:', error)
  }
}

/**
 * ============================================================================
 * EXAMPLE 3: Cron Job Integration (for use with node-cron)
 * ============================================================================
 * 
 * Add to your Next.js app initialization:
 * 
 * import cron from 'node-cron'
 * 
 * // Run ingestion every day at 2 AM
 * cron.schedule('0 2 * * *', async () => {
 *   await runScheduledIngestion()
 * })
 */
async function runScheduledIngestion() {
  const client = new IngestionClient('http://localhost:3002')

  // Import your scrapers
  const scrapers = [
    // new CheveningScraper(),
    // new KyosScraper(),
    // Add your scraper instances here
  ]

  for (const scraper of scrapers) {
    try {
      console.log(`Running scraper: ${scraper.constructor.name}`)
      const scholarships = await (scraper as any).scrape()

      if (scholarships.length === 0) {
        console.warn(`${scraper.constructor.name} returned no results`)
        continue
      }

      const result = await client.ingest(
        (scraper as any).source,
        scholarships
      )

      console.log(`${scraper.constructor.name}: ${result.success ? '✓ Success' : '✗ Failed'}`)
    } catch (error) {
      console.error(`${scraper.constructor.name} failed:`, error)
    }
  }
}

/**
 * ============================================================================
 * EXAMPLE 4: Error Handling & Retry Logic
 * ============================================================================
 */
async function exampleWithErrorHandling() {
  const client = new IngestionClient('http://localhost:3002')
  const maxRetries = 3
  let retryCount = 0

  const scholarships: ScholarshipData[] = [
    // ... your scholarship data
  ]

  while (retryCount < maxRetries) {
    try {
      const result = await client.ingest('my_scraper', scholarships)

      if (result.success) {
        console.log('✓ Ingestion successful')
        return result
      } else if (result.error?.includes('Network')) {
        throw new Error(result.error)
      } else {
        // API error but not retryable
        console.error('API error:', result.error)
        return result
      }
    } catch (error) {
      retryCount++
      if (retryCount < maxRetries) {
        const delayMs = 1000 * Math.pow(2, retryCount) // Exponential backoff
        console.log(`Retry ${retryCount}/${maxRetries} in ${delayMs}ms...`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      } else {
        console.error('Max retries reached. Giving up.')
        throw error
      }
    }
  }
}

/**
 * ============================================================================
 * EXAMPLE 5: Batch Processing Large Datasets
 * ============================================================================
 */
async function exampleBatchProcessing() {
  const client = new IngestionClient('http://localhost:3002')

  // Simulate a large dataset of scholarships
  const allScholarships: ScholarshipData[] = []
  // ... populate with data from multiple sources

  // Process in batches to avoid overwhelming the API
  const batchSize = 100
  let totalProcessed = 0

  for (let i = 0; i < allScholarships.length; i += batchSize) {
    const batch = allScholarships.slice(i, i + batchSize)

    console.log(`Processing batch ${Math.ceil(i / batchSize) + 1}...`)
    const result = await client.ingest('batch_scraper', batch)

    if (result.success && result.summary) {
      totalProcessed += result.summary.results.created + result.summary.results.updated
      console.log(`Batch processed: +${result.summary.results.created} created, +${result.summary.results.updated} updated`)
    } else {
      console.error(`Batch failed: ${result.error}`)
    }

    // Add delay between batches
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`Total processed: ${totalProcessed}`)
}

// Export for use in other modules
export { IngestionClient, IngestionRequest, IngestionResponse, ScholarshipData }

// Run examples if this is the main module
if (require.main === module) {
  const example = process.argv[2] || '1'

  (async () => {
    try {
      switch (example) {
        case '1':
          await exampleDirectApiUsage()
          break
        case '2':
          await exampleWithScraper()
          break
        case '3':
          await runScheduledIngestion()
          break
        case '4':
          await exampleWithErrorHandling()
          break
        case '5':
          await exampleBatchProcessing()
          break
        default:
          console.log('Usage: npx ts-node lib/ingestionClient.ts [1-5]')
          console.log('1 = Direct API usage')
          console.log('2 = With real scraper')
          console.log('3 = Cron job example')
          console.log('4 = Error handling')
          console.log('5 = Batch processing')
      }
    } catch (error) {
      console.error('Example failed:', error)
      process.exit(1)
    }
  })()
}
