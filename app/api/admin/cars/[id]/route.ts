export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { ensureAdminClient, assertAdminKey } from '@/utils/admin'

function normalizeTags(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((tag) => String(tag).trim()).filter(Boolean)
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }
  return []
}

function normalizeSpecs(input: unknown): any[] {
  if (Array.isArray(input)) {
    return input
      .map((spec) => {
        if (!spec) return null
        if (typeof spec === 'string') return spec.trim()
        if (typeof spec === 'object') return spec
        return null
      })
      .filter(Boolean)
  }
  if (typeof input === 'string') {
    return input
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }
  return []
}

function toBoolean(input: unknown): boolean {
  if (typeof input === 'string') {
    return input.toLowerCase() === 'true'
  }
  return Boolean(input)
}

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

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const updates: Record<string, any> = {}

  if (payload.model !== undefined) {
    const model = String(payload.model).trim()
    if (!model || model.length < 2) {
      return NextResponse.json({ error: 'Model is required (minimum 2 characters)' }, { status: 400 })
    }
    if (model.length > 100) {
      return NextResponse.json({ error: 'Model is too long (maximum 100 characters)' }, { status: 400 })
    }
    updates.model = model
  }

  if (payload.year !== undefined) {
    const numeric = typeof payload.year === 'number' ? payload.year : Number(payload.year)
    const year = Number.isFinite(numeric) ? numeric : null
    if (year && (year < 1990 || year > new Date().getFullYear() + 1)) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 })
    }
    updates.year = year
  }

  if (payload.description !== undefined) {
    const description = String(payload.description || '').trim()
    if (description.length > 2000) {
      return NextResponse.json({ error: 'Description is too long (maximum 2000 characters)' }, { status: 400 })
    }
    updates.description = description || null
  }

  if (payload.imageUrl !== undefined) {
    updates.image_url = payload.imageUrl ? String(payload.imageUrl).trim() : null
  }

  if (payload.specs !== undefined) updates.specs = normalizeSpecs(payload.specs)
  if (payload.tags !== undefined) updates.tags = normalizeTags(payload.tags)
  if (payload.isFeatured !== undefined) {
    updates.is_featured = toBoolean(payload.isFeatured)
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
  }

  const { data, error } = await client
    .from('cars')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ car: data })
}

export async function DELETE(
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

  const { error } = await client.from('cars').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
