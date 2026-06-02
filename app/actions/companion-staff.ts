'use server';

import { generateBookingRef, claimSeats, releaseSeats } from '@/lib/bookings';
import { REAL_TOUR_CODES } from '@/lib/constants';
import { getSupabaseSafe, type BookingRow, type TripRow } from '@/lib/supabase';
import type { ExtendedBookingRow, GuestConsentRow, TripExpenseRow } from '@/lib/companion/types';
import { loadTrips } from '@/lib/trips';
export type StaffActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

function sb() {
  const client = getSupabaseSafe();
  if (!client) return null;
  return client;
}

export async function listTripExpenses(tourCode?: string): Promise<StaffActionResult<TripExpenseRow[]>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  let q = client.from('trip_expenses').select('*').order('trip_date', { ascending: false });
  if (tourCode) q = q.eq('tour_code', tourCode.toUpperCase());
  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as TripExpenseRow[] };
}

export async function addTripExpense(input: {
  tour_code: string;
  trip_date: string;
  category: string;
  description: string;
  amount_aud: number;
  receipt_url?: string | null;
}): Promise<StaffActionResult<TripExpenseRow>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client
    .from('trip_expenses')
    .insert({
      tour_code: input.tour_code.toUpperCase(),
      trip_date: input.trip_date || null,
      category: input.category,
      description: input.description || null,
      amount_aud: input.amount_aud,
      receipt_url: input.receipt_url ?? null,
      recorded_by: 'photographer',
    })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as TripExpenseRow };
}

export async function uploadReceipt(formData: FormData): Promise<StaffActionResult<string>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const file = formData.get('file');
  const tourCode = String(formData.get('tour_code') || 'misc').toUpperCase();
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'ไม่พบไฟล์ใบเสร็จ' };
  }
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${tourCode}/${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await client.storage.from('receipts').upload(path, bytes, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  });
  if (error) return { ok: false, error: error.message };
  const { data } = client.storage.from('receipts').getPublicUrl(path);
  return { ok: true, data: data.publicUrl };
}

export async function listAllBookings(): Promise<StaffActionResult<ExtendedBookingRow[]>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client.from('bookings').select('*').order('created_at', { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as ExtendedBookingRow[] };
}

export async function listAllTrips(): Promise<StaffActionResult<TripRow[]>> {
  try {
    const trips = await loadTrips();
    return { ok: true, data: trips };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'โหลดทริปไม่สำเร็จ' };
  }
}

export async function cohostCreateBooking(input: {
  name: string;
  email: string;
  phone: string;
  tour_code: string;
  seats: number;
  payment_status: string;
  notes: string;
  status: string;
}): Promise<StaffActionResult<ExtendedBookingRow>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const tour_code = input.tour_code.toUpperCase();
  const booking_ref = generateBookingRef();
  const status = input.status || 'pending';

  if (status === 'confirmed') {
    const claim = await claimSeats(tour_code, input.seats);
    if (!claim.ok) return { ok: false, error: claim.reason ?? 'จองที่นั่งไม่สำเร็จ' };
  }

  const row = {
    tour_code,
    booking_ref,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim() || null,
    seats: input.seats,
    status,
    payment_status: input.payment_status,
    notes: input.notes || null,
  };

  const { data, error } = await client.from('bookings').insert(row).select().single();
  if (error) {
    if (status === 'confirmed') await releaseSeats(tour_code, input.seats);
    return { ok: false, error: error.message };
  }
  return { ok: true, data: data as ExtendedBookingRow };
}

export async function cohostUpdateBooking(
  id: string,
  patch: Partial<{
    name: string;
    email: string;
    phone: string;
    tour_code: string;
    seats: number;
    payment_status: string;
    notes: string;
    status: string;
  }>
): Promise<StaffActionResult<ExtendedBookingRow>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const update: Record<string, unknown> = { ...patch };
  if (patch.tour_code) update.tour_code = patch.tour_code.toUpperCase();
  const { data, error } = await client.from('bookings').update(update).eq('id', id).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as ExtendedBookingRow };
}

export async function updateTripAdmin(
  tourCode: string,
  patch: Partial<{ date: string | null; max_seats: number; seats_taken: number }>
): Promise<StaffActionResult<TripRow>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client
    .from('trips')
    .update(patch)
    .eq('tour_code', tourCode.toUpperCase())
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as TripRow };
}

