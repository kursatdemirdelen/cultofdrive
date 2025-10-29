import { NextResponse } from 'next/server'
import { getRawLocalCars, getRawLocalSocialPosts } from '@/utils/localFallback'

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || process.env.SEED_SECRET || ''

type Resource = 'cars' | 'social-posts'

export async function GET(req: Request) {
  if (!ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Admin API key not configured' }, { status: 500 })
  }

  const headerKey = req.headers.get('x-admin-key') || ''
  if (headerKey !== ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const resource = searchParams.get('resource') as Resource | null

  if (!resource) {
    return NextResponse.json({ error: 'resource is required' }, { status: 400 })
  }

  switch (resource) {
    case 'cars': {
      const cars = await getRawLocalCars()
      return NextResponse.json({ cars })
    }
    case 'social-posts': {
      const posts = await getRawLocalSocialPosts()
      return NextResponse.json({ posts })
    }
    default:
      return NextResponse.json({ error: 'Unsupported resource' }, { status: 400 })
  }
}

