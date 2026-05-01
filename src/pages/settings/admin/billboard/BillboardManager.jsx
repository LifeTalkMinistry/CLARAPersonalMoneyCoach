import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  media_url: "",
  cta_text: "",
  cta_url: "",
};

export default function BillboardManager() {
  const [billboards, setBillboards] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [rowErrors, setRowErrors] = useState({});

  const sortedBillboards = useMemo(() => {
    return [...billboards].sort((a, b) => {
      if (a.is_active === b.is_active) return 0;
      return a.is_active ? -1 : 1;
    });
  }, [billboards]);

  useEffect(() => {
    fetchBillboards();
  }, []);

  async function fetchBillboards() {
    setLoading(true);
    setPageError("");

    const { data, error } = await supabase
      .from("dashboard_billboards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setPageError(error.message || "Failed to load billboards.");
      setLoading(false);
      return;
    }

    setBillboards(data || []);
    setLoading(false);
  }

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
  }

  function startEdit(billboard) {
    setEditingId(billboard.id);
    setForm({
      title: billboard.title || "",
      subtitle: billboard.subtitle || "",
      media_url: billboard.media_url || "",
      cta_text: billboard.cta_text || "",
      cta_url: billboard.cta_url || "",
    });
    setFormError("");
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setFormError("Billboard title is required.");
      return;
    }

    setSaving(true);
    setFormError("");

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      media_url: form.media_url.trim() || null,
      cta_text: form.cta_text.trim() || null,
      cta_url: form.cta_url.trim() || null,
    };

    const request = editingId
      ? supabase
          .from("dashboard_billboards")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single()
      : supabase
          .from("dashboard_billboards")
          .insert(payload)
          .select()
          .single();

    const { data, error } = await request;

    if (error) {
      setFormError(error.message || "Failed to save billboard.");
      setSaving(false);
      return;
    }

    if (editingId) {
      setBillboards((prev) =>
        prev.map((item) => (item.id === editingId ? data : item))
      );
    } else {
      setBillboards((prev) => [data, ...prev]);
    }

    resetForm();
    setSaving(false);
  }

  async function handleActivate(billboard) {
    const rowKey = `${billboard.id}:activate`;

    setActionLoading((prev) => ({ ...prev, [rowKey]: true }));
    setRowErrors((prev) => ({ ...prev, [billboard.id]: "" }));

    if (!billboard.is_active) {
      const { error: deactivateError } = await supabase
        .from("dashboard_billboards")
        .update({ is_active: false })
        .neq("id", billboard.id);

      if (deactivateError) {
        setRowErrors((prev) => ({
          ...prev,
          [billboard.id]:
            deactivateError.message || "Failed to deactivate other billboards.",
        }));
        setActionLoading((prev) => ({ ...prev, [rowKey]: false }));
        return;
      }
    }

    const { data, error } = await supabase
      .from("dashboard_billboards")
      .update({ is_active: !billboard.is_active })
      .eq("id", billboard.id)
      .select()
      .single();

    if (error) {
      setRowErrors((prev) => ({
        ...prev,
        [billboard.id]: error.message || "Failed to update billboard status.",
      }));
      setActionLoading((prev) => ({ ...prev, [rowKey]: false }));
      return;
    }

    setBillboards((prev) =>
      prev.map((item) => {
        if (item.id === billboard.id) return data;
        if (!billboard.is_active) return { ...item, is_active: false };
        return item;
      })
    );

    setActionLoading((prev) => ({ ...prev, [rowKey]: false }));
  }

  async function handleDelete(billboard) {
    const rowKey = `${billboard.id}:delete`;

    setActionLoading((prev) => ({ ...prev, [rowKey]: true }));
    setRowErrors((prev) => ({ ...prev, [billboard.id]: "" }));

    const { error } = await supabase
      .from("dashboard_billboards")
      .delete()
      .eq("id", billboard.id);

    if (error) {
      setRowErrors((prev) => ({
        ...prev,
        [billboard.id]: error.message || "Failed to delete billboard.",
      }));
      setActionLoading((prev) => ({ ...prev, [rowKey]: false }));
      return;
    }

    setBillboards((prev) => prev.filter((item) => item.id !== billboard.id));

    if (editingId === billboard.id) {
      resetForm();
    }

    setActionLoading((prev) => ({ ...prev, [rowKey]: false }));
  }

  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">
        Billboard Manager
      </p>

      <h2 className="mt-2 text-lg font-black tracking-[-0.03em] text-white">
        Dashboard Billboard Content
      </h2>

      <p className="mt-1 text-sm leading-6 text-white/45">
        Manage dashboard billboard content, media, views, and taps.
      </p>

      <form onSubmit={handleSave} className="mt-5 space-y-3">
        <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
            Title
          </p>
          <input
            value={form.title}
            onChange={(e) => updateForm("title", e.target.value)}
            placeholder="Example: Normalize budgeting"
            className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
          />
        </div>

        <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
            Subtitle
          </p>
          <textarea
            value={form.subtitle}
            onChange={(e) => updateForm("subtitle", e.target.value)}
            placeholder="Short supporting message"
            rows={3}
            className="mt-1 w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/25"
          />
        </div>

        <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
            Media URL
          </p>
          <input
            value={form.media_url}
            onChange={(e) => updateForm("media_url", e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              CTA Text
            </p>
            <input
              value={form.cta_text}
              onChange={(e) => updateForm("cta_text", e.target.value)}
              placeholder="Get started"
              className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
          </div>

          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              CTA URL
            </p>
            <input
              value={form.cta_url}
              onChange={(e) => updateForm("cta_url", e.target.value)}
              placeholder="/settings"
              className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
          </div>
        </div>

        {formError && <p className="text-xs text-red-300">{formError}</p>}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.14] disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save Changes" : "Create Billboard"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/60 transition hover:bg-white/[0.08] hover:text-white"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        {loading && (
          <p className="text-sm text-white/45">Loading billboards...</p>
        )}

        {!loading && pageError && (
          <p className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
            {pageError}
          </p>
        )}

        {!loading && !pageError && sortedBillboards.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/40">
            No billboard content yet.
          </p>
        )}

        {!loading && !pageError && sortedBillboards.length > 0 && (
          <div className="space-y-3">
            {sortedBillboards.map((billboard) => {
              const activateKey = `${billboard.id}:activate`;
              const deleteKey = `${billboard.id}:delete`;

              return (
                <div
                  key={billboard.id}
                  className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-black text-white">
                          {billboard.title || "Untitled Billboard"}
                        </h3>

                        {billboard.is_active && (
                          <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                            Active
                          </span>
                        )}
                      </div>

                      {billboard.subtitle && (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">
                          {billboard.subtitle}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/35">
                        <span>Views: {billboard.views ?? 0}</span>
                        <span>•</span>
                        <span>Taps: {billboard.taps ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  {rowErrors[billboard.id] && (
                    <p className="mt-3 text-xs text-red-300">
                      {rowErrors[billboard.id]}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleActivate(billboard)}
                      disabled={actionLoading[activateKey]}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.14] disabled:opacity-50"
                    >
                      {actionLoading[activateKey]
                        ? "Updating..."
                        : billboard.is_active
                          ? "Deactivate"
                          : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(billboard)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(billboard)}
                      disabled={actionLoading[deleteKey]}
                      className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 transition hover:bg-red-500/15 disabled:opacity-50"
                    >
                      {actionLoading[deleteKey] ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
