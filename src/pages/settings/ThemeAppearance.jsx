import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";

export default function ThemeAppearance() {
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
      </div>
    </ClaraPageShell>
  );
}
