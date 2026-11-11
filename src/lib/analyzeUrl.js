// Analisis heuristik lokal. PhishGuard tidak membuka URL: hanya membaca teks tautannya.
// Skor menunjukkan indikasi, bukan bukti. Reputasi domain butuh sumber data eksternal
// dan sengaja tidak dipalsukan di sini.

export const ENGINE = 'heuristik-lokal-v1';

const SUSPICIOUS_TLDS = new Set(['zip', 'top', 'xyz', 'click', 'country', 'gq', 'tk', 'ml', 'cf', 'ga', 'work', 'loan', 'rest', 'cam', 'icu', 'monster']);
const SHORTENERS = new Set(['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'cutt.ly', 's.id', 'rebrand.ly', 'ow.ly', 'shorturl.at', 'rb.gy']);
const SENSITIVE_WORDS = ['login', 'signin', 'verify', 'verifikasi', 'secure', 'update', 'account', 'akun', 'password', 'otp', 'wallet', 'claim', 'hadiah', 'konfirmasi', 'banking'];
const SECOND_LEVEL = new Set(['co', 'com', 'net', 'org', 'go', 'ac', 'or', 'web', 'my', 'sch']);
const BRANDS = {
  paypal: ['paypal.com'],
  google: ['google.com', 'google.co.id'],
  microsoft: ['microsoft.com', 'live.com', 'office.com'],
  apple: ['apple.com', 'icloud.com'],
  facebook: ['facebook.com', 'fb.com'],
  instagram: ['instagram.com'],
  whatsapp: ['whatsapp.com', 'wa.me'],
  netflix: ['netflix.com'],
  amazon: ['amazon.com'],
  shopee: ['shopee.co.id', 'shopee.com'],
  tokopedia: ['tokopedia.com'],
  gopay: ['gopay.co.id', 'gojek.com'],
  dana: ['dana.id'],
  ovo: ['ovo.id'],
  bca: ['bca.co.id', 'klikbca.com'],
  bri: ['bri.co.id'],
  bni: ['bni.co.id'],
  mandiri: ['bankmandiri.co.id'],
};

export const VERDICT_THRESHOLDS = { suspicious: 25, dangerous: 60 };

function registrable(labels) {
  if (labels.length <= 2) return labels.join('.');
  const tld = labels[labels.length - 1];
  const sld = labels[labels.length - 2];
  const take = tld.length === 2 && SECOND_LEVEL.has(sld) ? 3 : 2;
  return labels.slice(-take).join('.');
}

const deLeet = (s) => s.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's');

/** Memecah URL menjadi bagian-bagiannya. Mengembalikan null jika tidak bisa diparse. */
export function parseUrl(input) {
  const raw = (input || '').trim();
  if (!raw) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw);
  let url;
  try {
    url = new URL(hasScheme ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol)) return null;

  const host = url.hostname.toLowerCase();
  const labels = host.split('.');
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');
  const domain = isIp ? host : registrable(labels);
  const sub = isIp ? '' : labels.slice(0, labels.length - domain.split('.').length).join('.');
  const pathText = `${url.pathname === '/' ? '' : url.pathname}${url.search}${url.hash}`;
  const hasUserinfo = Boolean(url.username || url.password);

  const parts = [
    { key: 'protocol', text: hasScheme ? `${url.protocol}//` : '' },
    // Kredensial di dalam URL disamarkan agar tidak ikut tersimpan.
    { key: 'userinfo', text: hasUserinfo ? '***@' : '' },
    { key: 'sub', text: sub ? `${sub}.` : '' },
    { key: 'domain', text: domain },
    { key: 'port', text: url.port ? `:${url.port}` : '' },
    { key: 'path', text: pathText },
  ].filter((p) => p.text);

  const clean = new URL(url.href);
  clean.username = '';
  clean.password = '';

  return { url, hasScheme, host, labels, isIp, domain, sub, pathText, hasUserinfo, parts, display: clean.href };
}

