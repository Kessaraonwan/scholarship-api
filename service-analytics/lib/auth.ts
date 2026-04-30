import { NextRequest, NextResponse } from 'next/server'

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'

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

    if (data.valid === true) {
      return { valid: true, user: data.user }
    }

    return { valid: false, error: data.error || 'Invalid API key' }
  } catch (error) {
    console.error('Error verifying API key:', error)
    return { valid: false, error: 'Failed to connect to Auth Service' }
  }
}

export function checkApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing x-api-key header' },
      { status: 401 }
    )
  }
  return null
}