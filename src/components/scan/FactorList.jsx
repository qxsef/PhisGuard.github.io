import { CircleCheck, Info, ShieldAlert, TriangleAlert } from 'lucide-react';

const SEV = {
  bad: { icon: ShieldAlert, cls: 'text-bad' },
  warn: { icon: TriangleAlert, cls: 'text-warn' },
  info: { icon: Info, cls: 'text-muted' },
  ok: { icon: CircleCheck, cls: 'text-ok' },
};

export default function FactorList({ factors }) {
  const sorted = [...factors].sort((a, b) => b.points - a.points);
  return (
    <ul className="divide-y divide-white/10 border-y border-white/10">
      {sorted.map((f) => {
        const { icon: Icon, cls } = SEV[f.severity] || SEV.info;
        return (
          <li key={f.id} className="flex gap-3.5 py-4">
            <Icon size={20} className={`mt-0.5 shrink-0 ${cls}`} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{f.detail}</p>
            </div>
            <span className={`shrink-0 pt-0.5 text-sm font-bold tabular-nums ${f.points > 0 ? cls : 'text-muted'}`}>
              {f.points > 0 ? `+${f.points}` : '0'}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
