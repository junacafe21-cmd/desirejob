'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NextImage from 'next/image';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, XCircle, Eye, Clock, Download, RefreshCw, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

type AppStatus = 'all' | 'pending' | 'approved' | 'rejected';

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AppStatus>((searchParams.get('status') as AppStatus) || 'all');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const supabase = createClient();

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const url = `/api/applications${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    setApplications(data.data || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleVerify = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`/api/applications/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, admin_note: adminNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(action === 'approve' ? '✅ Approved! Email sent to applicant.' : '❌ Application rejected.');
      setSelectedApp(null);
      fetchApplications();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoading(null);
      setAdminNote('');
    }
  };

  const viewScreenshot = async (app: any) => {
    setSelectedApp(app);
    setScreenshotUrl(null);
    if (app.payment_screenshot_url) {
      const { data } = await supabase.storage
        .from('payment-screenshots')
        .createSignedUrl(app.payment_screenshot_url, 60);
      setScreenshotUrl(data?.signedUrl || null);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, [string, any]> = {
      pending: ['bg-amber-100 text-amber-700', Clock],
      approved: ['bg-green-100 text-green-700', CheckCircle],
      rejected: ['bg-red-100 text-red-700', XCircle],
    };
    const [cls, Icon] = map[status] || ['bg-gray-100 text-gray-600', Clock];
    return (
      <span className={`badge ${cls} gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-blue">Applications</h1>
            <p className="text-gray-500 text-sm mt-0.5">{applications.length} total records</p>
          </div>
          <button onClick={fetchApplications} className="btn-outline text-sm py-2 px-4">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="p-6">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {(['all', 'pending', 'approved', 'rejected'] as AppStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  statusFilter === s
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-blue'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    {['Applicant', 'Job', 'Phone', 'Status', 'Screenshot', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-5 py-4"><div className="h-3 bg-gray-200 rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  ) : applications.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No applications found</td></tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800">{app.user_name}</p>
                          <p className="text-xs text-gray-400">{app.user_email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-700">{app.job?.title || '—'}</p>
                          <p className="text-xs text-gray-400">{app.job?.company}</p>
                        </td>
                        <td className="px-5 py-4 text-gray-600 text-xs">{app.user_phone}</td>
                        <td className="px-5 py-4">{statusBadge(app.status)}</td>
                        <td className="px-5 py-4">
                          {app.payment_screenshot_url ? (
                            <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Uploaded
                            </span>
                          ) : (
                            <span className="text-red-500 text-xs">None</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(app.created_at).toLocaleDateString('en-NP')}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => viewScreenshot(app)}
                            className="btn-secondary text-xs py-1.5 px-3"
                          >
                            <Eye className="w-3.5 h-3.5" /> Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scroll animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-brand-blue">Review Application</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedApp.user_name} — {selectedApp.job?.title}
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Applicant details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Name:</span><span className="font-semibold">{selectedApp.user_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email:</span><span className="font-medium">{selectedApp.user_email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone:</span><span>{selectedApp.user_phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Job:</span><span className="font-medium text-brand-blue">{selectedApp.job?.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>{statusBadge(selectedApp.status)}
                </div>
              </div>

              {/* Payment screenshot */}
              <div>
                <p className="label mb-2">Payment Screenshot</p>
                {screenshotUrl ? (
                  <div className="space-y-2">
                    <NextImage 
                      src={screenshotUrl} 
                      alt="Payment" 
                      width={400} 
                      height={400} 
                      className="w-full rounded-xl border border-gray-200 object-contain max-h-64" 
                      unoptimized 
                    />
                    <a href={screenshotUrl} download className="btn-outline text-xs py-1.5 px-3 w-full justify-center">
                      <Download className="w-3.5 h-3.5" /> Download Screenshot
                    </a>
                  </div>
                ) : selectedApp.payment_screenshot_url ? (
                  <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center text-gray-400 text-sm">Loading screenshot…</div>
                ) : (
                  <div className="bg-red-50 rounded-xl p-4 text-red-500 text-sm">No payment screenshot uploaded</div>
                )}
              </div>

              {/* CV link */}
              {selectedApp.cv_url && (
                <a href={selectedApp.cv_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-2 px-4 block text-center">
                  <Download className="w-4 h-4" /> View Uploaded CV
                </a>
              )}

              {/* Admin note */}
              {selectedApp.status === 'pending' && (
                <div>
                  <label className="label">Admin Note (optional)</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Reason for rejection (shown in email)..."
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>
              )}

              {/* Actions */}
              {selectedApp.status === 'pending' ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerify(selectedApp.id, 'reject')}
                    disabled={!!actionLoading}
                    className="flex-1 py-3 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {actionLoading === selectedApp.id + 'reject' ? 'Rejecting…' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleVerify(selectedApp.id, 'approve')}
                    disabled={!!actionLoading}
                    className="flex-1 btn-primary py-3 justify-center disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {actionLoading === selectedApp.id + 'approve' ? 'Approving…' : 'Approve'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <span className={`badge text-sm ${selectedApp.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    Already {selectedApp.status}
                  </span>
                </div>
              )}

              <button
                onClick={() => { setSelectedApp(null); setScreenshotUrl(null); }}
                className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading applications...</div>}>
      <ApplicationsContent />
    </Suspense>
  );
}
