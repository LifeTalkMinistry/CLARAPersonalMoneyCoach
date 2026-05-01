import { useNavigate } from "react-router-dom";
import ClaraPageShell from "../../../components/shared/layout/ClaraPageShell";
import { useAuth } from "../../../context/AuthContext";

function isAdmin(profile) {
  return profile?.role === "admin" || profile?.is_admin === true;
}

function AccessDenied() {
  return (
    <ClaraPageShell>
      <div className="flex min-h-[70vh] items-center justify-center px-2">
        <section className="w-full rounded-[28px] border border-red-400/20 bg-red-500/10 p-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-200/50">
            Admin Only
          </p>
          <h1 className="mt-2 text-xl font-black tracking-[-0.04em] text-white">
            Access Denied
          </h1>
          <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-white/45">
            This area is only available to approved CLARA admins.
          </p>
        </section>
      </div>
    </ClaraPageShell>
  );
}

function AdminCard({ title, desc, badge, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-[24px] border border-white/10 bg-white/[0.045] p-4 text-left shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition duration-200 hover:bg-white/[0.065] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
            {badge}
          </p>
          <h2 className="mt-2 text-[15px] font-black tracking-[-0.02em] text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-white/50">{desc}</p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-[10px] font-black text-white/55 transition group-hover:text-white/75">
          Open
        </span>
      </div>
    </button>
  );
}

export default function AdminPanel() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin(profile)) return <AccessDenied />;

  return (
    <ClaraPageShell>
      <div className="space-y-5 pb-6">
        <header className="px-1 pt-3">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
            Control Center
          </p>
          <h1 className="mt-2 text-[30px] font-black tracking-[-0.04em] text-white">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm leading-6 text-white/45">
            Manage CLARA content, users, access, and system behavior.
          </p>
        </header>

        <div className="space-y-3">
          <AdminCard
            badge="Billboard"
            title="Dashboard Billboard"
            desc="Manage dashboard content, media, CTA, and active state."
            onClick={() => navigate("/settings/admin/billboard")}
          />

          <AdminCard
            badge="Users"
            title="User Management"
            desc="Search users, review plans, and manage admin access."
            onClick={() => navigate("/settings/admin/users")}
          />

          <AdminCard
            badge="Plans"
            title="Plan Access"
            desc="Control which features are available per CLARA tier."
            onClick={() => navigate("/settings/admin/access")}
          />

          <AdminCard
            badge="System"
            title="Feature Flags"
            desc="Turn CLARA system features on or off safely."
            onClick={() => navigate("/settings/admin/feature-flags")}
          />
        </div>
      </div>
    </ClaraPageShell>
  );
}
