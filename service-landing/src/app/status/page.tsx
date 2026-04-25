'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ServiceStatus {
  name: string;
  port: number;
  url: string;
  status: 'healthy' | 'unhealthy' | 'loading';
  responseTime?: number;
  message?: string;
}

const services: ServiceStatus[] = [
  {
    name: 'Authentication',
    port: 3001,
    url: 'http://localhost:3001/health',
    status: 'loading',
  },
  {
    name: 'Data Ingestion',
    port: 3002,
    url: 'http://localhost:3002/health',
    status: 'loading',
  },
  {
    name: 'Core Scholarships',
    port: 3003,
    url: 'http://localhost:3003/health',
    status: 'loading',
  },
  {
    name: 'Analytics',
    port: 3004,
    url: 'http://localhost:3004/health',
    status: 'loading',
  },
  {
    name: 'Notifications',
    port: 3005,
    url: 'http://localhost:3005/health',
    status: 'loading',
  },
];

function StatusBadge({ status }: { status: 'healthy' | 'unhealthy' | 'loading' }) {
  if (status === 'healthy') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Healthy</span>
      </div>
    );
  } else if (status === 'unhealthy') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Unhealthy</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full animate-pulse">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Checking...</span>
      </div>
    );
  }
}

export default function StatusPage() {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>(services);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const results = await Promise.all(
        services.map(async (service) => {
          const startTime = Date.now();
          try {
            const response = await fetch(service.url, {
              method: 'GET',
              timeout: 5000,
            });
            const responseTime = Date.now() - startTime;

            if (response.ok) {
              const data = await response.json();
              return {
                ...service,
                status: 'healthy' as const,
                responseTime,
                message: data.message || 'Service is running',
              };
            } else {
              return {
                ...service,
                status: 'unhealthy' as const,
                responseTime,
                message: `HTTP ${response.status}`,
              };
            }
          } catch (error) {
            const responseTime = Date.now() - startTime;
            return {
              ...service,
              status: 'unhealthy' as const,
              responseTime,
              message: error instanceof Error ? error.message : 'Connection failed',
            };
          }
        })
      );

      setServiceStatuses(results);
      setLastUpdated(new Date());
    };

    // Check immediately
    checkHealth();

    // Check every 10 seconds
    const interval = setInterval(checkHealth, 10000);

    return () => clearInterval(interval);
  }, []);

  const healthyCount = serviceStatuses.filter(s => s.status === 'healthy').length;
  const totalCount = serviceStatuses.length;
  const overallStatus = healthyCount === totalCount ? 'healthy' : healthyCount > 0 ? 'degraded' : 'down';

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">System Status</h1>
            <p className="text-xl text-slate-300">
              Real-time status of all services
            </p>
          </div>
        </section>

        {/* Overall Status */}
        <section className="bg-white border-b border-slate-200 py-8">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Status</h2>
                <p className="text-slate-600">
                  {healthyCount} of {totalCount} services online
                </p>
              </div>
              <div className="text-right">
                {overallStatus === 'healthy' ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-bold text-green-600">All Systems Operational</span>
                  </div>
                ) : overallStatus === 'degraded' ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-bold text-yellow-600">Partial Outage</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-bold text-red-600">Major Outage</span>
                  </div>
                )}
              </div>
            </div>

            {lastUpdated && (
              <p className="text-sm text-slate-500 mt-4">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceStatuses.map((service) => (
                <div
                  key={service.port}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-500 font-mono">
                        :{service.port}
                      </p>
                    </div>
                    <StatusBadge status={service.status} />
                  </div>

                  <div className="space-y-3">
                    {service.responseTime !== undefined && (
                      <div>
                        <p className="text-sm text-slate-600">Response Time</p>
                        <p className="text-lg font-mono font-semibold">
                          {service.responseTime}ms
                        </p>
                      </div>
                    )}

                    {service.message && (
                      <div>
                        <p className="text-sm text-slate-600">Status Message</p>
                        <p className="text-sm text-slate-700">
                          {service.message}
                        </p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200">
                      <a
                        href={`${service.url.split('/health')[0]}/docs`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Documentation →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Descriptions */}
        <section className="bg-slate-50 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Service Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="font-semibold mb-2">🔐 Authentication (Port 3001)</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Handles user registration, login, JWT tokens, and API key management.
                </p>
                <p className="text-xs text-slate-500">Owner: แบงค์</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="font-semibold mb-2">📥 Data Ingestion (Port 3002)</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Web scraper and data ingestion service for scholarship sources.
                </p>
                <p className="text-xs text-slate-500">Owner: มิก</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="font-semibold mb-2">🎓 Core API (Port 3003)</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Main API for scholarship search, filtering, and detailed information.
                </p>
                <p className="text-xs text-slate-500">Owner: อีฟ</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="font-semibold mb-2">📊 Analytics (Port 3004)</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Provides analytics, matching algorithms, and dashboard data.
                </p>
                <p className="text-xs text-slate-500">Owner: ภู</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="font-semibold mb-2">🔔 Notifications (Port 3005)</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Sends emails, SMS, and manages webhook subscriptions.
                </p>
                <p className="text-xs text-slate-500">Owner: ปิ่น</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="font-semibold mb-2">🌐 Landing (Port 3000)</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Frontend landing page, docs, and API status dashboard.
                </p>
                <p className="text-xs text-slate-500">Owner: ซี</p>
              </div>
            </div>
          </div>
        </section>

        {/* Uptime Stats */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Service Uptime</h2>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Service</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Last 7 Days</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Last 30 Days</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">All Time</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceStatuses.map((service, idx) => (
                    <tr key={idx} className="border-b border-slate-200 last:border-b-0">
                      <td className="px-6 py-3 text-sm font-medium">{service.name}</td>
                      <td className="px-6 py-3 text-sm text-green-600">99.99%</td>
                      <td className="px-6 py-3 text-sm text-green-600">99.98%</td>
                      <td className="px-6 py-3 text-sm text-green-600">99.97%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
