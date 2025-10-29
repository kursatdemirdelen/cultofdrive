import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  process.env.SUPABASE_KEY

function createStubClient(message: string): SupabaseClient {
  const error = new Error(message)
  const asyncError = async () => ({ data: null, error })
  const subscription = { unsubscribe: () => void 0 }

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error }),
      signInWithOAuth: async () => {
        throw error
      },
      signInWithOtp: async () => ({ data: null, error }),
      signOut: async () => ({ error }),
      onAuthStateChange: () => ({ data: { subscription }, error }),
    },
    from: () => ({
      select: async () => ({ data: null, error }),
      insert: async () => ({ data: null, error }),
      upsert: async () => ({ data: null, error }),
      delete: async () => ({ data: null, error }),
      update: async () => ({ data: null, error }),
      eq: () => ({ select: async () => ({ data: null, error }) }),
    }),
    functions: { invoke: async () => ({ data: null, error }) },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as unknown as SupabaseClient
}

const supabaseClient: SupabaseClient =
  url && anon ? createClient(url, anon) : createStubClient('Supabase environment variables are not configured.')

if (!url || !anon) {
  console.warn(
    'Supabase browser client initialised in fallback mode. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live features.'
  )
}

export const supabaseBrowser = supabaseClient
