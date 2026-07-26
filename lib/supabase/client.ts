import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in the environment variables.'
  );
}

// Minimal client-side Supabase client using ONLY the anon key, 
// used solely for reading the admin's Auth session state — never for data queries.
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
