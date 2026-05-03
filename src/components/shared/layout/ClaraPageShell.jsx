export default function ClaraPageShell() {
  return (
    <main
      className="relative min-h-[100svh] w-full overflow-x-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 18% 12%, rgba(80,140,180,0.22), transparent 35%),
          radial-gradient(circle at 85% 25%, rgba(143,227,136,0.10), transparent 40%),
          radial-gradient(circle at 70% 85%, rgba(180,130,90,0.06), transparent 45%),
          linear-gradient(180deg, #07121A 0%, #050D14 50%, #03080D 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.012'/%3E%3C/svg%3E")
        `,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "screen",
      }}
    />
  );
}
