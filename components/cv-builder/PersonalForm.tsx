'use client';

import { Wand2, Loader2 } from 'lucide-react';
import { CVData } from '@/lib/types';

interface PersonalFormProps {
  personal: CVData['personal'];
  updatePersonal: (field: string, value: string) => void;
  enhanceWithAI: (section: string, text: string, onResult: (enhanced: string) => void) => void;
  enhancing: string | null;
}

export default function PersonalForm({ personal, updatePersonal, enhanceWithAI, enhancing }: PersonalFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-brand-blue text-lg">Personal Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Full Name *</label>
          <input value={personal.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} className="input-field" placeholder="Ram Bahadur Sharma" />
        </div>
        <div>
          <label className="label">Email *</label>
          <input value={personal.email} onChange={(e) => updatePersonal('email', e.target.value)} type="email" className="input-field" placeholder="ram@email.com" />
        </div>
        <div>
          <label className="label">Phone *</label>
          <input value={personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} className="input-field" placeholder="98XXXXXXXX" />
        </div>
        <div>
          <label className="label">Address</label>
          <input value={personal.address} onChange={(e) => updatePersonal('address', e.target.value)} className="input-field" placeholder="Kathmandu, Nepal" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">LinkedIn</label>
          <input value={personal.linkedin || ''} onChange={(e) => updatePersonal('linkedin', e.target.value)} className="input-field" placeholder="linkedin.com/in/yourprofile" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Career Objective / Summary</label>
          <textarea value={personal.objective} onChange={(e) => updatePersonal('objective', e.target.value)} className="input-field resize-none" rows={3} placeholder="A results-driven professional with..." />
          <button
            onClick={() => enhanceWithAI('objective', personal.objective, (val) => updatePersonal('objective', val))}
            disabled={enhancing === 'objective'}
            type="button"
            className="mt-2 btn-outline text-xs py-1.5 px-4"
          >
            {enhancing === 'objective' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            Enhance with AI
          </button>
        </div>
      </div>
    </div>
  );
}
