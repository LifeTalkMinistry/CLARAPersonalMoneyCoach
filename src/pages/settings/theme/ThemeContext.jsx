import { createContext, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "clara_selected_theme";

export const claraThemes = [
  {
    id: "clara-default",
    name: "CLARA Glass",
    category: "Default",
    description: "Refined premium dark glass fintech system.",
    bg: "#071018",
    panel: "#162026",
    card: "#111a20",
    accent: "#8FE388",
    accentSoft: "#1f3327",
    accentBorder: "#486f4b",
    accentText: "#A9F2A2",
    secondary: "#8FE388",
    secondarySoft: "#1f3327",
    highlight: "#2A6F68",
    highlightSoft: "#14312f",
    glow: "#8FE388",
    gradient: "#111a20"
  }
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
  const [themeId, setThemeId] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || fallbackTheme.id);
  const selectedTheme = claraThemes.find((theme) => theme.id === themeId) || fallbackTheme;

  useEffect(() => {
    applyTheme(selectedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme.id);
  }, [selectedTheme]);

  return (
    <ThemeContext.Provider value={{ themes: claraThemes, selectedThemeId: selectedTheme.id, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useClaraTheme() {
  return useContext(ThemeContext);
}
