'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Loader2, RefreshCw, Briefcase } from 'lucide-react';
import { JOB_CATEGORIES, NEPAL_LOCATIONS, Job } from '@/lib/types';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '', company: '', location: '', salary: '', description: '',
  contact_info: '', category: 'Technology', job_type: 'Full-Time', is_active: true, deadline: '',
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await fetch('/api/jobs');
    const data = await res.json();
    setJobs(data.data || []);
    setLoading(false);
  };

  const openAdd = () => { setEditJob(null); setFormData(emptyForm); setShowForm(true); };
  const openEdit = (job: Job) => {
    setEditJob(job);
    setFormData({
      title: job.title, company: job.company, location: job.location,
      salary: job.salary || '', description: job.description, contact_info: job.contact_info,
      category: job.category, job_type: job.job_type, is_active: job.is_active,
      deadline: job.deadline || '',
    });
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description || !formData.contact_info) {
      toast.error('Fill all required fields'); return;
    }
    setSaving(true);
    try {
      const url = editJob ? `/api/jobs/${editJob.id}` : '/api/jobs';
      const method = editJob ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success(editJob ? 'Job updated!' : 'Job posted!');
      setShowForm(false);
      fetchJobs();
    } catch { toast.error('Failed to save job'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Job deleted');
      fetchJobs();
    } catch { toast.error('Delete failed'); }
    finally { setDeleteId(null); }
  };

  const handleToggle = async (job: Job) => {
    try {
      await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !job.is_active }),
      });
      toast.success(job.is_active ? 'Job deactivated' : 'Job activated');
      fetchJobs();
    } catch { toast.error('Toggle failed'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-blue">Manage Jobs</h1>
            <p className="text-gray-500 text-sm mt-0.5">{jobs.length} total listings</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchJobs} className="btn-outline text-sm py-2 px-4"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={openAdd} className="btn-primary text-sm py-2 px-5"><Plus className="w-4 h-4" /> Post Job</button>
          </div>
        </div>

        <div className="p-6">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    {['Job Title', 'Company', 'Location', 'Category', 'Type', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-5 py-4"><div className="h-3 bg-gray-200 rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  ) : jobs.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-14 text-center text-gray-400">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      No jobs yet. Click &quot;Post Job&quot; to add one.
                    </td></tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800">{job.title}</p>
                          {job.salary && <p className="text-xs text-gray-400">{job.salary}</p>}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">{job.company}</td>
                        <td className="px-5 py-3.5 text-gray-600">{job.location}</td>
                        <td className="px-5 py-3.5">
                          <span className="badge bg-blue-50 text-blue-600 text-xs">{job.category}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="badge bg-gray-100 text-gray-600 text-xs">{job.job_type}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => handleToggle(job)} className="flex items-center gap-1 text-xs font-medium">
                            {job.is_active ? (
                              <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Active</span></>
                            ) : (
                              <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-500">Inactive</span></>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(job)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
                              disabled={deleteId === job.id}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition disabled:opacity-50"
                            >
                              {deleteId === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
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

      {/* Job Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scroll animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-brand-blue">{editJob ? 'Edit Job' : 'Post New Job'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Job Title *</label>
                <input name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g. Senior Software Engineer" required />
              </div>
              <div>
                <label className="label">Company *</label>
                <input name="company" value={formData.company} onChange={handleChange} className="input-field" placeholder="e.g. Ncell Axiata" required />
              </div>
              <div>
                <label className="label">Location *</label>
                <select name="location" value={formData.location} onChange={handleChange} className="input-field" required>
                  <option value="">Select location</option>
                  {NEPAL_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Salary Range</label>
                <input name="salary" value={formData.salary} onChange={handleChange} className="input-field" placeholder="e.g. NPR 50,000 - 80,000" />
              </div>
              <div>
                <label className="label">Deadline</label>
                <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Job Type *</label>
                <select name="job_type" value={formData.job_type} onChange={handleChange} className="input-field">
                  {['Full-Time', 'Part-Time', 'Contract', 'Remote', 'Internship'].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Job Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input-field resize-none" rows={4} placeholder="Describe the role, responsibilities, requirements..." required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Contact Information * <span className="text-gray-400 font-normal text-xs">(this is sent to users after approval)</span></label>
                <textarea name="contact_info" value={formData.contact_info} onChange={handleChange} className="input-field resize-none" rows={2} placeholder="Email: hr@company.com | Phone: 01-XXXXXXX | Apply via: company.com/careers" required />
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 rounded accent-brand-orange" />
                  <span className="text-sm font-medium text-gray-700">Active (visible on job portal)</span>
                </label>
              </div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 justify-center disabled:opacity-60">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : editJob ? 'Save Changes' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
