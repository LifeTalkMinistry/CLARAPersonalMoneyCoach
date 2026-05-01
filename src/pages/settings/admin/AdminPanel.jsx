import ClaraPageShell from "../../../components/shared/layout/ClaraPageShell";
import BillboardManager from "./billboard/BillboardManager";
import UserManagement from "./users/UserManagement";

export default function AdminPanel() {
  return (
    <ClaraPageShell>
      <div className="space-y-4">
        <BillboardManager />
        <UserManagement />
      </div>
    </ClaraPageShell>
  );
}
