import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

const PLANS = [
  { key: "free", label: "FREE" },
  { key: "pro", label: "PRO" },
  { key: "core", label: "CORE" },
  { key: "lifeos", label: "LIFE OS" },
];

export default function PlanAccessControl({ profile }) {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [rowErrors, setRowErrors] = useState({});
  const [updating, setUpdating] = useState({});

  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;

  const groupedConfig = useMemo(() => {
    const base = {
      free: [],
      pro: [],
      core: [],
      lifeos: [],
    };

    Object.entries(config).forEach(([plan, features]) => {
      base[plan] = features;
    });

    return base;
  }, [config]);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    fetchAccessConfig();
  }, [isAdmin]);

  async function fetchAccessConfig() {
    setLoading(true);
    setPageError("");

    const { data, error } = await supabase
      .from("access_config")
      .select("id, plan, feature_key, enabled")
      .order("plan", { ascending: true })
      .order("feature_key", { ascending: true });

    if (error) {
      setPageError(error.message || "Failed to load access control.");
      setLoading(false);
      return;
    }

    const grouped = {};

    (data || []).forEach((row) => {
      if (!grouped[row.plan]) grouped[row.plan] = [];
      grouped[row.plan].push(row);
    });

    setConfig(grouped);
    setLoading(false);
  }

  async function handleToggle(plan, featureKey, currentValue) {
    const nextValue = !currentValue;
    const rowKey = `${plan}:${featureKey}`;

    setUpdating((prev) => ({ ...prev, [rowKey]: true }));
    setRowErrors((prev) => ({ ...prev, [rowKey]: "" }));

    const { error } = await supabase
      .from("access_config")
      .update({ enabled: nextValue })
      .eq("plan", plan)
      .eq("feature_key", featureKey);

    if (error) {
      setRowErrors((prev) => ({
        ...prev,
        [rowKey]: error.message || "Update failed.",
      }));

      setUpdating((prev) => ({ ...prev, [rowKey]: false }));
      return;
    }

    setConfig((prev) => ({
      ...prev,
      [plan]: (prev[plan] || []).map((feature) =>
        feature.feature_key === featureKey
          ? { ...feature, enabled: nextValue }
          : feature
      ),
    }));

    setUpdating((prev) => ({ ...prev, [rowKey]: false }));
  }

  if (!isAdmin) {
    return (
      <section className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
        <h2 className="text-sm font-semibold text-white">Access denied</h2>
        <p className="mt-1 text-xs text-white/45">
          You do not have permission to manage plan access.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Plan Access Control
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Control which features are enabled per plan.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-white/50">Loading access control...</p>
      )}

      {!loading && pageError && (
        <div className="rounded-[24px] border border-red-400/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{pageError}</p>
        </div>
      )}

      {!loading &&
        !pageError &&
        PLANS.map((plan) => {
          const features = groupedConfig[plan.key] || [];

          return (
            <section
              key={plan.key}
              className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4"
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                {plan.label}
              </h2>

              <div className="mt-4 space-y-3">
                {features.length === 0 ? (
                  <p className="text-sm text-white/40">
                    No features configured for this plan.
                  </p>
                ) : (
                  features.map((feature) => {
                    const rowKey = `${plan.key}:${feature.feature_key}`;
                    const isUpdating = updating[rowKey];

                    return (
                      <div key={feature.id || rowKey}>
                        <div className="flex items-center justify-between gap-4 text-sm text-white">
                          <span className="min-w-0 truncate">
                            {feature.feature_key}
                          </span>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleToggle(
                                plan.key,
                                feature.feature_key,
                                feature.enabled
                              )
                            }
                            className={[
                              "relative h-7 w-12 shrink-0 rounded-full border transition disabled:opacity-50",
                              feature.enabled
                                ? "border-white/20 bg-white/20 shadow-[0_0_18px_rgba(255,255,255,0.08)]"
                                : "border-white/10 bg-white/[0.06]",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "absolute top-1 h-5 w-5 rounded-full bg-white/80 transition",
                                feature.enabled ? "left-6" : "left-1",
                              ].join(" ")}
                            />
                          </button>
                        </div>

                        {rowErrors[rowKey] && (
                          <p className="mt-1 text-xs text-red-300">
                            {rowErrors[rowKey]}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
    </div>
  );
}
