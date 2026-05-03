import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/fresh/dashboard/Dashboard";
import HomeV2 from "./pages/HomeV2";
import Feed from "./pages/fresh/feed/feed";
import Messages from "./pages/Messages";
import Settings from "./pages/settings/Settings";
import ThemeAppearance from "./pages/settings/ThemeAppearance";
import AdminPanel from "./pages/settings/admin/AdminPanel";
import BillboardManager from "./pages/settings/admin/billboard/BillboardManager";
import UserManagement from "./pages/settings/admin/users/UserManagement";
import PlanAccessControl from "./pages/settings/admin/access/PlanAccessControl";
import FeatureFlags from "./pages/settings/admin/feature-flags/FeatureFlags";
import AuthPage from "./pages/auth/AuthPage";

import { useAuth } from "./context/AuthContext";

function AppLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b10] px-6 text-white">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.045] px-6 py-5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/35">
          CLARA
        </p>
        <h1 className="mt-2 text-lg font-black tracking-[-0.03em] text-white">
          Loading your space
        </h1>
        <p className="mt-1 text-sm text-white/45">
          Preparing your secure session...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading, authReady } = useAuth();

  if (loading) {
    return <AppLoadingScreen />;
  }

  if (!authReady) {
    return <AuthPage />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/home-v2" element={<HomeV2 />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/theme" element={<ThemeAppearance />} />
      <Route path="/settings/admin" element={<AdminPanel />} />
      <Route path="/settings/admin/billboard" element={<BillboardManager />} />
      <Route path="/settings/admin/users" element={<UserManagement />} />
      <Route path="/settings/admin/access" element={<PlanAccessControl />} />
      <Route path="/settings/admin/feature-flags" element={<FeatureFlags />} />
    </Routes>
  );
}
