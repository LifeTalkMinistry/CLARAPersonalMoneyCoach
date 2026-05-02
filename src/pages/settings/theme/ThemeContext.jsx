import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "clara_selected_theme";

export const claraThemes = [
  {
    id: "clara-default",
    name: "CLARA Default",
    category: "Default",
    description: "Deep green base, warm yellow glow, and calm blue depth with premium glass layering.",
    bg: "radial-gradient(circle at 50% -18%, rgba(241,201,75,0.96) 0%, rgba(204,225,79,0.28) 16%, rgba(28,85,49,0.10) 32%, transparent 50%), radial-gradient(circle at 100% 92%, rgba(30,85,146,0.48) 0%, rgba(18,52,88,0.20) 28%, transparent 52%), radial-gradient(circle at 0% 84%, rgba(17,70,125,0.28) 0%, rgba(7,38,72,0.08) 34%, transparent 55%), linear-gradient(180deg, #14331d 0%, #0d2a1f 18%, #082218 42%, #071a23 76%, #05111d 100%)",
    panel: "linear-gradient(145deg, rgba(17,42,30,0.84), rgba(10,30,24,0.88) 44%, rgba(7,23,32,0.92) 100%)",
    panelStrong: "linear-gradient(145deg, rgba(16,40,29,0.92), rgba(9,27,22,0.95) 46%, rgba(6,22,33,0.98) 100%)",
    card: "linear-gradient(152deg, rgba(64,112,49,0.20) 0%, rgba(18,61,40,0.16) 20%, rgba(10,37,28,0.90) 46%, rgba(8,25,22,0.94) 72%, rgba(7,25,40,0.92) 100%)",
    cardStrong: "linear-gradient(150deg, rgba(95,150,57,0.24) 0%, rgba(28,83,48,0.20) 18%, rgba(10,42,30,0.95) 45%, rgba(7,28,25,0.98) 74%, rgba(9,33,56,0.96) 100%)",
    glass: "linear-gradient(145deg, rgba(20,47,34,0.74), rgba(11,31,24,0.78) 46%, rgba(8,24,35,0.84) 100%)",
    border: "rgba(255,255,255,0.10)",
    borderStrong: "rgba(199,226,58,0.30)",
    borderSoft: "rgba(255,255,255,0.06)",
    text: "rgba(255,255,255,0.96)",
    textSoft: "rgba(255,255,255,0.74)",
    textMuted: "rgba(255,255,255,0.52)",
    textFaint: "rgba(255,255,255,0.30)",
    accent: "#5a9334",
    accentSoft: "rgba(199,226,58,0.13)",
    accentBorder: "rgba(199,226,58,0.30)",
    accentText: "#d7ef59",
    secondary: "#e6c548",
    secondarySoft: "rgba(230,197,72,0.16)",
    highlight: "#1f4f8a",
    highlightSoft: "rgba(31,79,138,0.20)",
    glow: "rgba(207,232,74,0.10)",
    glowSoft: "rgba(230,197,72,0.06)",
    glowBlue: "rgba(58,116,214,0.10)",
    glowPremium: "0 18px 40px rgba(0,0,0,0.26), 0 32px 76px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.08)",
    surfaceGlow: "radial-gradient(circle at 16% 8%, rgba(207,232,74,0.14), transparent 26%), radial-gradient(circle at 72% 100%, rgba(52,108,196,0.12), transparent 32%), radial-gradient(circle at 100% 38%, rgba(230,197,72,0.08), transparent 22%)",
    gradient: "linear-gradient(135deg, rgba(69,121,48,0.18), rgba(12,42,32,0.94) 48%, rgba(10,34,54,0.92) 100%)",
    modalSurface: "linear-gradient(155deg, rgba(42,78,48,0.24) 0%, rgba(14,40,30,0.92) 36%, rgba(8,27,25,0.96) 68%, rgba(9,29,43,0.96) 100%)",
    modalBackdrop: "rgba(3,9,14,0.60)",
    inputSurface: "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.03))",
    inputBorder: "rgba(255,255,255,0.08)",
    buttonPrimary: "linear-gradient(135deg, rgba(112,160,55,0.96), rgba(191,215,74,0.92))",
    buttonSecondary: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
  },

  {
    id: "obsidian-pro",
    name: "Obsidian Pro",
    category: "Elite",
    description: "Minimal, sharp, and focused. No distractions.",

    bg: "#050505",
    panel: "rgba(15,15,15,0.9)",
    card: "rgba(20,20,20,0.9)",

    accent: "#1E4D35",
    accentSoft: "rgba(30,77,53,0.15)",
    accentBorder: "rgba(30,77,53,0.25)",
    accentText: "#4ADE80",

    secondary: "#4ADE80",
    secondarySoft: "rgba(74,222,128,0.1)",

    highlight: "#111",
    highlightSoft: "rgba(255,255,255,0.05)",

    glow: "rgba(0,0,0,0.3)",
    gradient: "rgba(20,20,20,0.9)",
  },

  {
    id: "midnight-intelligence",
    name: "Midnight Intelligence",
    category: "Intelligence",
    description: "AI-driven calm system. Focused and analytical.",

    bg: "linear-gradient(180deg, #050A14 0%, #081423 100%)",
    panel: "rgba(8,20,35,0.85)",
    card: "rgba(10,25,45,0.9)",

    accent: "#0EA5E9",
    accentSoft: "rgba(14,165,233,0.15)",
    accentBorder: "rgba(14,165,233,0.25)",
    accentText: "#38BDF8",

    secondary: "#22C55E",
    secondarySoft: "rgba(34,197,94,0.12)",

    highlight: "#1E3A8A",
    highlightSoft: "rgba(30,58,138,0.2)",

    glow: "rgba(14,165,233,0.12)",
    gradient: "linear-gradient(135deg, rgba(10,25,45,0.8), rgba(8,20,35,0.9))",
  },

  {
    id: "clarity-mode",
    name: "Clarity Mode",
    category: "Clarity",
    description: "Clean, soft, readable. No noise.",

    bg: "#F5F7F6",
    panel: "#FFFFFF",
    card: "#FFFFFF",

    accent: "#1E4D35",
    accentSoft: "rgba(30,77,53,0.1)",
    accentBorder: "rgba(30,77,53,0.2)",
    accentText: "#1E4D35",

    secondary: "#FFD23F",
    secondarySoft: "rgba(255,210,63,0.1)",

    highlight: "#143B6E",
    highlightSoft: "rgba(20,59,110,0.1)",

    glow: "rgba(0,0,0,0.05)",
    gradient: "#FFFFFF",
  },
];

