'use client';

import { Briefcase, Search } from 'lucide-react';
import Link from 'next/link';
import JobCard from './JobCard';
import { Job } from '@/lib/types';

interface JobListProps {
  jobs: Job[];
  loading: boolean;
  onApply: (job: Job) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function JobList({ jobs, loading, onApply, hasFilters, onClearFilters }: JobListProps) {
  return (
    <section id="jobs" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="section-title">
              {hasFilters ? 'Search Results' : 'Latest Job Openings'}
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              {loading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-brand-orange font-medium hover:underline flex items-center gap-1"
            >
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded mb-2 w-4/5" />
                <div className="h-3 bg-gray-200 rounded w-3/5 mb-4" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6">Try different search terms or clear your filters</p>
            {hasFilters && (
              <button onClick={onClearFilters} className="btn-primary text-sm">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Jobs grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={onApply} />
            ))}
          </div>
        )}

        {/* CTA to CV Builder */}
        {!loading && jobs.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-brand-blue to-brand-blue-mid rounded-2xl p-8 text-white text-center">
            <div className="w-12 h-12 bg-brand-orange/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-brand-orange" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Need a professional CV?</h3>
            <p className="text-white/70 mb-6">Use our AI-powered CV builder to create a standout resume in minutes</p>
            <Link href="/cv-builder" className="btn-primary text-sm">
              Build Your CV →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
