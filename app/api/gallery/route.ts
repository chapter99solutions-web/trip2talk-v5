import { NextResponse } from 'next/server';
import { listGalleryImages } from '@/lib/storage';

export async function GET(request: Request) {
  const tab = new URL(request.url).searchParams.get('tab') || 'all';
  const images = await listGalleryImages(tab);
  return NextResponse.json({ images });
}
