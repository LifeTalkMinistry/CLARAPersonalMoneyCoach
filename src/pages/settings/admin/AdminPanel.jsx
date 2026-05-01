import { useNavigate } from "react-router-dom";
import ClaraPageShell from "../../../components/shared/layout/ClaraPageShell";
import { useAuth } from "../../../context/AuthContext";

function isAdmin(profile) {
  return profile?.role === "admin" || profile?.is_admin === true;
}

function AccessDenied() {
  return (
    <ClaraPageShell>
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 p-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-200/50">
            Admin Only
          </p>
          <h1 className="mt-2 text-xl font-bold text-white">
            Access Denied
          </h1>
        </div>
      </div>
    </ClaraPageShell>
  );
}

function AdminCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-[24px] border border-white/10 bg-white/[0.045] p-4 text-left hover:bg-white/[0.06] transition"
    >
      <h2 className="text-white font-semibold">{title}</h2>
      <p className="text-white/50 text-sm mt-1">{desc}</p>
    </button>
  );
}

export default function AdminPanel() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin(profile)) return <AccessDenied />;

  return (
    <ClaraPageShell>
      <div className="space-y-4">
        <AdminCard
          title="Dashboard Billboard"
          desc="Manage homepage content"
          onClick={() => navigate("/settings/admin/billboard")}
        />

        <AdminCard
          title="Users"
          desc="Manage users & admin roles"
          onClick={() => navigate("/settings/admin/users")}
        />

        <AdminCard
          title="Plan Access"
          desc="Control features per tier"
          onClick={() => navigate("/settings/admin/access")}
        />

        <AdminCard
          title="Feature Flags"
          desc="Toggle system features"
          onClick={() => navigate("/settings/admin/feature-flags")}
        />
      </div>
    </ClaraPageShell>
  );
}
