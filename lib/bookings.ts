import { getSupabaseSafe, type ClaimSeatsResult } from './supabase';

export function generateBookingRef(): string {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `T2T-${Date.now().toString(36).toUpperCase().slice(-4)}${part}`;
}

export async function checkBookingAllowed(
  email: string,
  tourCode: string
): Promise<ClaimSeatsResult> {
  const sb = getSupabaseSafe();
  if (!sb) return { ok: false, reason: 'booking unavailable' };
  const { data, error } = await sb.rpc('check_booking_allowed', {
    p_email: email.trim(),
    p_tour_code: tourCode.toUpperCase(),
  });
  if (error) {
    return { ok: false, reason: error.message };
  }
  return (data ?? { ok: false, reason: 'unknown' }) as ClaimSeatsResult;
}

export async function claimSeats(tourCode: string, seats: number): Promise<ClaimSeatsResult> {
  const sb = getSupabaseSafe();
  if (!sb) return { ok: false, reason: 'booking unavailable' };
  const code = tourCode.trim().toUpperCase();

  // Lookup by public.trips.tour_code (same rules as claim_seats RPC; avoids FOR UPDATE + RLS blind spot).
  const { data: row, error: lookupError } = await sb
    .from('trips')
    .select('tour_code, max_seats, seats_taken, date')
    .eq('tour_code', code)
    .maybeSingle();

  if (lookupError) {
    return { ok: false, reason: lookupError.message };
  }
  if (!row) {
    return { ok: false, reason: 'trip not found' };
  }
  if (!row.date) {
    return { ok: false, reason: 'no date set' };
  }
  const today = new Date().toISOString().slice(0, 10);
  if (row.date < today) {
    return { ok: false, reason: 'trip already departed' };
  }
  if (row.seats_taken + seats > row.max_seats) {
    return { ok: false, reason: 'not enough seats' };
  }

  const { error: updateError } = await sb
    .from('trips')
    .update({ seats_taken: row.seats_taken + seats })
    .eq('tour_code', code);

  if (updateError) {
    return { ok: false, reason: updateError.message };
  }
  return {
    ok: true,
    seats_remaining: row.max_seats - row.seats_taken - seats,
  };
}

export async function releaseSeats(tourCode: string, seats: number): Promise<ClaimSeatsResult> {
  const sb = getSupabaseSafe();
  if (!sb) return { ok: false, reason: 'booking unavailable' };
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
  const sb = getSupabaseSafe();
  if (!sb) throw new Error('Booking service is not available right now.');
  const { data, error } = await sb
    .from('bookings')
    .insert({
      tour_code: input.tour_code.toUpperCase(),
      booking_ref: input.booking_ref,
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      seats: input.seats,
      status: 'confirmed',
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
