import ClaraPageShell from "../../../components/shared/layout/ClaraPageShell";
import BillboardManager from "./billboard/BillboardManager";

export default function AdminPanel() {
  return (
    <ClaraPageShell>
      <div className="space-y-4">
        <BillboardManager />
      </div>
    </ClaraPageShell>
  );
}
