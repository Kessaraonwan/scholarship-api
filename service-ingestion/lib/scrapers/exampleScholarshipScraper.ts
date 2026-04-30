/**
 * Example Scholarship Scraper Implementation
 * 
 * Demonstrates how to implement a concrete scraper that:
 * - Handles errors gracefully
 * - Extracts data from HTML
 * - Returns data in the expected format for the ingestion API
 * 
 * This example scrapes a mock scholarship website. Replace with real URLs and selectors
 * when implementing for actual sources.
 */

import { EnhancedBaseScraper } from './enhancedBaseScraper'

export class ExampleScholarshipScraper extends EnhancedBaseScraper {
  private baseUrl: string = 'https://example-scholarships.com'
  private maxPages: number = 5

  constructor() {
    super('example_scholarships_scraper', 500) // 500ms delay between requests
  }

  /**
   * Main scraping method
   * This is called by the ingestion API to get scholarship data
   */
  async scrape(): Promise<any[]> {
    console.log(`Starting scrape of ${this.source}...`)
    
    const allScholarships: any[] = []
    let successCount = 0
    let failureCount = 0

    try {
      // Scrape multiple pages with error handling
      for (let page = 1; page <= this.maxPages; page++) {
        try {
          const pageUrl = `${this.baseUrl}/scholarships?page=${page}`
          console.log(`Fetching page ${page}: ${pageUrl}`)

          const html = await this.fetchPage(pageUrl)
          
          if (!html) {
            failureCount++
            console.warn(`Page ${page} returned empty HTML, skipping...`)
            continue
          }

          // Parse and extract scholarships from this page
          const scholarships = await this.scrapeScholarshipsFromPage(html, page)
          allScholarships.push(...scholarships)
          successCount++

          console.log(`Page ${page}: Extracted ${scholarships.length} scholarships`)
        } catch (error) {
          failureCount++
          console.error(`Error scraping page ${page}:`, error)
          // Continue to next page instead of failing entire scrape
        }
      }

      console.log(
        `Scraping complete. Success: ${successCount}, Failures: ${failureCount}, Total scholarships: ${allScholarships.length}`
      )

      return allScholarships
    } catch (error) {
      console.error(`Critical error in scrape method:`, error)
      return allScholarships // Return what we've collected so far
    }
  }

  /**
   * Extract scholarships from a single page
   * Demonstrates robust error handling per item
   */
  private async scrapeScholarshipsFromPage(html: string, page: number): Promise<any[]> {
    const scholarships: any[] = []
    const $ = this.parseHtml(html)

    // Select all scholarship items on the page
    // These selectors are examples - adjust based on actual HTML structure
    const scholarshipElements = this.select($, '.scholarship-card, article.scholarship, .scholarship-item')

    if (scholarshipElements.length === 0) {
      console.warn(`No scholarship elements found with expected selectors on page ${page}`)
      return []
    }

    // Process each scholarship element with error handling
    scholarshipElements.each((index, element) => {
      try {
        const scholarship = this.extractScholarshipData($, element)
        
        // Only add if we successfully extracted critical fields
        if (scholarship && scholarship.name && scholarship.url) {
          scholarships.push(scholarship)
        } else {
          console.warn(
            `Skipping scholarship at index ${index} on page ${page}: missing critical fields`
          )
        }
      } catch (error) {
        // Log error but continue to next scholarship
        console.error(
          `Error extracting scholarship at index ${index} on page ${page}:`,
          error
        )
        // Don't add this scholarship, continue with next one
      }
    })

    return scholarships
  }

  /**
   * Extract data from a single scholarship element
   * Demonstrates safe field extraction with fallbacks
   */
  private extractScholarshipData($: any, element: any): any {
    try {
      const $element = $(element)

      // Extract each field with error handling and sensible defaults
      const name = this.normalizeText(
        this.getText($, 'h2.scholarship-title, .title, [data-field="name"]', ''),
        '',
        ''
      )

      const url = $element.find('a.scholarship-link, a[href*="scholarship"]').attr('href') || ''

      const level = this.normalizeText(
        this.getText($, '.level, [data-field="level"]', 'Undergraduate'),
        'Undergraduate',
        'Undergraduate'
      )

      const field = this.normalizeText(
        this.getText($, '.field, .category, [data-field="field"]', 'Other'),
        'Other',
        'Other'
      )

      const country = this.normalizeText(
        this.getText($, '.country, [data-field="country"]', 'Unknown'),
        'Unknown',
        'Unknown'
      )

      const deadlineText = this.getText($, '.deadline, [data-field="deadline"]', '')
      
      // Attempt to extract amount
      const amountText = this.getText($, '.amount, [data-field="amount"]', '')
      const { amount, currency } = this.parseAmount(amountText)

      // Optional: Extract description/overview
      const description = this.normalizeText(
        this.getText($, '.description, .overview, p', '')
      )

      return {
        name,
        level,
        field,
        country,
        deadline: deadlineText || undefined,
        amount: amount ? `${amount} ${currency || 'USD'}` : undefined,
        url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
        source: this.source,
        description: description || undefined
      }
    } catch (error) {
      console.error('Error in extractScholarshipData:', error)
      throw error // Re-throw so the caller knows extraction failed
    }
  }

  /**
   * Override normalizeText to provide additional processing
   */
  protected normalizeText(
    text: string,
    fallback: string = '',
    fallback2: string = ''
  ): string {
    if (!text || text.trim() === '') {
      return fallback || fallback2
    }
    return super.normalizeText(text)
  }
}

/**
 * Example usage of the scraper:
 * 
 * async function runIngestion() {
 *   try {
 *     const scraper = new ExampleScholarshipScraper()
 *     const scholarships = await scraper.scrape()
 *     
 *     // Send to ingestion API
 *     const response = await fetch('/api/ingest', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({
 *         source: 'example_scholarships_scraper',
 *         scholarships
 *       })
 *     })
 *     
 *     const result = await response.json()
 *     console.log('Ingestion result:', result)
 *   } catch (error) {
 *     console.error('Ingestion failed:', error)
 *   }
 * }
 */
