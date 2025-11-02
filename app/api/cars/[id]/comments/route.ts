import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { notifyCarOwner } from '@/utils/notifications'

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { searchParams } = new URL(req.url)
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') || 20)))

    const { data: comments, error } = await supabase
      .from('car_comments')
      .select(`
        id, 
        body, 
        user_id, 
        created_at,
        user_profiles(display_name, email, avatar_url, slug)
      `)
      .eq('car_id', id)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    
    // Transform data to match expected format
    const transformedComments = comments?.map((c: any) => ({
      id: c.id,
      body: c.body,
      user_id: c.user_id,
      user_email: Array.isArray(c.user_profiles) ? c.user_profiles[0]?.email : c.user_profiles?.email,
      display_name: Array.isArray(c.user_profiles) ? c.user_profiles[0]?.display_name : c.user_profiles?.display_name,
      avatar_url: Array.isArray(c.user_profiles) ? c.user_profiles[0]?.avatar_url : c.user_profiles?.avatar_url,
      slug: Array.isArray(c.user_profiles) ? c.user_profiles[0]?.slug : c.user_profiles?.slug,
      created_at: c.created_at
    })) || []
    
    return NextResponse.json({ comments: transformedComments })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { body, user_id, user_email } = await req.json()
    if (!body || typeof body !== 'string') {
      return NextResponse.json({ error: 'body is required' }, { status: 400 })
    }
    const { data: comment, error } = await supabase
      .from('car_comments')
      .insert({ car_id: id, user_id: user_id || null, body })
      .select(`
        id, 
        body, 
        user_id, 
        created_at,
        user_profiles(display_name, email, avatar_url, slug)
      `)
      .maybeSingle()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    
    // Transform data to match expected format
    const data = comment ? {
      id: comment.id,
      body: comment.body,
      user_id: comment.user_id,
      user_email: Array.isArray((comment as any).user_profiles) ? (comment as any).user_profiles[0]?.email : (comment as any).user_profiles?.email,
      display_name: Array.isArray((comment as any).user_profiles) ? (comment as any).user_profiles[0]?.display_name : (comment as any).user_profiles?.display_name,
      avatar_url: Array.isArray((comment as any).user_profiles) ? (comment as any).user_profiles[0]?.avatar_url : (comment as any).user_profiles?.avatar_url,
      slug: Array.isArray((comment as any).user_profiles) ? (comment as any).user_profiles[0]?.slug : (comment as any).user_profiles?.slug,
      created_at: comment.created_at
    } : null
    // Get car model for notification
    if (user_id) {
      const { data: car } = await supabase.from('cars').select('model').eq('id', id).single()
      if (car) {
        await notifyCarOwner(id, user_id, 'comment', `Someone commented on your ${car.model}`)
      }
    }

    return NextResponse.json({ comment: data }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
