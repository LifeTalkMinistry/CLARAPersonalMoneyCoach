export default function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <p className="px-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
        {title}
      </p>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}
