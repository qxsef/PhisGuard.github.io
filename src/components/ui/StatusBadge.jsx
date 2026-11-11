import { VERDICTS } from '../../lib/verdict';

export default function StatusBadge({ verdict, size = 'sm' }) {
  const v = VERDICTS[verdict];
  const Icon = v.icon;
  const pad = size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${pad} ${v.text} ${v.bg} ${v.border}`}>
      <Icon size={size === 'lg' ? 16 : 14} aria-hidden="true" />
      {v.label}
    </span>
  );
}
