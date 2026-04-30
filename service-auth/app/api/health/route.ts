// GET /api/health - Health check endpoint
export async function GET(request: Request) {
  return Response.json({
    service: "auth",
    status: "ok",
    timestamp: new Date().toISOString(),
    port: 3001,
  })
}