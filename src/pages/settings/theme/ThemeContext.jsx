import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "clara_selected_theme";

export const claraThemes = [
  {
    id: "emerald-core",
    name: "Emerald Core",
    category: "Classic",
    description: "The original CLARA money-coach glow, refined with mature depth.",
    bg: "#04110d",
    panel: "rgba(6, 24, 19, 0.72)",
    panelStrong: "rgba(10, 41, 34, 0.82)",
    card: "rgba(10, 35, 29, 0.64)",
    cardStrong: "rgba(13, 54, 45, 0.72)",
    accent: "#34d399",
    accentSoft: "rgba(52, 211, 153, 0.12)",
    accentBorder: "rgba(52, 211, 153, 0.26)",
    accentText: "#a7f3d0",
    secondary: "#2dd4bf",
    secondarySoft: "rgba(45, 212, 191, 0.10)",
    highlight: "#d1fae5",
    highlightSoft: "rgba(209, 250, 229, 0.08)",
    glow: "rgba(16, 185, 129, 0.16)",
    glowSoft: "rgba(45, 212, 191, 0.10)",
    premiumGlow:
      "0 0 22px rgba(16,185,129,0.14), 0 18px 60px rgba(5,46,34,0.22), inset 0 1px 0 rgba(209,250,229,0.08)",
    surfaceGlow:
      "radial-gradient(circle at 20% 0%, rgba(52,211,153,0.16), transparent 34%), radial-gradient(circle at 90% 18%, rgba(45,212,191,0.09), transparent 36%)",
    glass:
      "linear-gradient(135deg, rgba(13,54,45,0.66), rgba(4,17,13,0.82) 48%, rgba(15,23,42,0.72))",
    gradient:
      "linear-gradient(135deg, rgba(52,211,153,0.18), rgba(45,212,191,0.10) 34%, rgba(4,17,13,0.92) 66%, rgba(2,6,23,0.96))",
  },
  {
    id: "gold-prestige",
    name: "Gold Prestige",
    category: "Premium",
    description: "Warm, luxury, and executive with champagne-bronze depth.",
    bg: "#0c0805",
    panel: "rgba(28, 18, 10, 0.72)",
    panelStrong: "rgba(47, 31, 17, 0.82)",
    card: "rgba(36, 24, 13, 0.64)",
    cardStrong: "rgba(61, 42, 22, 0.72)",
    accent: "#d6b56d",
    accentSoft: "rgba(214, 181, 109, 0.12)",
    accentBorder: "rgba(214, 181, 109, 0.28)",
    accentText: "#f8e7bd",
    secondary: "#b7794a",
    secondarySoft: "rgba(183, 121, 74, 0.11)",
    highlight: "#fff7df",
    highlightSoft: "rgba(255, 247, 223, 0.07)",
    glow: "rgba(180, 119, 58, 0.15)",
    glowSoft: "rgba(214, 181, 109, 0.09)",
    premiumGlow:
      "0 0 22px rgba(214,181,109,0.13), 0 18px 58px rgba(92,52,24,0.22), inset 0 1px 0 rgba(255,247,223,0.08)",
    surfaceGlow:
      "radial-gradient(circle at 18% 0%, rgba(214,181,109,0.15), transparent 34%), radial-gradient(circle at 88% 18%, rgba(183,121,74,0.10), transparent 38%)",
    glass:
      "linear-gradient(135deg, rgba(61,42,22,0.64), rgba(12,8,5,0.84) 50%, rgba(33,21,12,0.72))",
    gradient:
      "linear-gradient(135deg, rgba(214,181,109,0.17), rgba(183,121,74,0.12) 34%, rgba(28,18,10,0.92) 66%, rgba(8,6,5,0.97))",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    category: "Classic",
    description: "Clean, calm, and focused with premium navy-indigo contrast.",
    bg: "#030816",
    panel: "rgba(8, 18, 38, 0.72)",
    panelStrong: "rgba(13, 30, 63, 0.82)",
    card: "rgba(11, 24, 49, 0.64)",
    cardStrong: "rgba(18, 39, 79, 0.72)",
    accent: "#7dd3fc",
    accentSoft: "rgba(125, 211, 252, 0.12)",
    accentBorder: "rgba(125, 211, 252, 0.27)",
    accentText: "#e0f2fe",
    secondary: "#818cf8",
    secondarySoft: "rgba(129, 140, 248, 0.10)",
    highlight: "#cffafe",
    highlightSoft: "rgba(207, 250, 254, 0.07)",
    glow: "rgba(96, 165, 250, 0.15)",
    glowSoft: "rgba(129, 140, 248, 0.09)",
    premiumGlow:
      "0 0 22px rgba(96,165,250,0.13), 0 18px 58px rgba(30,41,120,0.22), inset 0 1px 0 rgba(224,242,254,0.08)",
    surfaceGlow:
      "radial-gradient(circle at 18% 0%, rgba(125,211,252,0.14), transparent 34%), radial-gradient(circle at 88% 18%, rgba(129,140,248,0.10), transparent 38%)",
    glass:
      "linear-gradient(135deg, rgba(18,39,79,0.64), rgba(3,8,22,0.84) 50%, rgba(30,27,75,0.68))",
    gradient:
      "linear-gradient(135deg, rgba(125,211,252,0.16), rgba(129,140,248,0.11) 34%, rgba(8,18,38,0.92) 66%, rgba(2,6,23,0.97))",
  },
  {
    id: "rose-aura",
    name: "Rose Aura",
    category: "Aesthetic",
    description: "Soft, expressive, and modern with rose-violet wine depth.",
    bg: "#12070d",
    panel: "rgba(35, 15, 27, 0.72)",
    panelStrong: "rgba(58, 24, 45, 0.82)",
    card: "rgba(43, 18, 34, 0.64)",
    cardStrong: "rgba(74, 30, 57, 0.72)",
    accent: "#e8799a",
    accentSoft: "rgba(232, 121, 154, 0.12)",
    accentBorder: "rgba(232, 121, 154, 0.27)",
    accentText: "#ffe4e9",
    secondary: "#a78bfa",
    secondarySoft: "rgba(167, 139, 250, 0.10)",
    highlight: "#fff1f4",
    highlightSoft: "rgba(255, 241, 244, 0.07)",
    glow: "rgba(232, 121, 154, 0.14)",
    glowSoft: "rgba(167, 139, 250, 0.09)",
    premiumGlow:
      "0 0 22px rgba(232,121,154,0.12), 0 18px 58px rgba(88,28,80,0.21), inset 0 1px 0 rgba(255,241,244,0.08)",
    surfaceGlow:
      "radial-gradient(circle at 18% 0%, rgba(232,121,154,0.14), transparent 34%), radial-gradient(circle at 88% 18%, rgba(167,139,250,0.10), transparent 38%)",
    glass:
      "linear-gradient(135deg, rgba(74,30,57,0.62), rgba(18,7,13,0.84) 50%, rgba(46,16,101,0.58))",
    gradient:
      "linear-gradient(135deg, rgba(232,121,154,0.16), rgba(167,139,250,0.11) 34%, rgba(35,15,27,0.92) 66%, rgba(12,6,18,0.97))",
  },
];

