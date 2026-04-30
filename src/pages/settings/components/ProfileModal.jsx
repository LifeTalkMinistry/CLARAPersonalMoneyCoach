import { useEffect, useState } from "react";

function getInitials(value) {
  const cleanValue = value.trim();

  if (!cleanValue) return "CU";

  return cleanValue
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ProfileModal({ open, onClose, name, setName }) {
  const [draftName, setDraftName] = useState(name);
  const [message, setMessage] = useState("");

  const initials = getInitials(draftName);

  useEffect(() => {
    if (!open) return;
    setDraftName(name);
    setMessage("");
  }, [open, name]);

  if (!open) return null;

  const handleSaveName = () => {
    if (!draftName.trim()) return;

    setName(draftName.trim());
    setDraftName(draftName.trim());
    setMessage("Name saved for this preview.");
  };

  const handleCancel = () => {
    setDraftName(name);
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={handleCancel} />

      <div className="relative w-full max-w-md rounded-t-[28px] border border-white/10 bg-[#0c1117] p-5">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm font-black tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-white">
              Profile Information
            </h2>

            <p className="mt-1 text-xs text-white/50">
              Update your basic details
            </p>
          </div>
        </div>

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
              value={draftName}
              onChange={(event) => {
                setDraftName(event.target.value);
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
            onClick={handleCancel}
            className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveName}
            disabled={!draftName.trim()}
            className="flex-1 rounded-xl bg-white py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/40"
          >
            Save Name
          </button>
        </div>
      </div>
    </div>
  );
}
