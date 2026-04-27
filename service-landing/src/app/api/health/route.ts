// Health check API route for service-landing
export async function GET() {
  try {
    return Response.json(
      {
        status: 'healthy',
        service: 'service-landing',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
