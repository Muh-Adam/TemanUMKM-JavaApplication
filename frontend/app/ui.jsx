export function Isian({ label, ...props }) {
  return (
    <label className="isian">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

export function Nota({ judul, children, stempel }) {
  return (
    <section className="nota" aria-live="polite">
      {stempel && <div className={`stempel ${stempel.toLowerCase()}`}>{stempel}</div>}
      <h2>{judul}</h2>
      {children}
    </section>
  );
}

export const Baris = ({ k, v, tebal, kecil }) => (
  <div className={`nb${tebal ? ' tebal' : ''}${kecil ? ' kecil' : ''}`}>
    <span>{k}</span>
    <i />
    <b>{v}</b>
  </div>
);
