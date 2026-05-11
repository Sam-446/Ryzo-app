import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables. Check your .env file.");
}

// Force clear any old broken session keys from previous builds
const OLD_KEYS = ["sb-auth-token", "supabase.auth.token"];
OLD_KEYS.forEach((key) => {
  try { localStorage.removeItem(key); } catch {}
});

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: "ryzo-auth",
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
