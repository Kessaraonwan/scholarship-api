import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'

export interface AuthenticatedRequest {
  userId: string
  apiKeyId: string
  key: string
}

/**
 * ตรวจสอบ API key จาก Authorization header (Mock version for demo)
 * ใช้ในรูป: Authorization: Bearer sk_xxxxx
 * 
 * @returns user info หรือ error response
 */
export async function requireApiKey(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return {
        error: NextResponse.json(
          { error: 'ไม่พบ API key - ส่ง Authorization header พร้อม Bearer token' },
          { status: 401 }
        ),
        user: null,
      }
    }

    // แยก "Bearer sk_xxxxx"
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return {
        error: NextResponse.json(
          { error: 'รูปแบบ Authorization header ไม่ถูกต้อง - ใช้ "Bearer sk_xxxxx"' },
          { status: 401 }
        ),
        user: null,
      }
    }

    const key = parts[1]

    // For demo purposes, accept any key that starts with 'sk_'
    if (key.startsWith('sk_')) {
      return {
        error: null,
        user: {
          userId: 'demo-user-123',
          apiKeyId: 'demo-key-123',
          key: key,
          keyName: 'Demo API Key',
          userEmail: 'demo@example.com',
          userName: 'Demo User',
        },
      }
    } else {
      return {
        error: NextResponse.json(
          { error: 'API key ไม่ถูกต้อง' },
          { status: 401 }
        ),
        user: null,
      }
    }
  } catch (error) {
    console.error('API key verification error:', error)
    return {
      error: NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการตรวจสอบ API key' },
        { status: 500 }
      ),
      user: null,
    }
  }
}

/**
 * บันทึกการใช้งาน API
 */
export async function logApiUsage(
  userId: string,
  apiKeyId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
  ipAddress: string
) {
  try {
    // For demo purposes, just log to console instead of database
    console.log(`API Usage: ${method} ${endpoint} - User: ${userId} - Key: ${apiKeyId} - Status: ${statusCode} - Time: ${responseTime}ms - IP: ${ipAddress}`);

    // Uncomment below for real database logging when database is available
    // await prisma.usageLog.create({
    //   data: {
    //     userId,
    //     apiKeyId,
    //     endpoint,
    //     method,
    //     statusCode,
    //     responseTime,
    //     ipAddress,
    //   },
    // })
  } catch (error) {
    console.error('Error logging API usage:', error)
    // ไม่ return error เพราะเป็นการบันทึก logging เท่านั้น
  }
}
