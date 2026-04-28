import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('accessToken')?.value
    const decoded = await verifyJWT(token)

    // สมมติว่าเช็คจาก Role ใน Database หรือเช็คจาก Email
    const isAdmin = decoded?.role === 'ADMIN' // หรือเงื่อนไขที่แบงค์ตั้งไว้

    return NextResponse.json({ isAdmin: !!isAdmin })
  } catch (error) {
    return NextResponse.json({ isAdmin: false })
  }
}