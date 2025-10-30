import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { notifyCarOwner } from '@/utils/notifications'

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('user_id') || undefined

    const { count, error } = await supabase
      .from('favorites')
      .select('id', { count: 'exact', head: true })
      .eq('car_id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    let favorited = false
    if (user_id) {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('car_id', id)
        .eq('user_id', user_id)
        .maybeSingle()
      favorited = Boolean(data)
    }

    return NextResponse.json({ count: count ?? 0, favorited })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { user_id } = await req.json()
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    const { error } = await supabase.from('favorites').insert({ car_id: id, user_id })
    if (error) {
      if ((error as any).code === '23505') {
        return NextResponse.json({ error: 'Already favorited' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get car model for notification
    const { data: car } = await supabase.from('cars').select('model').eq('id', id).single()
    if (car) {
      await notifyCarOwner(id, user_id, 'favorite', `Someone favorited your ${car.model}`)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to favorite' }, { status: 500 })
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const { user_id } = await req.json()
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('car_id', id)
      .eq('user_id', user_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to unfavorite' }, { status: 500 })
  }
}
