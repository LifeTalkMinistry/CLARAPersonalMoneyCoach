import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getStoredProfileAvatar,
  getStoredProfileName,
  saveStoredProfileAvatar,
  saveStoredProfileName,
} from "../pages/settings/profileStorage";

const AvatarContext = createContext(null);

const DEFAULT_AVATAR = {
  name: "CLARA User",
  image: null,
};

export function getAvatarInitials(value) {
  const clean = String(value || "").trim();
  if (!clean) return "CU";

  return clean
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AvatarProvider({ children }) {
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAvatar() {
      try {
        const storedName = await getStoredProfileName();
        const storedAvatar = await getStoredProfileAvatar();

        if (!mounted) return;

        setAvatar({
          name: storedName || DEFAULT_AVATAR.name,
          image: storedAvatar || null,
        });
      } catch (err) {
        console.warn("Failed to load avatar", err);
      } finally {
        if (mounted) setHydrated(true);
      }
    }

    loadAvatar();

    return () => {
      mounted = false;
    };
  }, []);

  const updateAvatar = async (data = {}) => {
    setAvatar((current) => ({ ...current, ...data }));

    try {
      if (Object.prototype.hasOwnProperty.call(data, "name")) {
        await saveStoredProfileName(data.name);
      }

      if (Object.prototype.hasOwnProperty.call(data, "image")) {
        await saveStoredProfileAvatar(data.image);
      }
    } catch (err) {
      console.warn("Failed to save avatar", err);
    }
  };

  const value = useMemo(
    () => ({
      avatar,
      avatarInitials: getAvatarInitials(avatar.name),
      hydrated,
      updateAvatar,
    }),
    [avatar, hydrated],
  );

  return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>;
}

export function useAvatar() {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error("useAvatar must be used inside AvatarProvider");
  }

  return context;
}
