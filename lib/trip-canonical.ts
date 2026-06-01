import type { TripRow } from './supabase';
import { isRealTourCode, REAL_TOUR_CODES } from './constants';
import { SEED_TRIPS, withIds } from './seed-trips';

/** Substrings that must never appear in trip display names (legacy V4 marketing). */
export const RUNTIME_REJECTED_NAME_SNIPPETS = [
  'alpine',
  'southern coast',
  'aurora edge',
  'lavender',
  'aurora trail',
  'coastal cliffs',
  'golden fields',
  'secret southern',
] as const;

const SEED_BY_CODE = new Map(withIds(SEED_TRIPS).map((t) => [t.tour_code, t]));

export function getCanonicalSeed(tourCode: string): TripRow | undefined {
  return SEED_BY_CODE.get(tourCode.toUpperCase());
}

export function isRejectedTripName(name: string): boolean {
  const n = name.trim().toLowerCase();
  if (!n) return false;
  return RUNTIME_REJECTED_NAME_SNIPPETS.some((snippet) => n.includes(snippet));
}

function operationalOnly(row: TripRow): Partial<TripRow> {
  return {
    date: row.date,
    price: row.price,
    max_seats: row.max_seats,
    seats_taken: row.seats_taken,
    cover_image: row.cover_image,
    duration: row.duration,
    season: row.season,
  };
}

/** Identity always from seed; external sources may only update operational fields. */
export function applyCanonicalTrip(tourCode: string, operational: Partial<TripRow> = {}): TripRow {
  const seed = getCanonicalSeed(tourCode);
  if (!seed) {
    throw new Error(`Unknown tour_code: ${tourCode}`);
  }
  return {
    ...seed,
    id: seed.id,
    date: operational.date !== undefined ? operational.date : seed.date,
    price: operational.price !== undefined ? operational.price : seed.price,
    max_seats: operational.max_seats !== undefined ? operational.max_seats : seed.max_seats,
    seats_taken: operational.seats_taken !== undefined ? operational.seats_taken : seed.seats_taken,
    cover_image: operational.cover_image !== undefined ? operational.cover_image : seed.cover_image,
    duration: operational.duration !== undefined ? operational.duration : seed.duration,
    season: operational.season !== undefined ? operational.season : seed.season,
    tour_code: seed.tour_code,
    name: seed.name,
    name_th: seed.name_th,
    description: seed.description,
    featured: seed.featured,
  };
}

/**
 * Final gate before any trip list hits the UI:
 * - exactly 8 allowed tour_codes
 * - canonical names only
 * - drops rejected marketing titles
 */
export function guardAllowedTrips(trips: TripRow[]): TripRow[] {
  const byCode = new Map<string, TripRow>();

  for (const row of trips) {
    const code = row.tour_code?.trim().toUpperCase();
    if (!code || !isRealTourCode(code)) continue;
    if (isRejectedTripName(row.name) || isRejectedTripName(row.name_th ?? '')) {
      byCode.set(code, applyCanonicalTrip(code, operationalOnly(row)));
      continue;
    }
    byCode.set(code, applyCanonicalTrip(code, operationalOnly(row)));
  }

  return REAL_TOUR_CODES.map((code) => byCode.get(code) ?? getCanonicalSeed(code)!);
}