const fallbackTheme = claraThemes[0];

const ThemeContext = createContext(null);

function buildThemeSystem(theme) {
  const panel = theme.panel || "rgba(255, 255, 255, 0.055)";
  const panelStrong = theme.panelStrong || "rgba(255, 255, 255, 0.095)";
  const glow = theme.glow || theme.accentSoft || "rgba(52, 211, 153, 0.14)";
  const glowSoft = theme.glowSoft || theme.secondarySoft || glow;
  const glass =
    theme.glass || `linear-gradient(135deg, ${panelStrong}, ${panel})`;
  const surfaceGlow =
    theme.surfaceGlow ||
    `radial-gradient(circle at 50% 0%, ${glowSoft}, transparent 42%)`;
  const glowPremium =
    theme.premiumGlow ||
    theme.glowPremium ||
    `0 0 24px ${glowSoft}, inset 0 1px 0 rgba(255,255,255,0.08)`;

  return {
    ...theme,
    text: "rgba(255, 255, 255, 0.94)",
    textSoft: "rgba(255, 255, 255, 0.72)",
    textMuted: "rgba(255, 255, 255, 0.48)",
    textFaint: "rgba(255, 255, 255, 0.30)",
    border: "rgba(255, 255, 255, 0.105)",
    borderStrong: theme.accentBorder,
    card: theme.card || panel,
    cardStrong: theme.cardStrong || panelStrong,
    glass,
    glowSoft,
    glowPremium,
    surfaceGlow,
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
