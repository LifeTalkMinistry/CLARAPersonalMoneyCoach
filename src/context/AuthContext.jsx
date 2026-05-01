import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

const supabaseMissingError = {
  message:
    "Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(Boolean(supabase));

  const fetchProfile = async (userId) => {
    if (!supabase || !userId) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Unable to fetch profile", error);
      return null;
    }

    setProfile(data);
    return data;
  };

  const ensureProfile = async (authUser) => {
    if (!supabase || !authUser) return null;

    const existing = await fetchProfile(authUser.id);

    if (existing) return existing;

    const baseProfile = {
      id: authUser.id,
      email: authUser.email,
      role: "user",
      is_admin: false,
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert(baseProfile)
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Unable to create profile", error);
      return null;
    }

    setProfile(data || baseProfile);
    return data || baseProfile;
  };

  const signUp = async (email, password, displayName = "") => {
    if (!supabase) return { data: null, error: supabaseMissingError };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || null,
          full_name: displayName || null,
        },
      },
    });

    if (!error && data?.user) {
      await ensureProfile(data.user);
    }

    return { data, error };
  };

  const signIn = async (email, password) => {
    if (!supabase) return { data: null, error: supabaseMissingError };

    const result = await supabase.auth.signInWithPassword({ email, password });

    if (!result.error && result.data?.user) {
      await ensureProfile(result.data.user);
      await fetchProfile(result.data.user.id);
    }

    return result;
  };

  const signOut = async () => {
    if (!supabase) return { error: supabaseMissingError };

    const result = await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    return result;
  };

  const refreshProfile = async () => {
    if (!user?.id) return null;
    return fetchProfile(user.id);
  };

  useEffect(() => {
    if (!supabase) {
      setAuthReady(false);
      setLoading(false);
      return undefined;
    }

    let alive = true;

    async function initAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;
        if (!alive) return;

        const currentSession = data?.session ?? null;
        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);

        if (currentUser) {
          await ensureProfile(currentUser);
          await fetchProfile(currentUser.id);
        }
      } catch (err) {
        console.warn("Unable to initialize auth", err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        const nextUser = nextSession?.user ?? null;

        setSession(nextSession);
        setUser(nextUser);

        if (nextUser) {
          await ensureProfile(nextUser);
          await fetchProfile(nextUser.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      alive = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        authReady,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
