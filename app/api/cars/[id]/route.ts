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
      .select('id, model, year, owner, image_url, description, specs, tags, created_at')
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
      created_at: row.created_at,
    }

    return NextResponse.json({ car })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 })
  }
}
