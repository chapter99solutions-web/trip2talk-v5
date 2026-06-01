import { portfolioImageUrl, STORAGE_PUBLIC_BASE } from './constants';
import { getStorageSupabase } from './supabase';

export type StorageImage = { name: string; url: string; folder: string };

function publicUrl(folder: string, name: string): string {
  const path = folder ? `${folder}/${name}` : name;
  return `${STORAGE_PUBLIC_BASE}/${encodeURI(path)}`;
}

/** Homepage hero — user-specified fallbacks when storage.list fails. */
const HERO_FALLBACK_URLS = [
  portfolioImageUrl('milkyway/1.jpg'),
  portfolioImageUrl('Uluru/1.jpg'),
  portfolioImageUrl('New Zealand/Spring/T2T-10.JPG'),
];

async function listMixedCoverFlat(): Promise<string[]> {
  const sb = getStorageSupabase();
  if (!sb) return [];
  const { data, error } = await sb.storage.from('portfolio').list('Mixed Cover', {
    limit: 50,
    sortBy: { column: 'name', order: 'asc' },
  });
  if (error || !data?.length) return [];
  return data
    .filter((item) => item.id != null && item.name && /\.(jpe?g|png|webp|gif)$/i.test(item.name))
    .map((item) => publicUrl('Mixed Cover', item.name));
}

async function listFolder(folder: string): Promise<StorageImage[]> {
  const sb = getStorageSupabase();
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

export async function listHeroSlides(): Promise<string[]> {
  const mixed = await listMixedCoverFlat();
  if (mixed.length) return mixed;
  return HERO_FALLBACK_URLS;
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
