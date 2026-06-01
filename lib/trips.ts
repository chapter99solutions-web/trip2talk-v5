import { isRealTourCode, portfolioImageUrl, REAL_TOUR_CODES } from './constants';
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

function gasRowToTrip(row: Record<string, unknown>, seed: TripRow): TripRow | null {
  const tour_code = normalizeCode(
    pickField(row, ['tour_code', 'Tour Code', 'tourCode', 'TourCode', 'code'])
  );
  if (!isRealTourCode(tour_code)) return null;

  const name = String(pickField(row, ['name', 'Tour Name', 'tourName', 'title']) ?? seed.name).trim();
  const name_th = String(pickField(row, ['name_th', 'Name TH', 'nameTh']) ?? seed.name_th ?? '').trim() || seed.name_th;
  const priceRaw = pickField(row, ['price', 'Price', 'price_aud', 'Price AUD']);
  const price = priceRaw != null ? Number(priceRaw) : seed.price;
  const max_seats = Number(pickField(row, ['max_seats', 'Max Seats', 'maxPax']) ?? seed.max_seats) || seed.max_seats;
  const seats_taken = Number(pickField(row, ['seats_taken', 'Seats Taken', 'booked']) ?? seed.seats_taken) || 0;
  const duration = String(pickField(row, ['duration', 'Duration']) ?? seed.duration).trim() || seed.duration;
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
    ? coverPath.startsWith('http')
      ? coverPath
      : portfolioImageUrl(coverPath)
    : seed.cover_image;
  const description = String(pickField(row, ['description', 'Description']) ?? seed.description ?? '').trim() || seed.description;

  return {
    ...seed,
    tour_code,
    name,
    name_th,
    date: date || null,
    price: Number.isFinite(price) ? price : seed.price,
    max_seats,
    seats_taken,
    duration,
    season,
    cover_image,
    description,
  };
}

async function fetchTripsFromGas(): Promise<Record<string, unknown>[] | null> {
  const gasUrl = process.env.NEXT_PUBLIC_GAS_URL?.trim();
  if (!gasUrl) return null;
  try {
    const res = await fetch(gasUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as { ok?: boolean; trips?: unknown[] };
    if (!json.ok || !Array.isArray(json.trips)) return null;
    return json.trips as Record<string, unknown>[];
  } catch {
    return null;
  }
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
      byCode.set(code, {
        ...seed,
        ...row,
        tour_code: code,
        cover_image: row.cover_image?.startsWith('http')
          ? row.cover_image
          : row.cover_image
            ? portfolioImageUrl(row.cover_image)
            : seed.cover_image,
      });
    }
  }

  if (gasRows) {
    for (const row of gasRows) {
      const code = normalizeCode(
        pickField(row, ['tour_code', 'Tour Code', 'tourCode', 'TourCode', 'code'])
      );
      if (!isRealTourCode(code)) continue;
      const seed = byCode.get(code)!;
      const merged = gasRowToTrip(row, seed);
      if (merged) byCode.set(code, { ...byCode.get(code)!, ...merged });
    }
  }

  return REAL_TOUR_CODES.map((code) => byCode.get(code)!);
}

export async function loadTrips(): Promise<TripRow[]> {
  const [sb, gas] = await Promise.all([fetchTripsFromSupabase(), fetchTripsFromGas()]);
  return mergeTrips(sb, gas);
}

export async function loadTripByCode(tourCode: string): Promise<TripRow | null> {
  const code = normalizeCode(tourCode);
  if (!isRealTourCode(code)) return null;
  const trips = await loadTrips();
  return trips.find((t) => t.tour_code === code) ?? null;
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
