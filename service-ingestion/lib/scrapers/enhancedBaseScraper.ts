/**
 * Enhanced Base Scraper with Error Handling
 * 
 * This abstract base class provides common scraping functionality with
 * robust error handling, retry logic, and data normalization support
 */

import axios, { AxiosError } from 'axios'
import * as cheerio from 'cheerio'
import { Scholarship } from '../types'

// Maximum retries for failed requests
const MAX_RETRIES = 3

// Delay between retries (in milliseconds)
const RETRY_DELAY = 1000

// User agent to identify our scraper
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

export abstract class EnhancedBaseScraper {
  protected source: string
  protected requestDelay: number = 500 // Delay between requests (ms) for politeness

  constructor(source: string, requestDelay: number = 500) {
    this.source = source
    this.requestDelay = requestDelay
  }

  /**
   * Main entry point - must be implemented by subclasses
   * Should return array of raw scholarship data objects
   */
  abstract scrape(): Promise<any[]>

  /**
   * Fetch a page with retry logic and error handling
   * Automatically retries on network errors with exponential backoff
   * 
   * @param url - URL to fetch
   * @param retryCount - Current retry count (used internally)
   * @returns HTML string or empty string on failure
   */
  protected async fetchPage(url: string, retryCount: number = 0): Promise<string> {
    try {
      // Add delay for politeness (don't spam servers)
      await this.delay(this.requestDelay)

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      })
      
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const statusCode = axiosError.response?.status

      // Determine if we should retry
      const isRetryable =
        !statusCode || // Network error
        statusCode === 408 || // Request timeout
        statusCode === 429 || // Too many requests
        statusCode === 500 || // Server error
        statusCode === 502 || // Bad gateway
        statusCode === 503 || // Service unavailable
        statusCode === 504    // Gateway timeout

      // Retry with exponential backoff
      if (isRetryable && retryCount < MAX_RETRIES) {
        const delayMs = RETRY_DELAY * Math.pow(2, retryCount)
        console.warn(
          `Failed to fetch ${url} (status: ${statusCode}). Retrying in ${delayMs}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`
        )
        await this.delay(delayMs)
        return this.fetchPage(url, retryCount + 1)
      }

      // If we've exhausted retries or got a non-retryable error, log and return empty string
      console.error(
        `Failed to fetch ${url} after ${retryCount} retries:`,
        axiosError.message
      )
      return ''
    }
  }

  /**
   * Parse HTML using Cheerio
   * Provides jQuery-like API for scraping
   */
  protected parseHtml(html: string): cheerio.CheerioAPI {
    return cheerio.load(html)
  }

  /**
   * Safe CSS selector that returns empty array instead of null if selector fails
   * Usage: this.select($, '.scholarship-item') instead of $('.scholarship-item')
   * This prevents errors when HTML structure is unexpected
   */
  protected select(
    $: cheerio.CheerioAPI,
    selector: string
  ): cheerio.Cheerio<any> {
    try {
      const elements = $(selector)
      if (!elements || elements.length === 0) {
        console.warn(`CSS selector "${selector}" returned no elements`)
      }
      return elements
    } catch (error) {
      console.error(`Error selecting CSS "${selector}":`, error)
      return $([]) // Return empty selection
    }
  }

  /**
   * Safely extract text from element with fallback
   */
  protected getText(
    $: cheerio.CheerioAPI,
    selector: string,
    fallback: string = ''
  ): string {
    try {
      const text = this.select($, selector).text()
      return text || fallback
    } catch (error) {
      console.error(`Error getting text from "${selector}":`, error)
      return fallback
    }
  }

  /**
   * Safely extract attribute from element with fallback
   */
  protected getAttribute(
    element: cheerio.Element | cheerio.Cheerio<any>,
    attribute: string,
    fallback: string = ''
  ): string {
    try {
      const value = (element as any).attr?.(attribute) ||
                    (element instanceof cheerio.Cheerio ? element.attr(attribute) : '')
      return value || fallback
    } catch (error) {
      console.error(`Error getting attribute "${attribute}":`, error)
      return fallback
    }
  }

  /**
   * Normalize whitespace in text
   */
  protected normalizeText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\t/g, ' ')
      .trim()
  }

  /**
   * Parse amount with currency detection
   * Returns object with amount and currency code
   */
  protected parseAmount(text: string): { amount?: string; currency?: string } {
    // Simple pattern matching - enhance as needed
    const match = text.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([\$£€¥₹]|[A-Z]{3})?/i)
    
    if (match) {
      return {
        amount: match[1],
        currency: match[2]
      }
    }
    
    return {}
  }

  /**
   * Helper function to add delay (for rate limiting)
   */
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Wrap a scraping operation with error handling
   * Returns empty array if the operation fails
   */
  protected async safeOperation<T>(
    operation: () => Promise<T[]>,
    operationName: string
  ): Promise<T[]> {
    try {
      return await operation()
    } catch (error) {
      console.error(`Error during ${operationName}:`, error)
      return []
    }
  }
}
