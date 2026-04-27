import { mockScholarships } from '../../../../data/mockData.js'

export async function GET() {
  const today = new Date()
  const in30days = new Date()
  in30days.setDate(today.getDate() + 30)

  const result = mockScholarships
    .filter(s => {
      const deadline = new Date(s.deadline)
      return deadline >= today && deadline <= in30days
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  return Response.json({
    data: result,
    meta: { total: result.length, page: 1, limit: result.length }
  })
}