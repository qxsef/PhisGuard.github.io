import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/State';
import ScanRow from '../components/scan/ScanRow';
import { useScans } from '../hooks/useScans';
import { scanRepository } from '../services/scanRepository';
import { VERDICT_KEYS, VERDICTS } from '../lib/verdict';

export default function History() {
  const { status, scans, error, reload } = useScans();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirming, setConfirming] = useState(false);
  const [actionError, setActionError] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scans.filter((s) => (filter === 'all' || s.verdict === filter) && (!q || s.url.toLowerCase().includes(q)));
  }, [scans, query, filter]);

  async function clearAll() {
    try { await scanRepository.clear(); setConfirming(false); setActionError(''); reload(); }
    catch (e) { setActionError(e.message); }
  }

  const chip = (active) => `min-h-[40px] rounded-full border px-4 text-sm font-semibold transition duration-200 active:scale-[0.96] ${active ? 'border-brand bg-brand/15 text-fg' : 'border-white/10 text-muted hover:border-white/20 hover:text-fg'}`;

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Riwayat pemeriksaan</h1>
          <p className="mt-2 text-muted">Tersimpan di browser ini.</p>
        </div>
        {status === 'ready' && scans.length > 0 && (
          confirming ? (
            <div className="flex items-center gap-2">
              <Button variant="danger" onClick={clearAll}>Hapus semua</Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>Batal</Button>
            </div>
          ) : (
            <Button variant="ghost" icon={Trash2} onClick={() => setConfirming(true)}>Kosongkan</Button>
          )
        )}
      </div>
      <p role="alert" className="min-h-[20px] text-sm text-bad">{actionError}</p>

      <div className="mt-4">
        <label htmlFor="search" className="sr-only">Cari URL</label>
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input id="search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari URL atau domain" className="min-h-[48px] w-full rounded-xl border border-white/10 bg-panel pl-11 pr-4 text-sm outline-none transition duration-200 placeholder:text-muted/60 focus:border-brand" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter status">
          <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')} className={chip(filter === 'all')}>Semua</button>
          {VERDICT_KEYS.map((k) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className={chip(filter === k)}>{VERDICTS[k].label}</button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {status === 'loading' && (
          <div aria-busy="true" aria-label="Memuat riwayat" className="space-y-1">
            {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[66px] w-full" />)}
          </div>
        )}
        {status === 'error' && <ErrorState message={error.message} onRetry={reload} />}
        {status === 'ready' && scans.length === 0 && (
          <EmptyState title="Belum ada pemeriksaan" text="Hasil pemeriksaan akan muncul di sini setelah Anda memindai URL pertama." action={<Link to="/scan"><Button>Pindai URL</Button></Link>} />
        )}
        {status === 'ready' && scans.length > 0 && visible.length === 0 && (
          <EmptyState title="Tidak ada hasil yang cocok" text="Ubah kata kunci atau filter status untuk melihat pemeriksaan lain." action={<Button variant="secondary" onClick={() => { setQuery(''); setFilter('all'); }}>Atur ulang filter</Button>} />
        )}
        {status === 'ready' && visible.length > 0 && (
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {visible.map((s) => <ScanRow key={s.id} scan={s} />)}
          </ul>
        )}
      </div>
    </div>
  );
}
