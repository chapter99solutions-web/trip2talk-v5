import { STORAGE_SUPABASE_PROJECT, SUPABASE_PROJECT } from './constants';

const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT}.supabase.co`;
const DEFAULT_STORAGE_URL = `https://${STORAGE_SUPABASE_PROJECT}.supabase.co`;

function isUsableKey(key: string): boolean {
  if (!key) return false;
  if (key === 'placeholder_build_key') return false;
  if (key.startsWith('your_')) return false;
  return true;
}

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
}

export function getStorageSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL?.trim() || DEFAULT_STORAGE_URL;
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
