import { NextResponse } from 'next/server';
import type { Car } from '@/app/types';
import { buildImagePath, storageConfig } from '@/utils/storage';
import { getAdminSupabaseClient } from '@/utils/admin-supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const supabase = getAdminSupabaseClient();
    console.log('Request received:', new Date().toISOString());
    const formData = await request.formData();
    console.log('FormData:', Object.fromEntries(formData as any));

    const file = formData.get('image') as File | null;
    const model = formData.get('model') as string | null;
    const yearStr = formData.get('year') as string | null;
    const year = yearStr ? parseInt(yearStr) : undefined;
    const description = formData.get('description') as string | null;
    const specsStr = formData.get('specs') as string | null;
    const specs = specsStr ? (JSON.parse(specsStr) as { key: string; value: string }[]) : [];
    const tagsStr = formData.get('tags') as string | null;
    const tags = tagsStr ? (JSON.parse(tagsStr) as string[]) : [];
    const user_id = (formData.get('user_id') as string | null) || null;

    console.log('Parsed data:', { model, year, description, specs, tags, user_id });

    if (!file) return NextResponse.json({ error: 'Photo is required.' }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image too large. Maximum size is 5MB.' }, { status: 400 });
    }
    if (!model) return NextResponse.json({ error: 'Model is required.' }, { status: 400 });
    if (!description) return NextResponse.json({ error: 'Description is required.' }, { status: 400 });
    if (!user_id) return NextResponse.json({ error: 'User authentication required.' }, { status: 401 });

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', user_id)
      .single();

    const displayName = profile?.display_name || 'user';
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name?.split('.').pop() || file.type?.split('/').pop() || 'jpg';
    const storagePath = buildImagePath({
      category: 'cars',
      ownerId: user_id,
      label: model || displayName,
      extension: fileExt,
    });

    console.log('Uploading file:', storagePath);
    const { data: storageData, error: storageError } = await supabase.storage
      .from(storageConfig.bucket)
      .upload(storagePath, buffer, { contentType: file.type || 'application/octet-stream' });

    if (storageError) {
      console.error('Storage error:', storageError);
      return NextResponse.json({ error: `Could not upload photo: ${storageError.message}` }, { status: 500 });
    }

    console.log('Inserting DB row:', { model, image_url: storageData.path });
    const { error: dbError } = await supabase.from('cars').insert({
      model,
      year,
      image_url: storageData.path,
      description,
      specs,
      tags,
      user_id,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('DB error:', dbError);
      return NextResponse.json({ error: `Data could not be saved: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Car added!', path: storageData.path }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
