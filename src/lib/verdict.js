import { ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react';

// Kelas ditulis lengkap agar terbaca oleh Tailwind.
export const VERDICTS = {
  safe: { label: 'Safe', icon: ShieldCheck, text: 'text-ok', bg: 'bg-ok/10', border: 'border-ok/30', dot: 'bg-ok', summary: 'Tidak ditemukan indikator phishing pada pemeriksaan ini. Ini bukan jaminan keamanan.' },
  suspicious: { label: 'Suspicious', icon: TriangleAlert, text: 'text-warn', bg: 'bg-warn/10', border: 'border-warn/30', dot: 'bg-warn', summary: 'Ada beberapa indikator yang perlu dicermati. Jangan memasukkan data pribadi sebelum memastikan tautan berasal dari sumber resmi.' },
  dangerous: { label: 'Dangerous', icon: ShieldAlert, text: 'text-bad', bg: 'bg-bad/10', border: 'border-bad/30', dot: 'bg-bad', summary: 'Banyak indikator phishing ditemukan. Hindari membuka tautan ini dan jangan memasukkan data apa pun.' },
};
export const VERDICT_KEYS = ['safe', 'suspicious', 'dangerous'];
