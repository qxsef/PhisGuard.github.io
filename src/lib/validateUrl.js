const fail = (message) => ({ ok: false, message });

/** Validasi format URL di sisi klien. Mengembalikan { ok, message? }. */
export function validateUrl(input) {
  const value = (input || '').trim();
  if (!value) return fail('Masukkan URL yang ingin diperiksa.');
  if (value.length > 2048) return fail('URL terlalu panjang. Maksimal 2048 karakter.');
  if (/\s/.test(value)) return fail('URL tidak boleh mengandung spasi.');

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
  if (hasScheme && !/^https?:\/\//i.test(value)) {
    return fail('Hanya URL berawalan http:// atau https:// yang dapat diperiksa.');
  }

  let parsed;
  try {
    parsed = new URL(hasScheme ? value : `https://${value}`);
  } catch {
    return fail('Format URL tidak valid. Contoh: https://contoh.com/halaman');
  }
  if (!parsed.hostname.includes('.') && !parsed.hostname.startsWith('[')) {
    return fail('Domain belum lengkap. Contoh: contoh.com');
  }
  return { ok: true };
}
