# PhishGuard

Pemeriksa keamanan URL untuk membantu mengenali indikasi phishing. Dibangun dengan React, Tailwind CSS, dan Vite.

## Status pengerjaan

| Tahap | Isi | Status |
| --- | --- | --- |
| 1 | Fondasi: design tokens, komponen UI, layout, animasi | Selesai |
| 2 | Scanner, analisis heuristik, hasil dan detail, riwayat, dashboard, halaman Tentang | Selesai |
| 3 | Supabase: tabel PostgreSQL, RLS, Auth, sinkronisasi riwayat | Belum dikerjakan |
| 4 | Polish, pengujian, aksesibilitas, deploy | Belum dikerjakan |

## Menjalankan

```bash
npm install
npm run dev
```

## Cara kerja

- Analisis berjalan di browser (`src/lib/analyzeUrl.js`). URL tidak dibuka dan tidak dikirim ke server.
- Riwayat disimpan di localStorage lewat `src/services/scanRepository.js`. Tahap 3 akan mengganti isi file ini dengan Supabase tanpa mengubah komponen.
- Reputasi domain belum tersedia karena butuh layanan data eksternal. Fitur ini sengaja tidak dipalsukan.
- HTTPS tidak pernah dianggap bukti keamanan.

## Struktur

```
src/
  components/  ui/ (Button, Skeleton, StatusBadge, State), layout/, scan/
  hooks/       useScans
  lib/         analyzeUrl, validateUrl, verdict, format
  pages/       Dashboard, Scanner, ScanResult, History, About
  services/    scanRepository
```

## Environment

Salin `.env.example` ke `.env` saat Supabase mulai dihubungkan. Jangan commit file `.env`.
