import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const keyFromBody = typeof body?.key === 'string' ? body.key : null
    const authHeader = req.headers.get('authorization')

    const keyFromBearer =
      authHeader && authHeader.toLowerCase().startsWith('bearer ')
        ? authHeader.slice('bearer '.length).trim()
        : null

    const apiKeyValue = keyFromBody || keyFromBearer

    if (!apiKeyValue) {
      return NextResponse.json(
        { valid: false, error: 'Missing API key (send JSON { key } or Authorization: Bearer <key>)' },
        { status: 400 }
      )
    }
    
    // ค้นหา API Key ใน DB ของแบงค์เอง (auth_db)
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        key: apiKeyValue,
        isActive: true,
      },
      include: {
        user: true,
      },
    })

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'Invalid API key' }, { status: 401 })
    }

    // ถ้าเจอ ให้ตอบอีฟกลับไปว่า "กุญแจนี้ของจริง!"
    return NextResponse.json({
      valid: true,
      user: {
        id: apiKey.userId,
        email: apiKey.user.email,
        role: apiKey.user.role,
        // TODO: implement real plan/tier (free/pro) once billing is wired
        tier: 'free',
      },
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
      },
    })
  } catch (error) {
    console.error('Verify Key Error:', error)
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 })
  }
}