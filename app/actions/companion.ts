'use server';

import { getCanonicalSeed } from '@/lib/trip-canonical';
import type { BookingRow, TripRow } from '@/lib/supabase';
import { getSupabaseSafe } from '@/lib/supabase';
import { loadTripByCode } from '@/lib/trips';
import type { CompanionRole, StaffRole } from '@/lib/companion/types';
import { pinToStaffRole } from '@/lib/companion/staff-nav';

export type CompanionLoginResult =
  | {
      ok: true;
      role: CompanionRole;
      staffRole?: StaffRole;
      booking?: BookingRow;
      trip?: TripRow;
      activeTourCode?: string;
    }
  | { ok: false; error: string };

export async function loginCompanionWithBookingRef(ref: string): Promise<CompanionLoginResult> {
  const bookingRef = ref.trim().toUpperCase();
  if (!bookingRef) return { ok: false, error: 'กรุณากรอกรหัสการจอง' };

  const sb = getSupabaseSafe();
  if (!sb) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const { data: booking, error } = await sb
    .from('bookings')
    .select('*')
    .eq('booking_ref', bookingRef)
    .maybeSingle();

  if (error || !booking) {
    return { ok: false, error: 'ไม่พบรหัสการจอง กรุณาตรวจสอบอีกครั้ง' };
  }

  if (booking.status === 'cancelled') {
    return { ok: false, error: 'การจองนี้ถูกยกเลิกแล้ว' };
  }

  const trip = await loadTripByCode(booking.tour_code);
  if (!trip) return { ok: false, error: 'ไม่พบข้อมูลทริป' };

  return {
    ok: true,
    role: 'guest',
    booking: booking as BookingRow,
    trip,
  };
}

export async function loginCompanionWithPin(
  pin: string,
  bookingRef?: string
): Promise<CompanionLoginResult> {
  const staffRole = pinToStaffRole(pin.trim());
  if (!staffRole) {
    return { ok: false, error: 'รหัส PIN ไม่ถูกต้อง' };
  }

  if (bookingRef?.trim()) {
    const guest = await loginCompanionWithBookingRef(bookingRef);
    if (!guest.ok) return guest;
    return {
      ok: true,
      role: staffRole,
      staffRole,
      booking: guest.booking,
      trip: guest.trip,
      activeTourCode: guest.trip?.tour_code,
    };
  }

  const demoCode = 'NZ-6D5N';
  const demoTrip = getCanonicalSeed(demoCode);
  if (!demoTrip) return { ok: false, error: 'ไม่พบข้อมูลทริป' };

  if (staffRole === 'photographer') {
    const demoBooking: BookingRow = {
      id: 'companion-demo',
      tour_code: demoTrip.tour_code,
      booking_ref: 'TEAM-PREVIEW',
      name: 'ช่างภาพ',
      email: 'photographer@trip2talk.com',
      phone: null,
      seats: 1,
      status: 'confirmed',
    };
    return {
      ok: true,
      role: staffRole,
      staffRole,
      booking: demoBooking,
      trip: demoTrip,
      activeTourCode: demoCode,
    };
  }

  return {
    ok: true,
    role: staffRole,
    staffRole,
    activeTourCode: demoCode,
  };
}
