import { Play } from "lucide-react";

export default function DashboardBillboard({ billboard, onClick }) {
  const videoUrl = billboard?.video_url || "";
  const thumbnail = billboard?.thumbnail_url || "";
  const title = billboard?.title || "TRY YOUR ADS";
  const subtitle = billboard?.subtitle || "Now!";
  const caption = billboard?.caption || billboard?.description || "Feature your message inside CLARA.";
  const hasCta = Boolean(billboard?.cta_url);

  return (
    <section
      onClick={onClick}
      className="group relative overflow-hidden rounded-[26px] border backdrop-blur-2xl transition-all duration-300 active:scale-[0.99]"
      style={{
        borderColor: "var(--clara-border)",
        background: "var(--clara-card-strong)",
        boxShadow: "var(--clara-shadow-soft), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[26px]" style={{ background: "var(--clara-surface-glow)" }} />
      <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[linear-gradient(145deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03)_40%,rgba(255,255,255,0.015))]" />
      <div className="pointer-events-none absolute -left-20 -top-24 h-44 w-44 rounded-full opacity-70 blur-3xl transition duration-500 group-hover:opacity-90 group-hover:scale-110" style={{ background: "var(--clara-secondary-soft)" }} />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-44 w-44 rounded-full blur-3xl" style={{ background: "var(--clara-highlight-soft)" }} />
      <div className="pointer-events-none absolute inset-x-6 top-0 z-10 h-px opacity-60 group-hover:opacity-90" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)" }} />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 z-10 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

      <div className="relative h-[clamp(90px,14svh,120px)] w-full">
        {videoUrl ? (
          <video
            src={videoUrl}
            poster={thumbnail}
            className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
            muted
            playsInline
          />
        ) : thumbnail ? (
          <img
            src={thumbnail}
            className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
            alt="billboard"
          />
        ) : (
          <div className="h-full w-full" style={{ background: "linear-gradient(135deg, rgba(250,207,76,0.12), rgba(20,57,37,0.74) 32%, rgba(11,31,24,0.86) 64%, rgba(13,34,56,0.92) 100%)" }} />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/42 to-black/14" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-white/[0.035]" />

        <div className="absolute left-4 top-4 max-w-[74%]">
          <p className="text-[10px] font-black uppercase tracking-[0.32em]" style={{ color: "var(--clara-accent-text)" }}>
            {title}
          </p>

          <h2 className="mt-1 truncate text-[clamp(1rem,3.2svh,1.25rem)] font-black leading-none tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
            {subtitle}
          </h2>

          <p className="mt-1 line-clamp-1 text-[clamp(0.68rem,1.7svh,0.75rem)] font-medium leading-tight" style={{ color: "var(--clara-text-soft)" }}>
            {caption}
          </p>
        </div>

        {hasCta && (
          <div className="absolute right-4 top-4">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95" style={{ borderColor: "var(--clara-border)", background: "var(--clara-glass)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 18px rgba(255,255,255,0.06)" }}>
              <div className="absolute inset-1 rounded-full border" style={{ borderColor: "var(--clara-border-soft)" }} />
              <Play className="ml-0.5 h-3.5 w-3.5" style={{ color: "var(--clara-text)" }} fill="currentColor" strokeWidth={1.8} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
