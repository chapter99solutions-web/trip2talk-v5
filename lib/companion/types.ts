import type { BookingRow, TripRow } from '@/lib/supabase';

export type CompanionRole = 'guest' | 'staff' | 'cohost' | 'owner';

export type CompanionSession = {
  role: CompanionRole;
  bookingRef?: string;
  booking: BookingRow;
  trip: TripRow;
  savedAt: string;
};
