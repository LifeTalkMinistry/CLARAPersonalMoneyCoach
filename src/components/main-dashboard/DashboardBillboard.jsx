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
      className="group relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1118]/88 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)] active:scale-[0.99]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[linear-gradient(145deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03)_40%,rgba(255,255,255,0.015))]" />
      <div className="pointer-events-none absolute -left-20 -top-24 h-44 w-44 rounded-full bg-sky-400/18 opacity-70 blur-3xl transition duration-500 group-hover:opacity-90 group-hover:scale-110" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-44 w-44 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-6 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60 group-hover:opacity-90" />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

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
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.20),transparent_34%),radial-gradient(circle_at_84%_60%,rgba(168,85,247,0.15),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(15,23,42,0.80),rgba(0,0,0,0.92))]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/56 to-black/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-white/[0.035]" />

        <div className="absolute left-4 top-3 max-w-[72%] sm:top-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl">
            <Sparkles className="h-3 w-3 text-sky-300" />
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/72">
              Billboard
            </p>
          </div>

          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.32em] text-white/64 sm:mt-3">
            {title}
          </p>

          <h2 className="mt-0.5 truncate text-[clamp(1rem,3.2svh,1.25rem)] font-black leading-none tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
            {subtitle}
          </h2>

          <p className="mt-1 line-clamp-1 text-[clamp(0.68rem,1.7svh,0.75rem)] font-medium leading-tight text-white/50">
            {caption}
          </p>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_24px_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-white/[0.13] group-active:scale-95 sm:h-12 sm:w-12">
            <div className="absolute inset-1 rounded-full border border-white/8" />
            <Play className="ml-0.5 h-5 w-5 text-white" fill="currentColor" strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </section>
  );
}
