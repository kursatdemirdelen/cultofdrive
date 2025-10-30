import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

type DbCar = {
  id: string
  model: string
  year: number | null
  owner: string | null
  image_url: string | null
  description: string | null
  specs: any[] | null
  tags: string[] | null
  is_featured: boolean | null
  created_at: string
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params
    const { data, error } = await supabase
      .from('cars')
      .select('id, model, year, owner, image_url, description, specs, tags, is_featured, created_at')
      .eq('id', id)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const row = data as DbCar
    const { data: pub } = row.image_url
      ? supabase.storage.from('garage').getPublicUrl(row.image_url)
      : { data: { publicUrl: '' } as any }

    const specs: string[] = Array.isArray(row.specs)
      ? row.specs.map((s: any) => {
          if (typeof s === 'string') return s
          if (s && typeof s === 'object' && 'key' in s && 'value' in s) return `${s.key}: ${s.value}`
          try { return JSON.stringify(s) } catch { return String(s) }
        })
      : []

    const car = {
      id: row.id,
      model: row.model,
      year: row.year ?? undefined,
      owner: row.owner || 'Anonymous',
      imageUrl: pub?.publicUrl || row.image_url || '',
      description: row.description || '',
      specs,
      tags: row.tags || [],
      isFeatured: Boolean(row.is_featured),
      created_at: row.created_at,
    }

    return NextResponse.json({ car })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params
    const body = await req.json()

    const updates: Record<string, any> = {}
    if (body.model !== undefined) updates.model = String(body.model)
    if (body.year !== undefined) updates.year = body.year ? Number(body.year) : null
    if (body.owner !== undefined) updates.owner = body.owner || null
    if (body.description !== undefined) updates.description = body.description || null
    if (body.specs !== undefined) updates.specs = Array.isArray(body.specs) ? body.specs : []
    if (body.tags !== undefined) updates.tags = Array.isArray(body.tags) ? body.tags : []

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('cars')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Car not found' }, { status: 404 })

    return NextResponse.json({ car: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update' }, { status: 500 })
  }
}
