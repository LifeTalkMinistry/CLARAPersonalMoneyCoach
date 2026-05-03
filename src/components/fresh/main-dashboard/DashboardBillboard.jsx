import { Megaphone, Sparkles } from "lucide-react";

const DEFAULT_BILLBOARD = {
  title: "TRY YOUR ADS",
  subtitle: "Now!",
  cta_text: "Feature your message\ninside CLARA.",
  media_url: "",
  cta_url: "",
};

function isVideoUrl(url = "") {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export default function DashboardBillboard({ billboard, onClick }) {
  const source = billboard || DEFAULT_BILLBOARD;

  const mediaUrl = source.media_url || "";
  const title = source.title || DEFAULT_BILLBOARD.title;
  const subtitle = source.subtitle || DEFAULT_BILLBOARD.subtitle;
  const caption = source.cta_text || DEFAULT_BILLBOARD.cta_text;
  const ctaUrl = source.cta_url || "";
  const hasCta = Boolean(ctaUrl);
  const isVideo = isVideoUrl(mediaUrl);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[25px] opacity-80"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.025) 42%, rgba(168,237,158,0.13))",
          filter: "blur(0.2px)",
        }}
      />

      <div
        className="pointer-events-none absolute -inset-3 rounded-[30px] opacity-45"
        style={{
          background:
            "radial-gradient(circle at 82% 70%, rgba(168,237,158,0.16), transparent 38%), radial-gradient(circle at 22% 18%, rgba(120,165,220,0.10), transparent 36%)",
          filter: "blur(18px)",
        }}
      />

      <section
        onClick={onClick}
        className="group relative overflow-hidden rounded-[24px] border transition-all duration-300 active:scale-[0.99]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.085), rgba(255,255,255,0.045))",
          borderColor: "rgba(255,255,255,0.11)",
          boxShadow:
            "0 14px 34px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.09)",
        }}
      >
        <div className="relative h-[clamp(132px,18svh,160px)] w-full overflow-hidden">
          {mediaUrl &&
            (isVideo ? (
              <video
                src={mediaUrl}
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
                alt="billboard"
              />
            ))}

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 88% 74%, rgba(160,238,147,0.26), transparent 34%), radial-gradient(circle at 30% 28%, rgba(130,165,220,0.14), transparent 34%), linear-gradient(135deg, rgba(8,17,27,0.78), rgba(15,28,34,0.72))",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.18), transparent 52%), radial-gradient(circle at 50% 110%, rgba(255,255,255,0.08), transparent 42%)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-[1px] rounded-[23px]"
            style={{
              border: "1px solid rgba(255,255,255,0.045)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.045), transparent 34%, rgba(255,255,255,0.018))",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0 1px, transparent 1px), radial-gradient(circle at 62% 38%, rgba(255,255,255,0.055) 0 1px, transparent 1px), radial-gradient(circle at 76% 70%, rgba(255,255,255,0.05) 0 1px, transparent 1px)",
              backgroundSize: "34px 34px, 48px 48px, 58px 58px",
            }}
          />

          <div className="absolute left-5 top-5 max-w-[58%]">
            <p className="text-[10px] font-black uppercase tracking-[0.32em]" style={{ color: "#A8ED9E" }}>
              {title}
            </p>

            <h2 className="mt-3 text-[clamp(2rem,6svh,2.8rem)] font-black leading-[0.92] tracking-tight text-white">
              {subtitle}
            </h2>

            <p className="mt-4 whitespace-pre-line text-[clamp(0.78rem,1.8svh,0.9rem)] font-medium leading-relaxed text-white/70">
              {caption}
            </p>
          </div>

          <div
            className="absolute right-5 top-6 grid h-[86px] w-[86px] rotate-[24deg] place-items-center rounded-[28px] border backdrop-blur-[18px] transition duration-500 group-hover:scale-[1.03]"
            style={{
              background: "rgba(255,255,255,0.095)",
              borderColor: "rgba(255,255,255,0.12)",
              boxShadow:
                "0 16px 34px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.11)",
            }}
          >
            <Megaphone
              className="h-11 w-11 -rotate-[24deg] text-white/55"
              strokeWidth={1.55}
            />
          </div>

          <Sparkles className="absolute right-[84px] top-10 h-3.5 w-3.5 text-white/25" strokeWidth={1.6} />
          <Sparkles className="absolute right-[58px] bottom-9 h-3 w-3 text-white/20" strokeWidth={1.6} />

          {hasCta && (
            <div className="absolute right-4 bottom-4 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/80 backdrop-blur-md">
              View
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
            <span className="h-1.5 w-5 rounded-full" style={{ background: "#A8ED9E" }} />
            <span className="h-1.5 w-2 rounded-full bg-white/15" />
            <span className="h-1.5 w-2 rounded-full bg-white/10" />
          </div>
        </div>
      </section>
    </div>
  );
}
