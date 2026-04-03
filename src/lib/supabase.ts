import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.Vite_Supabase_URL;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.Vite_Supabase_Anon_key;

export const supabase = createClient(supabaseUrl, supabaseKey);
