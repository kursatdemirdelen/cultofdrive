export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { ensureAdminClient, assertAdminKey } from '@/utils/admin'

export async function GET(req: Request) {
  try {
    if (!assertAdminKey(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  let client
  try {
    client = ensureAdminClient()
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  const { data, error } = await client
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reports: data || [] })
}
