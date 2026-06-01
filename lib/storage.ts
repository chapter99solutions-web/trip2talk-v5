import { portfolioImageUrl, STORAGE_PUBLIC_BASE } from './constants';
import { getSupabaseSafe } from './supabase';

export type StorageImage = { name: string; url: string; folder: string };

function publicUrl(folder: string, name: string): string {
  const path = folder ? `${folder}/${name}` : name;
  return `${STORAGE_PUBLIC_BASE}/${encodeURI(path)}`;
}

async function listFolder(folder: string): Promise<StorageImage[]> {
  const sb = getSupabaseSafe();
  if (!sb) return [];
  const { data, error } = await sb.storage.from('portfolio').list(folder, {
    limit: 200,
    sortBy: { column: 'name', order: 'asc' },
  });
  if (error || !data) return [];
  const images: StorageImage[] = [];
  for (const item of data) {
    if (!item.name || item.name.startsWith('.')) continue;
    const isFolder = item.id == null;
    if (isFolder) {
      const nested = await listFolder(folder ? `${folder}/${item.name}` : item.name);
      images.push(...nested);
    } else if (/\.(jpe?g|png|webp|gif)$/i.test(item.name)) {
      images.push({ name: item.name, url: publicUrl(folder, item.name), folder });
    }
  }
  return images;
}

const HERO_FALLBACK = [
  'Cover/Mixed/01.jpg',
  'Cover/Mixed/02.jpg',
  'Cover/Mixed/03.jpg',
  'Cover/Mixed/04.jpg',
  'Cover/Mixed/05.png',
  'Cover/Mixed/06.jpg',
  'Cover/Mixed/07.jpg',
].map(portfolioImageUrl);

export async function listHeroSlides(): Promise<string[]> {
  for (const folder of ['Mixed Cover', 'Cover/Mixed', 'Cover']) {
    const mixed = await listFolder(folder);
    if (mixed.length) return mixed.map((i) => i.url);
  }
  return HERO_FALLBACK;
}

export async function listGalleryImages(tabId: string): Promise<StorageImage[]> {
  const { GALLERY_TABS } = await import('./constants');
  const tab = GALLERY_TABS.find((t) => t.id === tabId) ?? GALLERY_TABS[0];
  const all: StorageImage[] = [];
  const seen = new Set<string>();
  for (const folder of tab.folders) {
    const imgs = await listFolder(folder);
    for (const img of imgs) {
      if (!seen.has(img.url)) {
        seen.add(img.url);
        all.push(img);
      }
    }
  }
  return all;
}
