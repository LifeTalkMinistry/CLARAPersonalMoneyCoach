import { Play } from "lucide-react";

export default function DashboardBillboard({
  billboard,
  onClick,
}) {
  const videoUrl = billboard?.video_url || "";
  const thumbnail = billboard?.thumbnail_url || "";
  const title = billboard?.title || "TRY YOUR ADS";
  const subtitle = billboard?.subtitle || "Now!";

  return (
    <section
      onClick={onClick}
      className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
    >

      {/* 🔥 FIXED SIZE (MATCH YOUR SCREENSHOT) */}
      <div className="relative h-[120px] w-full">

        {/* MEDIA */}
        {videoUrl ? (
          <video
            src={videoUrl}
            poster={thumbnail}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={thumbnail || "https://via.placeholder.com/800x300"}
            className="h-full w-full object-cover"
            alt="billboard"
          />
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* TEXT */}
        <div className="absolute left-4 top-4">
          <p className="text-[10px] tracking-[0.25em] text-white/70 uppercase">
            {title}
          </p>
          <h2 className="text-base font-bold text-white">
            {subtitle}
          </h2>
        </div>

        {/* PLAY BUTTON */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Play className="h-5 w-5 text-white" />
          </div>
        </div>

      </div>
    </section>
  );
}