'use client';

import { useEffect, useState } from 'react';
import { MatchResult, MatchLevel } from '@/types';

const levelConfig: Record<MatchLevel, { color: string; bg: string; gradientFrom: string; gradientTo: string }> = {
  Perfect: { color: '#10B981', bg: '#ECFDF5', gradientFrom: '#34D399', gradientTo: '#059669' },
  Strong:  { color: '#6366F1', bg: '#EEF2FF', gradientFrom: '#818CF8', gradientTo: '#7C3AED' },
  Good:    { color: '#F59E0B', bg: '#FFFBEB', gradientFrom: '#FCD34D', gradientTo: '#D97706' },
  Partial: { color: '#F97316', bg: '#FFF7ED', gradientFrom: '#FB923C', gradientTo: '#EA580C' },
  Weak:    { color: '#EF4444', bg: '#FEF2F2', gradientFrom: '#F87171', gradientTo: '#DC2626' },
};

export default function MatchScore({ match }: { match: MatchResult }) {
  const config = levelConfig[match.level];
  const circumference = 2 * Math.PI * 54;
  const targetOffset = circumference - (match.score / 100) * circumference;
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const t = setTimeout(() => setDashOffset(targetOffset), 80);
    return () => clearTimeout(t);
  }, [targetOffset]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-8">

        <div className="relative flex-shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <defs>
              <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={config.gradientFrom} />
                <stop offset="100%" stopColor={config.gradientTo} />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle cx="70" cy="70" r="54" fill="none" stroke="#F1F5F9" strokeWidth="12" />
            {/* Animated gradient arc */}
            <circle
              cx="70" cy="70" r="54"
              fill="none"
              stroke="url(#score-gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{match.score}%</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1"
              style={{ color: config.color, backgroundColor: config.bg }}
            >
              {match.level}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-slate-600 mb-5 leading-relaxed">{match.summary}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">What's working</p>
              <ul className="space-y-1.5">
                {match.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-emerald-500 flex-shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            {match.gaps.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gap areas</p>
                <ul className="space-y-1.5">
                  {match.gaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 text-amber-400 flex-shrink-0">△</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
