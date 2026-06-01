'use server';

import {
  checkBookingAllowed,
  claimSeats,
  createBooking,
  generateBookingRef,
  releaseSeats,
} from '@/lib/bookings';
import { gasAddBooking } from '@/lib/gas-client';

export type SubmitBookingResult =
  | { ok: true; bookingRef: string }
  | { ok: false; error: string; code?: 'already_booked' };

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

  const normalizedEmail = email.toLowerCase();
  const allowed = await checkBookingAllowed(normalizedEmail, tour_code);
  if (!allowed.ok) {
    if (allowed.reason === 'already booked') {
      return { ok: false, error: 'already booked', code: 'already_booked' };
    }
    return { ok: false, error: allowed.reason || 'Could not verify booking.' };
  }

  const claim = await claimSeats(tour_code, seats);
  if (!claim.ok) {
    return { ok: false, error: claim.reason || 'Could not reserve seats.' };
  }

  const booking_ref = generateBookingRef();
  const status = 'confirmed';
  try {
    await createBooking({ tour_code, booking_ref, name, email: normalizedEmail, phone, seats });
    await gasAddBooking({
      booking_ref,
      tour_code,
      name,
      email,
      phone,
      seats,
      status,
    });
    return { ok: true, bookingRef: booking_ref };
  } catch (e) {
    await releaseSeats(tour_code, seats);
    const msg = e instanceof Error ? e.message : 'Booking save failed.';
    if (/bookings_one_active_per_email_tour|duplicate key/i.test(msg)) {
      return { ok: false, error: 'already booked', code: 'already_booked' };
    }
    return { ok: false, error: msg };
  }
}

export async function adjustSeats(tourCode: string, delta: number) {
  if (delta > 0) return claimSeats(tourCode, delta);
  return releaseSeats(tourCode, Math.abs(delta));
}

export async function markCheckedIn(bookingRef: string) {
  const { getSupabaseSafe } = await import('@/lib/supabase');
  const sb = getSupabaseSafe();
  if (!sb) return;
  const { error } = await sb
    .from('bookings')
    .update({ status: 'checked_in' })
    .eq('booking_ref', bookingRef);
  if (error) throw new Error(error.message);
}
