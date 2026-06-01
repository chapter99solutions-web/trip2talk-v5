import type { TripRow } from './supabase';
import { isRealTourCode } from './constants';
import { SEED_TRIPS, withIds } from './seed-trips';

/** Legacy V4 marketing titles — must never appear in the UI. */
export const REJECTED_TRIP_NAME_MARKERS = [
  'alpine kingdom',
  'secret southern coast',
  'the aurora edge',
  'aurora edge',
  'lavender & aurora trail',
  'lavender aurora trail',
  'the coastal cliffs',
  'the golden fields',
] as const;

const SEED_BY_CODE = new Map(withIds(SEED_TRIPS).map((t) => [t.tour_code, t]));

export function getCanonicalSeed(tourCode: string): TripRow | undefined {
  return SEED_BY_CODE.get(tourCode.toUpperCase());
}

export function isRejectedTripName(name: string): boolean {
  const n = name.trim().toLowerCase();
  if (!n) return false;
  return REJECTED_TRIP_NAME_MARKERS.some((marker) => n.includes(marker));
}

/** Identity fields always come from seed; external sources may only update operational fields. */
export function applyCanonicalTrip(
  tourCode: string,
  operational: Partial<TripRow> = {}
): TripRow {
  const seed = getCanonicalSeed(tourCode);
  if (!seed) {
    throw new Error(`Unknown tour_code: ${tourCode}`);
  }
  return {
    ...seed,
    ...operational,
    tour_code: seed.tour_code,
    name: seed.name,
    name_th: seed.name_th,
    description: seed.description,
    featured: seed.featured,
  };
}

export function sanitizeExternalTrip(row: TripRow): TripRow | null {
  const code = row.tour_code?.toUpperCase();
  if (!code || !isRealTourCode(code)) return null;
  if (isRejectedTripName(row.name) || (row.name_th && isRejectedTripName(row.name_th))) {
    return applyCanonicalTrip(code, {
      date: row.date,
      price: row.price,
      max_seats: row.max_seats,
      seats_taken: row.seats_taken,
      cover_image: row.cover_image,
      duration: row.duration,
      season: row.season,
    });
  }
  return applyCanonicalTrip(code, {
    date: row.date,
    price: row.price,
    max_seats: row.max_seats,
    seats_taken: row.seats_taken,
    cover_image: row.cover_image,
    duration: row.duration,
    season: row.season,
  });
}
