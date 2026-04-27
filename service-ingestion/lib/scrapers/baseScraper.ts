import axios from 'axios'
import * as cheerio from 'cheerio'
import { Scholarship } from '../types'



export abstract class BaseScraper {
  protected source: string

  constructor(source: string) {
    this.source = source
  }

  abstract scrape(): Promise<Scholarship[]>

  protected async fetchPage(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      throw error
    }
  }

  protected parseHtml(html: string): cheerio.CheerioAPI {
    return cheerio.load(html)
  }

  protected cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim()
  }

  protected parseAmount(text: string): { amount?: number; currency?: string } {
    // Simple amount parsing - can be enhanced
    const match = text.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(THB|USD|GBP|EUR|JPY)?/i)
    if (match) {
      return {
        amount: parseFloat(match[1].replace(/,/g, '')),
        currency: match[2]?.toUpperCase() || 'THB'
      }
    }
    return {}
  }

  protected parseDate(text: string): string | undefined {
    // Simple date parsing - can be enhanced with date libraries
    const dateMatch = text.match(/(\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\d{1,2}[-\/]\d{1,2}[-\/]\d{4})/)
    if (dateMatch) {
      return dateMatch[1].replace(/\//g, '-')
    }
    return undefined
  }
}