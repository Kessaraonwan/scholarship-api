import { NextResponse } from 'next/server'
import scholarships from '../../../../data/mockData'

export async function GET() {
  try {
    const now = new Date()

    const upcoming = scholarships
      .filter(s => new Date(s.deadline) > now && s.isOpen)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

    return NextResponse.json({
      data: upcoming,
      meta: { total: upcoming.length, page: 1, limit: upcoming.length }
    })

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    )
  }
}