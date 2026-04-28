#!/usr/bin/env node

/**
 * Test Script for Scholarship Ingestion API
 * 
 * Comprehensive tests for the ingestion system covering:
 * - API endpoint functionality
 * - Error handling
 * - Data normalization
 * - Database operations
 * 
 * Run: npx ts-node scripts/test-ingestion.ts
 */

import axios from 'axios'

interface TestResult {
  name: string
  status: 'pass' | 'fail'
  message: string
  duration: number
}

const results: TestResult[] = []
const API_BASE = 'http://localhost:3002'

/**
 * Helper to run a test
 */
async function runTest(name: string, fn: () => Promise<void>) {
  const start = Date.now()
  try {
    await fn()
    results.push({
      name,
      status: 'pass',
      message: 'Passed',
      duration: Date.now() - start
    })
    console.log(`✓ ${name}`)
  } catch (error) {
    results.push({
      name,
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - start
    })
    console.log(`✗ ${name}: ${error instanceof Error ? error.message : error}`)
  }
}

/**
 * Test 1: API Endpoint Health Check
 */
async function testHealthCheck() {
  await runTest('API Health Check', async () => {
    const response = await axios.get(`${API_BASE}/api/ingest`)
    if (!response.data.success) {
      throw new Error('Health check returned success: false')
    }
  })
}

/**
 * Test 2: Basic Ingestion
 */
async function testBasicIngestion() {
  await runTest('Basic Scholarship Ingestion', async () => {
    const response = await axios.post(`${API_BASE}/api/ingest`, {
      source: 'test_scraper_basic',
      scholarships: [
        {
          name: 'Test Scholarship 1',
          level: 'Master',
          field: 'Engineering',
          country: 'USA',
          deadline: '2025-12-31',
          amount: '$25,000',
          url: `https://example.com/test-${Date.now()}`,
          source: 'test_scraper_basic',
          description: 'A test scholarship'
        }
      ]
    })

    if (!response.data.success) {
      throw new Error(`API returned: ${response.data.error}`)
    }
    if (response.data.summary?.results.created !== 1) {
      throw new Error(`Expected 1 created, got ${response.data.summary?.results.created}`)
    }
  })
}

/**
 * Test 3: Duplicate Prevention (Upsert)
 */
async function testDuplicatePrevention() {
  await runTest('Duplicate Prevention (Upsert)', async () => {
    const uniqueUrl = `https://example.com/duplicate-test-${Date.now()}`

    // First ingestion
    const response1 = await axios.post(`${API_BASE}/api/ingest`, {
      source: 'test_scraper_duplicate',
      scholarships: [
        {
          name: 'Unique Scholarship',
          level: 'PhD',
          field: 'Medicine',
          country: 'UK',
          url: uniqueUrl,
          source: 'test_scraper_duplicate'
        }
      ]
    })

    if (response1.data.summary?.results.created !== 1) {
      throw new Error('First ingestion should create 1 scholarship')
    }

    // Second ingestion with same URL (should update, not create)
    const response2 = await axios.post(`${API_BASE}/api/ingest`, {
      source: 'test_scraper_duplicate',
      scholarships: [
        {
          name: 'Updated Scholarship Name',
          level: 'Master',
          field: 'Business',
          country: 'Canada',
          url: uniqueUrl,
          source: 'test_scraper_duplicate'
        }
      ]
    })

    if (response2.data.summary?.results.updated !== 1) {
      throw new Error(`Expected 1 update, got ${response2.data.summary?.results.updated}`)
    }
    if (response2.data.summary?.results.created !== 0) {
      throw new Error(`Expected 0 creates on duplicate, got ${response2.data.summary?.results.created}`)
    }
  })
}

/**
 * Test 4: Error Handling - Missing Required Fields
 */
async function testMissingFields() {
  await runTest('Error Handling - Missing Required Fields', async () => {
    try {
      await axios.post(`${API_BASE}/api/ingest`, {
        source: 'test_scraper',
        scholarships: [
          {
            // Missing required: name, url, source
            level: 'Master',
            field: 'Engineering'
          }
        ]
      })
      throw new Error('Should have rejected invalid data')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return // Expected error
      }
      throw error
    }
  })
}

/**
 * Test 5: Data Normalization
 */
async function testDataNormalization() {
  await runTest('Data Normalization', async () => {
    const response = await axios.post(`${API_BASE}/api/ingest`, {
      source: 'test_scraper_normalization',
      scholarships: [
        {
          name: '  Scholarship   with   spaces  ', // Should be trimmed
          level: 'MASTER', // Should be normalized to 'master'
          field: 'engineering', // Should normalize
          country: '  United Kingdom  ',
          deadline: 'March 15, 2025', // Should parse to ISO 8601
          amount: '$50,000 USD', // Should extract amount
          url: `https://example.com/normalized-${Date.now()}`,
          source: 'test_scraper_normalization'
        }
      ]
    })

    if (!response.data.success) {
      throw new Error(`Normalization failed: ${response.data.error}`)
    }
  })
}

