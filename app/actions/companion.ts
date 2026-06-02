'use server';

import { DASHBOARD_PINS, type DashboardRole } from '@/lib/constants';
import { getCanonicalSeed } from '@/lib/trip-canonical';
import type { BookingRow, TripRow } from '@/lib/supabase';
import { getSupabaseSafe } from '@/lib/supabase';
import { loadTripByCode } from '@/lib/trips';
import type { CompanionRole } from '@/lib/companion/types';

export type CompanionLoginResult =
  | {
      ok: true;
      role: CompanionRole;
      booking: BookingRow;
      trip: TripRow;
    }
  | { ok: false; error: string };

function roleFromPin(pin: string): DashboardRole | null {
  const entry = Object.entries(DASHBOARD_PINS).find(([, v]) => v === pin);
  return entry ? (entry[0] as DashboardRole) : null;
}

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
  const dashboardRole = roleFromPin(pin.trim());
  if (!dashboardRole || dashboardRole === 'platform') {
    return { ok: false, error: 'รหัส PIN ไม่ถูกต้อง' };
  }

  const companionRole: CompanionRole =
    dashboardRole === 'staff' ? 'staff' : dashboardRole === 'cohost' ? 'cohost' : 'owner';

  if (bookingRef?.trim()) {
    const guest = await loginCompanionWithBookingRef(bookingRef);
    if (!guest.ok) return guest;
    return { ...guest, role: companionRole };
  }

  const demoTrip = getCanonicalSeed('NZ-6D5N');
  if (!demoTrip) return { ok: false, error: 'ไม่พบข้อมูลทริป' };

  const demoBooking: BookingRow = {
    id: 'companion-demo',
    tour_code: demoTrip.tour_code,
    booking_ref: 'TEAM-PREVIEW',
    name: 'Team preview',
    email: 'team@trip2talk.com',
    phone: null,
    seats: 1,
    status: 'confirmed',
  };

  return {
    ok: true,
    role: companionRole,
    booking: demoBooking,
    trip: demoTrip,
  };
}
