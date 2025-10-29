import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

type SeedPost = {
  username: string
  content: string
  imageUrl?: string
  like_count?: number
  url?: string
  created_at?: string
}

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const headerKey = req.headers.get('x-seed-key') || ''
    const secret = process.env.SEED_SECRET || ''
    if (!secret || headerKey !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'social-posts.json')
    const raw = await fs.readFile(filePath, 'utf8')
    const posts: SeedPost[] = JSON.parse(raw)

    const url = process.env.SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY!
    const supabase = createClient(url, key)

    let inserted = 0
    let skipped = 0

    for (const p of posts) {
      // Basic duplicate check by username + content or url
      if (p.url) {
        const { data: existsByUrl } = await supabase
          .from('social_posts')
          .select('id')
          .eq('url', p.url)
          .maybeSingle()
        if (existsByUrl) { skipped++; continue }
      } else {
        const { data: existsByContent } = await supabase
          .from('social_posts')
          .select('id')
          .eq('username', p.username)
          .eq('content', p.content)
          .maybeSingle()
        if (existsByContent) { skipped++; continue }
      }

      const { error } = await supabase
        .from('social_posts')
        .insert({
          username: p.username,
          content: p.content,
          image_url: p.imageUrl || null,
          like_count: p.like_count ?? 0,
          url: p.url || '',
          created_at: p.created_at || new Date().toISOString(),
        })

      if (error) {
        console.error('Insert error (social post):', error.message)
        skipped++
      } else {
        inserted++
      }
    }

    return NextResponse.json({ inserted, skipped, total: posts.length })
  } catch (err) {
    console.error('Seed social posts error:', err)
    return NextResponse.json({ error: 'Failed to seed social posts' }, { status: 500 })
  }
}

