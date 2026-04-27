import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/middleware'
import { createApiKey, getUserApiKeys } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createKeySchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ API Key'),
})

// GET /api/keys - ดู API keys ของผู้ใช้ (Mock for demo)
export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return mock API keys
    const mockApiKeys = [
      {
        id: 'demo-key-1',
        name: 'Production App',
        key: 'sk_live_demo123456789',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastUsedAt: new Date().toISOString(),
      },
      {
        id: 'demo-key-2',
        name: 'Test Environment',
        key: 'sk_test_demo987654321',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        lastUsedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      }
    ];

    return NextResponse.json({ apiKeys: mockApiKeys });
  } catch (error) {
    console.error('Get API keys error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึง API keys' },
      { status: 500 }
    )
  }
}

// POST /api/keys - สร้าง API key ใหม่ (Mock for demo)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = createKeySchema.parse(body)

    // Generate mock API key
    const mockApiKey = {
      id: `demo-key-${Date.now()}`,
      name: name,
      key: `sk_demo_${Math.random().toString(36).substring(2, 15)}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
    };

    return NextResponse.json({
      message: 'สร้าง API key สำเร็จ',
      apiKey: mockApiKey,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create API key error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้าง API key' },
      { status: 500 }
    )
  }
}

// DELETE /api/keys/[id] - ลบ API key (Mock for demo)
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const keyId = url.searchParams.get('id')

    if (!keyId) {
      return NextResponse.json(
        { error: 'กรุณาระบุ API key ID' },
        { status: 400 }
      )
    }

    // For demo purposes, just return success
    return NextResponse.json({
      message: 'ลบ API key สำเร็จ',
    })
  } catch (error) {
    console.error('Delete API key error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบ API key' },
      { status: 500 }
    )
  }
}