import { Provider, createClient, Session, PostgrestError } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error("Please set the public key");
}
const supabaseClient = createClient(
  supabaseUrl ?? "https://dlaneecirxiecwhtelqh.supabase.co",
  supabaseAnonKey
);

export type { Session, Provider, PostgrestError };
export { supabaseClient };
