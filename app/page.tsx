'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { PrepResults } from '@/types';
import MatchScore from '@/components/MatchScore';
import PrepCard from '@/components/PrepCard';

export default function Home() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PrepResults | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    setCvFile(file);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!cvFile || !jobDescription.trim()) {
      setError('Please upload your CV and paste the job description.');
      return;
    }
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('jd', jobDescription);

      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setResults(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCvFile(null);
    setJobDescription('');
    setResults(null);
    setError('');
    setTimeout(() => inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">

      {/* ── Header ── */}
      <header className="border-b border-white/10 bg-[#0C0A20]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Icon mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 flex-shrink-0">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 20 20" fill="none">
                <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5V12A1.5 1.5 0 0 1 15.5 13.5H10.5L7 17V13.5H4.5A1.5 1.5 0 0 1 3 12V4.5Z" fill="white"/>
                <path d="M6.5 7.5h7M6.5 10.5h4" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="14" cy="10.5" r="1" fill="#818CF8"/>
              </svg>
            </div>
            {/* Wordmark */}
            <div className="flex items-baseline">
              <span className="font-bold text-white text-xl tracking-tight">Brief</span>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">Me</span>
            </div>
          </div>
          {results ? (
            <button onClick={reset} className="text-sm text-slate-400 hover:text-white transition-colors">
              ← New prep
            </button>
          ) : (
            <button
              onClick={() => inputRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Get started
            </button>
          )}
        </div>
      </header>

      {/* ── Hero ── */}
      {!results && (
        <section className="relative overflow-hidden bg-[#0C0A20] py-24 px-6">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
              alt="Modern professional workspace"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
              className="opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0C0A20]/95 via-[#1E1B4B]/85 to-[#0C0A20]/95" />
          </div>

          {/* Gradient orbs — vibrant multi-colour */}
          <div className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/30 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[-80px] right-[5%] w-[420px] h-[420px] rounded-full bg-violet-600/25 blur-[110px] pointer-events-none" />
          <div className="absolute top-[20%] right-[30%] w-[280px] h-[280px] rounded-full bg-pink-600/15 blur-[90px] pointer-events-none" />
          <div className="absolute bottom-[10%] left-[25%] w-[240px] h-[240px] rounded-full bg-teal-500/15 blur-[80px] pointer-events-none" />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#a5b4fc 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />

          <div className="relative max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            {/* Left — copy with entrance animations */}
            <div className="flex-1 text-center lg:text-left">
              <div className="animate-fade-up-1 flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-6">
                <div className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-xs font-bold tracking-wide shadow-lg shadow-emerald-500/40">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-ping opacity-30" />
                  <span className="relative">✦</span>
                  <span className="relative">100% FREE</span>
                </div>
              </div>
              <h1 className="animate-fade-up-2 text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                Walk into your next interview knowing{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  exactly what to say.
                </span>
              </h1>
              <p className="animate-fade-up-3 text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                Drop your CV and any job description. BriefMe analyzes your fit, decodes what the company really wants, and gives you tailored talking points, company intel, and smart questions to ask — in seconds. Free.{' '}
                <span className="text-slate-600 text-sm">Powered by Groq · Llama 3.3</span>
              </p>
              <div className="animate-fade-up-4">
                <button
                  onClick={() => inputRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold hover:from-indigo-600 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/25"
                >
                  Start your prep →
                </button>
              </div>
            </div>

            {/* Mobile — horizontal fan row, shown below CTA */}
            <div className="lg:hidden w-full flex justify-center items-start mt-2">
              {/* Card 1 — match score */}
              <div className="animate-float-a relative z-30 w-[38%] bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-2xl rotate-[-2deg]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative w-9 h-9 flex-shrink-0">
                    <svg viewBox="0 0 48 48" className="w-9 h-9 -rotate-90">
                      <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                      <circle cx="24" cy="24" r="18" fill="none" stroke="#818CF8" strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={2 * Math.PI * 18 * (1 - 0.87)}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-[10px]">87%</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-[11px]">Strong Match</p>
                    <p className="text-slate-400 text-[10px]">Sr. PM</p>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-400">Marketplace ✓</p>
                <p className="text-[10px] text-amber-400">B2B gap △</p>
              </div>

              {/* Card 2 — talking points */}
              <div className="animate-float-b relative z-20 w-[38%] -ml-4 mt-5 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-2xl rotate-[1deg]">
                <p className="text-[9px] font-semibold text-indigo-300 uppercase tracking-wider mb-2">Talking Points</p>
                <ul className="space-y-1.5">
                  {['€400M GMV area', 'AI ordering launch', '50+ org leadership'].map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <span className="w-3 h-3 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[8px] flex-shrink-0 font-bold">{i + 1}</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3 — questions */}
              <div className="animate-float-c relative z-10 w-[38%] -ml-4 mt-10 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-2xl rotate-[-1deg]">
                <p className="text-[9px] font-semibold text-amber-300 uppercase tracking-wider mb-1.5">Ask them</p>
                <p className="text-[10px] text-slate-300 leading-relaxed">"How do you measure product success?"</p>
              </div>
            </div>

            {/* Desktop — absolute floating stack */}
            <div className="hidden lg:block flex-1 relative h-72 w-full">
              {/* Match score card */}
              <div className="animate-float-a absolute top-2 right-12 w-60 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
                      <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                      <circle cx="24" cy="24" r="18" fill="none" stroke="#818CF8" strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={2 * Math.PI * 18 * (1 - 0.87)}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">87%</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Strong Match</p>
                    <p className="text-slate-400 text-xs">Sr. Product Manager</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {['Marketplace expertise ✓', 'Data-driven track record ✓'].map((s, i) => (
                    <p key={i} className="text-xs text-emerald-400">{s}</p>
                  ))}
                  <p className="text-xs text-amber-400">B2B experience △</p>
                </div>
              </div>

              {/* Talking points card */}
              <div className="animate-float-b absolute top-24 left-4 w-64 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-2xl">
                <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-3">Key Talking Points</p>
                <ul className="space-y-2">
                  {['Led a €400M GMV product area', 'Launched AI-powered ordering', '50+ person org leadership'].map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[9px] flex-shrink-0 font-bold">{i + 1}</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions card */}
              <div className="animate-float-c absolute bottom-0 right-6 w-52 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-2xl">
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">Ask them</p>
                <p className="text-xs text-slate-300 leading-relaxed">"How does the team measure product success today?"</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Why you need this ── */}
      {!results && (
        <section className="py-20 px-6 bg-[#F8F9FC] border-b border-slate-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest">The problem</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-3">
                Most candidates walk in half-prepared
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Every interview needs the same research. Every time. Company background, talking points, why you, why them, questions to ask. It takes hours — and it still feels generic.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: '⏳',
                  title: 'Hours of repetitive research',
                  body: 'Same process every time — Googling the company, reading the JD twice, trying to connect the dots between your experience and what they want.',
                  color: '#EF4444',
                },
                {
                  icon: '😶',
                  title: '"Why this company?" catches you off guard',
                  body: 'You know you should have a good answer. But under pressure, you default to something vague that doesn\'t land.',
                  color: '#F97316',
                },
                {
                  icon: '🙈',
                  title: 'Red flags hidden in the JD',
                  body: 'Job descriptions are written by marketing, not the hiring team. The real expectations — and the red flags — are buried in the language.',
                  color: '#8B5CF6',
                },
                {
                  icon: '📉',
                  title: 'You sound like every other candidate',
                  body: 'Generic talking points. Obvious questions. No signal that you did your homework or actually want this specific role.',
                  color: '#6366F1',
                },
              ].map(({ icon, title, body, color }) => (
                <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${color}12` }}
                  >
                    {icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm">
                BriefMe replaces all of that with a single upload —{' '}
                <span className="text-indigo-500 font-medium">tailored to you and the role, in seconds.</span>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      {!results && (
        <section className="py-20 px-6 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">How it works</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">Three steps to your best interview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200" />

              {[
                {
                  step: '01',
                  icon: '📄',
                  title: 'Upload your CV',
                  description: 'Drop your resume as a PDF. The AI reads your full experience, skills, and background instantly.',
                  color: '#6366F1',
                },
                {
                  step: '02',
                  icon: '📋',
                  title: 'Paste the job description',
                  description: 'Copy any job posting — role, requirements, responsibilities. No formatting needed.',
                  color: '#8B5CF6',
                },
                {
                  step: '03',
                  icon: '🚀',
                  title: 'Get your briefing',
                  description: 'Instant match score, talking points, company snapshot, and smart questions to ask — all tailored to you.',
                  color: '#06B6D4',
                },
              ].map(({ step, icon, title, description, color }) => (
                <div key={step} className="relative flex flex-col items-center text-center gap-4">
                  <div
                    className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-md z-10 bg-white border-2"
                    style={{ borderColor: `${color}30`, boxShadow: `0 8px 24px ${color}18` }}
                  >
                    {icon}
                    <span
                      className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      {step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Input section ── */}
      {!results && (
        <section ref={inputRef} className="flex-1 py-16 px-6 bg-[#F8F9FC]">
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-12">
              <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Ready when you are</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-2">Prep for your next interview</h2>
              <p className="text-slate-500">Three steps. Thirty seconds.</p>
            </div>

            {/* Sequential vertical steps */}
            <div className="max-w-2xl mx-auto flex flex-col">

              {/* Step 01 — CV Upload */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" style={{ borderTop: '3px solid #6366F1' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">01</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Upload your CV</p>
                    <p className="text-xs text-slate-400">PDF format · your experience stays private</p>
                  </div>
                </div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer transition-all ${
                    dragging
                      ? 'upload-gradient-border bg-indigo-50/50'
                      : cvFile
                      ? 'border-2 border-emerald-300 bg-emerald-50'
                      : 'upload-gradient-border bg-[#F8F9FC] hover:bg-indigo-50/30'
                  }`}
                >
                  {cvFile ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-emerald-700 truncate">{cvFile.name}</p>
                        <p className="text-xs text-slate-400">Click to replace</p>
                      </div>
                      <span className="text-emerald-500 text-lg flex-shrink-0">✓</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Drop your CV here</p>
                        <p className="text-xs text-slate-400">or click to browse — PDF only</p>
                      </div>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
              </div>

              {/* Connector arrow */}
              <div className="flex flex-col items-center py-2 gap-0.5">
                <div className="w-px h-4 bg-indigo-200" />
                <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </div>

              {/* Step 02 — Job Description */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" style={{ borderTop: '3px solid #8B5CF6' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">02</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Job Description</p>
                      <p className="text-xs text-slate-400">Paste text or drop a URL — Greenhouse, Lever, Workable</p>
                    </div>
                  </div>
                  {/^https?:\/\/.+/.test(jobDescription.trim()) && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium border border-indigo-100 flex-shrink-0">
                      🔗 URL detected
                    </span>
                  )}
                </div>
                <div className="rounded-xl border border-slate-200 bg-[#F8F9FC] focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-transparent transition-all overflow-hidden">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here, or drop a job URL..."
                    className="w-full h-44 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Connector arrow */}
              <div className="flex flex-col items-center py-2 gap-0.5">
                <div className="w-px h-4 bg-indigo-200" />
                <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </div>

              {error && <p className="text-sm text-red-500 text-center mb-3">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-shimmer btn-gradient-flow relative overflow-hidden w-full py-5 rounded-2xl text-white font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{
                backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7, #6366F1)',
                boxShadow: '0 4px 24px rgba(99,102,241,0.55), 0 0 48px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              {/* top edge highlight */}
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {/^https?:\/\/.+/.test(jobDescription.trim()) ? 'Fetching job page & analyzing...' : 'Analyzing your fit...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2.5">
                  <span className="text-xl">✦</span>
                  Generate My Interview Prep
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              )}
            </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Results ── */}
      {results && (
        <section ref={resultsRef} data-results className="flex-1 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Interview prep for</p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {results.role.title}{' '}
                  <span className="text-indigo-500">@ {results.role.company}</span>
                </h2>
              </div>
              <button
                onClick={() => window.print()}
                className="no-print flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.75 19.5m10.56-5.671L17.25 19.5M3 8.25V16.5a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 16.5V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M7.5 11.25h.008v.008H7.5v-.008zm3 0h.008v.008H10.5v-.008zm3 0h.008v.008H13.5v-.008z" />
                </svg>
                Save as PDF
              </button>
            </div>

            <MatchScore match={results.match} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* What They Really Want — full width, prominent */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: '#EF444415' }}>🔍</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">What They Really Want</h3>
                    <p className="text-xs text-slate-400">Decoding the job description</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic border-l-2 border-indigo-200 pl-3">{results.whatTheyReallyWant.summary}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Top Priorities</p>
                    <ul className="space-y-2">
                      {results.whatTheyReallyWant.topPriorities.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Culture Signals</p>
                    <ul className="space-y-2">
                      {results.whatTheyReallyWant.cultureSignals.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-1 text-violet-400 flex-shrink-0">◆</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Watch Out For</p>
                    <ul className="space-y-2">
                      {results.whatTheyReallyWant.redFlags.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-0.5 text-amber-400 flex-shrink-0">⚠</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: '#06B6D415' }}>🏢</span>
                    <h3 className="font-semibold text-slate-900">Company Snapshot</h3>
                  </div>
                  {results.role.website && (
                    <a href={results.role.website} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-cyan-400 hover:text-cyan-600 transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Visit website
                    </a>
                  )}
                </div>
                <dl className="space-y-3">
                  {[
                    { label: 'Overview', value: results.companySnapshot.overview },
                    { label: 'Business Model', value: results.companySnapshot.businessModel },
                    { label: 'Culture', value: results.companySnapshot.culture },
                  ].map((s, i) => (
                    <div key={i}>
                      <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{s.label}</dt>
                      <dd className="text-sm text-slate-700 leading-relaxed">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Recent News */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: '#06B6D415' }}>📰</span>
                  <h3 className="font-semibold text-slate-900">Recent News</h3>
                </div>
                {results.recentNews.length > 0 ? (
                  <ul className="space-y-3">
                    {results.recentNews.map((item, i) => (
                      <li key={i} className="border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-slate-800 font-medium hover:text-indigo-600 transition-colors leading-snug block mb-1">
                          {item.title}
                        </a>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          {item.source && <span className="font-medium text-slate-500">{item.source}</span>}
                          {item.source && item.pubDate && <span>·</span>}
                          {item.pubDate && <span>{new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic">No recent news found for this company.</p>
                )}
              </div>

              <PrepCard title="Why This Company" icon="💡" accent="#8B5CF6" items={results.whyThisCompany} />
              <PrepCard title="Why You" icon="🙋" accent="#6366F1" items={results.whyYou} />

              {/* Elevator Pitch */}
              {results.elevatorPitch && (
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-base flex-shrink-0 shadow-md shadow-indigo-200">🎤</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">Your Opening Pitch</h3>
                      <p className="text-xs text-slate-400">Answer to "Tell me about yourself" — tailored to this role</p>
                    </div>
                  </div>
                  <blockquote className="text-slate-700 text-sm leading-relaxed italic border-l-2 border-indigo-300 pl-4">
                    "{results.elevatorPitch}"
                  </blockquote>
                </div>
              )}

              <div className="md:col-span-2">
                <PrepCard title="Key Talking Points" icon="🎯" accent="#10B981" items={results.talkingPoints} />
              </div>
              <div className="md:col-span-2">
                <PrepCard title="Questions to Ask" icon="❓" accent="#F59E0B" items={results.questionsToAsk} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center mt-auto">
        <p className="text-slate-400 text-sm">
          Built by{' '}
          <a
            href="https://helmutfritz.fyi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-600 transition-colors"
          >
            Helmut Fritz
          </a>
          {' '}using AI tools · {new Date().getFullYear()}
        </p>
      </footer>

    </div>
  );
}
