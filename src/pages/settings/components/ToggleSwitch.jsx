export default function ToggleSwitch({ checked = false }) {
  return (
    <div
      className={`relative h-7 w-[50px] rounded-full border transition-all duration-300 active:scale-95 ${
        checked
          ? "border-emerald-300/35 bg-emerald-400/30 shadow-[0_0_24px_rgba(52,211,153,0.22)]"
          : "border-white/10 bg-white/[0.10]"
      }`}
    >
      <div
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out ${
          checked
            ? "left-[24px] shadow-[0_4px_18px_rgba(16,185,129,0.35)]"
            : "left-1"
        }`}
      />
    </div>
  );
}
