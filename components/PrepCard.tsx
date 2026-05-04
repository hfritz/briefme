'use client';

interface Props {
  title: string;
  icon: string;
  items?: string[];
  sections?: { label: string; value: string }[];
  accent?: string;
}

export default function PrepCard({ title, icon, items, sections, accent = '#6366F1' }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${accent}15` }}
        >
          {icon}
        </span>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>

      {items && (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
              <span
                className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                style={{ backgroundColor: accent }}
              >
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}

      {sections && (
        <dl className="space-y-3">
          {sections.map((s, i) => (
            <div key={i}>
              <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{s.label}</dt>
              <dd className="text-sm text-slate-700 leading-relaxed">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
