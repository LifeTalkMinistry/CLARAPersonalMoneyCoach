import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "clara_selected_theme";

export const claraThemes = [
  {
    id: "clara-default",
    name: "CLARA Default",
    category: "Default",
    description:
      "The official CLARA look: deep financial green, bright growth yellow, and a controlled blue trust accent.",
    bg: "#020b08",
    panel: "rgba(4, 22, 16, 0.76)",
    panelStrong: "rgba(8, 45, 31, 0.86)",
    card: "rgba(7, 35, 25, 0.68)",
    cardStrong: "rgba(10, 66, 42, 0.76)",
    accent: "#7ed957",
    accentSoft: "rgba(126, 217, 87, 0.14)",
    accentBorder: "rgba(126, 217, 87, 0.34)",
    accentText: "#d7ff5f",
    secondary: "#fff22d",
    secondarySoft: "rgba(255, 242, 45, 0.12)",
    highlight: "#16b8ff",
    highlightSoft: "rgba(22, 184, 255, 0.10)",
    glow: "rgba(126, 217, 87, 0.18)",
    glowSoft: "rgba(255, 242, 45, 0.10)",
    premiumGlow:
      "0 0 22px rgba(126,217,87,0.16), 0 18px 60px rgba(0,105,70,0.22), inset 0 1px 0 rgba(215,255,95,0.09)",
    surfaceGlow:
      "radial-gradient(circle at 18% 0%, rgba(126,217,87,0.18), transparent 34%), radial-gradient(circle at 88% 18%, rgba(255,242,45,0.10), transparent 35%), radial-gradient(circle at 92% 86%, rgba(22,184,255,0.12), transparent 38%)",
    glass:
      "linear-gradient(135deg, rgba(11,80,48,0.68), rgba(4,22,16,0.86) 46%, rgba(2,18,25,0.78))",
    gradient:
      "linear-gradient(135deg, rgba(126,217,87,0.18), rgba(255,242,45,0.08) 32%, rgba(4,22,16,0.94) 64%, rgba(2,18,25,0.96))",
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
  root.style.setProperty("--clara-secondary", themeSystem.secondary);
  root.style.setProperty("--clara-secondary-soft", themeSystem.secondarySoft);
  root.style.setProperty("--clara-highlight", themeSystem.highlight);
  root.style.setProperty("--clara-highlight-soft", themeSystem.highlightSoft);
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