export async function setTripBookingOpen(
  tourCode: string,
  open: boolean
): Promise<StaffActionResult<TripRow>> {
  const max = open ? 6 : 0;
  return updateTripAdmin(tourCode, { max_seats: max });
}

export async function listGuestConsents(): Promise<StaffActionResult<GuestConsentRow[]>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client
    .from('guest_consents')
    .select('*')
    .order('completed_at', { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as GuestConsentRow[] };
}

export async function saveGuestConsentRecord(input: {
  booking_ref: string;
  email?: string;
  tour_code?: string;
  has_medical_condition: boolean;
  medical_notes?: string;
  consent_items: Record<string, boolean>;
}): Promise<StaffActionResult<GuestConsentRow>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client
    .from('guest_consents')
    .upsert(
      {
        booking_ref: input.booking_ref,
        email: input.email ?? null,
        tour_code: input.tour_code ?? null,
        has_medical_condition: input.has_medical_condition,
        medical_notes: input.medical_notes ?? null,
        consent_items: input.consent_items,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'booking_ref' }
    )
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as GuestConsentRow };
}

export type FinanceSummary = {
  revenue: number;
  expenses: number;
  profit: number;
  depositReceived: number;
  pendingReceivable: number;
  byTour: { tour_code: string; revenue: number; expenses: number }[];
};

export async function getFinanceSummary(
  month?: string
): Promise<StaffActionResult<FinanceSummary>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const tripsRes = await listAllTrips();
  if (!tripsRes.ok) return tripsRes;
  const priceByCode = Object.fromEntries(tripsRes.data.map((t) => [t.tour_code, t.price]));

  const { data: bookings, error: bErr } = await client.from('bookings').select('*');
  if (bErr) return { ok: false, error: bErr.message };

  const { data: expenses, error: eErr } = await client.from('trip_expenses').select('*');
  if (eErr) return { ok: false, error: eErr.message };

  const inMonth = (iso: string | undefined) => {
    if (!month || !iso) return true;
    return iso.startsWith(month);
  };

  let revenue = 0;
  let depositReceived = 0;
  let pendingReceivable = 0;
  const byTour: Record<string, { revenue: number; expenses: number }> = {};

  for (const code of REAL_TOUR_CODES) {
    byTour[code] = { revenue: 0, expenses: 0 };
  }

  for (const b of (bookings ?? []) as ExtendedBookingRow[]) {
    if (b.status !== 'confirmed' && b.status !== 'pending') continue;
    if (!inMonth(b.created_at)) continue;
    const price = priceByCode[b.tour_code] ?? 0;
    const total = price * b.seats;
    const pay = b.payment_status ?? 'unpaid';
    if (b.status === 'confirmed') {
      if (pay === 'paid') {
        revenue += total;
        byTour[b.tour_code] = byTour[b.tour_code] ?? { revenue: 0, expenses: 0 };
        byTour[b.tour_code].revenue += total;
      } else if (pay === 'deposit') {
        const dep = total * 0.3;
        depositReceived += dep;
        revenue += dep;
        byTour[b.tour_code] = byTour[b.tour_code] ?? { revenue: 0, expenses: 0 };
        byTour[b.tour_code].revenue += dep;
        pendingReceivable += total - dep;
      } else {
        pendingReceivable += total;
      }
    }
    if (b.status === 'pending') pendingReceivable += total;
  }

  let expenseTotal = 0;
  for (const ex of (expenses ?? []) as TripExpenseRow[]) {
    if (!inMonth(ex.created_at)) continue;
    const amt = Number(ex.amount_aud) || 0;
    expenseTotal += amt;
    byTour[ex.tour_code] = byTour[ex.tour_code] ?? { revenue: 0, expenses: 0 };
    byTour[ex.tour_code].expenses += amt;
  }

  return {
    ok: true,
    data: {
      revenue,
      expenses: expenseTotal,
      profit: revenue - expenseTotal,
      depositReceived,
      pendingReceivable,
      byTour: Object.entries(byTour).map(([tour_code, v]) => ({ tour_code, ...v })),
    },
  };
}
