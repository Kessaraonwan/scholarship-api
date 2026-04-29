// ใน service-auth/app/api/stats/usage/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. นับคำขอโดยใช้ชื่อตาราง usageLog ตาม Schema
    const totalRequests = await prisma.usageLog.count();

    const requestsToday = await prisma.usageLog.count({
      where: { createdAt: { gte: startOfToday } } // ใช้ createdAt ตาม Schema
    });

    const requestsThisMonth = await prisma.usageLog.count({
      where: { createdAt: { gte: startOfMonth } }
    });

    // 2. คำนวณค่าเฉลี่ย Response Time (Schema แบงค์มีเก็บตัวนี้ด้วย เจ๋งมาก!)
    const avgResponse = await prisma.usageLog.aggregate({
      _avg: { responseTime: true }
    });

    // 3. คำนวณ Error Rate (นับที่ statusCode >= 400)
    const errorCount = await prisma.usageLog.count({
      where: { statusCode: { gte: 400 } }
    });
    const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;

    // 4. จัดอันดับ Endpoint
    const topEndpointsRaw = await prisma.usageLog.groupBy({
      by: ['endpoint'],
      _count: { endpoint: true },
      orderBy: { _count: { endpoint: 'desc' } },
      take: 5,
    });

    return NextResponse.json({
      totalRequests,
      requestsToday,
      requestsThisMonth,
      averageResponseTime: Math.round(avgResponse._avg.responseTime || 0),
      errorRate: parseFloat(errorRate.toFixed(1)),
      topEndpoints: topEndpointsRaw.map(item => ({
        endpoint: item.endpoint,
        count: item._count.endpoint
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Database Connection Error' }, { status: 500 });
  }
}