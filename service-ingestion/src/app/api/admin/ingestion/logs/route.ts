import { NextRequest, NextResponse } from 'next/server'
import { IngestionService } from '@/lib/ingestionService'

const ingestionService = new IngestionService()

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    try {
        // Verify with service-auth
        const verifyRes = await fetch(`${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/api/verify-admin`, {
            headers: { authorization: authHeader }
        })

        if (!verifyRes.ok) {
            return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
        }

        const { logs, total } = await ingestionService.getLogs(page, limit)

        return NextResponse.json({
            data: logs,
            meta: {
                total,
                page,
                limit,
            }
        })

    } catch (err) {
        console.error('Error fetching ingestion logs:', err)
        return NextResponse.json({ error: 'Server Error', code: 500 }, { status: 500 })
    }
}