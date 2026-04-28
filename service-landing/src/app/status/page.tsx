'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/config';

interface ServiceStatus {
  key: string;
  name: string;
  port: number;
  baseUrl: string;
  docsUrl: string;
  probeUrl: string;
  owner: string;
  description: string;
  status: 'online' | 'unavailable' | 'loading';
  responseTime?: number;
  message?: string;
}

const services: ServiceStatus[] = SERVICE_CONFIG.map((service) => ({
  key: service.key,
  name: service.name,
  port: service.port,
  baseUrl: service.baseUrl,
  docsUrl: `${service.baseUrl}${service.docsPath}`,
  probeUrl: `${service.baseUrl}${service.probePath}`,
  owner: service.owner,
  description: service.description,
  status: 'loading',
}));

function StatusBadge({ status }: { status: 'online' | 'unavailable' | 'loading' }) {
  if (status === 'online') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Online</span>
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full animate-pulse">
      <Clock className="w-4 h-4" />
      <span className="text-sm font-medium">Checking...</span>
    </div>
  );
}

export default function StatusPage() {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>(services);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/status', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setServiceStatuses(data.services);
        setLastUpdated(new Date(data.checkedAt));
      } catch {
        setServiceStatuses((current) =>
          current.map((service) => ({
            ...service,
            status: 'unavailable',
            message: 'Status check failed',
          }))
        );
        setLastUpdated(new Date());
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const onlineCount = serviceStatuses.filter((service) => service.status === 'online').length;
  const totalCount = serviceStatuses.length;
  const overallStatus = onlineCount === totalCount ? 'healthy' : onlineCount > 0 ? 'degraded' : 'down';

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">System Status</h1>
            <p className="text-xl text-slate-300">
              Live availability check for the local services used in this project
            </p>
          </div>
        </section>

        <section className="bg-white border-b border-slate-200 py-8">
          <div className="container">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Status</h2>
                <p className="text-slate-600">
                  {onlineCount} of {totalCount} services reachable
                </p>
              </div>
              <div className="text-right">
                {overallStatus === 'healthy' ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-bold text-green-600">All Services Reachable</span>
                  </div>
                ) : overallStatus === 'degraded' ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-bold text-yellow-600">Partial Availability</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-bold text-red-600">Services Unreachable</span>
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

        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceStatuses.map((service) => (
                <div
                  key={service.key}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-500 font-mono break-all">
                        {service.baseUrl}
                      </p>
                    </div>
                    <StatusBadge status={service.status} />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">{service.description}</p>

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

                    <div>
                      <p className="text-sm text-slate-600">Probe URL</p>
                      <p className="text-sm text-slate-700 break-all">
                        {service.probeUrl}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500">Owner: {service.owner}</p>

                    <div className="pt-3 border-t border-slate-200">
                      <a
                        href={service.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Open Service →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Service Notes</h2>
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-3 text-slate-700">
              <p>
                This page now performs a server-side availability check from `service-landing`.
              </p>
              <p>
                A service is marked <span className="font-semibold text-green-700">Online</span> when a known route responds.
              </p>
              <p>
                This is a local development readiness check, not historical uptime monitoring.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Current Snapshot</h2>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Service</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Current State</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Monitoring</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceStatuses.map((service) => (
                    <tr key={service.key} className="border-b border-slate-200 last:border-b-0">
                      <td className="px-6 py-3 text-sm font-medium">{service.name}</td>
                      <td className={`px-6 py-3 text-sm ${service.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                        {service.status === 'online' ? 'Reachable now' : 'Unavailable now'}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600">Live probe every 10s</td>
                      <td className="px-6 py-3 text-sm text-slate-600">Historical uptime not tracked yet</td>
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
