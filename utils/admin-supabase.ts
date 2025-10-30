import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedAdminClient: SupabaseClient | null = null;

export function getAdminSupabaseClient(): SupabaseClient {
  if (cachedAdminClient) return cachedAdminClient;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  cachedAdminClient = createClient(supabaseUrl, supabaseKey);
  return cachedAdminClient;
}
