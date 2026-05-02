import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "clara_selected_theme";

export const claraThemes = [
  {
    id: "clara-default",
    name: "CLARA Default",
    category: "Default",
    description:
      "The official CLARA look: deep financial green, growth yellow, and a calm blue intelligence accent.",

    /* Palette reference */
    ink: "#0D1F14",
    forest: "#123329",
    growth: "#1E4D35",
    lime: "#C7E23A",
    gold: "#FFD23F",
    intelligence: "#143B6E",

    /* Base */
    bg:
      "radial-gradient(circle at 50% -16%, rgba(255, 210, 63, 0.24), transparent 32%), radial-gradient(circle at 18% 18%, rgba(199, 226, 58, 0.13), transparent 34%), radial-gradient(circle at 88% 78%, rgba(20, 59, 110, 0.22), transparent 42%), linear-gradient(180deg, #0D1F14 0%, #092219 42%, #07151D 100%)",
    panel: "rgba(13, 31, 20, 0.82)",
    panelStrong: "rgba(18, 51, 41, 0.90)",
    card:
      "linear-gradient(145deg, rgba(18, 51, 41, 0.92), rgba(13, 31, 20, 0.98))",
    cardStrong:
      "linear-gradient(145deg, rgba(30, 77, 53, 0.86), rgba(18, 51, 41, 0.96))",

    /* Brand roles */
    accent: "#1E4D35",
    accentSoft: "rgba(30, 77, 53, 0.18)",
    accentBorder: "rgba(199, 226, 58, 0.28)",
    accentText: "#C7E23A",
    secondary: "#FFD23F",
    secondarySoft: "rgba(255, 210, 63, 0.13)",
    highlight: "#143B6E",
    highlightSoft: "rgba(20, 59, 110, 0.18)",

    /* Premium depth, not loud glow */
    glow: "rgba(199, 226, 58, 0.14)",
    glowSoft: "rgba(255, 210, 63, 0.08)",
    premiumGlow:
      "0 22px 54px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.055)",
    surfaceGlow:
      "radial-gradient(circle at 50% -14%, rgba(255,210,63,0.14), transparent 34%), radial-gradient(circle at 90% 20%, rgba(20,59,110,0.12), transparent 34%)",
    glass:
      "linear-gradient(145deg, rgba(18, 51, 41, 0.72), rgba(13, 31, 20, 0.92) 58%, rgba(7, 21, 29, 0.90))",
    gradient:
      "linear-gradient(135deg, rgba(30,77,53,0.62), rgba(18,51,41,0.86) 48%, rgba(20,59,110,0.34))",
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
    text: "rgba(255, 255, 255, 0.95)",
    textSoft: "rgba(255, 255, 255, 0.68)",
    textMuted: "rgba(255, 255, 255, 0.46)",
    textFaint: "rgba(255, 255, 255, 0.28)",
    border: "rgba(255, 255, 255, 0.095)",
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

  root.style.setProperty("--clara-ink", themeSystem.ink || "#0D1F14");
  root.style.setProperty("--clara-forest", themeSystem.forest || "#123329");
  root.style.setProperty("--clara-growth", themeSystem.growth || "#1E4D35");
  root.style.setProperty("--clara-lime", themeSystem.lime || "#C7E23A");
  root.style.setProperty("--clara-gold", themeSystem.gold || "#FFD23F");
  root.style.setProperty("--clara-blue", themeSystem.intelligence || "#143B6E");
  root.style.setProperty("--clara-success", themeSystem.growth || "#1E4D35");
  root.style.setProperty("--clara-warning", themeSystem.gold || "#FFD23F");
  root.style.setProperty("--clara-shadow-soft", "0 10px 30px rgba(0, 0, 0, 0.35)");
  root.style.setProperty("--clara-shadow-elevated", "0 20px 50px rgba(0, 0, 0, 0.45)");

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
