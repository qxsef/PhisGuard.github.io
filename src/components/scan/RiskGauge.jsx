import { useEffect, useState } from 'react';
import { VERDICT_THRESHOLDS } from '../../lib/analyzeUrl';

const ZONES = [
  { key: 'safe', label: 'Safe', width: VERDICT_THRESHOLDS.suspicious, color: 'bg-ok' },
  { key: 'suspicious', label: 'Suspicious', width: VERDICT_THRESHOLDS.dangerous - VERDICT_THRESHOLDS.suspicious, color: 'bg-warn' },
  { key: 'dangerous', label: 'Dangerous', width: 100 - VERDICT_THRESHOLDS.dangerous, color: 'bg-bad' },
];

export default function RiskGauge({ score }) {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setPos(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  return (
    <div role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label="Skor risiko">
      <div className="relative pt-3">
        <div className="flex gap-1">
          {ZONES.map((z) => <div key={z.key} style={{ width: `${z.width}%` }} className={`h-2.5 rounded-full ${z.color} opacity-80`} />)}
        </div>
        <span
          className="absolute top-0 h-[22px] w-1 -translate-x-1/2 rounded-full bg-fg shadow transition-[left] duration-700 ease-out"
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex gap-1 text-[11px] text-muted">
        {ZONES.map((z) => <span key={z.key} style={{ width: `${z.width}%` }}>{z.label}</span>)}
      </div>
    </div>
  );
}
