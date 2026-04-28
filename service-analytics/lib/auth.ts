type VerifyResult = {
  valid: boolean
  user?: {
    id: string
    email: string
    role: string
    tier: 'free' | 'pro'
  }
  error?: string
}

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://service-auth:3001'

export async function verifyApiKey(apiKey: string): Promise<VerifyResult> {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/keys/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: apiKey }),
    })

    if (!response.ok) {
      return { valid: false, error: 'Invalid API key' }
    }

    const payload = await response.json()
    return payload as VerifyResult
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Auth service unavailable',
    }
  }
}

export function requireProTier(verifyResult: VerifyResult) {
  if (!verifyResult.valid || !verifyResult.user) {
    return { ok: false, status: 401, body: { error: 'Invalid API key', code: 401 } }
  }

  if (verifyResult.user.tier !== 'pro') {
    return { ok: false, status: 403, body: { error: 'Pro plan required', code: 403 } }
  }

  return { ok: true as const }
}

