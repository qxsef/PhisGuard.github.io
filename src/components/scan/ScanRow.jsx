import { Link } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';
import { formatRelative } from '../../lib/format';

export default function ScanRow({ scan }) {
  return (
    <li>
      <Link to={`/scan/${scan.id}`} className="flex items-center gap-4 px-1 py-3.5 transition duration-200 hover:bg-white/[0.03] active:scale-[0.99] sm:px-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{scan.domain}</p>
          <p className="truncate font-mono text-xs text-muted">{scan.url}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-xs text-muted">{formatRelative(scan.scannedAt)}</span>
          <StatusBadge verdict={scan.verdict} />
        </div>
      </Link>
    </li>
  );
}
