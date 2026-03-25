'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { Users, CreditCard, RefreshCw } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_credits')
      .select('*')
      .order('total_paid', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalRevenue = users.reduce((sum, u) => sum + (u.total_paid || 0), 0);
  const totalCreditsIssued = users.reduce((sum, u) => sum + (u.credits || 0), 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-blue">User Credits</h1>
            <p className="text-gray-500 text-sm mt-0.5">{users.length} verified users</p>
          </div>
          <button onClick={fetchUsers} className="btn-outline text-sm py-2 px-4">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5 border border-blue-100">
              <p className="text-sm text-gray-500 mb-2">Total Users</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-brand-blue">{users.length}</span>
                <Users className="w-5 h-5 text-blue-400 mb-1" />
              </div>
            </div>
            <div className="card p-5 border border-green-100">
              <p className="text-sm text-gray-500 mb-2">Total Revenue</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-green-600">NPR {totalRevenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="card p-5 border border-orange-100">
              <p className="text-sm text-gray-500 mb-2">Credits Issued</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-brand-orange">{totalCreditsIssued}</span>
                <CreditCard className="w-5 h-5 text-orange-400 mb-1" />
              </div>
            </div>
          </div>

          {/* Users table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-brand-blue">User Credit Tracker</h2>
            </div>
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    {['Email', 'Credits Remaining', 'Total Paid (NPR)', 'Member Since'].map((h) => (
                      <th key={h} className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 4 }).map((_, j) => (
                          <td key={j} className="px-5 py-4"><div className="h-3 bg-gray-200 rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  ) : users.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">No verified users yet</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-4 font-medium text-gray-800">{user.email}</td>
                        <td className="px-5 py-4">
                          <span className={`badge text-xs ${user.credits > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {user.credits} credit{user.credits !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-700 font-semibold">NPR {user.total_paid?.toLocaleString() || 0}</td>
                        <td className="px-5 py-4 text-gray-400 text-xs">
                          {new Date(user.created_at).toLocaleDateString('en-NP')}
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
    </div>
  );
}
