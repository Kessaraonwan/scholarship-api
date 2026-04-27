import { NextResponse } from 'next/server'
import scholarships from '../../../data/mockData'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const keyword = searchParams.get('keyword') || ''
    const country = searchParams.get('country') || ''
    const level = searchParams.get('level') || ''

    let result = [...scholarships]

    if (keyword) {
      result = result.filter(s =>
        s.name.includes(keyword) || s.description.includes(keyword)
      )
    }
    if (country) {
      result = result.filter(s => s.country === country)
    }
    if (level) {
      result = result.filter(s => s.level === level)
    }

    const total = result.length
    const start = (page - 1) * limit
    const paginated = result.slice(start, start + limit)

    return NextResponse.json({
      data: paginated,
      meta: { total, page, limit }
    })

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    )
  }
}