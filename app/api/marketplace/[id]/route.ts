import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*, cars(model, image_url, year)')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ listing: data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    
    const { data, error } = await supabase
      .from('marketplace_listings')
      .update(body)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ listing: data[0] })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { error } = await supabase
      .from('marketplace_listings')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Listing deleted' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }
}