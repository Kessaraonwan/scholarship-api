# Scholarship Data Ingestion System

A production-ready data ingestion system for scraping and managing scholarship data with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

✅ **Robust Error Handling** - Graceful degradation with try-catch blocks
✅ **Data Normalization** - Cleaning messy scraped data before storage
✅ **Duplicate Prevention** - Prisma upsert pattern with unique constraints
✅ **Rate Limiting** - Delays between requests to be polite to servers
✅ **Comprehensive Logging** - Track all ingestion operations
✅ **Retry Logic** - Automatic retries with exponential backoff for network errors
✅ **Batch Processing** - Handle large datasets efficiently
✅ **Type Safety** - Full TypeScript support

## Architecture

```
service-ingestion/
├── app/
│   └── api/
│       └── ingest/
│           └── route.ts              # Main API endpoint
├── lib/
│   ├── dataNormalizer.ts             # Data cleaning functions
│   ├── ingestionClient.ts            # Client for calling the API
│   ├── prismaIngestionService.ts     # Database operations
│   ├── types.ts                      # Type definitions
│   └── scrapers/
│       ├── enhancedBaseScraper.ts    # Base scraper with error handling
│       └── exampleScholarshipScraper.ts # Example implementation
├── prisma/
│   └── schema.prisma                 # Database schema
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
cd service-ingestion
npm install @prisma/client axios cheerio
npm install --save-dev @types/node typescript
```

### 2. Configure Environment

Create a `.env` file in `service-ingestion`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/scholarships"
NODE_ENV="development"
```

### 3. Initialize Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start the Service

```bash
npm run dev
```

The API will be available at `http://localhost:3002/api/ingest`

## Usage

### API Endpoint

**POST** `/api/ingest`

Request body:
```json
{
  "source": "chevening_scraper",
  "scholarships": [
    {
      "name": "Chevening Award",
      "level": "Master",
      "field": "Engineering",
      "country": "United Kingdom",
      "deadline": "2025-03-15",
      "amount": "$50,000",
      "url": "https://example.com/chevening",
      "source": "chevening_scraper",
      "description": "Full scholarship for postgraduate studies"
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "message": "Ingestion completed successfully",
  "logId": "cljxxxxxxxxxx",
  "summary": {
    "totalProcessed": 10,
    "totalNormalized": 10,
    "normalizationFailures": 0,
    "results": {
      "created": 8,
      "updated": 2,
      "failed": 0
    }
  }
}
```

### Using the Client

```typescript
import { IngestionClient } from '@/lib/ingestionClient'

const client = new IngestionClient('http://localhost:3002')

const result = await client.ingest('my_scraper', scholarships)

if (result.success) {
  console.log(`Created ${result.summary?.results.created} scholarships`)
}
```

### Creating a Custom Scraper

```typescript
import { EnhancedBaseScraper } from '@/lib/scrapers/enhancedBaseScraper'

export class MyCustomScraper extends EnhancedBaseScraper {
  constructor() {
    super('my_custom_scraper', 500) // 500ms delay between requests
  }

  async scrape(): Promise<any[]> {
    const scholarships: any[] = []

    try {
      // Fetch HTML with automatic retry on errors
      const html = await this.fetchPage('https://example.com/scholarships')
      
      // Parse HTML using Cheerio
      const $ = this.parseHtml(html)
      
      // Extract scholarships with error handling per item
      this.select($, '.scholarship-item').each((i, el) => {
        try {
          const name = this.getText($, '.title', el)
          const url = this.getAttribute(el, 'href')
          const amount = this.getText($, '.amount', el)
          
          scholarships.push({
            name,
            level: 'Master',
            field: 'Engineering',
            country: 'Example Country',
            url,
            amount,
            source: this.source
          })
        } catch (error) {
          console.error(`Error parsing scholarship at index ${i}:`, error)
          // Continue to next item instead of crashing
        }
      })
    } catch (error) {
      console.error('Scraping error:', error)
    }

    return scholarships
  }
}
```

## Error Handling Patterns

### 1. Per-Item Error Handling (Graceful Degradation)

```typescript
// If one scholarship fails, continue processing others
for (const scholarship of scholarships) {
  try {
    const normalized = normalizeScholarship(scholarship)
    if (normalized) {
      allNormalized.push(normalized)
    }
  } catch (error) {
    console.error('Error normalizing:', error)
    // Don't throw - continue to next item
  }
}
```

### 2. CSS Selector Safety

```typescript
// Use safe wrapper instead of direct jQuery
const elements = this.select($, '.scholarship-item')

// Returns empty array if selector fails, instead of throwing
// No need for try-catch around selector operations
```

### 3. Field Extraction with Fallback

```typescript
// If required field is missing, use empty string fallback
const name = this.getText($, '.title', '')

// If name is still empty, normalization will catch it later
const normalized = normalizeScholarship({ name, ... })
// normalized will be null if name is empty
```

### 4. Network Retry Logic

```typescript
// Automatically retries on network errors
const html = await this.fetchPage(url)

// If it fails:
// - First retry: 1000ms delay
// - Second retry: 2000ms delay
// - Third retry: 4000ms delay
// - If all fail: returns empty string, operation continues
```

## Data Normalization

The `dataNormalizer` module provides functions to clean scraped data:

