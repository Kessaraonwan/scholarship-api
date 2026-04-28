import { NextResponse } from 'next/server';
import { SERVICE_CONFIG } from '@/lib/config';

const REQUEST_TIMEOUT_MS = 5000;

type ServiceState = 'online' | 'unavailable';

async function probeService(baseUrl: string, probePath: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const probeUrl = `${baseUrl}${probePath}`;
  const startedAt = Date.now();

  try {
    const response = await fetch(probeUrl, {
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
    });

    const responseTime = Date.now() - startedAt;
    const status: ServiceState = response.status >= 500 ? 'unavailable' : 'online';

    return {
      status,
      responseTime,
      message: status === 'online' ? `Reachable (${response.status})` : `HTTP ${response.status}`,
      probeUrl,
    };
  } catch (error) {
    const responseTime = Date.now() - startedAt;
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? `Timed out after ${REQUEST_TIMEOUT_MS}ms`
        : error instanceof Error
          ? error.message
          : 'Connection failed';

    return {
      status: 'unavailable' as const,
      responseTime,
      message,
      probeUrl,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const results = await Promise.all(
    SERVICE_CONFIG.map(async (service) => {
      const probe = await probeService(service.baseUrl, service.probePath);

      return {
        key: service.key,
        name: service.name,
        port: service.port,
        baseUrl: service.baseUrl,
        docsUrl: `${service.baseUrl}${service.docsPath}`,
        owner: service.owner,
        description: service.description,
        ...probe,
      };
    })
  );

  return NextResponse.json(
    {
      checkedAt: new Date().toISOString(),
      services: results,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
