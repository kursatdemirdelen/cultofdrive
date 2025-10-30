import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || ''
const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || ''

export function ensureAdminClient(): SupabaseClient {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Supabase admin credentials missing')
  }

  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
}

export function assertAdminKey(req: Request): boolean {
  if (!ADMIN_API_KEY) {
    throw new Error('ADMIN_API_KEY is not configured')
  }

  const headerKey = req.headers.get('x-admin-key') || ''
  return headerKey === ADMIN_API_KEY
}
