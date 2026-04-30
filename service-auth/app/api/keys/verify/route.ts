import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json()

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        key: key,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true, // ลบ tier: true ออกจากตรงนี้
          },
        },
      },
    })

    if (!apiKey || !apiKey.user.isActive) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: apiKey.user.id,
        email: apiKey.user.email,
        role: apiKey.user.role, // ลบ tier: apiKey.user.tier ออกจากตรงนี้
      },
    })
  } catch (error) {
    console.error('Verify Key Error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}