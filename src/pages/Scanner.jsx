import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanSearch } from 'lucide-react';
import Button from '../components/ui/Button';
import UrlAnatomy from '../components/scan/UrlAnatomy';
import { analyzeUrl, parseUrl } from '../lib/analyzeUrl';
import { validateUrl } from '../lib/validateUrl';
import { scanRepository } from '../services/scanRepository';

const EXAMPLES = ['https://github.com/anthropics', 'http://paypa1-secure-login.xyz/verify/account'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Scanner() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const preview = useMemo(() => parseUrl(value), [value]);

  async function onSubmit(e) {
    e.preventDefault();
    const check = validateUrl(value);
    if (!check.ok) { setError(check.message); return; }
    setError('');
    setLoading(true);
    try {
      // Jeda singkat agar status "memeriksa" terlihat; analisis sendiri berjalan instan di browser.
      const [result] = await Promise.all([Promise.resolve().then(() => analyzeUrl(value)), wait(600)]);
      await scanRepository.add(result);
      navigate(`/scan/${result.id}`);
    } catch (err) {
      setError(err.message || 'Pemeriksaan gagal. Coba lagi.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Periksa sebuah tautan</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">
        Tempel URL yang mencurigakan. PhishGuard membaca susunan tautannya tanpa membukanya, lalu menjelaskan faktor yang memengaruhi skor risiko.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8">
        <label htmlFor="url" className="text-sm font-semibold">URL</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="url"
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            value={value}
            onChange={(e) => { setValue(e.target.value); if (error) setError(''); }}
            placeholder="https://contoh.com/halaman"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'url-error' : undefined}
            className={`min-h-[48px] w-full flex-1 rounded-xl border bg-panel px-4 font-mono text-sm outline-none transition duration-200 placeholder:text-muted/60 focus:border-brand ${error ? 'border-bad' : 'border-white/10'}`}
          />
          <Button type="submit" loading={loading} icon={ScanSearch} className="sm:min-w-[150px]">
            {loading ? 'Memeriksa' : 'Scan URL'}
          </Button>
        </div>
        <p id="url-error" role="alert" className="mt-2 min-h-[20px] text-sm text-bad">{error}</p>
      </form>

      <section className="mt-6 min-h-[112px]" aria-live="polite">
        {preview ? (
          <>
            <h2 className="mb-2 text-sm font-semibold">Susunan tautan</h2>
            <UrlAnatomy parts={preview.parts} />
          </>
        ) : (
          <p className="text-sm text-muted">Susunan tautan akan tampil di sini saat Anda mengetik.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Coba contoh</h2>
        <p className="mt-1 text-sm text-muted">Contoh ini hanya diisi ke kolom, tidak dibuka.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" onClick={() => { setValue(ex); setError(''); }} className="min-h-[44px] truncate rounded-xl border border-white/10 px-4 py-2 text-left font-mono text-xs text-muted transition duration-200 hover:border-white/20 hover:text-fg active:scale-[0.97]">
              {ex}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
