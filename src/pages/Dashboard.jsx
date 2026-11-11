import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ScanSearch } from 'lucide-react';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/State';
import ScanRow from '../components/scan/ScanRow';
import { useScans } from '../hooks/useScans';
import { VERDICT_KEYS, VERDICTS } from '../lib/verdict';

const BAR = { safe: 'bg-ok', suspicious: 'bg-warn', dangerous: 'bg-bad' };

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat dashboard" className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <Skeleton className="h-24 w-44" />
        <Skeleton className="mt-8 h-3 w-full" />
        <Skeleton className="mt-8 h-40 w-full" />
      </div>
      <div className="space-y-1">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[66px] w-full" />)}</div>
    </div>
  );
}

export default function Dashboard() {
  const { status, scans, error, reload } = useScans();
  const counts = useMemo(() => {
    const c = { safe: 0, suspicious: 0, dangerous: 0 };
    scans.forEach((s) => { c[s.verdict] += 1; });
    return c;
  }, [scans]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Ringkasan keamanan</h1>
          <p className="mt-2 max-w-lg text-muted">Pantau hasil pemeriksaan tautan yang pernah Anda pindai di browser ini.</p>
        </div>
        <Link to="/scan"><Button icon={ScanSearch}>Pindai URL</Button></Link>
      </div>

      <div className="mt-10">
        {status === 'loading' && <DashboardSkeleton />}
        {status === 'error' && <ErrorState message={error.message} onRetry={reload} />}
        {status === 'ready' && scans.length === 0 && (
          <EmptyState title="Belum ada data" text="Pindai URL pertama Anda. Total dan sebaran status akan dihitung dari pemeriksaan nyata, bukan data contoh." action={<Link to="/scan"><Button>Mulai memindai</Button></Link>} />
        )}
        {status === 'ready' && scans.length > 0 && (
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <section aria-labelledby="total-h">
              <h2 id="total-h" className="text-sm font-semibold text-muted">URL diperiksa</h2>
              <p className="mt-1 text-7xl font-extrabold tabular-nums tracking-tight">{scans.length}</p>

              <div className="mt-8 flex h-3 gap-1 overflow-hidden rounded-full" role="img" aria-label={`Safe ${counts.safe}, Suspicious ${counts.suspicious}, Dangerous ${counts.dangerous}`}>
                {VERDICT_KEYS.filter((k) => counts[k] > 0).map((k) => (
                  <div key={k} className={`${BAR[k]} rounded-full transition-[flex-grow] duration-500`} style={{ flexGrow: counts[k] }} />
                ))}
              </div>

              <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
                {VERDICT_KEYS.map((k) => (
                  <div key={k} className="flex items-center justify-between py-3.5">
                    <dt className="flex items-center gap-3 text-sm font-semibold"><span className={`h-2.5 w-2.5 rounded-full ${VERDICTS[k].dot}`} aria-hidden="true" />{VERDICTS[k].label}</dt>
                    <dd className="text-lg font-bold tabular-nums">{counts[k]}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="recent-h">
              <div className="flex items-center justify-between">
                <h2 id="recent-h" className="text-lg font-bold">Aktivitas terbaru</h2>
                <Link to="/history" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand transition hover:text-fg">Lihat semua</Link>
              </div>
              <ul className="mt-2 divide-y divide-white/10 border-y border-white/10">
                {scans.slice(0, 5).map((s) => <ScanRow key={s.id} scan={s} />)}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
