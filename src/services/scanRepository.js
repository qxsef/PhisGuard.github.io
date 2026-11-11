// Lapisan penyimpanan. Tahap 1-2 memakai localStorage; Tahap 3 mengganti isi file ini
// dengan Supabase tanpa mengubah komponen karena antarmukanya sama (semua async).
const KEY = 'phishguard.scans.v1';
const MAX = 200;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    throw new Error('Riwayat di browser tidak dapat dibaca.');
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    throw new Error('Penyimpanan browser penuh atau diblokir.');
  }
}

export const scanRepository = {
  async list() { return read(); },
  async get(id) { return read().find((s) => s.id === id) ?? null; },
  async add(scan) { write([scan, ...read()]); return scan; },
  async remove(id) { write(read().filter((s) => s.id !== id)); },
  async clear() { write([]); },
};
