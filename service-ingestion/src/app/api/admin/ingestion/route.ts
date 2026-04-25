import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
  }

  return NextResponse.json({ data: null })

  try {
    // verify กับ service-auth
    const verifyRes = await fetch('http://localhost:3001/api/example', {
      headers: { authorization: authHeader }
    })

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
    }

    // query DB
    const result = await pool.query(`
      SELECT * FROM ingestion_logs
      ORDER BY started_at DESC
      LIMIT 1
    `)

    return NextResponse.json({ data: result.rows[0] || null })

  } catch (err) {
    return NextResponse.json({ error: 'Server Error', code: 500 }, { status: 500 })
  }
}