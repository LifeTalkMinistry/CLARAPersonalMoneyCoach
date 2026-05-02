import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "clara_selected_theme";

export const claraThemes = [
  // 🟢 CLARA DEFAULT (PRIMARY)
  {
    id: "clara-default",
    name: "CLARA Default",
    category: "Default",
    description: "Deep financial green, growth yellow, and calm blue intelligence.",

    bg: "linear-gradient(180deg, #0D1F14 0%, #092219 42%, #07151D 100%)",
    panel: "rgba(13,31,20,0.82)",
    card: "linear-gradient(145deg, rgba(18,51,41,0.92), rgba(13,31,20,0.98))",

    accent: "#1E4D35",
    accentSoft: "rgba(30,77,53,0.18)",
    accentBorder: "rgba(199,226,58,0.28)",
    accentText: "#C7E23A",

    secondary: "#FFD23F",
    secondarySoft: "rgba(255,210,63,0.13)",

    highlight: "#143B6E",
    highlightSoft: "rgba(20,59,110,0.18)",

    glow: "rgba(199,226,58,0.14)",
    gradient: "linear-gradient(135deg, rgba(30,77,53,0.6), rgba(18,51,41,0.9), rgba(20,59,110,0.4))",
  },

  // ⚫ OBSIDIAN PRO
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

  // 🔵 MIDNIGHT INTELLIGENCE
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

  // 🟡 CLARITY (CONTROLLED LIGHT)
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

  root.style.setProperty("--clara-bg", theme.bg);
  root.style.setProperty("--clara-panel", theme.panel);
  root.style.setProperty("--clara-card", theme.card);

  root.style.setProperty("--clara-accent", theme.accent);
  root.style.setProperty("--clara-accent-soft", theme.accentSoft);
  root.style.setProperty("--clara-accent-border", theme.accentBorder);
  root.style.setProperty("--clara-accent-text", theme.accentText);

  root.style.setProperty("--clara-secondary", theme.secondary);
  root.style.setProperty("--clara-secondary-soft", theme.secondarySoft);

  root.style.setProperty("--clara-highlight", theme.highlight);
  root.style.setProperty("--clara-highlight-soft", theme.highlightSoft);

  root.style.setProperty("--clara-glow", theme.glow);
  root.style.setProperty("--clara-gradient", theme.gradient);
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
