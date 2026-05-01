import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    supabase.from("profiles").select("*").then(({ data }) => {
      setUsers(data || []);
    });
  }, []);

  return (
    <div className="space-y-2">
      {users.map(u => (
        <div key={u.id} className="p-3 border border-white/10 rounded-xl">
          <p>{u.email}</p>
          <p className="text-white/50">{u.plan}</p>
        </div>
      ))}
    </div>
  );
}
