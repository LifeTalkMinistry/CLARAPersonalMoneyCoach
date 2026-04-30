export default function Toggle({ checked = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-7 w-12 rounded-full border transition ${
        checked
          ? "border-emerald-400/40 bg-emerald-400/25"
          : "border-white/15 bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}
