import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';
import type { Car } from '@/app/types/car';

export async function POST(request: Request) {
  try {
    console.log('Request geldi:', new Date().toISOString()); // Debug log
    const formData = await request.formData();
    console.log('FormData:', Object.fromEntries(formData)); // Tüm alanları logla

    const file = formData.get('image') as File | null;
    const model = formData.get('model') as string | null;
    const yearStr = formData.get('year') as string | null;
    const year = yearStr ? parseInt(yearStr) : undefined;
    const owner = formData.get('owner') as string | null || 'Anonim';
    const description = formData.get('description') as string | null;
    const specsStr = formData.get('specs') as string | null;
    const specs = specsStr ? JSON.parse(specsStr) as { key: string; value: string }[] : [];
    const tagsStr = formData.get('tags') as string | null;
    const tags = tagsStr ? JSON.parse(tagsStr) as string[] : [];
    const username = formData.get('username') as string | null;

    console.log('Veriler:', { model, year, owner, description, specs, tags, username }); // Kontrol

    if (!file) return NextResponse.json({ error: 'Fotoğraf zorunlu!' }, { status: 400 });
    if (!model) return NextResponse.json({ error: 'Model zorunlu!' }, { status: 400 });
    if (!description) return NextResponse.json({ error: 'Açıklama zorunlu!' }, { status: 400 });
    if (!username) return NextResponse.json({ error: 'Username zorunlu!' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${username}-${Date.now()}.jpg`;

    console.log('Dosya yükleniyor:', fileName); // Debug
    const { data: storageData, error: storageError } = await supabase.storage
      .from('garage')
      .upload(`public/${fileName}`, buffer, { contentType: 'image/jpeg' });

    if (storageError) {
      console.error('Storage hatası:', storageError);
      return NextResponse.json({ error: `Fotoğraf yüklenemedi: ${storageError.message}` }, { status: 500 });
    }

    console.log('DB ye yazılıyor:', { model, image_url: storageData.path }); // Debug
    const { error: dbError } = await supabase.from('cars').insert({
      model,
      year,
      owner,
      image_url: storageData.path,
      description,
      specs,
      tags,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('DB hatası:', dbError);
      return NextResponse.json({ error: `Veri kaydedilemedi: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Araç eklendi!', path: storageData.path }, { status: 200 });
  } catch (error) {
    console.error('Genel hata:', error); // Daha detaylı log
    return NextResponse.json({ error: 'Beklenmeyen hata' }, { status: 500 });
  }
}