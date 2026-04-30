// GET /api/health - Health check endpoint
export async function GET(request: Request) {
  return Response.json({
    service: "ingestion",
    status: "ok",
    timestamp: new Date().toISOString(),
    port: 3002,
  })
}