import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const {   username, content, imageUrl, like_count, url } = await req.json()

    // Validation
    if (  !username || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('social_posts')
      .insert([{ 
        username,
        content,
        image_url: imageUrl,
        like_count: like_count || 0,
        url: url || '',
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
