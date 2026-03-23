'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Briefcase } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Desire Job Hub Logo" className="h-14 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#jobs" className="text-gray-600 hover:text-brand-orange font-medium transition-colors text-sm">
              Browse Jobs
            </Link>
            <Link href="/#how-it-works" className="text-gray-600 hover:text-brand-orange font-medium transition-colors text-sm">
              How It Works
            </Link>
            <Link href="/cv-builder" className="text-gray-600 hover:text-brand-orange font-medium transition-colors text-sm">
              CV Builder
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-brand-orange font-medium transition-colors text-sm">
              Pricing
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/#jobs"
              className="btn-primary text-sm py-2 px-5"
            >
              Find Jobs
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="flex flex-col px-4 py-4 gap-3">
            <Link href="/#jobs" onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium py-2 hover:text-brand-orange transition-colors">
              Browse Jobs
            </Link>
            <Link href="/#how-it-works" onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium py-2 hover:text-brand-orange transition-colors">
              How It Works
            </Link>
            <Link href="/cv-builder" onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium py-2 hover:text-brand-orange transition-colors">
              CV Builder
            </Link>
            <Link href="/#pricing" onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium py-2 hover:text-brand-orange transition-colors">
              Pricing
            </Link>
            <Link href="/#jobs" onClick={() => setIsOpen(false)}
              className="btn-primary text-sm py-2.5 text-center justify-center mt-2">
              Find Jobs
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
