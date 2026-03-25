'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { FileText, Briefcase, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalApplications: number;
  pending: number;
  approved: number;
  rejected: number;
  totalJobs: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalApplications: 0, pending: 0, approved: 0, rejected: 0, totalJobs: 0, totalUsers: 0 });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    const [appsRes, jobsRes, usersRes] = await Promise.all([
      supabase.from('applications').select('status'),
      supabase.from('jobs').select('id', { count: 'exact', head: true }),
      supabase.from('user_credits').select('id', { count: 'exact', head: true }),
    ]);

    const apps = appsRes.data || [];
    setStats({
      totalApplications: apps.length,
      pending: apps.filter((a) => a.status === 'pending').length,
      approved: apps.filter((a) => a.status === 'approved').length,
      rejected: apps.filter((a) => a.status === 'rejected').length,
      totalJobs: jobsRes.count || 0,
      totalUsers: usersRes.count || 0,
    });

    // Recent applications
    const { data: recent } = await supabase
      .from('applications')
      .select('*, job:jobs(title, company)')
      .order('created_at', { ascending: false })
      .limit(5);
    setRecentApplications(recent || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', href: '/admin/applications?status=pending' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-50 text-red-600', border: 'border-red-100' },
    { label: 'Active Jobs', value: stats.totalJobs, icon: Briefcase, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', href: '/admin/jobs' },
    { label: 'Users Paid', value: stats.totalUsers, icon: Users, color: 'bg-teal-50 text-teal-600', border: 'border-teal-100', href: '/admin/users' },
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return <span className={`badge text-xs ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5">
          <h1 className="text-2xl font-bold text-brand-blue">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, Admin</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                const Wrapper = card.href ? Link : 'div';
                return (
                  <Wrapper key={card.label} href={card.href as string} className={`premium-card p-6 border ${card.border} ${card.href ? 'cursor-pointer' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{card.label}</span>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.color} shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-4xl font-black text-brand-blue tracking-tight">{card.value}</p>
                  </Wrapper>
                );
              })}
            </div>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/applications?status=pending" className="card p-5 flex items-center gap-4 border border-amber-100 hover:shadow-md">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Review Pending</p>
                <p className="text-sm text-gray-500">{stats.pending} applications waiting</p>
              </div>
            </Link>
            <Link href="/admin/jobs" className="card p-5 flex items-center gap-4 border border-blue-100 hover:shadow-md">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Post New Job</p>
                <p className="text-sm text-gray-500">Add a new job listing</p>
              </div>
            </Link>
          </div>

          {/* Recent applications */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-brand-blue">Recent Applications</h2>
              <Link href="/admin/applications" className="text-sm text-brand-orange hover:underline">View all →</Link>
            </div>
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase">Applicant</th>
                    <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase">Job</th>
                    <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase">Status</th>
                    <th className="px-6 py-3 font-semibold text-gray-500 text-xs uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-800">{app.user_name}</p>
                        <p className="text-xs text-gray-400">{app.user_email}</p>
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {app.job?.title || '—'}<br />
                        <span className="text-xs text-gray-400">{app.job?.company}</span>
                      </td>
                      <td className="px-6 py-3">{statusBadge(app.status)}</td>
                      <td className="px-6 py-3 text-gray-400 text-xs">
                        {new Date(app.created_at).toLocaleDateString('en-NP')}
                      </td>
                    </tr>
                  ))}
                  {recentApplications.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No applications yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
