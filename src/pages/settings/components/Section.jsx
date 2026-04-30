export default function Section({ title, children }) {
  return (
    <section className="space-y-2">
      {/* TITLE */}
      <p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/30">
        {title}
      </p>

      {/* PREMIUM IOS-STYLE GROUP */}
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        {children}
      </div>
    </section>
  );
}
