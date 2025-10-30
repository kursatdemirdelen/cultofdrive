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
  user_id: string | null
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const owner = searchParams.get('owner') || ''
    const tag = searchParams.get('tag') || ''
    const userId = searchParams.get('user_id') || ''
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    const featuredParam = searchParams.get('featured')
    
    const limit = limitParam ? Math.max(1, Math.min(100, Number(limitParam))) : 20
    const offset = offsetParam ? Math.max(0, Number(offsetParam)) : 0

    let query = supabase
      .from('cars')
      .select('id, model, year, owner, image_url, description, specs, tags, is_featured, created_at, user_id', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (owner) {
      query = query.ilike('owner', `%${owner}%`)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (q) {
      query = query.or(`model.ilike.%${q}%,description.ilike.%${q}%,owner.ilike.%${q}%`)
    }
    
    if (tag) {
      query = query.contains('tags', [tag])
    }
    
    if (featuredParam !== null && featuredParam !== undefined) {
      const isFeatured = featuredParam === 'true'
      query = query.eq('is_featured', isFeatured)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const cars = (data || []).map((row: DbCar) => {
      let imageUrl = ''
      if (row.image_url) {
        const { data: pub } = supabase.storage.from('garage').getPublicUrl(row.image_url)
        imageUrl = pub?.publicUrl || row.image_url
      }

      let specs: string[] = []
      if (Array.isArray(row.specs)) {
        specs = row.specs.map((s: any) => {
          if (typeof s === 'string') return s
          if (s && typeof s === 'object' && 'key' in s && 'value' in s) {
            return `${(s as any).key}: ${(s as any).value}`
          }
          try {
            return JSON.stringify(s)
          } catch {
            return String(s)
          }
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
        isFeatured: Boolean(row.is_featured),
        created_at: row.created_at,
      }
    })

    return NextResponse.json({ 
      cars,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}
