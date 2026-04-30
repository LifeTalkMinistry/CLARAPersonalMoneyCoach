import { Play, Sparkles } from "lucide-react";

export default function DashboardBillboard({ billboard, onClick }) {
  const videoUrl = billboard?.video_url || "";
  const thumbnail = billboard?.thumbnail_url || "";
  const title = billboard?.title || "TRY YOUR ADS";
  const subtitle = billboard?.subtitle || "Now!";
  const caption = billboard?.caption || billboard?.description || "Feature your message inside CLARA.";

  return (
    <section
      onClick={onClick}
      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] shadow-[0_20px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition duration-300 active:scale-[0.99]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-sky-400/[0.06]" />
      <div className="absolute -left-16 -top-20 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl transition duration-500 group-hover:bg-sky-400/25" />
      <div className="absolute -bottom-20 right-0 h-40 w-40 rounded-full bg-fuchsia-500/12 blur-3xl" />

      <div className="relative h-[120px] w-full">
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
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_84%_60%,rgba(168,85,247,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(15,23,42,0.78),rgba(0,0,0,0.92))]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/56 to-black/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-white/[0.04]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="absolute left-4 top-4 max-w-[72%]">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 backdrop-blur-xl">
            <Sparkles className="h-3 w-3 text-sky-300" />
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/70">
              Billboard
            </p>
          </div>

          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.32em] text-white/62">
            {title}
          </p>

          <h2 className="mt-0.5 truncate text-xl font-black tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
            {subtitle}
          </h2>

          <p className="mt-1 line-clamp-1 text-xs font-medium text-white/48">
            {caption}
          </p>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-white/[0.095] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_26px_rgba(255,255,255,0.10)] backdrop-blur-xl transition duration-300 group-hover:scale-105 group-hover:bg-white/[0.13]">
            <div className="absolute inset-1 rounded-full border border-white/8" />
            <Play className="ml-0.5 h-5 w-5 text-white" fill="currentColor" strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </section>
  );
}
