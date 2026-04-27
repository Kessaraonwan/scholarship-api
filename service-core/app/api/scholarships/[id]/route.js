import { mockScholarships } from '../../../../data/mockData.js'

export async function GET(request, { params }) {
  const scholarship = mockScholarships.find(s => s.id === params.id)
  if (!scholarship) {
    return Response.json({ error: 'ไม่พบทุนนี้', code: 404 }, { status: 404 })
  }
  return Response.json({ data: scholarship })
}