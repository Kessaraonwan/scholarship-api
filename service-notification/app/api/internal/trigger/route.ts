import { prisma } from '@/lib/prisma'

// Helper: Check if scholarship matches rule
function matchesRule(scholarship: any, rule: any): boolean {
  const triggers = (rule.triggers || {}) as Record<string, string>
  
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

async function sendWebhook(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`Webhook returned ${response.status}`)
  }
}

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-internal-secret')
    if (!process.env.INTERNAL_SECRET || secret !== process.env.INTERNAL_SECRET) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const scholarships = Array.isArray(body?.newScholarships)
      ? body.newScholarships
      : body?.scholarship
        ? [body.scholarship]
        : []

    if (scholarships.length === 0) {
      return Response.json(
        { error: "Missing scholarship data (send scholarship or newScholarships[])" },
        { status: 400 }
      )
    }

    const activeRules = await prisma.notificationRule.findMany({
      where: { active: true },
    })

    let delivered = 0
    const events: Array<{ scholarshipId: string; matchedRules: number }> = []

    for (const scholarship of scholarships) {
      if (!scholarship?.id) continue
      const matchingRules = activeRules.filter((rule: (typeof activeRules)[number]) => matchesRule(scholarship, rule))
      events.push({ scholarshipId: scholarship.id, matchedRules: matchingRules.length })

      for (const rule of matchingRules) {
        const channels = Array.isArray(rule.channels) ? (rule.channels as string[]) : ['email']
        for (const channel of channels) {
          let status = 'delivered'
          let errorMessage: string | null = null

          if (channel === 'webhook') {
            const hooks = await prisma.webhook.findMany({
              where: {
                userId: rule.userId,
                active: true,
              },
            })
            for (const hook of hooks) {
              const eventsAllowed = Array.isArray(hook.events) ? (hook.events as string[]) : []
              if (!eventsAllowed.includes('notification.sent') && !eventsAllowed.includes('notification.delivered')) {
                continue
              }
              try {
                await sendWebhook(hook.url, {
                  event: 'notification.sent',
                  userId: rule.userId,
                  scholarship,
                  ruleId: rule.id,
                  sentAt: new Date().toISOString(),
                })
              } catch (error) {
                status = 'failed'
                errorMessage = error instanceof Error ? error.message : 'Webhook delivery failed'
              }
            }
          } else if (channel === 'email') {
            // Placeholder for SMTP integration; mark as delivered and keep audit log in DB.
            status = 'delivered'
          }

          await prisma.notificationLog.create({
            data: {
              ruleId: rule.id,
              userId: rule.userId,
              scholarshipId: scholarship.id,
              scholarshipName: scholarship.name || null,
              channel,
              status,
              deliveredAt: status === 'delivered' ? new Date() : null,
              errorMessage,
            },
          })
          delivered += 1
        }
      }
    }

    return Response.json({
      data: {
        processedScholarships: scholarships.length,
        delivered,
        events,
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
