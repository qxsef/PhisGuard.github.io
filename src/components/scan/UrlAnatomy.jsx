const TONE = {
  protocol: 'text-muted',
  userinfo: 'text-muted',
  sub: 'text-fg',
  domain: 'text-brand font-bold',
  port: 'text-muted',
  path: 'text-muted',
};
const LABEL = { protocol: 'protokol', userinfo: 'kredensial', sub: 'subdomain', domain: 'domain utama', port: 'port', path: 'jalur' };

/** Menampilkan URL terpecah per bagian. Bagian yang memicu faktor risiko diberi garis merah. */
export default function UrlAnatomy({ parts, flagged = [] }) {
  return (
    <div>
      <p className="break-all rounded-xl border border-white/10 bg-panel px-4 py-3.5 font-mono text-[15px] leading-relaxed" aria-label={parts.map((p) => p.text).join('')}>
        {parts.map((p) => {
          const bad = flagged.includes(p.key);
          return (
            <span key={p.key} title={LABEL[p.key]} className={`${TONE[p.key]} ${bad ? 'underline decoration-bad decoration-wavy decoration-2 underline-offset-4' : ''}`}>
              {p.text}
            </span>
          );
        })}
      </p>
      <p className="mt-2 text-xs text-muted">
        <span className="font-semibold text-brand">Ungu</span> menandai domain utama, yaitu bagian yang menentukan pemilik situs.
        {flagged.length > 0 && <> Garis merah menandai bagian yang memicu faktor risiko.</>}
      </p>
    </div>
  );
}
