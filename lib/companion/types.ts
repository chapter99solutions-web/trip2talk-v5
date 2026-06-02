import type { BookingRow, TripRow } from '@/lib/supabase';

export type StaffRole = 'photographer' | 'cohost' | 'owner';

export type CompanionRole = 'guest' | StaffRole;

export type CompanionSession = {
  role: CompanionRole;
  staffRole?: StaffRole;
  bookingRef?: string;
  booking?: BookingRow;
  trip?: TripRow;
  /** Active trip context for photographer field work */
  activeTourCode?: string;
  savedAt: string;
};

export type TripExpenseRow = {
  id: string;
  tour_code: string;
  trip_date: string | null;
  category: string;
  description: string | null;
  amount_aud: number;
  receipt_url: string | null;
  recorded_by: string | null;
  created_at?: string;
};

export type GuestConsentRow = {
  id: string;
  booking_ref: string;
  email: string | null;
  tour_code: string | null;
  completed_at: string;
  has_medical_condition: boolean;
  medical_notes: string | null;
  consent_items?: Record<string, boolean> | null;
};

export type ExtendedBookingRow = BookingRow & {
  payment_status?: string | null;
  notes?: string | null;
  medical_flag?: boolean | null;
};
