import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
    }
    return NextResponse.json({ data: [], meta: { total: 0, page: 1, limit: 20 } })

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    try {
        // verify กับ service-auth
        const verifyRes = await fetch('http://localhost:3001/api/example', {
            headers: { authorization: authHeader }
        })

        if (!verifyRes.ok) {
            return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
        }

        const [logs, count] = await Promise.all([
            pool.query(`
        SELECT * FROM ingestion_logs
        ORDER BY started_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]),
            pool.query(`SELECT COUNT(*) FROM ingestion_logs`)
        ])

        return NextResponse.json({
            data: logs.rows,
            meta: {
                total: parseInt(count.rows[0].count),
                page,
                limit,
            }
        })

    } catch (err) {
        return NextResponse.json({ error: 'Server Error', code: 500 }, { status: 500 })
    }
}