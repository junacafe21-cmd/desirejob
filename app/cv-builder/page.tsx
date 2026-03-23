'use client';

import { useState, useRef, useCallback, forwardRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Plus, Trash2, Wand2, Download, Loader2, User, GraduationCap, Briefcase, Zap, Save } from 'lucide-react';
import { CVData, EducationEntry, ExperienceEntry } from '@/lib/types';
import toast from 'react-hot-toast';

const defaultCV: CVData = {
  personal: { fullName: '', email: '', phone: '', address: '', linkedin: '', objective: '' },
  education: [],
  experience: [],
  skills: [],
};

const newEdu = (): EducationEntry => ({ id: Date.now().toString(), institution: '', degree: '', field: '', year: '', gpa: '' });
const newExp = (): ExperienceEntry => ({ id: Date.now().toString(), company: '', position: '', duration: '', description: '' });

export default function CVBuilderPage() {
  const [cv, setCv] = useState<CVData>(defaultCV);
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'experience' | 'skills'>('personal');
  const [skillInput, setSkillInput] = useState('');
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  const updatePersonal = (field: string, value: string) => {
    setCv((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const addEducation = () => setCv((prev) => ({ ...prev, education: [...prev.education, newEdu()] }));
  const removeEducation = (id: string) => setCv((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  const updateEducation = (id: string, field: string, value: string) => {
    setCv((prev) => ({ ...prev, education: prev.education.map((e) => e.id === id ? { ...e, [field]: value } : e) }));
  };

  const addExperience = () => setCv((prev) => ({ ...prev, experience: [...prev.experience, newExp()] }));
  const removeExperience = (id: string) => setCv((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }));
  const updateExperience = (id: string, field: string, value: string) => {
    setCv((prev) => ({ ...prev, experience: prev.experience.map((e) => e.id === id ? { ...e, [field]: value } : e) }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setCv((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  };

  const removeSkill = (i: number) => setCv((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }));

  const enhanceWithAI = async (section: string, text: string, onResult: (enhanced: string) => void) => {
    if (!text.trim()) { toast.error('Please write something first'); return; }
    setEnhancing(section);
    try {
      const res = await fetch('/api/cv/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, section }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onResult(data.enhanced);
      toast.success('✨ Enhanced with AI!');
    } catch (err: any) {
      toast.error(err.message || 'AI enhancement failed');
    } finally {
      setEnhancing(null);
    }
  };

  const exportPDF = useCallback(async () => {
    if (!cv.personal.fullName) { toast.error('Please add your name first'); return; }
    setExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      if (!cvPreviewRef.current) return;

      const canvas = await html2canvas(cvPreviewRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        let y = 0;
        while (y < pdfHeight) {
          pdf.addImage(imgData, 'PNG', 0, -y, pdfWidth, pdfHeight);
          y += pageHeight;
          if (y < pdfHeight) pdf.addPage();
        }
      }

      pdf.save(`${cv.personal.fullName.replace(/\s+/g, '_')}_CV.pdf`);
      toast.success('CV downloaded!');
    } catch {
      toast.error('Export failed. Try again.');
    } finally {
      setExporting(false);
    }
  }, [cv]);

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Zap },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="hero-gradient py-10 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          AI-Powered <span className="text-brand-orange">CV Builder</span>
        </h1>
        <p className="text-white/70 text-base max-w-xl mx-auto">
          Create a professional CV in minutes. Use AI to enhance your descriptions.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-5">
            {/* Tab nav */}
            <div className="bg-white rounded-2xl p-2 flex gap-1 shadow-sm border border-gray-100">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === id ? 'bg-brand-blue text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="card p-6">
              {/* Personal Info */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-brand-blue text-lg">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label">Full Name *</label>
                      <input value={cv.personal.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} className="input-field" placeholder="Ram Bahadur Sharma" />
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input value={cv.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} type="email" className="input-field" placeholder="ram@email.com" />
                    </div>
                    <div>
                      <label className="label">Phone *</label>
                      <input value={cv.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} className="input-field" placeholder="98XXXXXXXX" />
                    </div>
                    <div>
                      <label className="label">Address</label>
                      <input value={cv.personal.address} onChange={(e) => updatePersonal('address', e.target.value)} className="input-field" placeholder="Kathmandu, Nepal" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label">LinkedIn</label>
                      <input value={cv.personal.linkedin || ''} onChange={(e) => updatePersonal('linkedin', e.target.value)} className="input-field" placeholder="linkedin.com/in/yourprofile" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label">Career Objective / Summary</label>
                      <textarea value={cv.personal.objective} onChange={(e) => updatePersonal('objective', e.target.value)} className="input-field resize-none" rows={3} placeholder="A results-driven professional with..." />
                      <button
                        onClick={() => enhanceWithAI('objective', cv.personal.objective, (val) => updatePersonal('objective', val))}
                        disabled={enhancing === 'objective'}
                        className="mt-2 btn-outline text-xs py-1.5 px-4"
                      >
                        {enhancing === 'objective' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                        Enhance with AI
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Education */}
              {activeTab === 'education' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-brand-blue text-lg">Education</h3>
                    <button onClick={addEducation} className="btn-primary text-xs py-2 px-4"><Plus className="w-3.5 h-3.5" /> Add</button>
                  </div>
                  {cv.education.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">No education added. Click &quot;Add&quot; to start.</div>
                  )}
                  {cv.education.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex justify-end">
                        <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="label">Institution</label>
                          <input value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="input-field" placeholder="Tribhuvan University" />
                        </div>
                        <div>
                          <label className="label">Degree</label>
                          <input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="input-field" placeholder="Bachelor's" />
                        </div>
                        <div>
                          <label className="label">Field of Study</label>
                          <input value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} className="input-field" placeholder="Computer Science" />
                        </div>
                        <div>
                          <label className="label">Year</label>
                          <input value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} className="input-field" placeholder="2020 - 2024" />
                        </div>
                        <div>
                          <label className="label">GPA / CGPA</label>
                          <input value={edu.gpa || ''} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} className="input-field" placeholder="3.8 / 4.0" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-brand-blue text-lg">Work Experience</h3>
                    <button onClick={addExperience} className="btn-primary text-xs py-2 px-4"><Plus className="w-3.5 h-3.5" /> Add</button>
                  </div>
                  {cv.experience.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">No experience added yet.</div>
                  )}
                  {cv.experience.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex justify-end">
                        <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="label">Company</label>
                          <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="input-field" placeholder="Leapfrog Technology" />
                        </div>
                        <div>
                          <label className="label">Position</label>
                          <input value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="input-field" placeholder="Software Engineer" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label">Duration</label>
                          <input value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} className="input-field" placeholder="Jan 2022 – Present" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label">Description / Achievements</label>
                          <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className="input-field resize-none" rows={3} placeholder="Describe your role and key achievements..." />
                          <button
                            onClick={() => enhanceWithAI('experience', exp.description, (val) => updateExperience(exp.id, 'description', val))}
                            disabled={enhancing === 'exp_' + exp.id}
                            className="mt-2 btn-outline text-xs py-1.5 px-4"
                          >
                            {enhancing === 'exp_' + exp.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                            Enhance with AI
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-brand-blue text-lg">Skills</h3>
                  <div className="flex gap-2">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="input-field flex-1"
                      placeholder="e.g. JavaScript, Project Management..."
                    />
                    <button onClick={addSkill} className="btn-primary px-5 py-2.5 whitespace-nowrap"><Plus className="w-4 h-4" /></button>
                  </div>
                  {cv.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cv.skills.map((skill, i) => (
                        <span key={i} className="badge bg-brand-blue/10 text-brand-blue gap-1 pr-2">
                          {skill}
                          <button onClick={() => removeSkill(i)} className="ml-1 text-brand-blue/50 hover:text-red-500 transition text-xs">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  {cv.skills.length === 0 && <p className="text-gray-400 text-sm">Add your skills one by one and press Enter or click +</p>}
                </div>
              )}
            </div>

            {/* Export button */}
            <button onClick={exportPDF} disabled={exporting} className="btn-primary w-full py-3.5 justify-center text-sm disabled:opacity-60">
              {exporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</> : <><Download className="w-4 h-4" /> Download CV as PDF</>}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="hidden xl:block">
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-brand-blue">Live Preview</h3>
                <span className="text-xs text-gray-400">A4 size</span>
              </div>
              <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200" style={{ transform: 'scale(0.85)', transformOrigin: 'top center', marginBottom: '-15%' }}>
                <CVPreview cv={cv} ref={cvPreviewRef} />
              </div>
            </div>
          </div>
          {/* Mobile preview (hidden by default, shown below) */}
          <div className="xl:hidden">
            <h3 className="font-bold text-brand-blue mb-3">Preview</h3>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200" style={{ transform: 'scale(0.65)', transformOrigin: 'top left', marginBottom: '-35%', marginRight: '-60px' }}>
              <CVPreview cv={cv} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// CV Preview Component
const CVPreview = forwardRef<HTMLDivElement, { cv: CVData }>(function CVPreview({ cv }, ref) {
  return (
    <div ref={ref} style={{
      width: '210mm', minHeight: '297mm', backgroundColor: '#ffffff',
      fontFamily: 'Inter, Arial, sans-serif', display: 'flex', color: '#334155'
    }}>
      {/* Left Sidebar (35%) */}
      <div style={{ width: '35%', backgroundColor: '#0f172a', padding: '40px 30px', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{
            width: '90px', height: '90px', backgroundColor: '#38bdf8', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', fontWeight: '800', color: '#ffffff',
            margin: '0 auto 16px', letterSpacing: '-1px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            {cv.personal.fullName ? cv.personal.fullName.charAt(0).toUpperCase() : 'CV'}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
            {cv.personal.fullName || 'Your Name'}
          </h1>
        </div>

        {/* Contact Info */}
        <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: '#38bdf8', marginBottom: '12px', paddingBottom: '4px', borderBottom: '1px solid rgba(56, 189, 248, 0.3)' }}>Contact</h3>
          {cv.personal.email && <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><span>✉</span> <span style={{ wordBreak: 'break-all' }}>{cv.personal.email}</span></div>}
          {cv.personal.phone && <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><span>📞</span> <span>{cv.personal.phone}</span></div>}
          {cv.personal.address && <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><span>📍</span> <span>{cv.personal.address}</span></div>}
          {cv.personal.linkedin && <div style={{ display: 'flex', gap: '8px' }}><span>🔗</span> <span style={{ wordBreak: 'break-all' }}>{cv.personal.linkedin.replace(/^https?:\/\//, '')}</span></div>}
        </div>

        {/* Skills */}
        {cv.skills.length > 0 && (
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: '#38bdf8', marginBottom: '12px', paddingBottom: '4px', borderBottom: '1px solid rgba(56, 189, 248, 0.3)' }}>Skills & Expertise</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {cv.skills.map((skill, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Main Column (65%) */}
      <div style={{ width: '65%', padding: '40px' }}>
        
        {/* Objective */}
        {cv.personal.objective && (
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#38bdf8', display: 'inline-block' }}></span>
              Professional Profile
            </h2>
            <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '12px', margin: 0, textAlign: 'justify' }}>{cv.personal.objective}</p>
          </section>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#38bdf8', display: 'inline-block' }}></span>
              Work Experience
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {cv.experience.map((exp) => (
                <div key={exp.id} style={{ position: 'relative', paddingLeft: '16px', borderLeft: '2px solid #e2e8f0' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', backgroundColor: '#38bdf8', borderRadius: '50%' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <strong style={{ color: '#0f172a', fontSize: '14px', fontWeight: '700' }}>{exp.position}</strong>
                    <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>{exp.duration}</span>
                  </div>
                  <p style={{ color: '#0284c7', fontWeight: '600', fontSize: '12px', margin: '0 0 6px 0' }}>{exp.company}</p>
                  {exp.description && <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '11px', margin: 0 }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#38bdf8', display: 'inline-block' }}></span>
              Education
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cv.education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                    <strong style={{ color: '#0f172a', fontSize: '13px', fontWeight: '700' }}>{edu.degree} {edu.field && <span style={{ fontWeight: '400' }}>in {edu.field}</span>}</strong>
                    <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600' }}>{edu.year}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#475569', fontSize: '12px', margin: 0, fontWeight: '500' }}>{edu.institution}</p>
                    {edu.gpa && <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700' }}>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});
