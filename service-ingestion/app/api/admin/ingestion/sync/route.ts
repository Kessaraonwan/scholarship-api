import { NextRequest, NextResponse } from 'next/server'
import { SyncService } from '../../../../../lib/syncService'

const syncService = new SyncService()

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
    }

    try {
        // Verify with service-auth
        const verifyRes = await fetch(`${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/api/verify-admin`, {
            headers: { authorization: authHeader }
        })

        if (!verifyRes.ok) {
            return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
        }

        // Start sync process
        const { totalNew, results } = await syncService.syncAllSources()

        // Trigger notifications if new scholarships were added
        if (totalNew > 0) {
            try {
                await fetch(`${process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005'}/internal/trigger`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Internal-Secret': process.env.INTERNAL_SECRET || '',
                    },
                    body: JSON.stringify({ newScholarshipsCount: totalNew }),
                })
            } catch (notificationError) {
                console.error('Failed to trigger notifications:', notificationError)
                // Don't fail the sync if notification trigger fails
            }
        }

        return NextResponse.json({
            data: {
                message: 'Sync completed successfully',
                totalNew,
                results
            }
        }, { status: 200 })

    } catch (err) {
        console.error('Error during sync:', err)
        return NextResponse.json({
            error: 'Sync failed',
            code: 500,
            details: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 })
    }
}