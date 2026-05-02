import { Play } from "lucide-react";

function isVideoUrl(url = "") {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export default function DashboardBillboard({ billboard, onClick }) {
  const mediaUrl = billboard?.media_url || billboard?.video_url || billboard?.thumbnail_url || "";
  const thumbnail = billboard?.thumbnail_url || billboard?.media_url || "";
  const title = billboard?.title || "TRY YOUR ADS";
  const subtitle = billboard?.subtitle || "Now!";
  const caption = billboard?.caption || billboard?.description || billboard?.cta_text || "Feature your message inside CLARA.";
  const ctaUrl = billboard?.cta_url || "";
  const hasCta = Boolean(ctaUrl);
  const isVideo = isVideoUrl(mediaUrl);

  return (
    <section
      onClick={onClick}
      className="group relative overflow-hidden rounded-[22px] transition-all duration-300 active:scale-[0.99]"
      style={{
        background: "linear-gradient(135deg, rgba(4,22,16,0.92), rgba(4,14,18,0.96))",
      }}
    >
      <div className="relative h-[clamp(90px,14svh,120px)] w-full">
        {mediaUrl ? (
          isVideo ? (
            <video
              src={mediaUrl}
              poster={thumbnail !== mediaUrl ? thumbnail : undefined}
              className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.02]"
              muted
              playsInline
              loop
              autoPlay
            />
          ) : (
            <img
              src={mediaUrl}
              className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.02]"
              alt={title || "Dashboard billboard"}
            />
          )
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(166,232,18,0.16), rgba(4,155,104,0.26) 42%, rgba(2,16,20,0.96) 100%)",
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

        <div className="absolute left-4 top-4 max-w-[74%]">
          <p className="text-[10px] font-black uppercase tracking-[0.32em]" style={{ color: "#B9F632" }}>
            {title}
          </p>

          <h2 className="mt-1 truncate text-[clamp(1rem,3.2svh,1.25rem)] font-black leading-none tracking-tight text-white">
            {subtitle}
          </h2>

          <p className="mt-1 line-clamp-1 text-[clamp(0.68rem,1.7svh,0.75rem)] font-medium leading-tight text-white/75">
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
