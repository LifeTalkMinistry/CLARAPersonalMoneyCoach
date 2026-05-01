import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Settings from "./pages/settings/Settings";
import ThemeAppearance from "./pages/settings/ThemeAppearance";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/theme" element={<ThemeAppearance />} />
    </Routes>
  );
}