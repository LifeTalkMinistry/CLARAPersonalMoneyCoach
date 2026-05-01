import { useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function BillboardForm({ billboard, onSaved, onCancel }) {
  const [title, setTitle] = useState(billboard?.title || "");

  const handleSubmit = async () => {
    const payload = { title };

    if (billboard?.id) {
      await supabase
        .from("dashboard_billboards")
        .update(payload)
        .eq("id", billboard.id);
    } else {
      await supabase
        .from("dashboard_billboards")
        .insert(payload);
    }

    onSaved?.();
  };

  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04]">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Billboard title"
        className="w-full bg-transparent text-white outline-none"
      />

      <div className="flex gap-2 mt-3">
        <button onClick={handleSubmit}>Save</button>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
