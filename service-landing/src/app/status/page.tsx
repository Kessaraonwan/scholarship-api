'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Clock, Server, Globe, Activity, ShieldCheck } from 'lucide-react';
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
      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" />
        <span className="text-xs font-bold uppercase tracking-wider">Online</span>
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-full border border-rose-200">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="text-xs font-bold uppercase tracking-wider">Offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200 animate-pulse">
      <Clock className="w-3.5 h-3.5" />
      <span className="text-xs font-bold uppercase tracking-wider">Checking</span>
    </div>
  );
}

export default function StatusPage() {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>(services);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/status', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
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

  const onlineCount = serviceStatuses.filter((s) => s.status === 'online').length;
  const totalCount = serviceStatuses.length;
  const overallStatus = onlineCount === totalCount ? 'healthy' : onlineCount > 0 ? 'degraded' : 'down';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50 pt-20">
        {/* Header Section */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <Activity size={240} className="text-indigo-400" />
          </div>
          
        </section>

        {/* Overall Status Bar */}
        <section className="bg-white border-b border-slate-200 py-10 shadow-sm">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-6 text-center md:text-left">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  overallStatus === 'healthy' ? 'bg-emerald-500 shadow-emerald-200' : 
                  overallStatus === 'degraded' ? 'bg-amber-500 shadow-amber-200' : 'bg-rose-500 shadow-rose-200'
                }`}>
                  <Server className="text-white w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Infrastructure Health</h2>
                  <p className="text-slate-500 font-medium">
                    {onlineCount} of {totalCount} nodes currently responsive
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full animate-ping ${
                    overallStatus === 'healthy' ? 'bg-emerald-500' : 
                    overallStatus === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  <span className={`text-3xl font-black uppercase tracking-tighter ${
                    overallStatus === 'healthy' ? 'text-emerald-600' : 
                    overallStatus === 'degraded' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {overallStatus === 'healthy' ? 'System Operational' : 
                     overallStatus === 'degraded' ? 'Partial Outage' : 'System Down'}
                  </span>
                </div>
                {lastUpdated && (
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
                    Last Verified: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Service Cards Grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceStatuses.map((service) => (
                <div
                  key={service.key}
                  className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                      <Globe className="w-6 h-6 text-indigo-600" />
                    </div>
                    <StatusBadge status={service.status} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-sm font-mono text-slate-400 mb-4">{service.baseUrl}</p>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-2">{service.description}</p>

                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Latency</span>
                      <span className="text-lg font-mono font-bold text-indigo-600">
                        {service.responseTime !== undefined ? `${service.responseTime}ms` : '--'}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Network Probe</span>
                      <p className="text-[10px] font-mono text-slate-500 break-all bg-slate-50 p-2 rounded-lg">
                        {service.probeUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <ShieldCheck className="w-4 h-4 text-slate-300" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Owner: {service.owner}</span>
                    </div>

                    <a
                      href={service.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full py-3 mt-4 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      Connect to Service
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Snapshot Table */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container">
            <h2 className="text-2xl font-bold text-slate-900 mb-10">Infrastructure Snapshot</h2>
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400">
                    <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest">Node Name</th>
                    <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest">Real-time State</th>
                    <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest">Monitoring Method</th>
                    <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest">Stability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {serviceStatuses.map((service) => (
                    <tr key={service.key} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-bold text-slate-900">{service.name}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${service.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className={`text-sm font-medium ${service.status === 'online' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {service.status === 'online' ? 'Operational' : 'Unresponsive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500">Live Probe (10s Interval)</td>
                      <td className="px-8 py-5 text-sm text-slate-500 font-medium">Verified Active</td>
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