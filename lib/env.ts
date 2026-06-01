/** Database project (trips, bookings, expenses). */
export const SUPABASE_DB_PROJECT = 'pcqxewzzypwxfldxkcxp';

/** Portfolio images / gallery (original project). */
export const STORAGE_PROJECT = 'niuibpznjvytprbrzvnn';

const DEFAULT_SUPABASE_URL = `https://${SUPABASE_DB_PROJECT}.supabase.co`;
const DEFAULT_STORAGE_PUBLIC_BASE = `https://${STORAGE_PROJECT}.supabase.co/storage/v1/object/public/portfolio`;

function isUsableKey(key: string): boolean {
  if (!key) return false;
  if (key === 'placeholder_build_key') return false;
  if (key.startsWith('your_')) return false;
  return true;
}

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
}

/** Public portfolio CDN base (no trailing slash). */
export function getStoragePublicBase(): string {
  const url = process.env.NEXT_PUBLIC_STORAGE_URL?.trim();
  return (url || DEFAULT_STORAGE_PUBLIC_BASE).replace(/\/+$/, '');
}

/** Supabase API host for storage.list (always the original portfolio project). */
export function getStorageSupabaseUrl(): string {
  return `https://${STORAGE_PROJECT}.supabase.co`;
}

export function getSupabaseAnonKey(): string | null {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';
  return isUsableKey(key) ? key : null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseAnonKey() != null;
}

export function getGasUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_GAS_URL?.trim();
  if (!url || url.startsWith('your_')) return null;
  return url;
}
