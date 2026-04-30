export default function ProfileModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-t-[28px] border border-white/10 bg-[#0c1117] p-5">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />

        <h2 className="text-lg font-semibold text-white">
          Profile Information
        </h2>

        <p className="mt-1 text-xs text-white/50">
          Update your basic details
        </p>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] uppercase text-white/40">Name</p>
            <input
              type="text"
              placeholder="Your name"
              className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] uppercase text-white/40">Email</p>
            <input
              type="email"
              placeholder="you@email.com"
              className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] uppercase text-white/40">Password</p>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/60"
          >
            Cancel
          </button>

          <button className="flex-1 rounded-xl bg-white text-black py-3 text-sm font-medium">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
