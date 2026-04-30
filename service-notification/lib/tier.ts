export type Tier = 'free' | 'pro'

export function normalizeTier(value: string | null | undefined): Tier | null {
  if (value === 'free' || value === 'pro') {
    return value
  }

  return null
}

export function readTierFromBrowser(searchParams?: URLSearchParams | null): Tier {
  const queryTier = normalizeTier(searchParams?.get('tier'))
  if (queryTier) {
    return queryTier
  }

  if (typeof window === 'undefined') {
    return 'free'
  }

  try {
    const storedTier = normalizeTier(window.localStorage.getItem('userTier'))
    if (storedTier) {
      return storedTier
    }

    const token = window.document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('accessToken='))
      ?.split('=')[1]

    if (!token) {
      return 'free'
    }

    const payload = JSON.parse(window.atob(token.split('.')[1]))
    return normalizeTier(payload.tier) ?? 'free'
  } catch {
    return 'free'
  }
}

export function persistTier(tier: Tier) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem('userTier', tier)
}

export async function fetchTierFromServer(): Promise<Tier> {
  try {
    if (typeof window === 'undefined') return 'free'

    const res = await fetch('/api/auth/verify', { credentials: 'include' })
    if (!res.ok) return 'free'

    const body = await res.json()
    const tier = normalizeTier(body?.user?.tier)
    return tier ?? 'free'
  } catch {
    return 'free'
  }
}