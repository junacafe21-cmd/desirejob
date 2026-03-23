'use client';

import { MapPin, Briefcase, DollarSign, Clock, Lock } from 'lucide-react';
import { Job } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700',
  Marketing: 'bg-purple-100 text-purple-700',
  Finance: 'bg-green-100 text-green-700',
  Engineering: 'bg-orange-100 text-orange-700',
  Education: 'bg-yellow-100 text-yellow-700',
  Healthcare: 'bg-red-100 text-red-700',
  Operations: 'bg-gray-100 text-gray-700',
  'Human Resources': 'bg-pink-100 text-pink-700',
  Design: 'bg-indigo-100 text-indigo-700',
  'Customer Service': 'bg-teal-100 text-teal-700',
  Sales: 'bg-amber-100 text-amber-700',
  Media: 'bg-cyan-100 text-cyan-700',
};

const jobTypeColors: Record<string, string> = {
  'Full-Time': 'bg-green-50 text-green-600 border border-green-200',
  'Part-Time': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  'Contract': 'bg-purple-50 text-purple-600 border border-purple-200',
  'Remote': 'bg-blue-50 text-blue-600 border border-blue-200',
  'Internship': 'bg-orange-50 text-orange-600 border border-orange-200',
};

export default function JobCard({ job, onApply }: JobCardProps) {
  const timeAgo = formatDistanceToNow(new Date(job.created_at), { addSuffix: true });
  const catColor = categoryColors[job.category] || 'bg-gray-100 text-gray-700';
  const typeColor = jobTypeColors[job.job_type] || 'bg-gray-50 text-gray-600';

  // Generate company avatar letters
  const initials = job.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="card p-5 group hover:-translate-y-0.5 transition-all duration-200 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Company avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-mid flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-brand-orange transition-colors line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-0.5">{job.company}</p>
        </div>

        {/* Posted time */}
        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{timeAgo}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`badge text-xs ${catColor}`}>{job.category}</span>
        <span className={`badge text-xs ${typeColor}`}>{job.job_type}</span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
          {job.location}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-green-500" />
            {job.salary}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
          {job.job_type}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
        {job.description}
      </p>

      {/* Contact info locked */}
      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mb-4">
        <Lock className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
        <span>Contact details locked — Pay NPR 500 to unlock</span>
      </div>

      {/* Apply button */}
      <button
        onClick={() => onApply(job)}
        className="w-full btn-primary py-2.5 text-sm justify-center"
      >
        Apply Now
      </button>
    </div>
  );
}
