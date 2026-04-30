import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function ProfileModal({ open, onClose }) {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    async function loadProfile() {
      setLoadingUser(true);
      setProfileMessage("");

      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!mounted) return;

      if (userError || !user) {
        setUserId("");
        setName("");
        setEmail("");
        setProfileMessage("Unable to load profile right now.");
        setLoadingUser(false);
        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (profileError) {
        setName("");
        setProfileMessage("Profile details are not available yet.");
        setLoadingUser(false);
        return;
      }

      if (profile) {
        setName(profile.full_name || "");
        setLoadingUser(false);
        return;
      }

      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        full_name: "",
      });

      if (!mounted) return;

      if (insertError) {
        setProfileMessage("Profile was not created yet.");
      }

      setName("");
      setLoadingUser(false);
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [open]);

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

        {profileMessage && (
          <div className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-400/10 px-3 py-2 text-xs text-amber-100/80">
            {profileMessage}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] uppercase text-white/40">Name</p>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={loadingUser ? "Loading name..." : "Your name"}
              className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] uppercase text-white/40">Email</p>
            <input
              type="email"
              value={email}
              readOnly
              placeholder={loadingUser ? "Loading email..." : "you@email.com"}
              className="mt-1 w-full bg-transparent text-sm text-white/75 outline-none placeholder:text-white/25"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] uppercase text-white/40">Password</p>
            <input
              type="password"
              readOnly
              placeholder="Managed securely by Supabase Auth"
              className="mt-1 w-full bg-transparent text-sm text-white/55 outline-none placeholder:text-white/25"
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

          <button
            disabled={!userId || loadingUser}
            className="flex-1 rounded-xl bg-white py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
