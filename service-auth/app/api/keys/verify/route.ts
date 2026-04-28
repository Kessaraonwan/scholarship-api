import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json()
    
    // ค้นหา API Key ใน DB ของแบงค์เอง (auth_db)
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        key: key,
        isActive: true,
      },
    })

    if (!apiKey) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    // ถ้าเจอ ให้ตอบอีฟกลับไปว่า "กุญแจนี้ของจริง!"
    return NextResponse.json({ valid: true, ownerId: apiKey.userId })
  } catch (error) {
    console.error('Verify Key Error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}