export function analyzeUrl(input) {
  const p = parseUrl(input);
  if (!p) throw new Error('URL tidak dapat dibaca.');
  const { url, hasScheme, host, labels, isIp, domain, hasUserinfo } = p;

  const factors = [];
  const flagged = new Set();
  let structureFlags = 0;
  const add = (f) => {
    factors.push(f);
    if (f.points > 0) {
      (f.marks || []).forEach((m) => flagged.add(m));
      if (f.structural) structureFlags += 1;
    }
  };

  // Protokol
  if (!hasScheme) {
    add({ id: 'scheme', title: 'Protokol tidak disebutkan', detail: 'Tautan ditulis tanpa http:// atau https://, jadi status enkripsi tidak bisa dipastikan.', points: 0, severity: 'info' });
  } else if (url.protocol === 'http:') {
    add({ id: 'http', title: 'Tidak memakai HTTPS', detail: 'Data yang dikirim ke situs ini tidak terenkripsi dan mudah disadap atau diubah.', points: 20, severity: 'bad', marks: ['protocol'] });
  } else {
    add({ id: 'https', title: 'Memakai HTTPS', detail: 'Koneksi terenkripsi. Ini tidak membuktikan situs tepercaya, karena situs phishing juga bisa memakai HTTPS.', points: 0, severity: 'info' });
  }

  if (isIp) add({ id: 'ip', title: 'Alamat berupa angka IP', detail: 'Situs resmi hampir selalu memakai nama domain, bukan alamat IP.', points: 30, severity: 'bad', marks: ['domain'], structural: true });
  if (hasUserinfo) add({ id: 'userinfo', title: 'Ada tanda @ di dalam URL', detail: 'Teks sebelum @ diabaikan browser dan sering dipakai untuk menyamarkan tujuan sebenarnya.', points: 25, severity: 'bad', marks: ['userinfo'], structural: true });
  if (host.includes('xn--')) add({ id: 'punycode', title: 'Domain memakai karakter khusus (punycode)', detail: 'Karakter mirip huruf biasa dapat dipakai untuk meniru domain lain.', points: 25, severity: 'bad', marks: ['domain', 'sub'], structural: true });

  const tld = labels[labels.length - 1];
  if (!isIp && SUSPICIOUS_TLDS.has(tld)) add({ id: 'tld', title: `Ekstensi domain .${tld} sering disalahgunakan`, detail: 'Ekstensi ini murah atau gratis sehingga sering muncul di tautan berbahaya. Banyak situs sah juga memakainya, jadi ini hanya sinyal tambahan.', points: 12, severity: 'warn', marks: ['domain'] });
  if (SHORTENERS.has(domain)) add({ id: 'shortener', title: 'Tautan dipersingkat', detail: 'Tujuan akhir disembunyikan. Buka tautan asli dari pengirim yang Anda percaya jika memungkinkan.', points: 15, severity: 'warn', marks: ['domain'] });
  if (!isIp && labels.length - domain.split('.').length >= 3) add({ id: 'subdomain', title: 'Subdomain berlapis', detail: 'Terlalu banyak lapisan subdomain dapat dipakai untuk menyembunyikan domain utama.', points: 10, severity: 'warn', marks: ['sub'], structural: true });
  if (!isIp && (domain.match(/-/g) || []).length >= 2) add({ id: 'hyphens', title: 'Domain memuat banyak tanda hubung', detail: 'Pola seperti nama-merek-aman-login sering dipakai untuk meniru layanan resmi.', points: 8, severity: 'warn', marks: ['domain'], structural: true });

  const domainName = domain.split('.')[0];
  const digits = (domainName.match(/\d/g) || []).length;
  if (!isIp && domainName.length >= 6 && digits / domainName.length > 0.3) add({ id: 'digits', title: 'Nama domain dipenuhi angka', detail: 'Rasio angka yang tinggi jarang ditemukan pada domain situs resmi.', points: 8, severity: 'warn', marks: ['domain'], structural: true });
  if (url.port && !['80', '443'].includes(url.port)) add({ id: 'port', title: `Memakai port tidak standar (${url.port})`, detail: 'Situs publik biasanya memakai port bawaan.', points: 10, severity: 'warn', marks: ['port'], structural: true });
  if (url.href.length > 100) add({ id: 'length', title: 'URL sangat panjang', detail: `Panjang ${url.href.length} karakter. URL panjang dapat menyembunyikan bagian yang mencurigakan.`, points: 8, severity: 'warn', marks: ['path'], structural: true });
  if ((url.href.match(/%[0-9a-f]{2}/gi) || []).length >= 5) add({ id: 'encoded', title: 'Banyak karakter ter-encode', detail: 'Encoding berlebihan kadang dipakai untuk menyamarkan isi URL.', points: 8, severity: 'warn', marks: ['path'], structural: true });

  // Peniruan merek
  const hostTokens = host.split(/[.\-_]/);
  const pathTokens = (p.pathText || '').toLowerCase().split(/[^a-z0-9]+/);
  for (const [brand, officials] of Object.entries(BRANDS)) {
    if (officials.includes(domain)) continue;
    const inHost = hostTokens.some((t) => t === brand || (brand.length >= 5 && t.includes(brand)));
    const lookalike = !inHost && hostTokens.some((t) => /\d/.test(t) && (deLeet(t) === brand || (brand.length >= 5 && deLeet(t).includes(brand))));
    if (inHost || lookalike) {
      add({ id: `brand-${brand}`, title: `Menyebut "${brand}" tetapi bukan domain resminya`, detail: lookalike ? 'Nama ditulis dengan angka pengganti huruf agar tampak mirip merek asli.' : `Domain resmi ${brand} adalah ${officials.join(' / ')}. Domain ini berbeda.`, points: 30, severity: 'bad', marks: ['sub', 'domain'] });
      break;
    }
    if (pathTokens.includes(brand)) {
      add({ id: `brand-path-${brand}`, title: `Nama "${brand}" muncul di jalur URL`, detail: 'Merek dicantumkan di belakang domain yang tidak terkait agar terlihat meyakinkan.', points: 15, severity: 'warn', marks: ['path'] });
      break;
    }
  }

  const haystack = `${host} ${p.pathText}`.toLowerCase();
  const found = SENSITIVE_WORDS.filter((w) => haystack.includes(w));
  if (found.length) add({ id: 'keywords', title: 'Memuat kata yang lazim dipakai phishing', detail: `Ditemukan: ${found.slice(0, 4).join(', ')}. Kata ini wajar di situs sah, tetapi menguatkan indikasi bila ada sinyal lain.`, points: Math.min(found.length * 8, 16), severity: 'warn', marks: ['sub', 'domain', 'path'] });

  const score = Math.min(100, factors.reduce((sum, f) => sum + f.points, 0));
  const verdict = score >= VERDICT_THRESHOLDS.dangerous ? 'dangerous' : score >= VERDICT_THRESHOLDS.suspicious ? 'suspicious' : 'safe';

  return {
    id: crypto.randomUUID(),
    url: p.display,
    host,
    domain,
    scannedAt: new Date().toISOString(),
    engine: ENGINE,
    schemeAssumed: !hasScheme,
    https: !hasScheme ? 'unknown' : url.protocol === 'https:' ? 'yes' : 'no',
    structure: { flags: structureFlags, label: structureFlags === 0 ? 'Wajar' : structureFlags === 1 ? 'Perlu dicermati' : 'Tidak lazim' },
    parts: p.parts,
    flagged: [...flagged],
    score,
    verdict,
    factors,
  };
}
