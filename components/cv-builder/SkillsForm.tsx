'use client';

import { Plus } from 'lucide-react';

interface SkillsFormProps {
  skills: string[];
  skillInput: string;
  setSkillInput: (val: string) => void;
  addSkill: () => void;
  removeSkill: (i: number) => void;
}

export default function SkillsForm({ skills, skillInput, setSkillInput, addSkill, removeSkill }: SkillsFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-brand-blue text-lg">Skills</h3>
      <div className="flex gap-2">
        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          className="input-field flex-1"
          placeholder="e.g. JavaScript, Project Management..."
        />
        <button onClick={addSkill} type="button" className="btn-primary px-5 py-2.5 whitespace-nowrap"><Plus className="w-4 h-4" /></button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span key={i} className="badge bg-brand-blue/10 text-brand-blue gap-1 pr-2">
              {skill}
              <button onClick={() => removeSkill(i)} type="button" className="ml-1 text-brand-blue/50 hover:text-red-500 transition text-xs">×</button>
            </span>
          ))}
        </div>
      )}
      {skills.length === 0 && <p className="text-gray-400 text-sm">Add your skills one by one and press Enter or click +</p>}
    </div>
  );
}
