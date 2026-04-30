import { Camera, ChevronRight, LogOut } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";
import Item from "./components/Item";
import ProfileModal from "./components/ProfileModal";
import Section from "./components/Section";
import ToggleSwitch from "./components/ToggleSwitch";
import Avatar from "../../components/shared/Avatar";
import { useAvatar } from "../../context/AvatarContext";

function Pill({ children, active = false, danger = false }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-black ${
        danger
          ? "border-red-400/25 bg-red-500/10 text-red-300"
          : active
            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
            : "border-white/10 bg-white/[0.08] text-white/55"
      }`}
    >
      {children}
    </span>
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function Settings() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const { avatar, updateAvatar } = useAvatar();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleOpenTheme = () => navigate("/settings/theme");
  const handleOpenProfile = () => setProfileOpen(true);
  const handleCloseProfile = () => setProfileOpen(false);
  const handleLogout = () => (window.location.href = "/login");

  const handlePickAvatar = () => fileRef.current?.click();

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const avatarDataUrl = await fileToDataUrl(file);
      await updateAvatar({ image: avatarDataUrl });
    } catch (err) {
      console.warn("Failed to update avatar", err);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateAvatar({ image: null });
      if (fileRef.current) fileRef.current.value = "";
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

        <section className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePickAvatar}
              className="group relative h-14 w-14"
            >
              <Avatar size={56} />

              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100 rounded-2xl">
                <Camera size={16} className="text-white" />
              </div>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleOpenProfile}
              className="flex-1 text-left"
            >
              <h2 className="truncate text-sm font-semibold text-white">{avatar.name}</h2>
              <p className="text-xs text-white/50">Profile</p>
            </button>
          </div>
        </section>

        <Section title="ACCOUNT">
          <Item
            title="Profile information"
            description="Name, email, account identity"
            icon={<span>🏠</span>}
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
