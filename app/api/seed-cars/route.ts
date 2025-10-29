import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

type LegacyCar = {
  id: string
  model: string
  year?: number
  owner: string
  description: string
  imageUrl: string
  specs: string[]
  tags: string[]
}

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const headerKey = req.headers.get('x-seed-key') || ''
    const secret = process.env.SEED_SECRET || ''
    if (!secret || headerKey !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'cars.json')
    const raw = await fs.readFile(filePath, 'utf8')
    const cars: LegacyCar[] = JSON.parse(raw)

    const url = process.env.SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY!
    const supabase = createClient(url, key)

    let inserted = 0
    let skipped = 0

    for (const c of cars) {
      // Check if a similar entry already exists
      const { data: existing } = await supabase
        .from('cars')
        .select('id')
        .eq('model', c.model)
        .eq('owner', c.owner)
        .maybeSingle()

      if (existing) {
        skipped++
        continue
      }

      const { error } = await supabase.from('cars').insert({
        model: c.model,
        year: c.year ?? null,
        owner: c.owner,
        image_url: c.imageUrl,
        description: c.description,
        specs: c.specs ?? [],
        tags: c.tags ?? [],
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error('Insert error for', c.model, error.message)
        skipped++
      } else {
        inserted++
      }
    }

    return NextResponse.json({ inserted, skipped, total: cars.length })
  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: 'Failed to seed cars' }, { status: 500 })
  }
}

