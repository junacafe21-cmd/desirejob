'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Download, CheckCircle, AlertCircle, Loader2, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Job } from '@/lib/types';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
}

type Step = 'form' | 'payment' | 'success';

export default function ApplyModal({ job, onClose }: ApplyModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('/qr-esewa.png');
  const screenshotRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchQR = async () => {
      const { data } = await supabase.storage.from('qr-codes').list('', { sortBy: { column: 'created_at', order: 'desc' }, limit: 1 });
      if (data && data.length > 0 && data[0].name !== '.emptyFolderPlaceholder') {
        const urlReq = supabase.storage.from('qr-codes').getPublicUrl(data[0].name);
        setQrUrl(urlReq.data.publicUrl);
      }
    };
    fetchQR();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setCvFile(e.target.files[0]);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFormNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setStep('payment');
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'DesireJobHub-Payment-QR.png';
      link.click();
    } catch {
      toast.error('Could not download QR code');
    }
  };

  const handleSubmit = async () => {
    if (!screenshotFile) {
      toast.error('Please upload your payment screenshot');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('job_id', job.id);
      fd.append('user_name', formData.name);
      fd.append('user_email', formData.email);
      fd.append('user_phone', formData.phone);
      fd.append('payment_screenshot', screenshotFile);
      if (cvFile) fd.append('cv_file', cvFile);

      const res = await fetch('/api/applications', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setStep('success');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="modal-content bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scroll border border-white/20">
        {/* Header */}
        <div className="flex items-start justify-between p-8 border-b border-gray-100">
          <div className="flex-1">
            <h2 className="text-2xl font-black text-brand-blue tracking-tight">Apply for Position</h2>
            <p className="text-sm font-semibold text-gray-500 mt-1">{job.title} <span className="text-gray-300 mx-1">/</span> {job.company}</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100"><MapPin className="w-3 h-3 text-brand-orange" />{job.location}</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100"><Briefcase className="w-3 h-3 text-brand-orange" />{job.job_type}</span>
              {job.salary && <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100"><DollarSign className="w-3 h-3 text-brand-orange" />{job.salary}</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-2xl transition-all ml-4 flex-shrink-0 group">
            <X className="w-5 h-5 text-gray-400 group-hover:text-brand-blue" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50">
          {['Application', 'Payment', 'Done'].map((s, i) => {
            const stepIndex = step === 'form' ? 0 : step === 'payment' ? 1 : 2;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < stepIndex ? 'bg-green-500 text-white' :
                  i === stepIndex ? 'bg-brand-orange text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === stepIndex ? 'text-brand-orange' : 'text-gray-400'}`}>{s}</span>
                {i < 2 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Form */}
        {step === 'form' && (
          <form onSubmit={handleFormNext} className="p-6 space-y-4">
            <div>
              <label className="label">Full Name *</label>
              <input
                name="name" type="text" required
                placeholder="e.g. Ram Prasad Sharma"
                value={formData.name} onChange={handleFormChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Email Address *</label>
              <input
                name="email" type="email" required
                placeholder="your@email.com"
                value={formData.email} onChange={handleFormChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Phone Number *</label>
              <input
                name="phone" type="tel" required
                placeholder="98XXXXXXXX"
                value={formData.phone} onChange={handleFormChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Upload CV / Resume <span className="text-gray-400 font-normal">(Optional)</span></label>
              <div
                onClick={() => cvRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-brand-orange/50 hover:bg-orange-50/30 transition"
              >
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">
                  {cvFile ? cvFile.name : 'Click to upload PDF/DOC (max 5MB)'}
                </p>
              </div>
              <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                After submitting, you&apos;ll need to pay <strong>NPR 500</strong> via eSewa to unlock job contact details. You get <strong>3 unlocks</strong> per payment.
              </p>
            </div>

            <button type="submit" className="btn-primary w-full py-3 justify-center">
              Continue to Payment →
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <div className="p-6 space-y-5">
            <div className="text-center">
              <h3 className="font-bold text-brand-blue text-lg mb-1">Complete Your Payment</h3>
              <p className="text-sm text-gray-500">Scan the QR code below using your eSewa app</p>
            </div>

            {/* QR code */}
            <div className="flex flex-col items-center gap-4">
              <div className="border-4 border-green-500 rounded-2xl p-3 bg-white shadow-lg overflow-hidden">
                <Image
                  src={qrUrl}
                  alt="Payment QR Code - NPR 500"
                  width={200}
                  height={240}
                  className="rounded-xl object-contain min-h-[240px] bg-gray-50 flex items-center justify-center text-xs text-gray-400"
                />
              </div>
              <button
                onClick={handleDownloadQR}
                className="btn-outline text-sm py-2 px-5"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </button>
            </div>

            {/* Payment instructions */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-bold text-green-800 text-sm mb-2">Payment Instructions:</h4>
              <ol className="space-y-1.5 text-sm text-green-700">
                <li>1. Open your <strong>eSewa</strong> app</li>
                <li>2. Tap <strong>&quot;Scan QR&quot;</strong> and scan the code above</li>
                <li>3. Pay exactly <strong>NPR 500</strong></li>
                <li>4. Take a <strong>screenshot</strong> of the payment confirmation</li>
                <li>5. Upload the screenshot below</li>
              </ol>
            </div>

            {/* Screenshot upload */}
            <div>
              <label className="label">Upload Payment Screenshot *</label>
              <div
                onClick={() => screenshotRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                  screenshotPreview
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 hover:border-brand-orange/50 hover:bg-orange-50/30'
                }`}
              >
                {screenshotPreview ? (
                  <div className="space-y-2">
                    <img src={screenshotPreview} alt="Payment screenshot" className="max-h-32 mx-auto rounded-lg object-contain" />
                    <p className="text-xs text-green-600 font-medium">✓ Screenshot uploaded — {screenshotFile?.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Click to upload payment screenshot</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG supported (max 5MB)</p>
                  </>
                )}
              </div>
              <input
                ref={screenshotRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="hidden"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !screenshotFile}
                className="flex-1 btn-primary py-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Your application is <strong>pending verification</strong>. Our admin team will review your payment screenshot within <strong>24 hours</strong>.<br /><br />
              Once approved, full job details and contact information will be sent to:<br />
              <strong className="text-brand-blue">{formData.email}</strong>
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 mb-6">
              💡 One payment (NPR 500) gives you <strong>3 job unlocks</strong>. Apply to more jobs without paying again!
            </div>

            <button onClick={onClose} className="btn-primary w-full py-3 justify-center">
              Back to Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
