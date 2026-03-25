'use client';

import { Plus, Trash2, Wand2, Loader2 } from 'lucide-react';
import { ExperienceEntry } from '@/lib/types';

interface ExperienceFormProps {
  experience: ExperienceEntry[];
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, field: string, value: string) => void;
  enhanceWithAI: (section: string, text: string, onResult: (enhanced: string) => void) => void;
  enhancing: string | null;
}

export default function ExperienceForm({ experience, addExperience, removeExperience, updateExperience, enhanceWithAI, enhancing }: ExperienceFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-blue text-lg">Work Experience</h3>
        <button onClick={addExperience} type="button" className="btn-primary text-xs py-2 px-4"><Plus className="w-3.5 h-3.5" /> Add</button>
      </div>
      {experience.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">No experience added yet.</div>
      )}
      {experience.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex justify-end">
            <button onClick={() => removeExperience(exp.id)} type="button" className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
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
                type="button"
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
  );
}
