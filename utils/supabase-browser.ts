import { createClient } from '@supabase/supabase-js'

// Prefer NEXT_PUBLIC_* for browser; fall back to server vars if not set
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

export const supabaseBrowser = createClient(url as string, anon as string)
