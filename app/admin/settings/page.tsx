import { useEffect, useState, useRef } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { Settings, Upload, CheckCircle, Loader2, QrCode, User, Globe, ShieldCheck, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [qrUrl, setQrUrl] = useState<string>('/qr-esewa.png');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [storageStatus, setStorageStatus] = useState<any>(null);
  const [checkingStorage, setCheckingStorage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Fetch Admin Profile
  const fetchProfile = async () => {
    setProfileLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
    setProfileLoading(false);
  };

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

  // Check Storage Health
  const checkStorageHealth = async () => {
    setCheckingStorage(true);
    const buckets = ['qr-codes', 'payment-screenshots', 'cv-uploads'];
    const results: any = {};
    
    for (const b of buckets) {
      const { data, error } = await supabase.storage.getBucket(b);
      results[b] = { exists: !error, public: data?.public || false };
    }
    setStorageStatus(results);
    setCheckingStorage(false);
  };

  useEffect(() => {
    fetchQR();
    fetchProfile();
    checkStorageHealth();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone
      })
      .eq('id', profile.id);
    
    if (error) toast.error(error.message);
    else toast.success('Profile updated successfully!');
    setProfileLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `avatar-${profile.id}-${Date.now()}.${file.name.split('.').pop()}`;

    try {
      const { error } = await supabase.storage
        .from('qr-codes') // Reusing for now or create another
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from('qr-codes').getPublicUrl(fileName);
      
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Profile picture updated!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `payment-qr-${Date.now()}.${file.name.split('.').pop()}`;

    try {
      const { error } = await supabase.storage
        .from('qr-codes')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;
      
      toast.success('New QR Code activated!');
      fetchQR();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <AdminSidebar />
      <main className="flex-1 overflow-auto pb-12">
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center gap-3 sticky top-0 z-10">
          <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-blue">Platform Settings</h1>
            <p className="text-gray-500 text-sm">Manage global settings and admin profile</p>
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto space-y-8">
          
          {/* Section 1: Admin Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold">Admin Profile</h2>
              <p className="text-sm text-gray-500">Update your personal information and profile picture.</p>
            </div>
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {profileLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-blue" /></div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-brand-blue transition-colors">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-gray-300" />
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl border border-gray-100 shadow-md hover:text-brand-blue transition-all"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      <input type="file" ref={avatarInputRef} className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{profile?.full_name || 'Admin'}</h3>
                      <p className="text-sm text-gray-500">{profile?.email}</p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-50 text-brand-blue text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-100">
                        {profile?.role} Access
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name</label>
                      <input 
                        type="text" 
                        value={profile?.full_name || ''} 
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        className="input-field" 
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="label">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profile?.phone || ''} 
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="input-field" 
                        placeholder="98XXXXXXXX"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={profileLoading} className="btn-primary px-6 py-2.5">
                    Save Profile
                  </button>
                </form>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: QR Code */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold">Payment Configuration</h2>
              <p className="text-sm text-gray-500">Update the eSewa QR code used by job seekers.</p>
            </div>
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-56 flex-shrink-0">
                  <div className="aspect-[3/4] border-4 border-gray-100 rounded-2xl p-3 bg-gray-50 flex flex-col items-center justify-center relative">
                    {loading ? (
                      <Loader2 className="animate-spin text-gray-300" />
                    ) : (
                      <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain rounded-lg" />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div 
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-brand-blue hover:bg-blue-50/50 cursor-pointer transition-all"
                  >
                    <QrCode className="w-8 h-8 text-brand-blue mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800">Replace QR Image</h4>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 800x1000px</p>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleQRUpload} accept="image/*" />
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-700 leading-relaxed">
                    <strong>Note:</strong> Replacing the QR code updates it instantly for all users. Ensure the new QR is linked to the correct account receiving NPR 500 payments.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 3: Storage Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold">System Integrity</h2>
              <p className="text-sm text-gray-500">Check bucket availability and storage permissions.</p>
            </div>
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                    Storage Buckets
                  </h3>
                  <button 
                    onClick={checkStorageHealth} 
                    disabled={checkingStorage}
                    className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
                  >
                    {checkingStorage ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    Refresh
                  </button>
                </div>

                <div className="space-y-2">
                  {storageStatus && Object.entries(storageStatus).map(([name, status]: any) => (
                    <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${status.exists ? 'bg-green-100' : 'bg-red-100'}`}>
                          {status.exists ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                        </div>
                        <span className="text-sm font-medium">{name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${status.public ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {status.public ? 'Public' : 'Private'}
                        </span>
                        <span className={`text-xs font-bold ${status.exists ? 'text-green-600' : 'text-red-600'}`}>
                          {status.exists ? 'Verified' : 'Missing'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {storageStatus && Object.values(storageStatus).some((s: any) => !s.exists) && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700">
                    <strong>Critical:</strong> One or more storage buckets are missing. Please go to your **Supabase Dashboard &gt; Storage** and create the missing buckets manually with the names listed above.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

