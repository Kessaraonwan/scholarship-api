/**
 * Data Normalization Module for Scholarship Ingestion
 * 
 * This module provides utility functions to clean, validate, and normalize
 * scraped scholarship data before database insertion. It handles:
 * - Text trimming and whitespace normalization
 * - Date parsing and ISO 8601 formatting
 * - Currency and amount validation
 * - Category standardization
 * - URL validation
 */

import { Scholarship } from './types'

// Standard scholarship levels
const STANDARD_LEVELS = [
  'undergraduate',
  'master',
  'phd',
  'postdoc',
  'professional'
]

// Standard fields of study
const STANDARD_FIELDS = [
  'engineering',
  'medicine',
  'business',
  'law',
  'arts',
  'sciences',
  'education',
  'technology',
  'humanities',
  'social-sciences',
  'other'
]

// ISO 4217 Currency Codes
const VALID_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY',
  'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY',
  'RUB', 'INR', 'BRL', 'ZAR', 'THB', 'MYR', 'PHP', 'IDR'
]

/**
 * Normalize whitespace and trim text
 * @param text - Raw text from HTML
 * @returns Cleaned text with normalized whitespace
 */
export function normalizeText(text: string | undefined): string {
  if (!text) return ''
  return text
    .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
    .replace(/\n\t/g, ' ')     // Replace newlines and tabs with space
    .trim()
}

/**
 * Validate and normalize URL
 * @param url - URL string to validate
 * @returns Normalized URL or empty string if invalid
 */
export function normalizeUrl(url: string | undefined): string {
  if (!url) return ''
  
  try {
    const normalized = normalizeText(url)
    // Add protocol if missing
    const withProtocol = !normalized.startsWith('http')
      ? `https://${normalized}`
      : normalized
    
    // Validate URL format
    new URL(withProtocol)
    return withProtocol
  } catch {
    console.warn(`Invalid URL format: ${url}`)
    return ''
  }
}

/**
 * Parse date string and convert to ISO 8601 format
 * Handles multiple common date formats
 * @param dateStr - Raw date string (e.g., "15 March 2025", "2025-03-15")
 * @returns ISO 8601 date string or null if parsing fails
 */
export function normalizeDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null
  
  try {
    const cleaned = normalizeText(dateStr)
    
    // Try direct parsing first
    const date = new Date(cleaned)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }
    
    // Try common date patterns
    // Pattern: "15 March 2025" or "March 15, 2025"
    const monthPatterns = cleaned.match(
      /(january|february|march|april|may|june|july|august|september|october|november|december)[\s\-/]?(\d{1,2})[\s\-/,]*(\d{4})/i
    )
    if (monthPatterns) {
      const monthMap: { [key: string]: number } = {
        january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
      }
      const month = monthMap[monthPatterns[1].toLowerCase()]
      const day = parseInt(monthPatterns[2])
      const year = parseInt(monthPatterns[3])
      const parsedDate = new Date(year, month, day)
      return parsedDate.toISOString()
    }
    
    // Pattern: "DD/MM/YYYY" or "DD-MM-YYYY"
    const slashPattern = cleaned.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/)
    if (slashPattern) {
      const day = parseInt(slashPattern[1])
      const month = parseInt(slashPattern[2]) - 1
      const year = parseInt(slashPattern[3])
      const parsedDate = new Date(year, month, day)
      return parsedDate.toISOString()
    }
    
    console.warn(`Could not parse date: ${dateStr}`)
    return null
  } catch (error) {
    console.warn(`Error parsing date "${dateStr}":`, error)
    return null
  }
}

/**
 * Parse monetary amount and extract currency
 * Handles formats like "$50,000", "€25000", "5000 GBP", etc.
 * @param amountStr - Raw amount string
 * @returns Object with normalized amount (in cents) and currency code
 */
export function normalizeAmount(amountStr: string | undefined): {
  amount: number | null
  currency: string
} {
  if (!amountStr) return { amount: null, currency: 'USD' }
  
  const cleaned = normalizeText(amountStr)
  
  // Currency symbols map to ISO 4217 codes
  const currencySymbols: { [key: string]: string } = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY',
    '₹': 'INR',
    '₽': 'RUB',
    'c': 'CAD',
    'kr': 'SEK',
    '฿': 'THB'
  }
  
  let currency = 'USD' // Default currency
  let amount: number | null = null
  
  // Try to extract currency code (e.g., "USD", "GBP", "EUR")
  const currencyCodeMatch = cleaned.match(/\b([A-Z]{3})\b/)
  if (currencyCodeMatch && VALID_CURRENCIES.includes(currencyCodeMatch[1])) {
    currency = currencyCodeMatch[1]
  }
  
  // Try to extract currency symbol
  for (const [symbol, code] of Object.entries(currencySymbols)) {
    if (cleaned.includes(symbol)) {
      currency = code
      break
    }
  }
  
  // Extract numeric value
  // Handles formats: "50,000", "50000", "50000.00"
  const amountMatch = cleaned.match(/([\d,]+(?:\.\d{2})?)/);
  if (amountMatch) {
    const numStr = amountMatch[1].replace(/,/g, '')
    const parsedAmount = parseFloat(numStr)
    
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      // Convert to cents (assuming input is in primary units)
      // For currencies like JPY that don't have decimals, multiply by 1
      // For others, multiply by 100
      const decimalCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'NZD', 'MXN', 'SGD', 'HKD', 'TRY']
      amount = decimalCurrencies.includes(currency) 
        ? Math.round(parsedAmount * 100)
        : Math.round(parsedAmount)
    }
  }
  
  return { amount, currency }
}