```typescript
import {
  normalizeText,       // Trim and normalize whitespace
  normalizeDate,       // Parse various date formats to ISO 8601
  normalizeAmount,     // Extract currency and amount
  normalizeLevel,      // Standardize scholarship level
  normalizeField,      // Standardize field of study
  normalizeCountry,    // Normalize country names
  normalizeScholarship // Complete validation and normalization
} from '@/lib/dataNormalizer'
```

### Supported Date Formats
- `2025-03-15` (ISO 8601)
- `March 15, 2025`
- `15 March 2025`
- `15/03/2025` (DD/MM/YYYY)
- `15-03-2025`

### Supported Amount Formats
- `$50,000`
- `€25000`
- `£15000`
- `5000 GBP`
- `50000 USD`

## Duplicate Prevention

The system uses a three-tier approach:

1. **Primary**: URL must be unique (database constraint)
2. **Secondary**: Name + Source combination must be unique
3. **Upsert**: If a scholarship URL exists, update its fields instead of creating a new record

This ensures:
- Same scholarship from same source never creates duplicates
- Updated scholarship data overwrites old data
- Related scholarships from different sources are tracked separately

## Rate Limiting

The system includes built-in delays:

```typescript
// Base scraper delays 500ms between requests
const scraper = new EnhancedBaseScraper('my_scraper', 500)

// API batches requests with 100ms delay between batches
const batchSize = 25
for (batch in batches) {
  await ingestionService.saveScholarships(batch)
  await sleep(100) // Delay between batches
}
```

## Logging

### Ingestion Logs

Every ingestion operation creates a log:

```typescript
// Logs are automatically created/updated
const logId = await ingestionService.createLog('chevening_scraper')

// Track progress
await ingestionService.updateLog(
  logId,
  'success',
  10, // created
  5,  // updated
  null // error message
)
```

### Query Logs

```typescript
// Get recent logs
const { logs, total } = await ingestionService.getLogs(1, 20)

// Clean up old logs
await ingestionService.cleanupOldLogs(30) // older than 30 days
```

## Advanced Usage

### Cron Scheduling

```typescript
import cron from 'node-cron'
import { IngestionClient } from '@/lib/ingestionClient'

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  const client = new IngestionClient()
  const scrapers = [new CheveningScraper(), new KyosScraper()]

  for (const scraper of scrapers) {
    const scholarships = await scraper.scrape()
    await client.ingest(scraper.source, scholarships)
  }
})
```

### Batch Processing

```typescript
// Process large datasets in chunks
const batchSize = 100
for (let i = 0; i < scholarships.length; i += batchSize) {
  const batch = scholarships.slice(i, i + batchSize)
  await client.ingest('my_scraper', batch)
  await sleep(1000) // Delay between batches
}
```

### Monitoring

```typescript
// Check last ingestion status
const status = await client.getStatus()

console.log(`Latest: ${status.latest.source} - ${status.latest.status}`)
console.log(`Created: ${status.latest.countNew}, Updated: ${status.latest.countUpdated}`)
```

## Database Schema

### Scholarship Table
- `id` - Primary key
- `name` - Scholarship name
- `level` - Study level (undergraduate, master, phd, postdoc, professional)
- `field` - Field of study (engineering, medicine, business, etc.)
- `country` - Target country
- `deadline` - Application deadline
- `amount` - Scholarship amount (in cents)
- `currency` - Currency code (USD, EUR, GBP, etc.)
- `url` - Source URL (unique)
- `source` - Source identifier
- `description` - Scholarship details
- `createdAt` - Creation timestamp
- `lastUpdated` - Last update timestamp

### IngestionLog Table
- `id` - Primary key
- `source` - Source identifier
- `status` - running, success, error
- `countNew` - New scholarships created
- `countUpdated` - Existing scholarships updated
- `errorMsg` - Error message if status is error
- `startedAt` - Operation start time
- `finishedAt` - Operation end time

## Troubleshooting

### Scholarships Not Being Created

1. Check normalization - ensure all required fields are present
2. Verify URL is unique in database
3. Check error logs: `const logs = await ingestionService.getLogs()`

### Scrapers Timing Out

1. Increase fetch timeout: `fetchPage(url, 0, 15000)` (15 second timeout)
2. Check target website is accessible
3. Try without custom headers if getting 403

### Duplicate Data Issues

1. Check URL field is correctly extracted
2. Verify source field is consistent
3. Review database constraints: `SELECT * FROM scholarships WHERE url = '...'`

### Memory Issues with Large Scrapes

1. Process in smaller batches (default: 25 items per batch)
2. Implement streaming HTML parsing for very large pages
3. Add intermediate garbage collection points

## Performance Tips

1. **Index frequently queried fields**: Source, deadline, field
2. **Archive old logs**: Run `cleanupOldLogs()` periodically
3. **Batch inserts**: Process 25-50 items per batch
4. **Connection pooling**: Prisma handles this automatically
5. **Lazy load descriptions**: Store description separately if very large

## Testing

```bash
# Run example ingestion
npm run dev

# In another terminal, test the API
curl -X POST http://localhost:3002/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source": "test_scraper",
    "scholarships": [
      {
        "name": "Test Scholarship",
        "level": "Master",
        "field": "Engineering",
        "country": "USA",
        "url": "https://example.com/test",
        "source": "test_scraper"
      }
    ]
  }'
```

## License

MIT
