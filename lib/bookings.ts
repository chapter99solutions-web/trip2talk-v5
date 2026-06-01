import { getSupabase, type ClaimSeatsResult } from './supabase';

export function generateBookingRef(): string {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `T2T-${Date.now().toString(36).toUpperCase().slice(-4)}${part}`;
}

export async function claimSeats(tourCode: string, seats: number): Promise<ClaimSeatsResult> {
  const sb = getSupabase();
  const { data, error } = await sb.rpc('claim_seats', {
    p_tour_code: tourCode.toUpperCase(),
    p_seats: seats,
  });
  if (error) {
    return { ok: false, reason: error.message };
  }
  return (data ?? { ok: false, reason: 'unknown' }) as ClaimSeatsResult;
}

export async function releaseSeats(tourCode: string, seats: number): Promise<ClaimSeatsResult> {
  const sb = getSupabase();
  const { data, error } = await sb.rpc('release_seats', {
    p_tour_code: tourCode.toUpperCase(),
    p_seats: seats,
  });
  if (error) return { ok: false, reason: error.message };
  return (data ?? { ok: true }) as ClaimSeatsResult;
}

export type CreateBookingInput = {
  tour_code: string;
  booking_ref: string;
  name: string;
  email: string;
  phone?: string;
  seats: number;
};

export async function createBooking(input: CreateBookingInput) {
  const sb = getSupabase();
  const { data, error } = await sb.from('bookings').insert({
    tour_code: input.tour_code.toUpperCase(),
    booking_ref: input.booking_ref,
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    seats: input.seats,
    status: 'confirmed',
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}
