import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const RATE_LIMIT = 3
const WINDOW_MS = 60 * 1000

const ipStore = new Map<string, { count: number; time: number }>()

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/api/subscribe' && req.method === 'POST') {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    const now = Date.now()
    const record = ipStore.get(ip)

    if (!record) {
      ipStore.set(ip, { count: 1, time: now })
    } else {
      if (now - record.time < WINDOW_MS) {
        if (record.count >= RATE_LIMIT) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          )
        }
        record.count++
      } else {
        ipStore.set(ip, { count: 1, time: now })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/subscribe'],
}
