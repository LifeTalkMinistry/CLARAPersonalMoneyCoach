import { useEffect, useState } from "react";

export default function ProfileModal({ open, onClose }) {
  const [savedName, setSavedName] = useState("CLARA User");
  const [name, setName] = useState(savedName);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(savedName);
    setMessage("");
  }, [open, savedName]);

  if (!open) return null;

  const handleSaveName = () => {
    if (!name.trim()) return;

    setSavedName(name.trim());
    setName(name.trim());
    setMessage("Name saved for this preview.");
  };

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

        {message && (
          <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100/80">
            {message}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] uppercase text-white/40">Name</p>
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setMessage("");
              }}
              placeholder="Your name"
              className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] uppercase text-white/40">Email</p>
            <input
              type="email"
              readOnly
              placeholder="you@email.com"
              className="mt-1 w-full bg-transparent text-sm text-white/75 outline-none placeholder:text-white/25"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] uppercase text-white/40">Password</p>
            <input
              type="password"
              readOnly
              placeholder="Managed securely later"
              className="mt-1 w-full bg-transparent text-sm text-white/55 outline-none placeholder:text-white/25"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveName}
            disabled={!name.trim()}
            className="flex-1 rounded-xl bg-white py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/40"
          >
            Save Name
          </button>
        </div>
      </div>
    </div>
  );
}
