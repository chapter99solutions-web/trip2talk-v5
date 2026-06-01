import { gasAddExpense } from './gas-client';
import { getSupabaseSafe, type BookingRow, type ExpenseRow, type TripRow } from './supabase';
import { loadTrips } from './trips';

export async function fetchBookings(): Promise<BookingRow[]> {
  const sb = getSupabaseSafe();
  if (!sb) return [];
  const { data } = await sb.from('bookings').select('*').order('created_at', { ascending: false });
  return (data ?? []) as BookingRow[];
}

export async function fetchExpenses(): Promise<ExpenseRow[]> {
  const sb = getSupabaseSafe();
  if (!sb) return [];
  const { data } = await sb.from('expenses').select('*').order('created_at', { ascending: false });
  return (data ?? []) as ExpenseRow[];
}

export async function addExpense(tour_code: string | null, description: string, amount: number) {
  const sb = getSupabaseSafe();
  if (!sb) throw new Error('Supabase not configured');
  const { error } = await sb.from('expenses').insert({ tour_code, description, amount });
  if (error) throw new Error(error.message);
  await gasAddExpense({ tour_code, description, amount });
}

export async function upsertTrip(trip: Partial<TripRow> & { tour_code: string }) {
  const sb = getSupabaseSafe();
  if (!sb) throw new Error('Supabase not configured');
  const { error } = await sb.from('trips').upsert(trip, { onConflict: 'tour_code' });
  if (error) throw new Error(error.message);
}

export async function deleteTripByCode(tour_code: string) {
  const sb = getSupabaseSafe();
  if (!sb) throw new Error('Supabase not configured');
  const { error } = await sb.from('trips').delete().eq('tour_code', tour_code);
  if (error) throw new Error(error.message);
}

export async function loadDashboardTrips() {
  return loadTrips();
}

export function revenueFromBookings(bookings: BookingRow[], trips: TripRow[]): number {
  const priceByCode = new Map(trips.map((t) => [t.tour_code, t.price]));
  return bookings.reduce((sum, b) => {
    if (b.status === 'cancelled') return sum;
    return sum + (priceByCode.get(b.tour_code) ?? 0) * b.seats;
  }, 0);
}
