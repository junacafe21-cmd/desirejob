'use client';

import { forwardRef } from 'react';
import { CVData } from '@/lib/types';

interface CVPreviewProps {
  cv: CVData;
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(function CVPreview({ cv }, ref) {
  return (
    <div ref={ref} style={{
      width: '210mm', minHeight: '297mm', backgroundColor: '#ffffff',
      fontFamily: 'var(--font-inter), Inter, Arial, sans-serif', display: 'flex', color: '#334155'
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

export default CVPreview;
