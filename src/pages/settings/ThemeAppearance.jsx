import { useState } from "react";
import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";

const themeCategories = ["All", "Classic", "Premium", "Aesthetic"];

export default function ThemeAppearance() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <ClaraPageShell>
      <div className="space-y-5 pb-6">
        <div className="px-1 pt-1">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-emerald-300/45">
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
                className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-black transition ${
                  active
                    ? "border-emerald-400/35 bg-emerald-400/15 text-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.16)]"
                    : "border-white/10 bg-white/[0.05] text-white/45 hover:bg-white/[0.08]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </ClaraPageShell>
  );
}
