import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import BillboardForm from "./BillboardForm";
import BillboardList from "./BillboardList";
import BillboardAnalytics from "./BillboardAnalytics";

export default function BillboardManager() {
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBillboard, setEditingBillboard] = useState(null);

  const loadBillboards = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("dashboard_billboards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBillboards(data || []);
    } catch (err) {
      console.warn("Failed to load billboards", err);
      setBillboards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillboards();
  }, []);

  const handleSaved = () => {
    setEditingBillboard(null);
    loadBillboards();
  };

  return (
    <section className="space-y-4">
      <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">
          Billboard Manager
        </p>
        <h2 className="mt-2 text-lg font-black tracking-[-0.03em] text-white">
          Dashboard Billboard Content
        </h2>
        <p className="mt-1 text-sm leading-6 text-white/45">
          Manage active billboard messages, media, views, and taps.
        </p>
      </div>

      <BillboardForm
        billboard={editingBillboard}
        onSaved={handleSaved}
        onCancel={() => setEditingBillboard(null)}
      />

      <BillboardAnalytics billboards={billboards} />

      <BillboardList
        billboards={billboards}
        loading={loading}
        onEdit={setEditingBillboard}
        onChanged={loadBillboards}
      />
    </section>
  );
}
