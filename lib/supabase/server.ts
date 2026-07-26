import { createClient } from '@supabase/supabase-js';

// Ensure this file is only ever executed on the server.
if (typeof window !== 'undefined') {
  throw new Error('This module can only be imported on the server.');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in the environment variables.'
  );
}

// Server-only Supabase client bypassing RLS using the service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Note: SUPABASE_DB_POOL_URL is available for raw PostgreSQL connections (e.g. pg, drizzle)
// if direct database access bypassing the REST API is required later.
export const dbPoolUrl = process.env.SUPABASE_DB_POOL_URL;
