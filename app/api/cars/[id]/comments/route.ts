import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { searchParams } = new URL(req.url)
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') || 20)))

    const { data, error } = await supabase
      .from('car_comments')
      .select('id, body, user_id, created_at')
      .eq('car_id', id)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ comments: data || [] })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { body, user_id } = await req.json()
    if (!body || typeof body !== 'string') {
      return NextResponse.json({ error: 'body is required' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('car_comments')
      .insert({ car_id: id, user_id: user_id || null, body })
      .select('id, body, user_id, created_at')
      .maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ comment: data }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
