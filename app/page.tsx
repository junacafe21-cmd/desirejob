'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import JobList from '@/components/JobList';
import HowItWorks from '@/components/HowItWorks';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { createClient } from '@/lib/supabase/client';
import { Job } from '@/lib/types';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');

  const supabase = createClient();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load jobs');
    } else {
      setJobs(data || []);
      setFilteredJobs(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = useCallback((query: string, category: string, location: string, jobType: string) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedLocation(location);
    setSelectedJobType(jobType);

    let filtered = [...jobs];

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (category) filtered = filtered.filter((j) => j.category === category);
    if (location) filtered = filtered.filter((j) => j.location === location);
    if (jobType) filtered = filtered.filter((j) => j.job_type === jobType);

    setFilteredJobs(filtered);
  }, [jobs]);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection onSearch={handleSearch} />
      <JobList
        jobs={filteredJobs}
        loading={loading}
        onApply={handleApply}
        hasFilters={!!(searchQuery || selectedCategory || selectedLocation || selectedJobType)}
        onClearFilters={() => {
          setFilteredJobs(jobs);
          setSearchQuery('');
          setSelectedCategory('');
          setSelectedLocation('');
          setSelectedJobType('');
        }}
      />
      <HowItWorks />
      <PricingSection />
      <Footer />

      {showApplyModal && selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </main>
  );
}
