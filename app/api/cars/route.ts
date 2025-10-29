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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const owner = searchParams.get('owner') || ''
    const tag = searchParams.get('tag') || ''
    const userId = searchParams.get('user_id') || ''
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.max(1, Math.min(50, Number(limitParam))) : 9

    let query = supabase
      .from('cars')
      .select('id, model, year, owner, image_url, description, specs, tags, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (owner) {
      query = query.ilike('owner', owner)
    }
    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (q) {
      // naive search across model and description
      query = query.or(`model.ilike.%${q}%,description.ilike.%${q}%`)
    }
    if (tag) {
      // tags is an array; use contains
      query = query.contains('tags', [tag])
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const cars = (data || []).map((row: DbCar) => {
      let imageUrl = ''
      if (row.image_url) {
        const { data: pub } = supabase.storage.from('garage').getPublicUrl(row.image_url)
        imageUrl = pub?.publicUrl || row.image_url
      }

      // Normalize specs to string[] for UI
      let specs: string[] = []
      if (Array.isArray(row.specs)) {
        specs = row.specs.map((s: any) => {
          if (typeof s === 'string') return s
          if (s && typeof s === 'object' && 'key' in s && 'value' in s) {
            return `${(s as any).key}: ${(s as any).value}`
          }
          try { return JSON.stringify(s) } catch { return String(s) }
        })
      }

      return {
        id: row.id,
        model: row.model,
        year: row.year ?? undefined,
        owner: row.owner || 'Anonymous',
        imageUrl,
        description: row.description || '',
        specs,
        tags: row.tags || [],
      }
    })

    return NextResponse.json({ cars })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}
