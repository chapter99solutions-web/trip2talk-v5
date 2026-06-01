'use client';

import type { TripRow } from '@/lib/supabase';
import BookingConfirmation from './BookingConfirmation';

export default function BookingConfirmationClient({
  trip,
  bookingRef,
  seats,
}: {
  trip: TripRow;
  bookingRef: string;
  seats: number;
}) {
  return <BookingConfirmation trip={trip} bookingRef={bookingRef} seats={seats} />;
}
