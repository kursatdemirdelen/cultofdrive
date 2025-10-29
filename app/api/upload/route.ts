import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';
import type { Car } from '@/app/types/car';

export async function POST(request: Request) {
  try {
    console.log('Request received:', new Date().toISOString());
    const formData = await request.formData();
    console.log('FormData:', Object.fromEntries(formData as any));

    const file = formData.get('image') as File | null;
    const model = formData.get('model') as string | null;
    const yearStr = formData.get('year') as string | null;
    const year = yearStr ? parseInt(yearStr) : undefined;
    const owner = (formData.get('owner') as string | null) || 'Anonymous';
    const description = formData.get('description') as string | null;
    const specsStr = formData.get('specs') as string | null;
    const specs = specsStr ? (JSON.parse(specsStr) as { key: string; value: string }[]) : [];
    const tagsStr = formData.get('tags') as string | null;
    const tags = tagsStr ? (JSON.parse(tagsStr) as string[]) : [];
    const username = formData.get('username') as string | null;
    const user_id = (formData.get('user_id') as string | null) || null;

    console.log('Parsed data:', { model, year, owner, description, specs, tags, username, user_id });

    if (!file) return NextResponse.json({ error: 'Photo is required.' }, { status: 400 });
    if (!model) return NextResponse.json({ error: 'Model is required.' }, { status: 400 });
    if (!description) return NextResponse.json({ error: 'Description is required.' }, { status: 400 });
    if (!username) return NextResponse.json({ error: 'Username is required.' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${username}-${Date.now()}.jpg`;

    console.log('Uploading file:', fileName);
    const { data: storageData, error: storageError } = await supabase.storage
      .from('garage')
      .upload(`public/${fileName}`, buffer, { contentType: 'image/jpeg' });

    if (storageError) {
      console.error('Storage error:', storageError);
      return NextResponse.json({ error: `Could not upload photo: ${storageError.message}` }, { status: 500 });
    }

    console.log('Inserting DB row:', { model, image_url: storageData.path });
    const { error: dbError } = await supabase.from('cars').insert({
      model,
      year,
      owner,
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
