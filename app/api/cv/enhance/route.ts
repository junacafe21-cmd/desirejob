import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { text, section } = await request.json();

    if (!text || !section) {
      return NextResponse.json({ error: 'Missing text or section' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompts: Record<string, string> = {
      objective: `Rewrite the following career objective/summary to sound professional and impactful for a job seeker in Nepal. Keep it concise (2-3 sentences), achievement-oriented, and suitable for the Nepali job market. Only output the rewritten text, nothing else.\n\nOriginal: "${text}"`,
      experience: `Rewrite the following job experience description to be more impactful and professional for a CV/resume. Use strong action verbs, quantify achievements where possible, and make it ATS-friendly. Output only the rewritten text, no explanations.\n\nOriginal: "${text}"`,
      skills: `Improve and expand this skills list for a professional CV. Format as a comma-separated list. Make it relevant and specific. Only output the improved skills list.\n\nOriginal: "${text}"`,
      education: `Rewrite this education description to sound more professional on a CV. Keep it factual and concise. Output only the improved text.\n\nOriginal: "${text}"`,
    };

    const prompt = prompts[section] || `Improve the following text to sound more professional on a CV/resume. Output only the improved text.\n\nOriginal: "${text}"`;

    const result = await model.generateContent(prompt);
    const enhanced = result.response.text().trim();

    return NextResponse.json({ enhanced });
  } catch (error) {
    console.error('AI enhance error:', error);
    return NextResponse.json({ error: 'AI enhancement failed' }, { status: 500 });
  }
}
