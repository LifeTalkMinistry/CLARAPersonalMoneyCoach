import { Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";
import { useClaraTheme } from "./theme/ThemeContext";

const themeCategories = ["All", "Classic", "Premium", "Aesthetic"];

export default function ThemeAppearance() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const { themes, selectedThemeId, setThemeId } = useClaraTheme();

  const visibleThemes =
    activeCategory === "All"
      ? themes
      : themes.filter((theme) => theme.category === activeCategory);

  return (
    <ClaraPageShell>
      <div className="space-y-5 pb-6">

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 px-1 text-white/60 hover:text-white transition"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="px-1">
          <p
            className="text-[11px] font-black uppercase tracking-[0.26em]"
            style={{ color: "var(--clara-accent-text)" }}
          >
            SETTINGS
          </p>

          <h1 className="mt-1 text-[30px] font-black tracking-[-0.04em] text-white">
            Theme & appearance
          </h1>

          <p className="mt-1 text-sm leading-5 text-white/45">
            Customize how CLARA looks and feels.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {themeCategories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="shrink-0 rounded-full border px-4 py-2 text-[11px] font-black transition active:scale-95"
                style={{
                  borderColor: active
                    ? "var(--clara-accent-border)"
                    : "rgba(255,255,255,0.10)",
                  background: active
                    ? "var(--clara-accent-soft)"
                    : "rgba(255,255,255,0.05)",
                  color: active ? "var(--clara-accent-text)" : "rgba(255,255,255,0.45)",
                  boxShadow: active ? "0 0 22px var(--clara-glow)" : "none",
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        <section className="space-y-3">
          {visibleThemes.map((theme) => {
            const selected = selectedThemeId === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                className="group w-full overflow-hidden rounded-[28px] border p-4 text-left transition active:scale-[0.99]"
                style={{
                  borderColor: selected ? theme.accentBorder : "rgba(255,255,255,0.10)",
                  background: selected ? theme.gradient : "rgba(255,255,255,0.045)",
                  boxShadow: selected ? `0 0 34px ${theme.glow}` : "0 18px 60px rgba(0,0,0,0.26)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
                    style={{
                      borderColor: theme.accentBorder,
                      background: theme.accentSoft,
                      color: theme.accentText,
                    }}
                  >
                    {selected ? <Check size={19} strokeWidth={2.4} /> : "🎨"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[15px] font-black tracking-[-0.02em] text-white">
                        {theme.name}
                      </h3>

                      <span
                        className="shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em]"
                        style={{
                          borderColor: theme.accentBorder,
                          background: theme.accentSoft,
                          color: theme.accentText,
                        }}
                      >
                        {theme.category}
                      </span>
                    </div>

                    <p className="mt-1 text-[12px] leading-5 text-white/45">
                      {theme.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className="h-7 flex-1 rounded-full border"
                        style={{
                          borderColor: theme.accentBorder,
                          background: theme.gradient,
                        }}
                      />
                      <span
                        className="h-7 w-7 rounded-full border"
                        style={{
                          borderColor: theme.accentBorder,
                          background: theme.accent,
                          boxShadow: `0 0 18px ${theme.glow}`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </section>
      </div>
    </ClaraPageShell>
  );
}
