import ClaraPageShell from "../../../components/shared/layout/ClaraPageShell";
import { useAuth } from "../../../context/AuthContext";
import BillboardManager from "./billboard/BillboardManager";
import UserManagement from "./users/UserManagement";

function isApprovedAdmin(profile) {
  return profile?.role === "admin" || profile?.is_admin === true;
}

function AccessDenied() {
  return (
    <ClaraPageShell>
      <div className="flex min-h-[65vh] items-center justify-center px-2">
        <section className="w-full rounded-[28px] border border-white/10 bg-white/[0.045] p-5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-sm font-black text-red-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            AD
          </div>

          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-red-200/45">
            Admin access required
          </p>

          <h1 className="mt-2 text-xl font-black tracking-[-0.04em] text-white">
            Access denied
          </h1>

          <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-white/45">
            This area is only available to approved CLARA admins.
          </p>
        </section>
      </div>
    </ClaraPageShell>
  );
}

export default function AdminPanel() {
  const { profile } = useAuth();
  const adminAllowed = isApprovedAdmin(profile);

  if (!adminAllowed) {
    return <AccessDenied />;
  }

  return (
    <ClaraPageShell>
      <div className="space-y-4">
        <BillboardManager />
        <UserManagement />
      </div>
    </ClaraPageShell>
  );
}
