import { Response } from "next/server"

// Mock data (shared with parent route.ts - in real app use database)
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

// GET /api/notifications/[id] - Get specific rule
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const rule = notificationRules.find(r => r.id === id)

  if (!rule) {
    return Response.json(
      { error: "Notification rule not found" },
      { status: 404 }
    )
  }

  return Response.json({ data: rule })
}

// PUT /api/notifications/[id] - Update rule
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const ruleIndex = notificationRules.findIndex(r => r.id === id)
    
    if (ruleIndex === -1) {
      return Response.json(
        { error: "Notification rule not found" },
        { status: 404 }
      )
    }

    // Update only allowed fields
    const updatedRule = {
      ...notificationRules[ruleIndex],
      name: body.name || notificationRules[ruleIndex].name,
      triggers: body.triggers || notificationRules[ruleIndex].triggers,
      channels: body.channels || notificationRules[ruleIndex].channels,
      active: body.active !== undefined ? body.active : notificationRules[ruleIndex].active,
      updatedAt: new Date().toISOString(),
    }

    notificationRules[ruleIndex] = updatedRule

    return Response.json({ data: updatedRule })
  } catch (error) {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}

// DELETE /api/notifications/[id] - Delete rule
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const ruleIndex = notificationRules.findIndex(r => r.id === id)

  if (ruleIndex === -1) {
    return Response.json(
      { error: "Notification rule not found" },
      { status: 404 }
    )
  }

  const deletedRule = notificationRules[ruleIndex]
  notificationRules.splice(ruleIndex, 1)

  return Response.json({ data: deletedRule })
}
