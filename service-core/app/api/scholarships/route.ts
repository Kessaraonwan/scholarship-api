import { NextRequest, NextResponse } from 'next/server'
import { scholarships } from '@/lib/scholarships-data'

// Optional: สร้าง API route ที่ต้องการ auth
// สำหรับ public read: ไม่ต้องใส่ auth
// สำหรับ private: ใส่ header "Authorization: Bearer <api-key>"

export async function GET(request: NextRequest) {
  // Optional: ตรวจสอบ auth (ถ้ามี header)
  const authHeader = request.headers.get('authorization')
  
  // ถ้ามี auth header ให้ตรวจสอบ (optional)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
      const verifyResponse = await fetch(`${authServiceUrl}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
      })
      
      if (!verifyResponse.ok) {
        return NextResponse.json(
          { error: 'API key ไม่ถูกต้อง' },
          { status: 401 }
        )
      }
    } catch (error) {
      // Dev mode: ถ้า auth service ไม่พร้อม ยังให้ผ่านได้
      console.warn('Auth service unavailable, allowing request')
    }
  }

  const searchParams = request.nextUrl.searchParams
  
  const keyword = searchParams.get('keyword') || ''
  const level = searchParams.get('level') || 'ทุกระดับ'
  const field = searchParams.get('field') || 'ทุกสาขา'
  const country = searchParams.get('country') || 'ทุกประเทศ'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '6')

  // Filter scholarships
  let filtered = scholarships.filter(scholarship => {
    // Search by keyword (name or description)
    const matchKeyword = keyword === '' || 
      scholarship.name.toLowerCase().includes(keyword.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    
    // Filter by level
    const matchLevel = level === 'ทุกระดับ' || scholarship.level === level
    
    // Filter by field
    const matchField = field === 'ทุกสาขา' || scholarship.field === field
    
    // Filter by country
    const matchCountry = country === 'ทุกประเทศ' || scholarship.country === country
    
    return matchKeyword && matchLevel && matchField && matchCountry
  })

  // Calculate pagination
  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = filtered.slice(startIndex, endIndex)

  return NextResponse.json({
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: limit
    }
  })
}