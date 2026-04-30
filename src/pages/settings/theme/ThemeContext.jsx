import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "clara_selected_theme";

export const claraThemes = [
  {
    id: "emerald-core",
    name: "Emerald Core",
    category: "Classic",
    description: "The original CLARA money-coach glow.",
    accent: "#34d399",
    accentSoft: "rgba(52, 211, 153, 0.14)",
    accentBorder: "rgba(52, 211, 153, 0.32)",
    accentText: "#86efac",
    glow: "rgba(16, 185, 129, 0.22)",
    bg: "#070b10",
    panel: "rgba(255, 255, 255, 0.055)",
    panelStrong: "rgba(255, 255, 255, 0.095)",
    gradient: "linear-gradient(135deg, rgba(52,211,153,0.14), rgba(15,23,42,0.9), rgba(6,78,59,0.22))",
  },
  {
    id: "gold-prestige",
    name: "Gold Prestige",
    category: "Premium",
    description: "Warm, luxury, and executive.",
    accent: "#fbbf24",
    accentSoft: "rgba(251, 191, 36, 0.14)",
    accentBorder: "rgba(251, 191, 36, 0.34)",
    accentText: "#fde68a",
    glow: "rgba(245, 158, 11, 0.22)",
    bg: "#090806",
    panel: "rgba(255, 255, 255, 0.055)",
    panelStrong: "rgba(255, 255, 255, 0.10)",
    gradient: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(15,23,42,0.88), rgba(120,53,15,0.25))",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    category: "Classic",
    description: "Clean, calm, and focused.",
    accent: "#38bdf8",
    accentSoft: "rgba(56, 189, 248, 0.13)",
    accentBorder: "rgba(56, 189, 248, 0.32)",
    accentText: "#bae6fd",
    glow: "rgba(56, 189, 248, 0.22)",
    bg: "#050914",
    panel: "rgba(255, 255, 255, 0.052)",
    panelStrong: "rgba(255, 255, 255, 0.095)",
    gradient: "linear-gradient(135deg, rgba(56,189,248,0.13), rgba(15,23,42,0.9), rgba(30,64,175,0.20))",
  },
  {
    id: "rose-aura",
    name: "Rose Aura",
    category: "Aesthetic",
    description: "Soft, expressive, and modern.",
    accent: "#fb7185",
    accentSoft: "rgba(251, 113, 133, 0.14)",
    accentBorder: "rgba(251, 113, 133, 0.32)",
    accentText: "#fecdd3",
    glow: "rgba(251, 113, 133, 0.22)",
    bg: "#10070c",
    panel: "rgba(255, 255, 255, 0.055)",
    panelStrong: "rgba(255, 255, 255, 0.10)",
    gradient: "linear-gradient(135deg, rgba(251,113,133,0.14), rgba(15,23,42,0.88), rgba(831,16,38,0.18))",
  },
];

const fallbackTheme = claraThemes[0];

const ThemeContext = createContext(null);

function applyTheme(theme) {
  const root = document.documentElement;

  root.style.setProperty("--clara-bg", theme.bg);
  root.style.setProperty("--clara-panel", theme.panel);
  root.style.setProperty("--clara-panel-strong", theme.panelStrong);
  root.style.setProperty("--clara-accent", theme.accent);
  root.style.setProperty("--clara-accent-soft", theme.accentSoft);
  root.style.setProperty("--clara-accent-border", theme.accentBorder);
  root.style.setProperty("--clara-accent-text", theme.accentText);
  root.style.setProperty("--clara-glow", theme.glow);
  root.style.setProperty("--clara-gradient", theme.gradient);
}

export function ClaraThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    if (typeof window === "undefined") return fallbackTheme.id;
    return window.localStorage.getItem(THEME_STORAGE_KEY) || fallbackTheme.id;
  });

  const selectedTheme =
    claraThemes.find((theme) => theme.id === themeId) || fallbackTheme;

  useEffect(() => {
    applyTheme(selectedTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, selectedTheme.id);
  }, [selectedTheme]);

  const value = useMemo(
    () => ({
      themes: claraThemes,
      selectedTheme,
      selectedThemeId: selectedTheme.id,
      setThemeId,
    }),
    [selectedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useClaraTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useClaraTheme must be used inside ClaraThemeProvider");
  }

  return context;
}
