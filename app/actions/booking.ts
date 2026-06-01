'use server';

import { claimSeats, createBooking, generateBookingRef, releaseSeats } from '@/lib/bookings';

export type SubmitBookingResult =
  | { ok: true; bookingRef: string }
  | { ok: false; error: string };

export async function submitBooking(formData: FormData): Promise<SubmitBookingResult> {
  const tour_code = String(formData.get('tour_code') || '').trim().toUpperCase();
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const seats = Number(formData.get('seats') || 1);

  if (!tour_code || !name || !email) {
    return { ok: false, error: 'Name and email are required.' };
  }
  if (!Number.isFinite(seats) || seats < 1) {
    return { ok: false, error: 'Invalid seat count.' };
  }

  const claim = await claimSeats(tour_code, seats);
  if (!claim.ok) {
    return { ok: false, error: claim.reason || 'Could not reserve seats.' };
  }

  const booking_ref = generateBookingRef();
  try {
    await createBooking({ tour_code, booking_ref, name, email, phone, seats });
    return { ok: true, bookingRef: booking_ref };
  } catch (e) {
    await releaseSeats(tour_code, seats);
    return { ok: false, error: e instanceof Error ? e.message : 'Booking save failed.' };
  }
}

export async function adjustSeats(tourCode: string, delta: number) {
  if (delta > 0) return claimSeats(tourCode, delta);
  return releaseSeats(tourCode, Math.abs(delta));
}

export async function markCheckedIn(bookingRef: string) {
  const { getSupabase } = await import('@/lib/supabase');
  const sb = getSupabase();
  const { error } = await sb
    .from('bookings')
    .update({ status: 'checked_in' })
    .eq('booking_ref', bookingRef);
  if (error) throw new Error(error.message);
}
