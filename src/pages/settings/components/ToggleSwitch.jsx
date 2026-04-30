export default function ToggleSwitch({ checked = false }) {
  return (
    <div
      className={`relative h-7 w-12 rounded-full border transition ${
        checked
          ? "border-emerald-400/30 bg-emerald-400/25"
          : "border-white/10 bg-white/10"
      }`}
    >
      <div
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-lg transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </div>
  );
}
