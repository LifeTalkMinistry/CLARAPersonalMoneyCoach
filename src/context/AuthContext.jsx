import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

const AUTH_INIT_TIMEOUT_MS = 1500;

const supabaseMissingError = {
  message:
    "Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.",
};

function getAuthName(authUser) {
  return (
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.display_name ||
    authUser?.user_metadata?.name ||
    ""
  );
}

function createFallbackProfile(authUser, reason = "fallback") {
  const fullName = getAuthName(authUser);

  return {
    id: authUser?.id || null,
    email: authUser?.email || "",
    full_name: fullName,
    display_name: fullName,
    avatar_url: authUser?.user_metadata?.avatar_url || null,
    role: "user",
    is_admin: false,
    __temporary: true,
    __reason: reason,
  };
}

function withTimeout(promise, ms, label) {
  let timeoutId;

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = window.setTimeout(() => {
      console.warn(`${label} timed out. Continuing with safe fallback.`);
      resolve({ timedOut: true });
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    window.clearTimeout(timeoutId);
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(Boolean(supabase));

  const fetchProfile = async (userId, options = {}) => {
    const { silent = false } = options;

    if (!supabase || !userId) return null;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        if (!silent) console.warn("Unable to fetch profile", error);
        return null;
      }

      return data || null;
    } catch (err) {
      if (!silent) console.warn("Profile fetch crashed", err);
      return null;
    }
  };

  const ensureProfile = async (authUser) => {
    if (!supabase || !authUser) return null;

    const fallbackProfile = createFallbackProfile(
      authUser,
      "profile_unavailable"
    );

    try {
      const existing = await fetchProfile(authUser.id);

      if (existing) {
        setProfile(existing);
        return existing;
      }

      const fullName = getAuthName(authUser);

      const baseProfile = {
        id: authUser.id,
        email: authUser.email || "",
        full_name: fullName || null,
        avatar_url: authUser?.user_metadata?.avatar_url || null,
        role: "user",
        is_admin: false,
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert(baseProfile)
        .select()
        .maybeSingle();

      if (error) {
        console.warn("Unable to create profile. Using temporary profile.", error);
        setProfile(fallbackProfile);
        return fallbackProfile;
      }

      const nextProfile = data || {
        ...fallbackProfile,
        ...baseProfile,
        display_name: fullName,
        __temporary: false,
      };

      setProfile(nextProfile);
      return nextProfile;
    } catch (err) {
      console.warn("Profile setup failed. Using temporary profile.", err);
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  const startProfileLoad = (authUser, reason = "profile_loading") => {
    if (!authUser) return;

    setProfile(createFallbackProfile(authUser, reason));

    ensureProfile(authUser).catch((err) => {
      console.warn("Background profile setup failed", err);
      setProfile(createFallbackProfile(authUser, "profile_failed"));
    });
  };

  const refreshProfile = async () => {
    if (!user?.id) return null;

    try {
      const freshProfile = await fetchProfile(user.id);

      if (freshProfile) {
        setProfile(freshProfile);
        return freshProfile;
      }

      const fallbackProfile = createFallbackProfile(
        user,
        "refresh_profile_failed"
      );
      setProfile((current) => current || fallbackProfile);
      return fallbackProfile;
    } catch (err) {
      console.warn("Unable to refresh profile", err);

      const fallbackProfile = createFallbackProfile(
        user,
        "refresh_profile_crashed"
      );
      setProfile((current) => current || fallbackProfile);
      return fallbackProfile;
    }
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
      startProfileLoad(data.user, "signup_profile_loading");
    }

    return { data, error };
  };

  const signIn = async (email, password) => {
    if (!supabase) return { data: null, error: supabaseMissingError };

    const result = await supabase.auth.signInWithPassword({ email, password });

    if (!result.error && result.data?.user) {
      startProfileLoad(result.data.user, "signin_profile_loading");
    }

    return result;
  };

  const signOut = async () => {
    if (!supabase) return { error: supabaseMissingError };

    const result = await supabase.auth.signOut();

    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);

    return result;
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
        const result = await withTimeout(
          supabase.auth.getSession(),
          AUTH_INIT_TIMEOUT_MS,
          "Auth initialization"
        );

        if (!alive) return;

        if (result?.timedOut) {
          setSession(null);
          setUser(null);
          setProfile(null);
          return;
        }

        const { data, error } = result;

        if (error) {
          console.warn("Unable to initialize auth", error);
          setSession(null);
          setUser(null);
          setProfile(null);
          return;
        }

        const currentSession = data?.session ?? null;
        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);

        if (currentUser) {
          startProfileLoad(currentUser, "profile_loading");
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.warn("Unable to initialize auth", err);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        const nextUser = nextSession?.user ?? null;

        setSession(nextSession);
        setUser(nextUser);

        if (!nextUser) {
          setProfile(null);
          setLoading(false);
          return;
        }

        startProfileLoad(nextUser, "auth_state_loading");
        setLoading(false);
      }
    );

    return () => {
      alive = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      authReady,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      isAdmin: profile?.role === "admin" || profile?.is_admin === true,
    }),
    [user, session, profile, loading, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
