import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*, cars(model, image_url, year)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ listings: data || [] })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert(body)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ listing: data[0] }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}