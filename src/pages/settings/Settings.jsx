import { Camera, ChevronRight, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";
import Item from "./components/Item";
import ProfileModal from "./components/ProfileModal";
import Section from "./components/Section";
import ToggleSwitch from "./components/ToggleSwitch";
import {
  getStoredProfileAvatar,
  getStoredProfileName,
  saveStoredProfileAvatar,
  saveStoredProfileName,
} from "./profileStorage";

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

function getInitials(value) {
  const clean = value.trim();
  if (!clean) return "CU";

  return clean
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
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

  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [name, setName] = useState("CLARA User");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [storedName, storedAvatar] = await Promise.all([
          getStoredProfileName(),
          getStoredProfileAvatar(),
        ]);

        if (storedName) setName(storedName);
        if (storedAvatar) setAvatarPreview(storedAvatar);
      } catch (err) {
        console.warn("Failed to load profile", err);
      } finally {
        setHydrated(true);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    async function persistName() {
      try {
        await saveStoredProfileName(name);
      } catch (err) {
        console.warn("Failed to save profile name", err);
      }
    }

    persistName();
  }, [name, hydrated]);

  const handleOpenTheme = () => {
    navigate("/settings/theme");
  };

  const handleOpenProfile = () => {
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const handlePickAvatar = () => {
    fileRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const avatarDataUrl = await fileToDataUrl(file);

      setAvatarPreview(avatarDataUrl);
      await saveStoredProfileAvatar(avatarDataUrl);
    } catch (err) {
      console.warn("Failed to save profile avatar", err);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setAvatarPreview(null);
      await saveStoredProfileAvatar(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err) {
      console.warn("Failed to remove profile avatar", err);
    }
  };

  const initials = getInitials(name);

  return (
    <ClaraPageShell>
      <div className="space-y-5 pb-6">
        <header className="px-1 pt-1">
          <div className="min-w-0">
            <h1 className="text-[30px] font-black tracking-[-0.04em] text-white">
              Settings
            </h1>

            <p className="mt-1 text-sm leading-5 text-white/45">
              Manage your account and preferences.
            </p>
          </div>
        </header>

        <section className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePickAvatar}
              className="group relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-lg font-bold text-white transition active:scale-95"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
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
              className="min-w-0 flex-1 text-left"
            >
              <h2 className="truncate text-sm font-semibold text-white">
                {name}
              </h2>
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
            right={
              <div className="flex items-center gap-2">
                <Pill>Edit</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="Security & privacy"
            description="Session status and safe preferences"
            icon={<span>🛡️</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Safe</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />
        </Section>

        <Section title="PREFERENCES">
          <Item
            title="Theme & appearance"
            description="Colors, visual style, and dashboard look"
            icon={<span>🎨</span>}
            onClick={handleOpenTheme}
            right={
              <div className="flex items-center gap-2">
                <Pill>Customize</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="Performance Mode"
            description="Static visuals with no animation"
            icon={<span>🚀</span>}
            right={<ToggleSwitch checked={false} />}
          />

          <Item
            title="Notifications"
            description="Reminders, alerts, and program updates"
            icon={<span>🔔</span>}
            right={<ToggleSwitch checked />}
          />
        </Section>

        <Section title="PROGRAM">
          <Item
            title="Plan & billing"
            description="Enrollment, payment, and access"
            icon={<span>📄</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill active>Pro 99</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="Help & support"
            description="Message support or report an issue"
            icon={<span>💬</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Help</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="About CLARA"
            description="Mission, vision, app info, and legal"
            icon={<span>📘</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Info</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="Admin Panel"
            description="Manage users, access, and CLARA system"
            icon={<span>🛡️</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Admin</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />
        </Section>

        <section className="space-y-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/25">
            SESSION
          </p>

          <div className="overflow-hidden rounded-[28px] border border-red-400/15 bg-red-500/[0.055] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-red-500/[0.06] active:bg-red-500/[0.09]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-red-400/20 bg-red-500/10 text-red-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition group-active:scale-95">
                <LogOut size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-red-300">
                  Log out
                </h3>
                <p className="mt-0.5 text-[12px] leading-5 text-red-200/45">
                  End your current session
                </p>
              </div>

              <ChevronRight size={16} className="text-red-200/25" />
            </button>
          </div>
        </section>
      </div>

      <ProfileModal
        open={profileOpen}
        onClose={handleCloseProfile}
        name={name}
        setName={setName}
        avatarPreview={avatarPreview}
        onRemoveAvatar={handleRemoveAvatar}
      />
    </ClaraPageShell>
  );
}
