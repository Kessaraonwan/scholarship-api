import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyApiKey } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // 1. ดึง API Key จาก Header
  const apiKey = request.headers.get('x-api-key')

  // 2. ถ้าไม่มี API Key ตอบ 401 Unauthorized
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing x-api-key header' },
      { status: 401 }
    )
  }

  // 3. ยิง Fetch ไปถาม Service Auth เพื่อตรวจสอบคีย์
  const verificationResult = await verifyApiKey(apiKey)

  // 4. ถ้า valid: false หรือไม่มีคีย์แนบมา -> ตอบกลับ 401 Unauthorized
  if (!verificationResult.valid) {
    return NextResponse.json(
      { error: verificationResult.error || 'Invalid API key' },
      { status: 401 }
    )
  }

  // 5. ถ้า valid: true -> ดึงข้อมูลทุนส่งกลับไปให้ลูกค้า
  const searchParams = request.nextUrl.searchParams
  
  const keyword = searchParams.get('keyword') || ''
  const level = searchParams.get('level') || ''
  const field = searchParams.get('field') || ''
  const country = searchParams.get('country') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  // Build where clause for filtering
  const where: any = {}
  
  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
    ]
  }
  
  if (level) {
    where.level = level
  }
  
  if (field) {
    where.field = field
  }
  
  if (country) {
    where.country = country
  }

  // Get total count
  const totalItems = await prisma.scholarship.count({ where })
  
  // Get paginated data
  const scholarships = await prisma.scholarship.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
  })

  const totalPages = Math.ceil(totalItems / limit)

  return NextResponse.json({
    data: scholarships,
    meta: {
      total: totalItems,
      page,
      limit,
      totalPages
    }
  })
}