import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Configure the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    // console.log(body);
    const name = body.get('name');
    const description = body.get('description');
    const link = body.get('link');
    const university = body.get('university');
    const icon = body.get('icon');

    if (!name || !description || !link || !university || !icon) {
        return NextResponse.json(
        { error: 'Name, description, link, university, and icon are required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const fileExt = icon.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `public/${fileName}`

    // console.log(fileExt, fileName, filePath)
    // check if app exists
    const { data: existingApp } = await supabase
      .from('apps')
      .select('name')
      .eq('name', name)
      .maybeSingle();

    if (existingApp) {
      return NextResponse.json(
        { error: 'App with this name already exists' },
        { status: 400 }
      );
    }

    const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('icons')
    .upload(filePath, icon, {cacheControl:'3600', upsert:false});

    if (uploadError) {
      console.log(uploadError)
      return NextResponse.json(
        { error: 'Cannot upload image to database' },
        { status: 400 }
      );
    }

    const iconUrl = supabase.storage.from('icons').getPublicUrl(filePath).data.publicUrl;

    const { error: dbError } = await supabase
    .from('apps')
    .insert([{
      name: name,
      description: description,
      icon_url: iconUrl,
      university: university,
      link: link
    }])

    if (dbError) {
      console.log(dbError)
      await supabase.storage.from('icons').remove([filePath]);
      return NextResponse.json(
        { error: 'Database error.' },
        { status: 400 }
      );
    }

    
    
    // // Return success response
    return NextResponse.json({
      name: name,
      description: description,
      icon_url: iconUrl,
      university: university,
      link: link
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during upload' },
      { status: 500 }
    );
  }
}
