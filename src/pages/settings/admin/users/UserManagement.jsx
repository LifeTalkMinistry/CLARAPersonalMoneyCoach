import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function UserManagement({ profile }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});

  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setUsers(data);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [isAdmin]);

  const handlePromote = async (user) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        is_admin: true,
        role: "admin",
      })
      .eq("id", user.id);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [user.id]: error.message,
      }));
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, is_admin: true, role: "admin" }
          : u
      )
    );
  };

  const handleRemoveAdmin = async (user) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        is_admin: false,
        role: "user",
      })
      .eq("id", user.id);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [user.id]: error.message,
      }));
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, is_admin: false, role: "user" }
          : u
      )
    );
  };

  if (!isAdmin) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-6 text-center text-white/60">
        Access denied
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();
    return (
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term) ||
      user.plan?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* SEARCH */}
      <div className="rounded-[20px] border border-white/10 bg-white/[0.045] p-3">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-white/50">Loading users...</p>
      )}

      {/* USERS */}
      {!loading &&
        filteredUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-[20px] border border-white/10 bg-white/[0.045] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              {/* LEFT */}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.email}
                </p>

                <p className="text-xs text-white/50">
                  Plan: {user.plan || "—"}
                </p>

                <p className="text-xs text-white/40">
                  Role: {user.role || "user"}
                </p>

                {user.is_admin && (
                  <span className="mt-1 inline-block text-[10px] uppercase tracking-wider text-white/70">
                    Admin
                  </span>
                )}
              </div>

              {/* RIGHT */}
              <div>
                {!user.is_admin ? (
                  <button
                    onClick={() => handlePromote(user)}
                    className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs text-white/80 transition hover:bg-white/[0.12]"
                  >
                    Make Admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleRemoveAdmin(user)}
                    className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs text-white/80 transition hover:bg-white/[0.12]"
                  >
                    Remove Admin
                  </button>
                )}
              </div>
            </div>

            {/* ERROR */}
            {errors[user.id] && (
              <p className="mt-2 text-xs text-red-400">
                {errors[user.id]}
              </p>
            )}
          </div>
        ))}
    </div>
  );
}
