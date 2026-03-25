'use client';

import { Plus, Trash2 } from 'lucide-react';
import { EducationEntry } from '@/lib/types';

interface EducationFormProps {
  education: EducationEntry[];
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, field: string, value: string) => void;
}

export default function EducationForm({ education, addEducation, removeEducation, updateEducation }: EducationFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-blue text-lg">Education</h3>
        <button onClick={addEducation} type="button" className="btn-primary text-xs py-2 px-4"><Plus className="w-3.5 h-3.5" /> Add</button>
      </div>
      {education.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">No education added. Click &quot;Add&quot; to start.</div>
      )}
      {education.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex justify-end">
            <button onClick={() => removeEducation(edu.id)} type="button" className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
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
  );
}
