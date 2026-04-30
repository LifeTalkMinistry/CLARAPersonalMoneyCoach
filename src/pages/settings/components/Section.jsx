export default function Section({ title, children }) {
  return (
    <section className="space-y-2">
      
      {/* TITLE */}
      <p className="px-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
        {title}
      </p>

      {/* CONTAINER (CLARA glass group) */}
      <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-2 space-y-2">
        {children}
      </div>

    </section>
  );
}
