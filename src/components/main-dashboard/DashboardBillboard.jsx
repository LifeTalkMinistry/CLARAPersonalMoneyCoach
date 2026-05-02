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
      className="group relative overflow-hidden rounded-[22px] transition-all duration-300 active:scale-[0.99]"
      style={{
        background: "linear-gradient(135deg, rgba(10,18,28,0.85), rgba(6,14,22,0.92))",
      }}
    >
      <div className="relative h-[clamp(90px,14svh,120px)] w-full">
        {videoUrl ? (
          <video
            src={videoUrl}
            poster={thumbnail}
            className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.02]"
            muted
            playsInline
          />
        ) : thumbnail ? (
          <img
            src={thumbnail}
            className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.02]"
            alt="billboard"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(250,204,21,0.10), rgba(34,197,94,0.25) 35%, rgba(2,16,24,0.95) 100%)",
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        <div className="absolute left-4 top-4 max-w-[74%]">
          <p className="text-[10px] font-black uppercase tracking-[0.32em]" style={{ color: "#a7f3d0" }}>
            {title}
          </p>

          <h2 className="mt-1 truncate text-[clamp(1rem,3.2svh,1.25rem)] font-black leading-none tracking-tight text-white">
            {subtitle}
          </h2>

          <p className="mt-1 line-clamp-1 text-[clamp(0.68rem,1.7svh,0.75rem)] font-medium leading-tight text-white/70">
            {caption}
          </p>
        </div>

        {hasCta && (
          <div className="absolute right-4 top-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:scale-105">
              <Play className="ml-0.5 h-3.5 w-3.5 text-white" fill="currentColor" strokeWidth={1.8} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
