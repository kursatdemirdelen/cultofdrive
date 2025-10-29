import { NextResponse } from 'next/server'
import { isLocalFallbackEnabled, getRawLocalCars, getRawLocalSocialPosts } from '@/utils/localFallback'

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || process.env.SEED_SECRET || ''

export async function GET(req: Request) {
  if (!ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Admin API key not configured' }, { status: 500 })
  }

  const headerKey = req.headers.get('x-admin-key') || ''
  if (headerKey !== ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [cars, posts] = await Promise.all([getRawLocalCars(), getRawLocalSocialPosts()])

  return NextResponse.json({
    fallbackEnabled: isLocalFallbackEnabled(),
    local: {
      cars: cars.length,
      socialPosts: posts.length,
    },
    timestamp: new Date().toISOString(),
  })
}

