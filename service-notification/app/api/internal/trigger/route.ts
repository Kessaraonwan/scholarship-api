// POST /api/internal/trigger - Internal endpoint called by other services
// This is called when service-core adds a new scholarship
// It will check all notification rules and send notifications to matching users

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
  },
]

const notificationLogs: any[] = []

// Helper: Check if scholarship matches rule
function matchesRule(scholarship: any, rule: any): boolean {
  const { triggers } = rule
  
  if (triggers.scholarshipLevel && triggers.scholarshipLevel !== scholarship.level && triggers.scholarshipLevel !== "ทุกระดับ") {
    return false
  }
  
  if (triggers.scholarshipField && triggers.scholarshipField !== scholarship.field && triggers.scholarshipField !== "ทุกสาขา") {
    return false
  }
  
  if (triggers.country && triggers.country !== scholarship.country && triggers.country !== "ทุกประเทศ") {
    return false
  }
  
  return true
}

// Helper: Send notification
async function sendNotification(userId: string, scholarship: any, channels: string[]): Promise<any> {
  const logs = []

  for (const channel of channels) {
    const log = {
      id: `log-${Date.now()}-${Math.random()}`,
      userId,
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      channel,
      status: "sent",
      sentAt: new Date().toISOString(),
    }

    // Mock: simulate sending
    if (channel === "email") {
      console.log(`📧 Email sent to user ${userId} about ${scholarship.name}`)
      log.status = "delivered"
    } else if (channel === "webhook") {
      console.log(`🔗 Webhook triggered for user ${userId}`)
      // TODO: Actually call user's webhook URL
      log.status = "delivered"
    }

    notificationLogs.push(log)
    logs.push(log)
  }

  return logs
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { scholarship } = body

    if (!scholarship || !scholarship.id) {
      return Response.json(
        { error: "Missing scholarship data" },
        { status: 400 }
      )
    }

    // Check all active rules
    const matchingRules = notificationRules.filter(rule => rule.active && matchesRule(scholarship, rule))
    
    const sentNotifications = []

    for (const rule of matchingRules) {
      const logs = await sendNotification(rule.userId, scholarship, rule.channels)
      sentNotifications.push({
        ruleId: rule.id,
        userId: rule.userId,
        logs,
      })
    }

    return Response.json({
      data: {
        scholarshipId: scholarship.id,
        matchedRules: matchingRules.length,
        sentNotifications,
      },
    })
  } catch (error) {
    console.error("Error in notification trigger:", error)
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
