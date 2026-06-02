import { gasGetTrips } from './gas-client';
import { isRealTourCode, normalizeCoverImageUrl, portfolioImageUrl, REAL_TOUR_CODES } from './constants';
import { applyCanonicalTrip, getCanonicalSeed, guardAllowedTrips } from './trip-canonical';
import { SEED_TRIPS, withIds } from './seed-trips';
import { getSupabaseSafe, type TripRow } from './supabase';

function normalizeCode(raw: unknown): string {
  return String(raw ?? '')
    .trim()
    .toUpperCase();
}

function pickField(row: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) {
    if (row[k] != null && row[k] !== '') return row[k];
  }
  return undefined;
}

/** Resolve tour_code from sheet row — never trust marketing title as the code. */
function extractTourCodeFromRow(row: Record<string, unknown>): string | null {
  const fields = [
    row.tour_code,
    row['Tour Code'],
    row.tourCode,
    row.TourCode,
    row.code,
    row['Code'],
  ];
  for (const field of fields) {
    const code = normalizeCode(field);
    if (isRealTourCode(code)) return code;
  }
  const blob = String(
    pickField(row, ['Tour Name', 'tourName', 'name', 'title', 'Tour Title']) ?? ''
  ).toUpperCase();
  for (const code of REAL_TOUR_CODES) {
    if (blob.includes(code)) return code;
  }
  return null;
}

function durationFromSheet(row: Record<string, unknown>, seed: TripRow): string {
  const raw = pickField(row, ['duration', 'Duration', 'Duration Days']);
  if (raw == null || raw === '') return seed.duration;
  const s = String(raw).trim();
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    if (n === 1) return '1DAY';
    if (n === 2) return '2D1N';
    if (n === 3) return '3D2N';
    if (n === 4) return '4D3N';
    if (n === 5) return '5D4N';
    if (n === 6) return '6D5N';
  }
  return s || seed.duration;
}

function operationalFromGasRow(row: Record<string, unknown>, seed: TripRow): Partial<TripRow> {
  const priceRaw = pickField(row, ['price', 'Price', 'price_aud', 'Price AUD', 'Standard Price']);
  const price = priceRaw != null ? Number(priceRaw) : seed.price;
  const max_seats =
    Number(pickField(row, ['max_seats', 'Max Seats', 'maxPax', 'Max Pax']) ?? seed.max_seats) || seed.max_seats;
  const seats_taken = Number(pickField(row, ['seats_taken', 'Seats Taken', 'booked']) ?? seed.seats_taken) || 0;
  const duration = durationFromSheet(row, seed);
  const season = String(pickField(row, ['season', 'Season']) ?? seed.season ?? '').trim() || seed.season;
  const dateVal = pickField(row, ['date', 'Date', 'trip_date', 'Trip Date']);
  const date =
    dateVal instanceof Date
      ? dateVal.toISOString().slice(0, 10)
      : dateVal
        ? String(dateVal).slice(0, 10)
        : seed.date;
  const coverPath = String(pickField(row, ['cover_image', 'Cover', 'coverUrl']) ?? '').trim();
  const cover_image = coverPath
    ? normalizeCoverImageUrl(coverPath.startsWith('http') ? coverPath : portfolioImageUrl(coverPath)) ??
      seed.cover_image
    : seed.cover_image;

  return {
    date: date || null,
    price: Number.isFinite(price) ? price : seed.price,
    max_seats,
    seats_taken,
    duration,
    season,
    cover_image,
  };
}

function gasRowToTrip(row: Record<string, unknown>): TripRow | null {
  const tour_code = extractTourCodeFromRow(row);
  if (!tour_code) return null;
  const seed = getCanonicalSeed(tour_code);
  if (!seed) return null;
  return applyCanonicalTrip(tour_code, operationalFromGasRow(row, seed));
}

function filterGasRows(rows: Record<string, unknown>[] | null): Record<string, unknown>[] | null {
  if (!rows) return null;
  return rows.filter((row) => extractTourCodeFromRow(row) != null);
}

async function fetchTripsFromSupabase(): Promise<TripRow[] | null> {
  const sb = getSupabaseSafe();
  if (!sb) return null;
  const { data, error } = await sb.from('trips').select('*').in('tour_code', [...REAL_TOUR_CODES]);
  if (error || !data?.length) return null;
  return data as TripRow[];
}

function mergeTrips(supabaseRows: TripRow[] | null, gasRows: Record<string, unknown>[] | null): TripRow[] {
  const seeds = withIds(SEED_TRIPS);
  const byCode = new Map<string, TripRow>();
  for (const s of seeds) byCode.set(s.tour_code, s);

  if (supabaseRows) {
    for (const row of supabaseRows) {
      const code = normalizeCode(row.tour_code);
      if (!isRealTourCode(code)) continue;
      const seed = byCode.get(code)!;
      const cover = row.cover_image
        ? normalizeCoverImageUrl(
            row.cover_image.startsWith('http') ? row.cover_image : portfolioImageUrl(row.cover_image)
          ) ?? seed.cover_image
        : seed.cover_image;
      byCode.set(
        code,
        applyCanonicalTrip(code, {
          date: row.date,
          price: row.price,
          max_seats: row.max_seats,
          seats_taken: row.seats_taken,
          duration: row.duration,
          season: row.season,
          cover_image: cover,
        })
      );
    }
  }

  if (gasRows) {
    for (const row of gasRows) {
      const merged = gasRowToTrip(row);
      if (!merged) continue;
      byCode.set(
        merged.tour_code,
        applyCanonicalTrip(merged.tour_code, {
          date: merged.date,
          price: merged.price,
          max_seats: merged.max_seats,
          seats_taken: merged.seats_taken,
          duration: merged.duration,
          season: merged.season,
          cover_image: merged.cover_image,
        })
      );
    }
  }

  return guardAllowedTrips(REAL_TOUR_CODES.map((code) => byCode.get(code)!));
}

export async function loadTrips(): Promise<TripRow[]> {
  const gasRows = filterGasRows(await gasGetTrips());
  if (gasRows && gasRows.length > 0) {
    return mergeTrips(null, gasRows);
  }

  const supabaseRows = await fetchTripsFromSupabase();
  if (supabaseRows) {
    return mergeTrips(supabaseRows, gasRows);
  }

  return guardAllowedTrips(REAL_TOUR_CODES.map((code) => getCanonicalSeed(code)!));
}

export async function loadTripByCode(tourCode: string): Promise<TripRow | null> {
  const code = normalizeCode(tourCode);
  if (!isRealTourCode(code)) return null;
  const trips = await loadTrips();
  return trips.find((t) => t.tour_code === code) ?? getCanonicalSeed(code) ?? null;
}

export function seatsRemaining(trip: TripRow): number {
  return Math.max(0, trip.max_seats - trip.seats_taken);
}

export function tripBookable(trip: TripRow): { bookable: boolean; reason: 'full' | 'soon' | 'departed' | null } {
  if (!trip.date) return { bookable: false, reason: 'soon' };
  if (trip.date < new Date().toISOString().slice(0, 10)) return { bookable: false, reason: 'departed' };
  if (seatsRemaining(trip) <= 0) return { bookable: false, reason: 'full' };
  return { bookable: true, reason: null };
}
