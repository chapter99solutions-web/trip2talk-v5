import type { TripRow } from '@/lib/supabase';
import { isListingOnlyTourCode } from '@/lib/constants';
import { tripBookable } from '@/lib/trips';

export type TripCategoryId =
  | 'all'
  | 'multi-day'
  | 'day-trips'
  | 'international'
  | 'australia'
  | 'night'
  | 'budget';

export type TripCategory = {
  id: TripCategoryId;
  /** URL query value: /trips?cat= */
  slug: string;
  labelTh: string;
  emoji: string;
  codes: readonly string[];
};

const MULTI_DAY = [
  'MEL-4D3N',
  'ULU-4D3N',
  'NZ-6D5N',
  'TAS-3D2N',
  'TAS-LH-4D3N',
  'TAS-SU-4D3N',
  'CAN-2D1N',
  'BER-3D2N',
] as const;

const DAY_TRIPS = [
  'KIA-1DAY',
  'SYD-1DAY',
  'PSP-1DAY',
  'SYD-MW-WIN',
  'LAV-ANB-1D',
] as const;

const INTERNATIONAL = ['NZ-6D5N'] as const;

const AUSTRALIA = [
  'MEL-4D3N',
  'ULU-4D3N',
  'TAS-3D2N',
  'TAS-LH-4D3N',
  'TAS-SU-4D3N',
  'CAN-2D1N',
  'BER-3D2N',
  'KIA-1DAY',
  'SYD-1DAY',
  'PSP-1DAY',
  'SYD-MW-WIN',
  'LAV-ANB-1D',
] as const;

const NIGHT = ['SYD-MW-WIN', 'TAS-3D2N', 'TAS-LH-4D3N', 'ULU-4D3N', 'MEL-4D3N'] as const;

const BUDGET = [
  'KIA-1DAY',
  'SYD-1DAY',
  'PSP-1DAY',
  'SYD-MW-WIN',
  'LAV-ANB-1D',
  'CAN-2D1N',
  'BER-3D2N',
] as const;

const ALL_CODES = [
  ...new Set([
    ...MULTI_DAY,
    ...DAY_TRIPS,
    ...INTERNATIONAL,
    ...AUSTRALIA,
    ...NIGHT,
    ...BUDGET,
  ]),
] as const;

export const TRIP_CATEGORIES: TripCategory[] = [
  { id: 'all', slug: 'all', labelTh: 'ทั้งหมด', emoji: '', codes: ALL_CODES },
  { id: 'multi-day', slug: 'multi-day', labelTh: 'หลายวัน', emoji: '🗓️', codes: MULTI_DAY },
  { id: 'day-trips', slug: 'day-trips', labelTh: 'วันเดียว', emoji: '☀️', codes: DAY_TRIPS },
  {
    id: 'international',
    slug: 'international',
    labelTh: 'ต่างประเทศ',
    emoji: '✈️',
    codes: INTERNATIONAL,
  },
  {
    id: 'australia',
    slug: 'australia',
    labelTh: 'ในออสเตรเลีย',
    emoji: '🇦🇺',
    codes: AUSTRALIA,
  },
  { id: 'night', slug: 'night', labelTh: 'ถ่ายดาว', emoji: '🌌', codes: NIGHT },
  { id: 'budget', slug: 'budget', labelTh: 'งบไม่เกิน $500', emoji: '💰', codes: BUDGET },
];

const BUDGET_MAX_AUD = 500;

export function categoryBySlug(slug: string | null): TripCategory {
  if (!slug) return TRIP_CATEGORIES[0];
  return TRIP_CATEGORIES.find((c) => c.slug === slug) ?? TRIP_CATEGORIES[0];
}

export function tripMatchesCategory(trip: TripRow, category: TripCategory): boolean {
  if (category.id === 'all') return true;
  if (category.id === 'budget') {
    return trip.price <= BUDGET_MAX_AUD && category.codes.includes(trip.tour_code);
  }
  return category.codes.includes(trip.tour_code);
}

export function filterTripsByCategory(trips: TripRow[], category: TripCategory): TripRow[] {
  return trips.filter((t) => tripMatchesCategory(t, category));
}

export function countTripsInCategory(trips: TripRow[], category: TripCategory): number {
  return filterTripsByCategory(trips, category).length;
}

/** Trips that show an active “View trip” CTA (not listing-only, bookable). */
export function isTripViewable(trip: TripRow): boolean {
  if (isListingOnlyTourCode(trip.tour_code)) return false;
  return tripBookable(trip).bookable;
}

export function isTripComingSoon(trip: TripRow): boolean {
  return !isTripViewable(trip);
}

export function partitionTripsForDisplay(trips: TripRow[]) {
  const bookable: TripRow[] = [];
  const comingSoon: TripRow[] = [];
  for (const trip of trips) {
    if (isTripComingSoon(trip)) comingSoon.push(trip);
    else bookable.push(trip);
  }
  return { bookable, comingSoon };
}
