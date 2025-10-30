export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { ensureAdminClient, assertAdminKey } from '@/utils/admin'

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    if (!assertAdminKey(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  const { id } = await ctx.params

  let client
  try {
    client = ensureAdminClient()
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  const { status } = await req.json()

  const { error } = await client
    .from('reports')
    .update({ status, resolved_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
