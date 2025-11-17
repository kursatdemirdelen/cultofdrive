export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { buildImagePath, getPublicAssetUrl, storageConfig } from '@/utils/storage'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileExt = file.name?.split('.').pop() || file.type?.split('/').pop() || 'jpg'
    const storagePath = buildImagePath({
      category: 'admin',
      ownerId: 'admin',
      label: file.name,
      extension: fileExt,
    })

    const { data, error } = await supabase.storage
      .from(storageConfig.bucket)
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600'
      })

    if (error) throw error

    const publicUrl = getPublicAssetUrl(data.path)

    return NextResponse.json({ 
      path: data.path, 
      publicUrl 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
