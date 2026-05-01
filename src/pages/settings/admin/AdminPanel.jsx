import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import ClaraPageShell from "../../../components/shared/layout/ClaraPageShell";
import BillboardManager from "./billboard/BillboardManager";
import UserManagement from "./users/UserManagement";
import PlanAccessControl from "./access/PlanAccessControl";
import FeatureFlags from "./feature-flags/FeatureFlags";

function isAdmin(profile) {
  return profile?.role === "admin" || profile?.is_admin === true;
}

export default function AdminPanel() {
  const [allowed, setAllowed] = useState(null);
  const [tab, setTab] = useState("billboard");

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      const id = data?.user?.id;

      if (!id) return setAllowed(false);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      setAllowed(isAdmin(profile));
    }

    check();
  }, []);

  if (allowed === null) return null;

  if (!allowed) {
    return (
      <ClaraPageShell>
        <div className="p-6 text-center text-white/60">
          Access denied
        </div>
      </ClaraPageShell>
    );
  }

  return (
    <ClaraPageShell>
      <div className="space-y-4">
        <div className="flex gap-2">
          {["billboard","users","plans","flags"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 rounded-xl border ${
                tab === t
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "billboard" && <BillboardManager />}
        {tab === "users" && <UserManagement />}
        {tab === "plans" && <PlanAccessControl />}
        {tab === "flags" && <FeatureFlags />}
      </div>
    </ClaraPageShell>
  );
}
