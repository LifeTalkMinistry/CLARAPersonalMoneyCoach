import { supabase } from "../../../../lib/supabaseClient";

export default function PlanAccessControl() {

  async function updatePlan(id, plan) {
    await supabase.from("profiles").update({ plan }).eq("id", id);
  }

  return (
    <div className="text-white/60">
      Manual plan control ready
    </div>
  );
}
