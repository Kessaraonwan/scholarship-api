'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AUTH_BASE_URL } from '@/lib/config';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="container flex justify-between items-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SA</span>
          </div>
          <span className="text-xl font-bold text-slate-900">Scholarship API</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-slate-700 hover:text-blue-600 transition">Home</Link>
          <Link href="/docs" className="text-slate-700 hover:text-blue-600 transition">Docs</Link>
          <Link href="/docs/quickstart" className="text-slate-700 hover:text-blue-600 transition">Quickstart</Link>
          <Link href="/status" className="text-slate-700 hover:text-blue-600 transition">Status</Link>
          <a href={`${AUTH_BASE_URL}/login`} className="btn-secondary">Sign In</a>
          <a href={`${AUTH_BASE_URL}/register`} className="btn-primary">Sign Up</a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t md:hidden">
            <div className="container flex flex-col gap-4 py-4">
              <Link href="/" className="text-slate-700 hover:text-blue-600">Home</Link>
              <Link href="/docs" className="text-slate-700 hover:text-blue-600">Docs</Link>
              <Link href="/docs/quickstart" className="text-slate-700 hover:text-blue-600">Quickstart</Link>
              <Link href="/status" className="text-slate-700 hover:text-blue-600">Status</Link>
              <a href={`${AUTH_BASE_URL}/login`} className="btn-secondary w-full text-center">Sign In</a>
              <a href={`${AUTH_BASE_URL}/register`} className="btn-primary w-full text-center">Sign Up</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
