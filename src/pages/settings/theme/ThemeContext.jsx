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
    gradient:
      "linear-gradient(135deg, rgba(52,211,153,0.14), rgba(15,23,42,0.9), rgba(6,78,59,0.22))",
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
    gradient:
      "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(15,23,42,0.88), rgba(120,53,15,0.25))",
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
    gradient:
      "linear-gradient(135deg, rgba(56,189,248,0.13), rgba(15,23,42,0.9), rgba(30,64,175,0.20))",
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
    gradient:
      "linear-gradient(135deg, rgba(251,113,133,0.14), rgba(15,23,42,0.88), rgba(131,16,38,0.18))",
  },
];

const fallbackTheme = claraThemes[0];

const ThemeContext = createContext(null);

function buildThemeSystem(theme) {
  return {
    ...theme,
    text: "rgba(255, 255, 255, 0.94)",
    textSoft: "rgba(255, 255, 255, 0.72)",
    textMuted: "rgba(255, 255, 255, 0.48)",
    textFaint: "rgba(255, 255, 255, 0.30)",
    border: "rgba(255, 255, 255, 0.105)",
    borderStrong: theme.accentBorder,
    card: theme.panel,
    cardStrong: theme.panelStrong,
    glass: `linear-gradient(135deg, ${theme.panelStrong}, ${theme.panel})`,
    glowSoft: theme.glow,
    glowPremium: `0 0 28px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.10)`,
    surfaceGlow: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 42%)`,
  };
}

function applyTheme(theme) {
  const root = document.documentElement;
  const themeSystem = buildThemeSystem(theme);

  root.style.setProperty("--clara-bg", themeSystem.bg);
  root.style.setProperty("--clara-panel", themeSystem.panel);
  root.style.setProperty("--clara-panel-strong", themeSystem.panelStrong);
  root.style.setProperty("--clara-card", themeSystem.card);
  root.style.setProperty("--clara-card-strong", themeSystem.cardStrong);
  root.style.setProperty("--clara-glass", themeSystem.glass);
  root.style.setProperty("--clara-border", themeSystem.border);
  root.style.setProperty("--clara-border-strong", themeSystem.borderStrong);
  root.style.setProperty("--clara-text", themeSystem.text);
  root.style.setProperty("--clara-text-soft", themeSystem.textSoft);
  root.style.setProperty("--clara-text-muted", themeSystem.textMuted);
  root.style.setProperty("--clara-text-faint", themeSystem.textFaint);
  root.style.setProperty("--clara-accent", themeSystem.accent);
  root.style.setProperty("--clara-accent-soft", themeSystem.accentSoft);
  root.style.setProperty("--clara-accent-border", themeSystem.accentBorder);
  root.style.setProperty("--clara-accent-text", themeSystem.accentText);
  root.style.setProperty("--clara-glow", themeSystem.glow);
  root.style.setProperty("--clara-glow-soft", themeSystem.glowSoft);
  root.style.setProperty("--clara-glow-premium", themeSystem.glowPremium);
  root.style.setProperty("--clara-surface-glow", themeSystem.surfaceGlow);
  root.style.setProperty("--clara-gradient", themeSystem.gradient);
  root.style.colorScheme = "dark";
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
      selectedTheme: buildThemeSystem(selectedTheme),
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
