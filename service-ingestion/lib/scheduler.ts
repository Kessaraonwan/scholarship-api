import cron from 'node-cron'
import { SyncService } from './syncService'

const syncService = new SyncService()

// Schedule daily sync at 2:00 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Starting scheduled daily sync...')

  try {
    const { totalNew, results } = await syncService.syncAllSources()
    console.log(`Scheduled sync completed: ${totalNew} new scholarships added`)

    // Log results for each source
    results.forEach(result => {
      if (result.status === 'success') {
        console.log(`✓ ${result.source}: ${result.countNew} new scholarships`)
      } else {
        console.error(`✗ ${result.source}: ${result.error}`)
      }
    })

  } catch (error) {
    console.error('Scheduled sync failed:', error)
  }
})

console.log('Ingestion scheduler initialized - daily sync at 2:00 AM')