'use client';

import { useEffect, useState, useRef } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { Settings, Upload, CheckCircle, Loader2, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [qrUrl, setQrUrl] = useState<string>('/qr-esewa.png');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Fetch the latest QR Code
  const fetchQR = async () => {
    setLoading(true);
    const { data } = await supabase.storage.from('qr-codes').list('', { sortBy: { column: 'created_at', order: 'desc' }, limit: 1 });
    if (data && data.length > 0 && data[0].name !== '.emptyFolderPlaceholder') {
      const urlReq = supabase.storage.from('qr-codes').getPublicUrl(data[0].name);
      setQrUrl(urlReq.data.publicUrl);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQR();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG)');
      return;
    }

    setUploading(true);
    const fileName = `payment-qr-${Date.now()}.${file.name.split('.').pop()}`;

    try {
      const { error } = await supabase.storage
        .from('qr-codes')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;
      
      toast.success('New QR Code activated!');
      fetchQR(); // Refresh the preview
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload QR code');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-blue">Platform Settings</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage global platform configurations</p>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          {/* QR Code Settings Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-brand-orange" />
              Payment QR Code
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              This QR code is shown to job applicants during checkout for the NPR 500 payment. 
              Uploading a new image will instantly replace the active QR code globally.
            </p>

            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Preview */}
              <div className="w-full md:w-64 flex-shrink-0">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Active QR Pattern</label>
                <div className="border-4 border-gray-100 rounded-2xl p-4 bg-gray-50 flex flex-col items-center justify-center min-h-[250px] relative">
                  {loading ? (
                    <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrUrl}
                        alt="Active Payment QR"
                        className="w-full h-auto object-contain rounded-xl max-h-56 shadow-sm"
                      />
                      <div className="absolute -bottom-3 bg-green-500 text-white text-[10px] uppercase tracking-wider font-bold py-1 flex items-center gap-1 px-3 rounded-full shadow-md">
                        <CheckCircle className="w-3 h-3" /> Live
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 w-full">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Upload New Code</label>
                <div 
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
                    uploading ? 'border-gray-200 bg-gray-50 cursor-wait' : 'border-gray-300 hover:border-brand-blue hover:bg-blue-50/50 cursor-pointer'
                  }`}
                >
                  <Upload className={`w-8 h-8 mx-auto mb-3 ${uploading ? 'text-gray-400' : 'text-brand-blue'}`} />
                  <h3 className="font-semibold text-gray-700 mb-1">
                    {uploading ? 'Uploading securely...' : 'Click to select new QR image'}
                  </h3>
                  <p className="text-xs text-gray-500">Supported formats: JPG, PNG, WEBP (Square aspect recommended)</p>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  ref={fileInputRef}
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