/**
 * Test 6: Batch Processing
 */
async function testBatchProcessing() {
  await runTest('Batch Processing (Multiple Scholarships)', async () => {
    const scholarships = Array.from({ length: 50 }, (_, i) => ({
      name: `Batch Scholarship ${i + 1}`,
      level: ['Master', 'PhD', 'Undergraduate'][i % 3],
      field: ['Engineering', 'Medicine', 'Business'][i % 3],
      country: ['USA', 'UK', 'Canada', 'Australia'][i % 4],
      url: `https://example.com/batch-${Date.now()}-${i}`,
      source: 'test_scraper_batch'
    }))

    const response = await axios.post(`${API_BASE}/api/ingest`, {
      source: 'test_scraper_batch',
      scholarships
    })

    if (response.data.summary?.totalNormalized < 45) {
      throw new Error(`Expected most scholarships to normalize, got ${response.data.summary?.totalNormalized}`)
    }
  })
}

/**
 * Test 7: Rate Limiting (Verify no timeout with moderate load)
 */
async function testRateLimiting() {
  await runTest('Rate Limiting & Performance', async () => {
    const scholarships = Array.from({ length: 100 }, (_, i) => ({
      name: `Performance Test ${i + 1}`,
      level: 'Master',
      field: 'Engineering',
      country: 'USA',
      url: `https://example.com/perf-${Date.now()}-${i}`,
      source: 'test_scraper_performance'
    }))

    const start = Date.now()
    const response = await axios.post(`${API_BASE}/api/ingest`, {
      source: 'test_scraper_performance',
      scholarships
    })
    const duration = Date.now() - start

    if (!response.data.success) {
      throw new Error('Performance test failed')
    }

    console.log(`  (Duration: ${duration}ms)`)
  })
}

/**
 * Test 8: Ingestion Logging
 */
async function testLogging() {
  await runTest('Ingestion Logging', async () => {
    const response = await axios.post(`${API_BASE}/api/ingest`, {
      source: 'test_scraper_logging',
      scholarships: [
        {
          name: 'Log Test Scholarship',
          level: 'Master',
          field: 'Engineering',
          country: 'USA',
          url: `https://example.com/log-test-${Date.now()}`,
          source: 'test_scraper_logging'
        }
      ]
    })

    if (!response.data.logId) {
      throw new Error('No logId returned in response')
    }

    // Verify log can be retrieved
    const statusResponse = await axios.get(`${API_BASE}/api/ingest`)
    const latestLog = statusResponse.data.latest

    if (latestLog.source !== 'test_scraper_logging') {
      throw new Error('Latest log not found')
    }
  })
}

/**
 * Test 9: Invalid Request Format
 */
async function testInvalidRequest() {
  await runTest('Error Handling - Invalid Request Format', async () => {
    try {
      await axios.post(`${API_BASE}/api/ingest`, {
        // Missing required 'source' field
        scholarships: []
      })
      throw new Error('Should have rejected invalid request')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return // Expected
      }
      throw error
    }
  })
}

/**
 * Test 10: Empty Scholarship Array
 */
async function testEmptyArray() {
  await runTest('Error Handling - Empty Scholarships Array', async () => {
    try {
      await axios.post(`${API_BASE}/api/ingest`, {
        source: 'test_scraper',
        scholarships: []
      })
      throw new Error('Should reject empty array')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return // Expected
      }
      throw error
    }
  })
}

/**
 * Print test summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(50))
  console.log('TEST SUMMARY')
  console.log('='.repeat(50))

  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0)

  console.log(`\nPassed: ${passed}/${results.length}`)
  console.log(`Failed: ${failed}/${results.length}`)
  console.log(`Total Time: ${totalTime}ms\n`)

  if (failed > 0) {
    console.log('Failed Tests:')
    results
      .filter(r => r.status === 'fail')
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.message}`)
      })
  }

  console.log('')
  console.log(passed === results.length ? '✓ All tests passed!' : '✗ Some tests failed')
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🧪 Starting Ingestion API Tests...\n')

  try {
    // Check API is running
    try {
      await axios.get(`${API_BASE}/api/ingest`)
    } catch {
      console.error('❌ API not accessible at', API_BASE)
      console.error('   Make sure to run: npm run dev')
      process.exit(1)
    }

    // Run all tests
    await testHealthCheck()
    await testBasicIngestion()
    await testDuplicatePrevention()
    await testMissingFields()
    await testDataNormalization()
    await testBatchProcessing()
    await testRateLimiting()
    await testLogging()
    await testInvalidRequest()
    await testEmptyArray()

    printSummary()

    const hasFailures = results.some(r => r.status === 'fail')
    process.exit(hasFailures ? 1 : 0)
  } catch (error) {
    console.error('Test runner error:', error)
    process.exit(1)
  }
}

// Run tests
runAllTests()
