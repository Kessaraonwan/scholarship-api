'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  service: string;
  example: string;
  response: string;
}

const endpoints: APIEndpoint[] = [
  {
    method: 'GET',
    path: '/api/scholarships',
    description: 'ค้นหาทุนพร้อม filter (keyword, level, field, country) + pagination',
    service: 'service-core',
    example: 'curl http://localhost:3003/api/scholarships?country=japan&level=masters \\\n  -H "x-api-key: YOUR_API_KEY"',
    response: JSON.stringify({
      success: true,
      data: [{ id: '1', name: 'MEXT Scholarship', country: 'Japan', level: 'masters', deadline: '2026-05-31' }],
      pagination: { total: 120, page: 1, limit: 20 },
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/scholarships/:id',
    description: 'ดูรายละเอียดทุนรายชิ้น',
    service: 'service-core',
    example: 'curl http://localhost:3003/api/scholarships/123 \\\n  -H "x-api-key: YOUR_API_KEY"',
    response: JSON.stringify({
      success: true,
      data: { id: '123', name: 'MEXT Scholarship', country: 'Japan', level: 'masters', deadline: '2026-05-31' },
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/scholarships/upcoming',
    description: 'ทุนที่กำลังจะหมดเขตใน 30 วัน',
    service: 'service-core',
    example: 'curl http://localhost:3003/api/scholarships/upcoming \\\n  -H "x-api-key: YOUR_API_KEY"',
    response: JSON.stringify({
      success: true,
      data: [{ id: '1', name: 'Quick Opportunity', deadline: '2026-05-01', days_left: 5 }],
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/register',
    description: 'สมัครสมาชิกใหม่',
    service: 'service-auth',
    example: 'curl -X POST http://localhost:3001/api/register \\\n  -H "Content-Type: application/json" \\\n  -d \'{"email":"user@example.com","password":"pass123"}\'',
    response: JSON.stringify({
      success: true,
      data: { userId: 'usr_123', email: 'user@example.com' },
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/login',
    description: 'เข้าสู่ระบบ รับ accessToken cookie',
    service: 'service-auth',
    example: 'curl -X POST http://localhost:3001/api/login \\\n  -H "Content-Type: application/json" \\\n  -d \'{"email":"user@example.com","password":"pass123"}\'',
    response: JSON.stringify({
      success: true,
      data: { accessToken: 'eyJhbGci...', user: { id: 'usr_123', tier: 'free' } },
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/keys',
    description: 'ดู API Key ทั้งหมดของ user',
    service: 'service-auth',
    example: 'curl http://localhost:3001/api/keys \\\n  -H "Authorization: Bearer ACCESS_TOKEN"',
    response: JSON.stringify({
      success: true,
      data: [{ id: 'key_123', name: 'My Key', key: 'sk_...', isActive: true }],
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/analytics/overview',
    description: 'ดู analytics overview — Pro tier เท่านั้น',
    service: 'service-analytics',
    example: 'curl http://localhost:3004/api/analytics/overview \\\n  -H "x-api-key: YOUR_API_KEY"',
    response: JSON.stringify({
      success: true,
      data: { totalScholarships: 120, byCountry: { Japan: 40, UK: 30 } },
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/match',
    description: 'จับคู่ทุนที่เหมาะกับโปรไฟล์ — Pro tier เท่านั้น',
    service: 'service-analytics',
    example: 'curl -X POST http://localhost:3004/api/match \\\n  -H "x-api-key: YOUR_API_KEY" \\\n  -d \'{"level":"masters","field":"engineering"}\'',
    response: JSON.stringify({
      success: true,
      data: [{ id: '1', name: 'MEXT', matchScore: 0.95 }],
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/notifications',
    description: 'ดูการแจ้งเตือนทั้งหมด',
    service: 'service-notification',
    example: 'curl http://localhost:3005/api/notifications \\\n  -H "Authorization: Bearer ACCESS_TOKEN"',
    response: JSON.stringify({
      success: true,
      data: [{ id: 'notif_123', message: 'ทุนใหม่ตรงโปรไฟล์คุณ', createdAt: '2026-04-30' }],
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/webhooks',
    description: 'ดู Webhook ทั้งหมด — Pro tier เท่านั้น',
    service: 'service-notification',
    example: 'curl http://localhost:3005/api/webhooks \\\n  -H "Authorization: Bearer ACCESS_TOKEN"',
    response: JSON.stringify({
      success: true,
      data: [{ id: 'wh_123', url: 'https://example.com/hook', events: ['notification.sent'] }],
    }, null, 2),
  },
];

function MethodBadge({ method }: { method: string }) {
  const colors = {
    GET: 'bg-blue-100 text-blue-700',
    POST: 'bg-green-100 text-green-700',
    PUT: 'bg-yellow-100 text-yellow-700',
    DELETE: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-3 py-1 rounded text-sm font-bold ${colors[method as keyof typeof colors]}`}>
      {method}
    </span>
  );
}

function EndpointCard({ endpoint }: { endpoint: APIEndpoint }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-4">
          <MethodBadge method={endpoint.method} />
          <div className="text-left">
            <p className="font-mono font-semibold text-slate-900">{endpoint.path}</p>
            <p className="text-sm text-slate-600">{endpoint.description}</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-slate-700 mb-2">Service</h4>
              <p className="text-sm text-slate-600 font-mono">{endpoint.service}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-700 mb-2">Example</h4>
              <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">{endpoint.example}</pre>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-700 mb-2">Response</h4>
              <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">{endpoint.response}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState<string | null>(null);

  const filtered = endpoints.filter(ep => {
    const matchesSearch =
      ep.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = !filterService || ep.service === filterService;
    return matchesSearch && matchesService;
  });

  const services = Array.from(new Set(endpoints.map(ep => ep.service)));

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
            <p className="text-xl text-slate-300">Complete reference for Scholarship API endpoints</p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="bg-white border-b border-slate-200 py-6">
          <div className="container space-y-4">
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterService(null)}
                className={`px-4 py-2 rounded-lg font-medium transition ${filterService === null ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                All Services
              </button>
              {services.map(service => (
                <button
                  key={service}
                  onClick={() => setFilterService(service)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${filterService === service ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="py-12">
          <div className="container space-y-4">
            {filtered.length > 0 ? (
              filtered.map((endpoint, idx) => <EndpointCard key={idx} endpoint={endpoint} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No endpoints found</p>
              </div>
            )}
          </div>
        </section>

        {/* Authentication */}
        <section className="bg-blue-50 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Authentication</h2>
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <p className="text-slate-700 mb-4">ทุก API request ต้องใส่ API key ใน header:</p>
              {/* ✅ แก้จาก Authorization: Bearer → x-api-key */}
              <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-x-auto">
                x-api-key: YOUR_API_KEY
              </pre>
              <p className="text-slate-600 mt-4">
                ขอ API key ได้ที่{' '}
                <a href="http://localhost:3001/dashboard/keys" className="text-indigo-600 font-semibold hover:underline">
                  Dashboard → Keys
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Rate Limiting */}
        <section className="bg-white py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Rate Limiting</h2>
            {/* ✅ แก้ตัวเลขและตัด Enterprise ออก */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Free Plan</h3>
                <p className="text-slate-600">1,000 requests / วัน</p>
              </div>
              <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold mb-2 text-indigo-700">Pro Plan</h3>
                <p className="text-slate-600">10,000 requests / วัน</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}