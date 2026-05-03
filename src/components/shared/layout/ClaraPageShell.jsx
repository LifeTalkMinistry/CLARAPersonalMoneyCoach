export default function ClaraPageShell() {
  return (
    <main
      className="relative min-h-[100svh] w-full overflow-x-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 18% 12%, rgba(60,110,140,0.18), transparent 35%),
          radial-gradient(circle at 85% 25%, rgba(120,200,160,0.08), transparent 40%),
          radial-gradient(circle at 70% 85%, rgba(160,120,90,0.05), transparent 45%),
          linear-gradient(180deg, #04080D 0%, #03070C 50%, #02060A 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E")
        `,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "screen",
        filter: "blur(0.3px)",
      }}
    />
  );
}
