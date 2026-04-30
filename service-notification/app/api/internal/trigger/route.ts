import { prisma } from '@/lib/prisma'

function matchesRule(scholarship: any, rule: any): boolean {
  const triggers = rule.triggers as any

  if (triggers.scholarshipLevel && triggers.scholarshipLevel !== scholarship.level && triggers.scholarshipLevel !== 'ทุกระดับ') {
    return false
  }
  if (triggers.scholarshipField && triggers.scholarshipField !== scholarship.field && triggers.scholarshipField !== 'ทุกสาขา') {
    return false
  }
  if (triggers.country && triggers.country !== scholarship.country && triggers.country !== 'ทุกประเทศ') {
    return false
  }

  return true
}

async function deliverWebhook(url: string, payload: any, retries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      })

      if (res.ok) {
        console.log(`✅ Webhook delivered to ${url} (attempt ${attempt})`)
        return true
      }

      console.warn(`⚠️ Webhook failed (attempt ${attempt}/${retries}): ${res.status}`)
    } catch (error) {
      console.warn(`⚠️ Webhook error (attempt ${attempt}/${retries}):`, error)
    }

    // รอก่อน retry: 1s, 2s, 4s
    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  console.error(`❌ Webhook failed after ${retries} attempts: ${url}`)
  return false
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { scholarship } = body

    if (!scholarship || !scholarship.id) {
      return Response.json(
        { error: 'Missing scholarship data' },
        { status: 400 }
      )
    }

    const rules = await prisma.notificationRule.findMany({
      where: { active: true },
    })

    const matchingRules = rules.filter(rule => matchesRule(scholarship, rule))
    const sentNotifications = []

    for (const rule of matchingRules) {
      const results: any = { ruleId: rule.id, userId: rule.userId, channels: {} }

      for (const channel of rule.channels) {
        if (channel === 'email') {
          // TODO: เชื่อม SMTP จริง
          console.log(`📧 Email sent to user ${rule.userId} about ${scholarship.name}`)
          results.channels.email = 'sent'
        } else if (channel === 'webhook') {
          // ดึง webhook URLs ของ user นี้
          const webhooks = await prisma.webhook.findMany({
            where: {
              userId: rule.userId,
              active: true,
              events: { has: 'notification.sent' },
            },
          })

          for (const webhook of webhooks) {
            const payload = {
              event: 'notification.sent',
              scholarship: {
                id: scholarship.id,
                name: scholarship.name,
                level: scholarship.level,
                field: scholarship.field,
                country: scholarship.country,
                deadline: scholarship.deadline,
                url: scholarship.url,
              },
              timestamp: new Date().toISOString(),
            }

            const delivered = await deliverWebhook(webhook.url, payload)
            results.channels.webhook = delivered ? 'delivered' : 'failed'
          }
        }
      }

      sentNotifications.push(results)
    }

    return Response.json({
      data: {
        scholarshipId: scholarship.id,
        matchedRules: matchingRules.length,
        sentNotifications,
      },
    })
  } catch (error) {
    console.error('Error in notification trigger:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}