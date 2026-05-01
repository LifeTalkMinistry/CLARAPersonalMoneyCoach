import ClaraPageShell from "../../../../components/shared/layout/ClaraPageShell";
import { useAuth } from "../../../../context/AuthContext";

export default function FeatureFlags() {
  const { profile } = useAuth();

  if (!(profile?.role === "admin" || profile?.is_admin)) {
    return <div className="text-white p-6">Access Denied</div>;
  }

  return (
    <ClaraPageShell>
      <div className="space-y-4 text-white">
        <h1 className="text-lg font-semibold">Feature Flags</h1>
        <p className="text-white/50">
          Connect to "feature_flags" table
        </p>
      </div>
    </ClaraPageShell>
  );
}
