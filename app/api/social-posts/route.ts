import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { isLocalFallbackEnabled, getLocalSocialPosts } from '@/utils/localFallback'

const MAX_POSTS = 6

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .select('id, username, content, image_url, like_count, url, created_at')
      .order('created_at', { ascending: false })
      .limit(MAX_POSTS)

    if (!error && data && data.length > 0) {
      const posts = data.map((row: any) => ({
        id: row.id,
        username: row.username,
        content: row.content,
        imageUrl: row.image_url || '',
        like_count: row.like_count ?? 0,
        url: row.url || '',
        timestamp: row.created_at,
        profilePic: '/images/profile.png',
      }))
      return NextResponse.json({ posts })
    }

    if (isLocalFallbackEnabled()) {
      try {
        const posts = await getLocalSocialPosts(MAX_POSTS)
        if (posts.length > 0) {
          return NextResponse.json({ posts })
        }
      } catch {}
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts: [] })
  } catch (error) {
    if (isLocalFallbackEnabled()) {
      try {
        const posts = await getLocalSocialPosts(MAX_POSTS)
        if (posts.length > 0) {
          return NextResponse.json({ posts })
        }
      } catch {}
    }

    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { username, content, imageUrl, like_count, url } = await req.json()

    if (!username || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('social_posts')
      .insert([
        {
          username,
          content,
          image_url: imageUrl,
          like_count: like_count || 0,
          url: url || '',
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

