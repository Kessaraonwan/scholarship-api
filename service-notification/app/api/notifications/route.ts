// Mock data - ในอนาคตจะเชื่อม database
const notificationRules: any[] = [
  {
    id: "rule-1",
    userId: "user-123",
    name: "IT Scholarships",
    triggers: {
      scholarshipLevel: "ปริญญาตรี",
      scholarshipField: "IT",
      country: "ไทย",
    },
    channels: ["email", "webhook"],
    active: true,
    createdAt: new Date().toISOString(),
  },
]

// GET /api/notifications - List all rules for user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  
  if (!userId) {
    return Response.json(
      { error: "userId query parameter is required" },
      { status: 400 }
    )
  }

  // Filter rules by userId
  const userRules = notificationRules.filter(r => r.userId === userId)
  const total = userRules.length

  return Response.json({
    data: userRules,
    meta: { total },
  })
}

// POST /api/notifications - Create new rule
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, name, triggers, channels } = body

    if (!userId || !name || !triggers) {
      return Response.json(
        { error: "Missing required fields: userId, name, triggers" },
        { status: 400 }
      )
    }

    const newRule = {
      id: `rule-${Date.now()}`,
      userId,
      name,
      triggers,
      channels: channels || ["email"],
      active: true,
      createdAt: new Date().toISOString(),
    }

    notificationRules.push(newRule)

    return Response.json(
      { data: newRule },
      { status: 201 }
    )
  } catch (error) {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
