import { createClient } from "@supabase/supabase-js";

// 🔥 ENV (works locally)
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔥 FALLBACK (for GitHub Pages)
const fallbackUrl = "https://xzbjeffacbdgsagrtzth.supabase.co";
const fallbackKey = "sb_publishable_s7RCarxHtrW4Mhohyh51-A_D4iEl-c7";

// Decide which to use
const supabaseUrl = envUrl || fallbackUrl;
const supabaseAnonKey = envKey || fallbackKey;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("Supabase not configured.");
}

export { supabase };
