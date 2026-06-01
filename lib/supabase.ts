import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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

export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  if (!client) {
    client = createClient(url, key);
  }
  return client;
}

export function getSupabaseSafe(): SupabaseClient | null {
  try {
    return getSupabase();
  } catch {
    return null;
  }
}
