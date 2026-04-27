import { KyosScraper } from './scrapers/kyosScraper'
import { CheveningScraper } from './scrapers/cheveningScraper'
import { IngestionService } from './ingestionService'

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

                // Create log entry
                const logId = await this.ingestionService.createLog(scraper['source'])

                try {
                    // Scrape data
                    const scholarships = await scraper.scrape()

                    // Save to database
                    const countNew = await this.ingestionService.saveScholarships(scholarships)

                    // Update log as success
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
                    // Update log as error
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
            return { countNew }
        } catch (error) {
            return {
                countNew: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }
}