const fallbackTheme = claraThemes[0];
const ThemeContext = createContext(null);

function applyTheme(theme) {
  const root = document.documentElement;
  const withFallback = (value, fallback) => value ?? fallback;

  root.style.setProperty("--clara-bg", theme.bg);
  root.style.setProperty("--clara-panel", theme.panel);
  root.style.setProperty("--clara-panel-strong", withFallback(theme.panelStrong, theme.panel));
  root.style.setProperty("--clara-card", theme.card);
  root.style.setProperty("--clara-card-strong", withFallback(theme.cardStrong, theme.card));
  root.style.setProperty("--clara-glass", withFallback(theme.glass, theme.panel));
  root.style.setProperty("--clara-border", withFallback(theme.border, "rgba(255,255,255,0.10)"));
  root.style.setProperty("--clara-border-strong", withFallback(theme.borderStrong, theme.accentBorder));
  root.style.setProperty("--clara-border-soft", withFallback(theme.borderSoft, "rgba(255,255,255,0.06)"));
  root.style.setProperty("--clara-text", withFallback(theme.text, "rgba(255,255,255,0.96)"));
  root.style.setProperty("--clara-text-soft", withFallback(theme.textSoft, "rgba(255,255,255,0.72)"));
  root.style.setProperty("--clara-text-muted", withFallback(theme.textMuted, "rgba(255,255,255,0.52)"));
  root.style.setProperty("--clara-text-faint", withFallback(theme.textFaint, "rgba(255,255,255,0.30)"));

  root.style.setProperty("--clara-accent", theme.accent);
  root.style.setProperty("--clara-accent-soft", theme.accentSoft);
  root.style.setProperty("--clara-accent-border", theme.accentBorder);
  root.style.setProperty("--clara-accent-text", theme.accentText);

  root.style.setProperty("--clara-secondary", theme.secondary);
  root.style.setProperty("--clara-secondary-soft", theme.secondarySoft);

  root.style.setProperty("--clara-highlight", theme.highlight);
  root.style.setProperty("--clara-highlight-soft", theme.highlightSoft);

  root.style.setProperty("--clara-glow", theme.glow);
  root.style.setProperty("--clara-glow-soft", withFallback(theme.glowSoft, theme.glow));
  root.style.setProperty("--clara-glow-blue", withFallback(theme.glowBlue, theme.highlightSoft));
  root.style.setProperty("--clara-glow-premium", withFallback(theme.glowPremium, "0 18px 40px rgba(0,0,0,0.26)"));
  root.style.setProperty("--clara-surface-glow", withFallback(theme.surfaceGlow, "none"));
  root.style.setProperty("--clara-gradient", theme.gradient);
  root.style.setProperty("--clara-modal-surface", withFallback(theme.modalSurface, theme.card));
  root.style.setProperty("--clara-modal-backdrop", withFallback(theme.modalBackdrop, "rgba(0,0,0,0.6)"));
  root.style.setProperty("--clara-input-surface", withFallback(theme.inputSurface, theme.card));
  root.style.setProperty("--clara-input-border", withFallback(theme.inputBorder, theme.border));
  root.style.setProperty("--clara-button-primary", withFallback(theme.buttonPrimary, theme.accent));
  root.style.setProperty("--clara-button-secondary", withFallback(theme.buttonSecondary, theme.card));
}

export function ClaraThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) || fallbackTheme.id
  );

  const selectedTheme =
    claraThemes.find((t) => t.id === themeId) || fallbackTheme;

  useEffect(() => {
    applyTheme(selectedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme.id);
  }, [selectedTheme]);

  return (
    <ThemeContext.Provider
      value={{
        themes: claraThemes,
        selectedThemeId: selectedTheme.id,
        setThemeId,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useClaraTheme() {
  return useContext(ThemeContext);
}
