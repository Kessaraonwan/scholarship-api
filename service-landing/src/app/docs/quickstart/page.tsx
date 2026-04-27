'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';

export default function QuickstartPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">5-Minute Quickstart</h1>
            <p className="text-xl text-slate-300">
              Get your first API request working in 5 minutes
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-12">
          <div className="container max-w-3xl">
            {/* Step 1: Sign Up */}
            <div className="mb-12 pb-8 border-b border-slate-200">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Sign Up for an Account</h2>
                  <p className="text-slate-600 mb-4">
                    Create a free account to get your API key.
                  </p>
                  <div className="bg-slate-100 rounded-lg p-4">
                    <ol className="space-y-2 text-sm text-slate-700">
                      <li className="flex gap-2">
                        <span className="font-mono bg-slate-300 rounded px-2">1</span>
                        Go to the <a href="/register" className="text-blue-600 underline">Sign Up</a> page
                      </li>
                      <li className="flex gap-2">
                        <span className="font-mono bg-slate-300 rounded px-2">2</span>
                        Fill in your email and password
                      </li>
                      <li className="flex gap-2">
                        <span className="font-mono bg-slate-300 rounded px-2">3</span>
                        Confirm your email
                      </li>
                      <li className="flex gap-2">
                        <span className="font-mono bg-slate-300 rounded px-2">4</span>
                        You're ready to go!
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Get API Key */}
            <div className="mb-12 pb-8 border-b border-slate-200">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Get Your API Key</h2>
                  <p className="text-slate-600 mb-4">
                    Generate your API key from the dashboard.
                  </p>
                  <div className="bg-slate-100 rounded-lg p-4">
                    <ol className="space-y-2 text-sm text-slate-700">
                      <li className="flex gap-2">
                        <span className="font-mono bg-slate-300 rounded px-2">1</span>
                        Log in to your account
                      </li>
                      <li className="flex gap-2">
                        <span className="font-mono bg-slate-300 rounded px-2">2</span>
                        Go to <span className="font-mono">Dashboard → Keys</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-mono bg-slate-300 rounded px-2">3</span>
                        Click "Generate New Key"
                      </li>
                      <li className="flex gap-2">
                        <span className="font-mono bg-slate-300 rounded px-2">4</span>
                        Copy and save it (you won't see it again!)
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Make First Request */}
            <div className="mb-12 pb-8 border-b border-slate-200">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Make Your First API Request</h2>
                  <p className="text-slate-600 mb-4">
                    Use curl, JavaScript, or your favorite HTTP client:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-700 mb-2">Using cURL</h3>
                      <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-x-auto text-xs">
{`curl -X GET \\
  'http://localhost:3003/scholarships?country=TH' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'`}
                      </pre>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-slate-700 mb-2">Using JavaScript</h3>
                      <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-x-auto text-xs">
{`const apiKey = 'YOUR_API_KEY';

fetch('http://localhost:3003/scholarships?country=TH', {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(data => console.log(data))`}
                      </pre>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-slate-700 mb-2">Using Python</h3>
                      <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-x-auto text-xs">
{`import requests

api_key = 'YOUR_API_KEY'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'http://localhost:3003/scholarships?country=TH',
    headers=headers
)
print(response.json())`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Parse Response */}
            <div className="mb-12 pb-8 border-b border-slate-200">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Parse the Response</h2>
                  <p className="text-slate-600 mb-4">
                    The API returns JSON with scholarship data:
                  </p>
                  <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "data": [
    {
      "id": "sch_123",
      "name": "Royal Scholarship",
      "provider": "Thai Government",
      "amount": 500000,
      "deadline": "2026-05-31",
      "eligibility": ["Thai citizens", "GPA >= 3.5"],
      "categories": ["Engineering", "Science"]
    }
  ],
  "pagination": {
    "total": 1523,
    "page": 1,
    "limit": 20
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 5: Next Steps */}
            <div className="mb-12">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Next Steps</h2>
                  <p className="text-slate-600 mb-4">
                    You're ready to build! Here are some ideas:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Build a scholarship search tool</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Create matching recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Set up deadline reminders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Integrate with your app</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-12">
              <h3 className="font-bold text-yellow-900 mb-4">🔧 Common Issues</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-yellow-900 text-sm">401 Unauthorized</h4>
                  <p className="text-sm text-yellow-800">Make sure your API key is correct and included in the Authorization header</p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-900 text-sm">429 Too Many Requests</h4>
                  <p className="text-sm text-yellow-800">You've exceeded your rate limit. Check your plan and upgrade if needed.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-900 text-sm">CORS Errors</h4>
                  <p className="text-sm text-yellow-800">You can use the API from backend services without CORS issues. For frontend use, contact support.</p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-2">💡 Need Help?</h3>
              <p className="text-sm text-blue-900 mb-3">
                Check out the full <a href="/docs" className="underline font-semibold">API Documentation</a> or contact our support team.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
