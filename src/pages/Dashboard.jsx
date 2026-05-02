import ClaraPageShell from "../components/shared/layout/ClaraPageShell";
import DashboardBillboard from "../components/main-dashboard/DashboardBillboard";
import DashboardWalletDrawer from "../components/main-dashboard/DashboardWalletDrawer";
import DashboardFinancialCarousel from "../components/main-dashboard/DashboardFinancialCarousel";

export default function Dashboard() {
  return (
    <ClaraPageShell compactHeader>
      <div className="min-h-[100dvh] overflow-x-hidden overflow-y-auto px-4 pb-[calc(70px+env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-[calc(88px+env(safe-area-inset-bottom))]">
        <div className="space-y-4">
          <DashboardBillboard />
          <DashboardWalletDrawer />
          <DashboardFinancialCarousel />
        </div>
      </div>
    </ClaraPageShell>
  );
}
