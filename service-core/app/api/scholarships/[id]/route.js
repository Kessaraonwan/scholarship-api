import { NextResponse } from 'next/server'
import scholarships from '../../../../data/mockData'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const scholarship = scholarships.find(s => s.id === id)

    if (!scholarship) {
      return NextResponse.json(
        { error: 'Scholarship not found', code: 404 },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: scholarship,
      meta: {}
    })

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    )
  }
}