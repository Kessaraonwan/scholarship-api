import { prisma } from '@/lib/prisma'

/**
 * Verify API key with service-auth
 */
async function verifyApiKey(apiKey: string) {
  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/api/keys/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: apiKey }),
    })

    if (!response.ok) return null

    return await response.json()
  } catch (error) {
    console.error('Error verifying API key:', error)
    return null
  }
}

// GET /api/notifications - List all rules for user
export async function GET(request: Request) {
  try {
    // === Verify authentication ===
    const authHeader = request.headers.get('authorization')
    let apiKey = null

    if (authHeader?.toLowerCase().startsWith('bearer ')) {
      apiKey = authHeader.slice('bearer '.length).trim()
    }

    if (!apiKey) {
      return Response.json(
        { error: 'Unauthorized: Missing Authorization header' },
        { status: 401 }
      )
    }

    const verifyResult = await verifyApiKey(apiKey)
    if (!verifyResult?.valid) {
      return Response.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      )
    }

    const authenticatedUserId = verifyResult?.user?.id

    // === Get request parameters ===
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!userId) {
      return Response.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      )
    }

    // === Verify user owns the rules they're requesting ===
    if (userId !== authenticatedUserId) {
      return Response.json(
        { error: 'Forbidden: Cannot access other users\' notification rules' },
        { status: 403 }
      )
    }

    const where = { userId }
    const total = await prisma.notificationRule.count({ where })
    const userRules = await prisma.notificationRule.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return Response.json({
      data: userRules,
      meta: { total, page, limit },
    })
  } catch (error) {
    console.error('Error fetching notification rules:', error)
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create new rule
export async function POST(request: Request) {
  try {
    // === Verify authentication ===
    const authHeader = request.headers.get('authorization')
    let apiKey = null

    if (authHeader?.toLowerCase().startsWith('bearer ')) {
      apiKey = authHeader.slice('bearer '.length).trim()
    }

    if (!apiKey) {
      return Response.json(
        { error: 'Unauthorized: Missing Authorization header' },
        { status: 401 }
      )
    }

    const verifyResult = await verifyApiKey(apiKey)
    if (!verifyResult?.valid) {
      return Response.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      )
    }

    const authenticatedUserId = verifyResult?.user?.id

    // === Parse and validate request body ===
    const body = await request.json()
    const { userId, name, triggers, channels } = body

    // Validate required fields
    if (!userId || !name || !triggers) {
      return Response.json(
        { error: "Missing required fields: userId, name, triggers" },
        { status: 400 }
      )
    }

    // Validate channels if provided (default to ['email'] if not)
    if (channels !== undefined && !Array.isArray(channels)) {
      return Response.json(
        { error: "channels must be an array (e.g., ['email', 'webhook'])" },
        { status: 400 }
      )
    }

    // === Verify user can only create rules for themselves ===
    if (userId !== authenticatedUserId) {
      return Response.json(
        { error: 'Forbidden: Cannot create notification rules for other users' },
        { status: 403 }
      )
    }

    const newRule = await prisma.notificationRule.create({
      data: {
        userId,
        name,
        triggers,
        channels: channels || ['email'],
        active: true,
      },
    })

    return Response.json(
      { data: newRule },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating notification rule:', error)
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
