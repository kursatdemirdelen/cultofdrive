export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = `${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from('garage')
      .upload(`admin/${filename}`, buffer, {
        contentType: file.type,
        cacheControl: '3600'
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('garage')
      .getPublicUrl(data.path)

    return NextResponse.json({ 
      path: data.path, 
      publicUrl 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}