import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function FeatureFlags() {
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    supabase.from("feature_flags").select("*").then(({ data }) => {
      setFlags(data || []);
    });
  }, []);

  return (
    <div className="space-y-2">
      {flags.map(f => (
        <div key={f.id} className="p-3 border border-white/10 rounded-xl">
          {f.feature_name}
        </div>
      ))}
    </div>
  );
}
