import { NextRequest, NextResponse } from 'next/server'

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'

type ApiKeyRecord = {
  key?: string
  isActive?: boolean
}

export async function resolveApiKeyFromRequest(
  request: NextRequest,
): Promise<{ apiKey: string | null; response?: NextResponse }> {
  const explicitApiKey = request.headers.get('x-api-key')
  if (explicitApiKey) {
    return { apiKey: explicitApiKey }
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim()
    
    // If it looks like a JWT (has dots), try to get API key from auth service
    if (token.includes('.')) {
      try {
        const response = await fetch(`${AUTH_SERVICE_URL}/api/keys`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        })

        if (response.ok) {
          const data = await response.json()
          const apiKeys = Array.isArray(data.apiKeys) ? (data.apiKeys as ApiKeyRecord[]) : []
          const activeKey = apiKeys.find((item) => item.isActive && typeof item.key === 'string' && item.key.length > 0)

          if (activeKey?.key) {
            return { apiKey: activeKey.key }
          }
        }
      } catch (e) {
        console.error('Failed to resolve API key from auth service via JWT:', e)
      }
    }
    
    // Otherwise treat token as an API key directly
    return { apiKey: token }
  }

  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) {
    return {
      apiKey: null,
      response: NextResponse.json(
        { error: 'Missing session cookie or x-api-key header' },
        { status: 401 },
      ),
    }
  }

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/keys`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        apiKey: null,
        response: NextResponse.json(
          { error: 'Unable to load API keys from auth service' },
          { status: response.status },
        ),
      }
    }

    const data = await response.json()
    const apiKeys = Array.isArray(data.apiKeys) ? (data.apiKeys as ApiKeyRecord[]) : []
    const activeKey = apiKeys.find((item) => item.isActive && typeof item.key === 'string' && item.key.length > 0)

    if (!activeKey?.key) {
      return {
        apiKey: null,
        response: NextResponse.json(
          { error: 'No active API key found. Please create one in the auth dashboard.' },
          { status: 403 },
        ),
      }
    }

    return { apiKey: activeKey.key }
  } catch (error) {
    console.error('Failed to resolve API key from auth service:', error)
    return {
      apiKey: null,
      response: NextResponse.json(
        { error: 'Failed to connect to auth service' },
        { status: 502 },
      ),
    }
  }
}