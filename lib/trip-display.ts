import { getCanonicalSeed } from './trip-canonical';
import type { TripRow } from './supabase';

/** UI display titles — always from canonical seed, never sheet/DB marketing names. */
export function tripDisplayTitle(trip: TripRow, lang: 'EN' | 'TH'): string {
  const canonical = getCanonicalSeed(trip.tour_code) ?? trip;
  if (lang === 'TH' && canonical.name_th) return canonical.name_th;
  return canonical.name;
}
