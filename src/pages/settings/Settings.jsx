import { ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";
import Item from "./components/Item";
import ProfileModal from "./components/ProfileModal";
import Section from "./components/Section";
import ToggleSwitch from "./components/ToggleSwitch";
import Avatar from "../../components/shared/Avatar";
import { useAvatar } from "../../context/AvatarContext";

export default function Settings() {
  const navigate = useNavigate();
  const { avatar, updateAvatar } = useAvatar();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleOpenTheme = () => navigate("/settings/theme");
  const handleOpenProfile = () => setProfileOpen(true);
  const handleCloseProfile = () => setProfileOpen(false);
  const handleLogout = () => (window.location.href = "/login");

  const handleRemoveAvatar = async () => {
    try {
      await updateAvatar({ image: null });
    } catch (err) {
      console.warn("Failed to remove avatar", err);
    }
  };

  const handleSetName = (nextName) => {
    updateAvatar({ name: nextName });
  };

  return (
    <ClaraPageShell>
      <div className="space-y-5 pb-6">
        <header className="px-1 pt-1">
          <h1 className="text-[30px] font-black tracking-[-0.04em] text-white">Settings</h1>
          <p className="mt-1 text-sm text-white/45">Manage your account and preferences.</p>
        </header>

        <Section title="ACCOUNT">
          <Item
            title="Profile information"
            description={avatar?.name ? `${avatar.name} · Name, email, account identity` : "Name, email, account identity"}
            icon={<Avatar size={40} />}
            onClick={handleOpenProfile}
            right={<ChevronRight size={16} className="text-white/25" />}
          />
        </Section>

        <Section title="PREFERENCES">
          <Item
            title="Theme & appearance"
            description="Colors, visual style, and dashboard look"
            icon={<span>🎨</span>}
            onClick={handleOpenTheme}
            right={<ChevronRight size={16} className="text-white/25" />}
          />

          <Item
            title="Performance Mode"
            description="Static visuals with no animation"
            icon={<span>🚀</span>}
            right={<ToggleSwitch checked={false} />}
          />
        </Section>

        <section className="space-y-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/25">SESSION</p>

          <div className="rounded-[28px] border border-red-400/15 bg-red-500/[0.055]">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3.5"
            >
              <LogOut size={17} className="text-red-300" />
              <span className="text-red-300">Log out</span>
            </button>
          </div>
        </section>
      </div>

      <ProfileModal
        open={profileOpen}
        onClose={handleCloseProfile}
        name={avatar.name}
        setName={handleSetName}
        avatarPreview={avatar.image}
        onRemoveAvatar={handleRemoveAvatar}
      />
    </ClaraPageShell>
  );
}
