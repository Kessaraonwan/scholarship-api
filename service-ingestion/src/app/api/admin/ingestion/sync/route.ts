import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

const mockScholarships = [
    {
        name: 'ทุน กยศ. 2567',
        level: 'ปริญญาตรี',
        field: 'ทุกสาขา',
        country: 'ไทย',
        deadline: '2025-06-30',
        amount: 30000,
        currency: 'THB',
        url: 'https://www.studentloan.or.th',
        source: 'กยศ.',
        description: 'ทุนกู้ยืมเพื่อการศึกษา',
    },
    {
        name: 'Chevening Scholarship 2025',
        level: 'ปริญญาโท',
        field: 'ทุกสาขา',
        country: 'UK',
        deadline: '2025-11-05',
        amount: null,
        currency: 'GBP',
        url: 'https://www.chevening.org',
        source: 'Chevening',
        description: 'ทุนรัฐบาลอังกฤษ ครอบคลุมค่าเล่าเรียนและค่าครองชีพ',
    },
]

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
    }

    // verify กับ service-auth
    const verifyRes = await fetch('http://localhost:3001/api/example', {
        headers: { authorization: authHeader }
    })

    if (!verifyRes.ok) {
        return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
    }

    // บันทึก log ว่าเริ่ม running
    const logResult = await pool.query(`
    INSERT INTO ingestion_logs (source, status, started_at)
    VALUES ($1, $2, NOW())
    RETURNING id
  `, ['manual-sync', 'running'])

    const logId = logResult.rows[0].id

    try {
        let countNew = 0
        for (const s of mockScholarships) {
            const exists = await pool.query(
                `SELECT id FROM scholarships WHERE name = $1 AND source = $2`,
                [s.name, s.source]
            )
            if (exists.rows.length === 0) {
                await pool.query(`
          INSERT INTO scholarships
            (name, level, field, country, deadline, amount, currency, url, source, description)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        `, [s.name, s.level, s.field, s.country, s.deadline, s.amount, s.currency, s.url, s.source, s.description])
                countNew++
            }
        }

        await pool.query(`
      UPDATE ingestion_logs
      SET status = 'success', count_new = $1, finished_at = NOW()
      WHERE id = $2
    `, [countNew, logId])

        if (countNew > 0) {
            await fetch('http://localhost:3005/internal/trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Internal-Secret': process.env.INTERNAL_SECRET || '',
                },
                body: JSON.stringify({ newScholarships: mockScholarships }),
            }).catch(() => { })
        }

        return NextResponse.json({ data: { message: 'sync completed', countNew } }, { status: 200 })

    } catch (err) {
        await pool.query(`
      UPDATE ingestion_logs
      SET status = 'error', error_msg = $1, finished_at = NOW()
      WHERE id = $2
    `, [String(err), logId])

        return NextResponse.json({ error: 'Sync failed', code: 500 }, { status: 500 })
    }
}