'use client';

import { supabase } from '@/lib/supabase';

// Uploads to the public "assets" bucket. Returns the public URL.
export async function uploadAsset(folder: string, file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('assets').upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from('assets').getPublicUrl(path).data.publicUrl;
}