/**
 * Standardize scholarship level to predefined values
 * Maps common variations to standard levels
 * @param level - Raw level string (e.g., "Undergrad", "Master's", "PhD")
 * @returns Standardized level code
 */
export function normalizeLevel(level: string | undefined): string {
  if (!level) return 'undergraduate'
  
  const cleaned = normalizeText(level).toLowerCase()
  
  // Map common variations to standard levels
  if (cleaned.match(/undergraduate|undergrad|bachelor|bachelor's|degree|first degree/)) {
    return 'undergraduate'
  }
  if (cleaned.match(/master|master's|postgraduate|graduate|m\.?a\.|m\.?s\./)) {
    return 'master'
  }
  if (cleaned.match(/ph\.?d|doctorate|doctoral|doctor of philosophy/)) {
    return 'phd'
  }
  if (cleaned.match(/postdoc|post-doc|postdoctoral/)) {
    return 'postdoc'
  }
  if (cleaned.match(/professional|legal|medical/)) {
    return 'professional'
  }
  
  return 'undergraduate' // Default fallback
}

/**
 * Standardize field of study to predefined values
 * Maps common variations to standard fields
 * @param field - Raw field string
 * @returns Standardized field code
 */
export function normalizeField(field: string | undefined): string {
  if (!field) return 'other'
  
  const cleaned = normalizeText(field).toLowerCase()
  
  // Check for matching standard fields
  for (const standardField of STANDARD_FIELDS) {
    if (cleaned.includes(standardField.replace('-', ' '))) {
      return standardField
    }
  }
  
  // Map common field variations
  if (cleaned.match(/engineering|tech|computer|software|electrical|mechanical|civil/)) {
    return 'engineering'
  }
  if (cleaned.match(/medical|medicine|health|nursing|dentistry|pharmacy/)) {
    return 'medicine'
  }
  if (cleaned.match(/business|commerce|economics|finance|accounting|management|mba/)) {
    return 'business'
  }
  if (cleaned.match(/law|legal|law school|jd/)) {
    return 'law'
  }
  if (cleaned.match(/art|design|music|performance|visual|creative/)) {
    return 'arts'
  }
  if (cleaned.match(/science|physics|chemistry|biology|mathematics|geology/)) {
    return 'sciences'
  }
  if (cleaned.match(/education|teaching|pedagogy|teacher training/)) {
    return 'education'
  }
  if (cleaned.match(/literature|language|history|philosophy|geography/)) {
    return 'humanities'
  }
  if (cleaned.match(/psychology|sociology|anthropology|political|social/)) {
    return 'social-sciences'
  }
  
  return 'other'
}

/**
 * Validate country code or name
 * @param country - Country name or code
 * @returns Standardized country name or empty string if invalid
 */
export function normalizeCountry(country: string | undefined): string {
  if (!country) return ''
  
  const cleaned = normalizeText(country).trim()
  
  // This is a basic implementation - you might want to use a library like 'iso-3166-1'
  // for production-grade country validation
  
  // Convert to title case for consistency
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Complete data normalization for a scholarship object
 * Validates and cleans all fields
 * @param rawScholarship - Raw scraped scholarship data
 * @returns Normalized scholarship object or null if critical fields are missing
 */
export function normalizeScholarship(rawScholarship: any): Scholarship | null {
  try {
    // Validate critical fields
    const name = normalizeText(rawScholarship.name)
    const url = normalizeUrl(rawScholarship.url)
    const source = normalizeText(rawScholarship.source)
    
    // All critical fields must be present
    if (!name || !url || !source) {
      console.warn('Missing critical fields:', { name, url, source })
      return null
    }
    
    // Parse and normalize optional fields
    const deadline = normalizeDate(rawScholarship.deadline)
    const { amount, currency } = normalizeAmount(rawScholarship.amount)
    const level = normalizeLevel(rawScholarship.level)
    const field = normalizeField(rawScholarship.field)
    const country = normalizeCountry(rawScholarship.country)
    const description = normalizeText(rawScholarship.description)
    
    return {
      name,
      level,
      field,
      country,
      deadline: deadline ? new Date(deadline) : undefined,
      amount: amount ?? undefined,
      currency,
      url,
      source,
      description: description || undefined
    }
  } catch (error) {
    console.error('Error normalizing scholarship:', error, rawScholarship)
    return null
  }
}
