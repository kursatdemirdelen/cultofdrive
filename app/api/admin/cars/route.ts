export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { ensureAdminClient, assertAdminKey } from '@/utils/admin'

function normalizeTags(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((tag) => String(tag).trim()).filter(Boolean)
  }
  if (typeof input === 'string') {
    return input.split(',').map((tag) => tag.trim()).filter(Boolean)
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
    return input.split('\n').map((line) => line.trim()).filter(Boolean)
  }
  return []
}

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

  const { searchParams } = new URL(req.url)
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Math.max(1, Math.min(500, Number(limitParam))) : 200

  const { data, error } = await client
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ cars: data || [] })
}

export async function POST(req: Request) {
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

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const model = String(payload.model || '').trim()
  if (!model || model.length < 2) {
    return NextResponse.json({ error: 'Model is required (minimum 2 characters)' }, { status: 400 })
  }

  if (model.length > 100) {
    return NextResponse.json({ error: 'Model is too long (maximum 100 characters)' }, { status: 400 })
  }

  const description = String(payload.description || '').trim()
  if (description.length > 2000) {
    return NextResponse.json({ error: 'Description is too long (maximum 2000 characters)' }, { status: 400 })
  }

  const year = payload.year ? Number(payload.year) : null
  if (year && (year < 1990 || year > new Date().getFullYear() + 1)) {
    return NextResponse.json({ error: 'Invalid year' }, { status: 400 })
  }

  const insertData: Record<string, any> = {
    model,
    year,
    owner: String(payload.owner || '').trim() || null,
    description: description || null,
    image_url: String(payload.imageUrl || '').trim() || null,
    specs: normalizeSpecs(payload.specs),
    tags: normalizeTags(payload.tags),
    is_featured: Boolean(payload.isFeatured),
  }

  const { data, error } = await client
    .from('cars')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ car: data })
}
