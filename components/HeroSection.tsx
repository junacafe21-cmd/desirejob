'use client';

import { useState } from 'react';
import { Search, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import { JOB_CATEGORIES, NEPAL_LOCATIONS } from '@/lib/types';

interface HeroSectionProps {
  onSearch: (query: string, category: string, location: string, jobType: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const handleSearch = () => {
    const jobsSection = document.getElementById('jobs');
    if (jobsSection) jobsSection.scrollIntoView({ behavior: 'smooth' });
    onSearch(query, category, location, jobType);
  };

  return (
    <section className="hero-gradient text-white py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse-slow" />
          Nepal&apos;s Fastest Growing Job Portal
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5 animate-slide-up">
          Find Your{' '}
          <span className="text-brand-orange">Dream Job</span>
          <br />
          <span className="text-white/90">in Nepal</span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
          Thousands of verified jobs from top companies across Nepal.
          One payment. Unlimited possibilities.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-10 animate-fade-in">
          {[
            { value: '500+', label: 'Active Jobs' },
            { value: '200+', label: 'Companies' },
            { value: '10K+', label: 'Job Seekers' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-brand-orange">{stat.value}</div>
              <div className="text-xs text-white/60 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-4xl mx-auto animate-slide-up">
          {/* Main search row */}
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Job title, company, or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition"
              />
            </div>
            <button
              onClick={handleSearch}
              className="btn-primary text-sm py-3 px-8 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Search Jobs
            </button>
          </div>

          {/* Filter row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 appearance-none bg-gray-50"
              >
                <option value="">All Categories</option>
                {JOB_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 appearance-none bg-gray-50"
              >
                <option value="">All Locations</option>
                {NEPAL_LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex-1 relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 appearance-none bg-gray-50"
              >
                <option value="">All Types</option>
                {['Full-Time', 'Part-Time', 'Contract', 'Remote', 'Internship'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Popular searches */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in">
          <span className="text-white/50 text-sm">Popular:</span>
          {['Software Engineer', 'Marketing', 'Accounting', 'Remote', 'Kathmandu'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                onSearch(tag, category, location, jobType);
                document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-full glass text-xs text-white/80 hover:bg-white/20 transition-all cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
