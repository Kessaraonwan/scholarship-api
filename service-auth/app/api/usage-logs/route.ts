import { NextRequest, NextResponse } from 'next/server'
import { requireApiKey } from '@/lib/api-key-middleware'
import { prisma } from '@/lib/prisma'

/**
 * ดู Usage logs ของผู้ใช้ปัจจุบัน
 * 
 * ทดสอบด้วย:
 * curl -X GET http://localhost:3002/api/usage-logs \
 *   -H "Authorization: Bearer sk_xxxxx"
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireApiKey(request)

    if (error) {
      return error
    }

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const days = parseInt(url.searchParams.get('days') || '7')

    // Mock usage logs for demo
    const mockLogs = [
      {
        id: 'log-1',
        endpoint: '/api/example',
        method: 'GET',
        statusCode: 200,
        responseTime: 45,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'log-2',
        endpoint: '/api/example',
        method: 'POST',
        statusCode: 200,
        responseTime: 67,
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'log-3',
        endpoint: '/api/keys',
        method: 'GET',
        statusCode: 200,
        responseTime: 23,
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    // Mock stats
    const stats = {
      totalRequests: 4250,
      successRequests: 4180,
      errorRequests: 70,
      averageResponseTime: 45,
      endpoints: {
        '/api/example': 2100,
        '/api/keys': 1500,
        '/api/usage-logs': 650,
      },
      methods: {
        'GET': 3800,
        'POST': 450,
      },
      statusCodes: {
        200: 4180,
        401: 50,
        500: 20,
      },
    };

    return NextResponse.json({
      userId: user.userId,
      userName: user.userName,
      stats,
      logs: mockLogs.slice(0, limit).map(log => ({
        id: log.id,
        endpoint: log.endpoint,
        method: log.method,
        statusCode: log.statusCode,
        responseTime: `${log.responseTime}ms`,
        ipAddress: log.ipAddress,
        timestamp: log.timestamp,
      })),
      pagination: {
        limit,
        returned: Math.min(mockLogs.length, limit),
        period: `${days} วันที่ผ่านมา`,
      },
    })
  } catch (error) {
    console.error('Get usage logs error:', error)

    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึง usage logs' },
      { status: 500 }
    )
  }
}
