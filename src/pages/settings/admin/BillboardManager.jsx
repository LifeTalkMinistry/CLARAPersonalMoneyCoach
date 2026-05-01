import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function BillboardManager() {
  const [items, setItems] = useState([]);

  async function load() {
    const { data } = await supabase
      .from("dashboard_billboards")
      .select("*")
      .order("created_at", { ascending: false });

    setItems(data || []);
  }

  async function toggle(id, current) {
    await supabase
      .from("dashboard_billboards")
      .update({ is_active: !current })
      .eq("id", id);

    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-3">
      {items.map(i => (
        <div key={i.id} className="p-4 rounded-2xl border border-white/10 bg-white/[0.04]">
          <p className="text-white">{i.title}</p>
          <button onClick={() => toggle(i.id, i.is_active)}>
            {i.is_active ? "Deactivate" : "Activate"}
          </button>
        </div>
      ))}
    </div>
  );
}
