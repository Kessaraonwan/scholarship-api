import { NextRequest, NextResponse } from 'next/server'
import { requireApiKey, logApiUsage } from '@/lib/api-key-middleware'

/**
 * ตัวอย่าง endpoint ที่ใช้ API key verification
 * 
 * ทดสอบด้วย:
 * curl -X GET http://localhost:3002/api/example \
 *   -H "Authorization: Bearer sk_xxxxx"
 * 
 * หรือใน JavaScript:
 * fetch('/api/example', {
 *   headers: {
 *     'Authorization': `Bearer ${apiKey}`
 *   }
 * })
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // ตรวจสอบ API key
    const { user, error } = await requireApiKey(request)
    
    if (error) {
      return error
    }

    // ตอนนี้มี user ที่พร้อมใช้งาน
    console.log(`✅ API key verified for user: ${user.userName}`)

    // ตัวอย่างข้อมูลที่ส่งกลับ
    const responseData = {
      message: 'สำเร็จ - API key verified',
      data: {
        userId: user.userId,
        userEmail: user.userEmail,
        userName: user.userName,
        apiKeyName: user.keyName,
        timestamp: new Date().toISOString(),
      },
    }

    const response = NextResponse.json(responseData)

    // บันทึก usage (ทำแบบ async, ไม่รอ)
    const responseTime = Date.now() - startTime
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    
    logApiUsage(
      user.userId,
      user.apiKeyId,
      '/api/example',
      'GET',
      200,
      responseTime,
      ipAddress
    ).catch(err => console.error('Error logging usage:', err))

    return response
  } catch (error) {
    console.error('API error:', error)

    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผลคำขอ' },
      { status: 500 }
    )
  }
}

/**
 * ตัวอย่าง POST endpoint
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { user, error } = await requireApiKey(request)
    
    if (error) {
      return error
    }

    const body = await request.json()

    console.log(`📝 POST request from: ${user.userName}`)
    console.log(`📦 Payload:`, body)

    const response = NextResponse.json({
      message: 'รับข้อมูลแล้ว',
      received: body,
      userId: user.userId,
    })

    // บันทึก usage
    const responseTime = Date.now() - startTime
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    
    logApiUsage(
      user.userId,
      user.apiKeyId,
      '/api/example',
      'POST',
      200,
      responseTime,
      ipAddress
    ).catch(err => console.error('Error logging usage:', err))

    return response
  } catch (error) {
    console.error('API error:', error)

    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผลคำขอ' },
      { status: 500 }
    )
  }
}
