import { BaseScraper } from './baseScraper'
import { XMLParser } from 'fast-xml-parser'
import { Scholarship } from '../types'

export class CheveningScraper extends BaseScraper {
  constructor() {
    super('Chevening')
  }

  async scrape(): Promise<Scholarship[]> {
    try {
      const html = await this.fetchPage('https://opportunity-desk.org/category/scholarships/feed/')
      const parser = new XMLParser()
      const result = parser.parse(html)
      const items = result?.rss?.channel?.item || []

      return items.slice(0, 10).map((item: any) => ({
        name: item.title || 'ไม่มีชื่อ',
        level: 'ทุกระดับ',
        field: 'ทุกสาขา',
        country: 'International',
        deadline: this.parseDate(item.pubDate || '') || undefined,
        amount: undefined,
        currency: undefined,
        url: item.link || '',
        source: this.source,
        description: item.description?.replace(/<[^>]*>/g, '').slice(0, 500) || undefined,
      }))
    } catch (error) {
      console.error('Error scraping Chevening:', error)
      throw error
    }
  }
}