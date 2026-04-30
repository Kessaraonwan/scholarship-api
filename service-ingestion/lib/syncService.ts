import { KyosScraper } from './scrapers/kyosScraper'
import { CheveningScraper } from './scrapers/cheveningScraper'
import { IngestionService } from './ingestionService'

const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL || 'http://localhost:3003'
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || 'internal-secret-key'

async function sendToCore(scholarships: any[]): Promise<void> {
  try {
    const res = await fetch(`${CORE_SERVICE_URL}/api/scholarships/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': INTERNAL_SECRET,
      },
      body: JSON.stringify({ scholarships }),
    })

    if (!res.ok) {
      console.error('Failed to send to service-core:', await res.text())
    } else {
      const data = await res.json()
      console.log(`Sent to service-core: ${data.data.created} created, ${data.data.updated} updated`)
    }
  } catch (error) {
    console.error('Error sending to service-core:', error)
  }
}

export class SyncService {
  private ingestionService: IngestionService

  constructor() {
    this.ingestionService = new IngestionService()
  }

  async syncAllSources(): Promise<{ totalNew: number; results: any[] }> {
    const sources = [
      new KyosScraper(),
      new CheveningScraper()
    ]

    let totalNew = 0
    const results = []

    for (const scraper of sources) {
      try {
        console.log(`Starting sync for ${scraper['source']}`)
        const logId = await this.ingestionService.createLog(scraper['source'])

        try {
          const scholarships = await scraper.scrape()

          // บันทึกลง DB ของ ingestion
          const countNew = await this.ingestionService.saveScholarships(scholarships)

          // ส่งไปให้ service-core ด้วย
          await sendToCore(scholarships)

          await this.ingestionService.updateLog(logId, 'success', countNew)
          totalNew += countNew
          results.push({
            source: scraper['source'],
            status: 'success',
            countNew,
            error: null
          })
          console.log(`Completed sync for ${scraper['source']}: ${countNew} new scholarships`)
        } catch (error) {
          await this.ingestionService.updateLog(logId, 'error', 0, error instanceof Error ? error.message : 'Unknown error')
          results.push({
            source: scraper['source'],
            status: 'error',
            countNew: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          console.error(`Error syncing ${scraper['source']}:`, error)
        }
      } catch (error) {
        console.error(`Failed to create log for ${scraper['source']}:`, error)
        results.push({
          source: scraper['source'],
          status: 'error',
          countNew: 0,
          error: 'Failed to create log'
        })
      }
    }

    return { totalNew, results }
  }

  async syncSource(source: string): Promise<{ countNew: number; error?: string }> {
    let scraper
    switch (source) {
      case 'กยศ.':
        scraper = new KyosScraper()
        break
      case 'Chevening':
        scraper = new CheveningScraper()
        break
      default:
        throw new Error(`Unknown source: ${source}`)
    }

    try {
      const scholarships = await scraper.scrape()
      const countNew = await this.ingestionService.saveScholarships(scholarships)

      // ส่งไปให้ service-core ด้วย
      await sendToCore(scholarships)

      return { countNew }
    } catch (error) {
      return {
        countNew: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}