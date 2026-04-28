import { NextRequest, NextResponse } from 'next/server'

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'

/**
 * Verify API Key by calling Auth Service (Server-to-Server)
 * @param apiKey - The API key from x-api-key header
 * @returns Promise<{ valid: boolean; user?: any; error?: string }>
 */
export async function verifyApiKey(apiKey: string): Promise<{ valid: boolean; user?: any; error?: string }> {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/keys/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: apiKey }),
    })

    if (!response.ok) {
      return { valid: false, error: 'Auth service returned error' }
    }

    const data = await response.json()
    
    // Auth service should return { valid: true, user: {...} } or { valid: false }
    if (data.valid === true) {
      return { valid: true, user: data.user }
    }
    
    return { valid: false, error: data.error || 'Invalid API key' }
  } catch (error) {
    console.error('Error verifying API key:', error)
    return { valid: false, error: 'Failed to connect to Auth Service' }
  }
}

/**
 * Middleware function to check API key from request
 * @param request - NextRequest object
 * @returns NextResponse with 401 if invalid, null if valid
 */
export function checkApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing x-api-key header' },
      { status: 401 }
    )
  }

  // Note: Actual verification is done asynchronously in the route handler
  // This function just checks for presence of the key
  return null
}

/**
 * Get all scholarships from database using Prisma
 * @param prisma - PrismaClient instance
 * @returns Promise<Scholarship[]>
 */
export async function getAllScholarships(prisma: any) {
  return prisma.scholarship.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}