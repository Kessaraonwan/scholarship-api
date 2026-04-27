'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, Zap, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                Find Your Perfect Scholarship
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Powerful API platform for discovering, applying to, and managing scholarships. 
                Integrated with real scholarship data, real-time notifications, and advanced matching algorithms.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/register" className="btn-primary">
                  Get Started Free
                </Link>
                <Link href="/docs" className="btn-secondary">
                  Read Docs
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="p-6 bg-white rounded-lg border border-slate-200 hover:shadow-lg transition">
                <Zap className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-slate-600">
                  Search through thousands of scholarships in milliseconds with our optimized database.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg border border-slate-200 hover:shadow-lg transition">
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Matching</h3>
                <p className="text-slate-600">
                  Intelligent algorithms match you with the best scholarship opportunities based on your profile.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg border border-slate-200 hover:shadow-lg transition">
                <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
                <p className="text-slate-600">
                  Always up-to-date with the latest scholarships, deadlines, and opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">How You Can Use It</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  For Students
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Browse scholarships matched to your profile</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Get notifications about deadlines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Track your applications in one place</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Access analytics on your chances</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  For Developers
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>REST API for scholarship data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Webhook support for real-time updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Advanced filtering and search capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Analytics dashboard and usage reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Tier */}
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-slate-600 mb-6">Perfect for getting started</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold">$0</p>
                  <p className="text-slate-600 text-sm">forever</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Browse scholarships</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>100 API calls/day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Email notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Community support</span>
                  </li>
                </ul>

                <button className="btn-secondary w-full">Get Started</button>
              </div>

              {/* Pro Tier */}
              <div className="bg-blue-600 text-white rounded-lg p-8 relative border-2 border-blue-600">
                <div className="absolute top-0 left-4 transform -translate-y-1/2">
                  <span className="bg-yellow-400 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                    POPULAR
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-blue-100 mb-6">For serious developers</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold">$99</p>
                  <p className="text-blue-100 text-sm">/month</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>50,000 API calls/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>Webhook support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>Priority support</span>
                  </li>
                </ul>

                <button className="btn-primary w-full bg-white text-blue-600 hover:bg-blue-50">
                  Get Started
                </button>
              </div>

              {/* Enterprise Tier */}
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-slate-600 mb-6">For large-scale applications</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold">Custom</p>
                  <p className="text-slate-600 text-sm">contact sales</p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Unlimited API calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Custom integrations</span>
                  </li>
                </ul>

                <button className="btn-secondary w-full">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Join thousands of students and developers using Scholarship API to find and build scholarship solutions.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                Sign Up Free
              </Link>
              <Link href="/docs/quickstart" className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                View Tutorial
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
