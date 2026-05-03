export default function ClaraPageShell() {
  return (
    <main
      className="relative min-h-[100svh] w-full overflow-x-hidden"
      style={{
        backgroundColor: "#02090C",
        backgroundImage: `
          radial-gradient(circle at 12% 5%, rgba(166,232,18,0.16), transparent 30%),
          radial-gradient(circle at 92% 42%, rgba(54,128,255,0.14), transparent 38%),
          radial-gradient(circle at 30% 86%, rgba(4,155,104,0.16), transparent 42%),
          linear-gradient(180deg, #061116 0%, #031014 44%, #02070A 100%)
        `,
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    />
  );
}
