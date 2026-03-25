'use client';

import { useState, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Download, Loader2, User, GraduationCap, Briefcase, Zap } from 'lucide-react';
import { CVData, EducationEntry, ExperienceEntry } from '@/lib/types';
import toast from 'react-hot-toast';

// Modular Components
import PersonalForm from '@/components/cv-builder/PersonalForm';
import EducationForm from '@/components/cv-builder/EducationForm';
import ExperienceForm from '@/components/cv-builder/ExperienceForm';
import SkillsForm from '@/components/cv-builder/SkillsForm';
import CVPreview from '@/components/cv-builder/CVPreview';

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
              {activeTab === 'personal' && (
                <PersonalForm 
                  personal={cv.personal} 
                  updatePersonal={updatePersonal} 
                  enhanceWithAI={enhanceWithAI} 
                  enhancing={enhancing} 
                />
              )}
              {activeTab === 'education' && (
                <EducationForm 
                  education={cv.education} 
                  addEducation={addEducation} 
                  removeEducation={removeEducation} 
                  updateEducation={updateEducation} 
                />
              )}
              {activeTab === 'experience' && (
                <ExperienceForm 
                  experience={cv.experience} 
                  addExperience={addExperience} 
                  removeExperience={removeExperience} 
                  updateExperience={updateExperience} 
                  enhanceWithAI={enhanceWithAI} 
                  enhancing={enhancing} 
                />
              )}
              {activeTab === 'skills' && (
                <SkillsForm 
                  skills={cv.skills} 
                  skillInput={skillInput} 
                  setSkillInput={setSkillInput} 
                  addSkill={addSkill} 
                  removeSkill={removeSkill} 
                />
              )}
            </div>

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
