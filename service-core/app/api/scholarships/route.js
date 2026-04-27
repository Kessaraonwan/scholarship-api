import { mockScholarships } from '../../../data/mockData.js'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const field   = searchParams.get('field')
  const level   = searchParams.get('level')
  const country = searchParams.get('country')
  const page    = Number(searchParams.get('page') || 1)
  const limit   = Number(searchParams.get('limit') || 20)

  let result = [...mockScholarships]

  if (field)   result = result.filter(s => s.field === field)
  if (level)   result = result.filter(s => s.level === level)
  if (country) result = result.filter(s => s.country === country)

  const start = (page - 1) * limit
  const paginated = result.slice(start, start + limit)

  return Response.json({
    data: paginated,
    meta: { total: result.length, page, limit }
  })
}