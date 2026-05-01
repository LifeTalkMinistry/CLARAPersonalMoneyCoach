import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Settings from "./pages/settings/Settings";
import ThemeAppearance from "./pages/settings/ThemeAppearance";
import AdminPanel from "./pages/settings/admin/AdminPanel";
import AuthPage from "./pages/auth/AuthPage";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // 🔒 NOT LOGGED IN → SHOW AUTH
  if (!user) {
    return <AuthPage />;
  }

  // ✅ LOGGED IN → SHOW APP
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/theme" element={<ThemeAppearance />} />
      <Route path="/settings/admin" element={<AdminPanel />} />
    </Routes>
  );
}
