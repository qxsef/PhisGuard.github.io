import { VERDICT_THRESHOLDS } from '../lib/analyzeUrl';
import { VERDICTS } from '../lib/verdict';

const BANDS = [
  ['safe', `0 sampai ${VERDICT_THRESHOLDS.suspicious - 1}`],
  ['suspicious', `${VERDICT_THRESHOLDS.suspicious} sampai ${VERDICT_THRESHOLDS.dangerous - 1}`],
  ['dangerous', `${VERDICT_THRESHOLDS.dangerous} sampai 100`],
];

export default function About() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Tentang PhishGuard</h1>
      <p className="mt-4 leading-relaxed text-muted">
        PhishGuard membantu Anda menilai sebuah tautan sebelum membukanya. Alat ini membaca susunan URL dan menjelaskan setiap faktor yang menaikkan skor risiko, supaya Anda tahu alasannya dan bisa memutuskan sendiri.
      </p>

      <h2 className="mt-10 text-lg font-bold">Cara skor dihitung</h2>
      <p className="mt-2 leading-relaxed text-muted">Setiap indikator menambah poin, misalnya domain berupa alamat IP, nama merek yang dipakai di domain tidak resmi, atau tautan tanpa HTTPS. Total poin dibatasi sampai 100.</p>
      <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
        {BANDS.map(([k, range]) => (
          <div key={k} className="flex items-center justify-between py-3.5 text-sm">
            <dt className={`flex items-center gap-3 font-semibold ${VERDICTS[k].text}`}><span className={`h-2.5 w-2.5 rounded-full ${VERDICTS[k].dot}`} aria-hidden="true" />{VERDICTS[k].label}</dt>
            <dd className="tabular-nums text-muted">Skor {range}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 text-lg font-bold">Batasan yang perlu diketahui</h2>
      <ul className="mt-3 list-disc space-y-2.5 pl-5 leading-relaxed text-muted">
        <li>HTTPS hanya berarti koneksi terenkripsi. Situs phishing juga bisa memakainya, jadi HTTPS tidak pernah dianggap sebagai bukti aman.</li>
        <li>Pemeriksaan bersifat heuristik dan berjalan di browser. PhishGuard tidak membuka tautan dan tidak melihat isi halaman.</li>
        <li>Status Safe berarti tidak ada indikator yang ditemukan, bukan jaminan keamanan.</li>
        <li>Reputasi domain belum tersedia karena membutuhkan layanan data eksternal yang belum terhubung.</li>
        <li>Riwayat disimpan di penyimpanan browser ini dan tidak disinkronkan ke perangkat lain.</li>
      </ul>
    </div>
  );
}
