import { NextRequest, NextResponse } from 'next/server'
import { SyncService } from '../../../../../lib/syncService'

const syncService = new SyncService()

export async function POST(req: NextRequest) {
    try {
        console.log('--- Starting Sync Process ---')

        const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://service-auth:3001'
        const coreServiceUrl = process.env.CORE_SERVICE_URL || 'http://service-core:3003'
        const internalSecret = process.env.INTERNAL_SECRET

        if (!internalSecret) {
            return NextResponse.json({ error: 'INTERNAL_SECRET is not configured', code: 500 }, { status: 500 })
        }

        // (A) Admin panel call: verify admin cookie via service-auth
        // (B) Internal call: allow if X-Internal-Secret matches (e.g. scheduled jobs)
        const gotInternal = req.headers.get('x-internal-secret')
        if (gotInternal !== internalSecret) {
            const verifyAdmin = await fetch(`${authServiceUrl}/api/verify-admin`, {
                method: 'GET',
                headers: { cookie: req.headers.get('cookie') || '' },
                cache: 'no-store',
            })

            if (!verifyAdmin.ok) {
                return NextResponse.json({ error: 'Forbidden', code: 403 }, { status: 403 })
            }
        }

        const syncResult = await syncService.syncAllSources()

        // Push scraped scholarships to core as a batch (core will upsert + trigger notification)
        const pushResponse = await fetch(`${coreServiceUrl}/api/scholarships/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Internal-Secret': internalSecret,
            },
            body: JSON.stringify({ scholarships: syncResult.scholarships }),
        })

        if (!pushResponse.ok) {
            const details = await pushResponse.text().catch(() => '')
            return NextResponse.json(
                { error: 'Failed to push scholarships to core', code: 502, details },
                { status: 502 }
            )
        }

        // 3. ตอบกลับหน้าบ้านมิกให้ปุ่ม Sync เปลี่ยนสถานะ
        return NextResponse.json({
            data: {
                message: 'Sync completed successfully',
                totalNew: syncResult.totalNew,
                results: syncResult.results
            }
        }, { status: 200 })

    } catch (err) {
        console.error('Fatal Error during sync:', err)
        return NextResponse.json({
            error: 'Sync failed',
            code: 500,
            details: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 })
    }
}