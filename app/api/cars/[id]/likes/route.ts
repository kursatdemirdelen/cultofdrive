import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('user_id') || undefined

    const { count, error } = await supabase
      .from('car_likes')
      .select('id', { count: 'exact', head: true })
      .eq('car_id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    let liked = false
    if (user_id) {
      const { data } = await supabase
        .from('car_likes')
        .select('id')
        .eq('car_id', id)
        .eq('user_id', user_id)
        .maybeSingle()
      liked = Boolean(data)
    }

    return NextResponse.json({ count: count ?? 0, liked })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 })
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { user_id } = await req.json()
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    const { error } = await supabase.from('car_likes').insert({ car_id: id, user_id })
    if (error) {
      // unique violation
      if ((error as any).code === '23505') {
        return NextResponse.json({ error: 'Already liked' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to like' }, { status: 500 })
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { user_id } = await req.json()
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    const { error } = await supabase
      .from('car_likes')
      .delete()
      .eq('car_id', id)
      .eq('user_id', user_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to unlike' }, { status: 500 })
  }
}
