import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getStorageSupabaseUrl, getSupabaseUrl, isSupabaseConfigured } from './env';

export type TripRow = {
  id: string;
  tour_code: string;
  name: string;
  name_th: string | null;
  date: string | null;
  price: number;
  max_seats: number;
  seats_taken: number;
  cover_image: string | null;
  description: string | null;
  duration: string;
  season: string | null;
  featured?: boolean;
  created_at?: string;
};

export type BookingRow = {
  id: string;
  tour_code: string;
  booking_ref: string;
  name: string;
  email: string;
  phone: string | null;
  seats: number;
  status: string;
  created_at?: string;
};

export type ExpenseRow = {
  id: string;
  tour_code: string | null;
  description: string;
  amount: number;
  created_at?: string;
};

export type ClaimSeatsResult = {
  ok: boolean;
  reason?: string;
  seats_remaining?: number;
};

let client: SupabaseClient | null = null;
let storageClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey()!;
  if (!client) {
    client = createClient(url, key);
  }
  return client;
}

/** Client for portfolio storage (niuibpznjvytprbrzvnn — not the DB project). */
export function getStorageSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  const url = getStorageSupabaseUrl();
  const key = getSupabaseAnonKey()!;
  if (!storageClient) {
    storageClient = createClient(url, key);
  }
  return storageClient;
}

export function getSupabaseSafe(): SupabaseClient | null {
  return getSupabase();
}
