import { TriangleAlert } from 'lucide-react';
import Button from './Button';

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-bad/30 bg-bad/10 p-4">
      <TriangleAlert size={20} className="mt-0.5 shrink-0 text-bad" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-fg">Data tidak bisa dimuat</p>
        <p className="mt-1 text-sm text-muted">{message}</p>
        {onRetry && <Button variant="secondary" className="mt-3" onClick={onRetry}>Coba lagi</Button>}
      </div>
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
      <p className="text-base font-semibold">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">{text}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
