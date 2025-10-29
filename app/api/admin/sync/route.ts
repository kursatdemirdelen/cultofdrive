import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getRawLocalCars, getRawLocalSocialPosts } from '@/utils/localFallback'

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || process.env.SEED_SECRET || ''
const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || ''

type SyncRequest = {
  resource: 'cars' | 'social-posts'
  direction?: 'local-to-remote'
}

function unauthorized(message: string, status = 401) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: Request) {
  if (!ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Admin API key not configured' }, { status: 500 })
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase admin credentials missing' }, { status: 500 })
  }

  const headerKey = req.headers.get('x-admin-key') || ''
  if (headerKey !== ADMIN_API_KEY) {
    return unauthorized('Unauthorized')
  }

  let payload: SyncRequest
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { resource, direction = 'local-to-remote' } = payload
  if (!resource) {
    return NextResponse.json({ error: 'resource is required' }, { status: 400 })
  }

  if (direction !== 'local-to-remote') {
    return NextResponse.json({ error: 'Only local-to-remote sync is supported currently' }, { status: 400 })
  }

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  try {
    switch (resource) {
      case 'cars':
        return await syncCars(adminClient)
      case 'social-posts':
        return await syncSocialPosts(adminClient)
      default:
        return NextResponse.json({ error: 'Unsupported resource' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Admin sync error:', error)
    return NextResponse.json({ error: 'Failed to sync data' }, { status: 500 })
  }
}

async function syncCars(client: SupabaseClient) {
  const cars = await getRawLocalCars()
  if (!cars.length) {
    return NextResponse.json({ message: 'No local cars to sync', synced: 0 })
  }

  const rows = cars.map((car) => ({
    id: car.id,
    model: car.model,
    year: car.year ?? null,
    owner: car.owner ?? null,
    image_url: car.imageUrl ?? null,
    description: car.description ?? null,
    specs: Array.isArray(car.specs) ? car.specs : [],
    tags: Array.isArray(car.tags) ? car.tags : [],
    created_at: car.created_at || new Date().toISOString(),
  }))

  const { error } = await client.from('cars').upsert(rows, { onConflict: 'id' })
  if (error) {
    throw new Error(error.message)
  }

  return NextResponse.json({ message: 'Cars synced', synced: rows.length })
}

async function syncSocialPosts(client: SupabaseClient) {
  const posts = await getRawLocalSocialPosts()
  if (!posts.length) {
    return NextResponse.json({ message: 'No local social posts to sync', synced: 0 })
  }

  const normalized = posts.map((post) => ({
    id: post.id,
    username: post.username || '@cultofdrive',
    content: post.content || '',
    image_url: post.imageUrl || post.image_url || null,
    like_count: post.like_count ?? 0,
    url: post.url || '',
    created_at: post.timestamp || new Date().toISOString(),
  }))

  const withId = normalized.filter((post) => !!post.id)
  const withoutId = normalized.filter((post) => !post.id).map(({ id, ...rest }) => rest)

  if (withId.length) {
    const { error } = await client.from('social_posts').upsert(withId, { onConflict: 'id' })
    if (error) {
      throw new Error(error.message)
    }
  }

  if (withoutId.length) {
    const { error } = await client.from('social_posts').insert(withoutId)
    if (error) {
      throw new Error(error.message)
    }
  }

  return NextResponse.json({
    message: 'Social posts synced',
    synced: normalized.length,
    upserted: withId.length,
    inserted: withoutId.length,
  })
}

