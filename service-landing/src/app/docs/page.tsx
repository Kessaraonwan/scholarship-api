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
    path: '/scholarships',
    description: 'Search for scholarships with filters',
    service: 'service-core',
    example: '/scholarships?country=TH&level=bachelor&min_amount=10000',
    response: JSON.stringify({
      success: true,
      data: [
        {
          id: '1',
          name: 'Royal Scholarship',
          provider: 'Thai Government',
          amount: 500000,
          deadline: '2026-05-31',
          eligibility: ['Thai citizens', 'GPA >= 3.5'],
        },
      ],
      pagination: { total: 1523, page: 1, limit: 20 },
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/scholarships/:id',
    description: 'Get detailed information about a specific scholarship',
    service: 'service-core',
    example: '/scholarships/123',
    response: JSON.stringify({
      success: true,
      data: {
        id: '123',
        name: 'Royal Scholarship 2026',
        provider: 'Thai Government',
        amount: 500000,
        deadline: '2026-05-31',
        description: 'Full scholarship for Thai students',
        eligibility: ['Thai citizens', 'GPA >= 3.5', 'Age < 25'],
        categories: ['Engineering', 'Science'],
        documents_required: ['Transcript', 'ID', 'Essay'],
      },
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/scholarships/upcoming',
    description: 'Get scholarships with upcoming deadlines (next 30 days)',
    service: 'service-core',
    example: '/scholarships/upcoming?limit=10',
    response: JSON.stringify({
      success: true,
      data: [
        {
          id: '1',
          name: 'Quick Opportunity',
          deadline: '2026-05-01',
          days_left: 5,
        },
      ],
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/auth/register',
    description: 'Register a new user account',
    service: 'service-auth',
    example: 'POST /auth/register',
    response: JSON.stringify({
      success: true,
      data: {
        user_id: 'usr_123',
        email: 'student@example.com',
        token: 'eyJhbGciOiJIUzI1NiIs...',
      },
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/auth/login',
    description: 'Login and get authentication token',
    service: 'service-auth',
    example: 'POST /auth/login',
    response: JSON.stringify({
      success: true,
      data: {
        token: 'eyJhbGciOiJIUzI1NiIs...',
        user: { id: 'usr_123', email: 'student@example.com' },
      },
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/analytics/dashboard',
    description: 'Get analytics dashboard data',
    service: 'service-analytics',
    example: '/analytics/dashboard',
    response: JSON.stringify({
      success: true,
      data: {
        total_scholarships: 5234,
        matching_scholarships: 45,
        success_rate: 0.32,
        top_categories: ['Engineering', 'Medicine', 'Law'],
      },
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/notifications/subscribe',
    description: 'Subscribe to notifications for specific criteria',
    service: 'service-notification',
    example: 'POST /notifications/subscribe',
    response: JSON.stringify({
      success: true,
      data: {
        subscription_id: 'sub_123',
        criteria: { country: 'TH', min_amount: 100000 },
      },
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
              <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                {endpoint.example}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-slate-700 mb-2">Response</h4>
              <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                {endpoint.response}
              </pre>
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
            <p className="text-xl text-slate-300">
              Complete reference for Scholarship API endpoints
            </p>
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
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterService === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Services
              </button>
              {services.map(service => (
                <button
                  key={service}
                  onClick={() => setFilterService(service)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterService === service
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
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
              filtered.map((endpoint, idx) => (
                <EndpointCard key={idx} endpoint={endpoint} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No endpoints found</p>
              </div>
            )}
          </div>
        </section>

        {/* Authentication Info */}
        <section className="bg-blue-50 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Authentication</h2>
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <p className="text-slate-700 mb-4">
                All API requests require an API key in the Authorization header:
              </p>
              <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-x-auto">
                Authorization: Bearer YOUR_API_KEY
              </pre>
              <p className="text-slate-600 mt-4">
                Get your API key from the <span className="font-mono bg-slate-100 px-2 py-1 rounded">Dashboard → Keys</span> page.
              </p>
            </div>
          </div>
        </section>

        {/* Rate Limiting */}
        <section className="bg-white py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Rate Limiting</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Free Plan</h3>
                <p className="text-slate-600">100 requests per day</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Pro Plan</h3>
                <p className="text-slate-600">50,000 requests per month</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Enterprise</h3>
                <p className="text-slate-600">Unlimited requests</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
