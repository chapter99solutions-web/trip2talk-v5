'use server';

import { claimSeats, createBooking, generateBookingRef, releaseSeats } from '@/lib/bookings';
import { gasAddBooking } from '@/lib/gas-client';
import { getSupabaseSafe } from '@/lib/supabase';

export type SubmitBookingResult =
  | { ok: true; bookingRef: string }
  | { ok: false; error: string; code?: 'already_booked' | 'booking_check_failed' };

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

  const sb = getSupabaseSafe();
  if (!sb) {
    return {
      ok: false,
      code: 'booking_check_failed',
      error: 'ไม่สามารถทำการจองได้ กรุณาลองใหม่อีกครั้ง',
    };
  }

  const { data: allowCheck, error: checkError } = await sb.rpc('check_booking_allowed', {
    p_email: email,
    p_tour_code: tour_code,
  });

  if (checkError || !(allowCheck as { ok?: boolean } | null)?.ok) {
    const reason = (allowCheck as { reason?: string } | null)?.reason;
    const alreadyBooked = reason === 'already booked';
    return {
      ok: false,
      code: alreadyBooked ? 'already_booked' : 'booking_check_failed',
      error: alreadyBooked
        ? 'อีเมลนี้จองทริปนี้ไว้แล้ว กรุณาตรวจสอบอีเมลของคุณ'
        : 'ไม่สามารถทำการจองได้ กรุณาลองใหม่อีกครั้ง',
    };
  }

  const normalizedEmail = email.toLowerCase();
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
      return {
        ok: false,
        code: 'already_booked',
        error: 'อีเมลนี้จองทริปนี้ไว้แล้ว กรุณาตรวจสอบอีเมลของคุณ',
      };
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
