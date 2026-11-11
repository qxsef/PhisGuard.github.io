import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import StatusBadge from '../components/ui/StatusBadge';
import { EmptyState, ErrorState } from '../components/ui/State';
import RiskGauge from '../components/scan/RiskGauge';
import UrlAnatomy from '../components/scan/UrlAnatomy';
import FactorList from '../components/scan/FactorList';
import { analyzeUrl } from '../lib/analyzeUrl';
import { VERDICTS } from '../lib/verdict';
import { formatDateTime } from '../lib/format';
import { scanRepository } from '../services/scanRepository';

const HTTPS_TEXT = { yes: 'Aktif', no: 'Tidak aktif', unknown: 'Tidak disebutkan' };

function ResultSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat hasil">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-10 w-3/4 max-w-md" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      <Skeleton className="mt-8 h-14 w-full" />
      <Skeleton className="mt-8 h-24 w-full" />
      <Skeleton className="mt-8 h-64 w-full" />
    </div>
  );
}

export default function ScanResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', scan: null, error: null });
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    setState({ status: 'loading', scan: null, error: null });
    try {
      const scan = await scanRepository.get(id);
      setState({ status: scan ? 'ready' : 'missing', scan, error: null });
    } catch (error) {
      setState({ status: 'error', scan: null, error });
    }
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function rescan() {
    setBusy(true); setActionError('');
    try {
      const result = analyzeUrl(state.scan.url);
      await scanRepository.add(result);
      navigate(`/scan/${result.id}`);
    } catch (e) { setActionError(e.message); }
    setBusy(false);
  }

  async function remove() {
    setBusy(true); setActionError('');
    try {
      await scanRepository.remove(id);
      navigate('/history');
    } catch (e) { setActionError(e.message); setBusy(false); }
  }

  if (state.status === 'loading') return <ResultSkeleton />;
  if (state.status === 'error') return <ErrorState message={state.error.message} onRetry={load} />;
  if (state.status === 'missing') {
    return <EmptyState title="Hasil tidak ditemukan" text="Hasil ini mungkin sudah dihapus dari riwayat." action={<Link to="/scan"><Button>Pindai URL baru</Button></Link>} />;
  }

  const s = state.scan;
  const v = VERDICTS[s.verdict];
  const rows = [
    ['Domain', s.domain],
    ['HTTPS', HTTPS_TEXT[s.https]],
    ['Struktur URL', s.structure.label],
    ['Reputasi domain', 'Belum tersedia'],
    ['Risk score', `${s.score} dari 100`],
  ];

  return (
    <article>
      <Link to="/history" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-muted transition hover:text-fg"><ArrowLeft size={16} aria-hidden="true" />Riwayat</Link>

      <header className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <StatusBadge verdict={s.verdict} size="lg" />
          <h1 className="mt-4 break-all text-3xl font-extrabold tracking-tight md:text-4xl">{s.domain}</h1>
          <p className="mt-1 text-sm text-muted">Diperiksa {formatDateTime(s.scannedAt)}</p>
        </div>
        <p className={`text-6xl font-extrabold tabular-nums ${v.text}`} aria-hidden="true">{s.score}</p>
      </header>

      <p className="mt-5 max-w-2xl leading-relaxed">{v.summary}</p>

      <section className="mt-8 max-w-2xl"><RiskGauge score={s.score} /></section>

      <section className="mt-10 max-w-3xl">
        <h2 className="mb-3 text-lg font-bold">Susunan tautan</h2>
        <UrlAnatomy parts={s.parts} flagged={s.flagged} />
      </section>

      <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <h2 className="mb-3 text-lg font-bold">Faktor yang memengaruhi skor</h2>
          <FactorList factors={s.factors} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-bold">Ringkasan</h2>
          <dl className="divide-y divide-white/10 border-y border-white/10 text-sm">
            {rows.map(([k, val]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="break-all text-right font-semibold">{val}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-muted">Reputasi domain membutuhkan layanan data eksternal yang belum terhubung, sehingga tidak ditampilkan.</p>
        </div>
      </section>

      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted">Hasil berasal dari analisis heuristik lokal ({s.engine}). PhishGuard tidak membuka tautan dan tidak dapat memastikan isi halaman.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" icon={RefreshCw} onClick={rescan} loading={busy}>Pindai ulang</Button>
        <Button variant="danger" icon={Trash2} onClick={remove} disabled={busy}>Hapus dari riwayat</Button>
      </div>
      <p role="alert" className="mt-3 min-h-[20px] text-sm text-bad">{actionError}</p>
    </article>
  );
}
