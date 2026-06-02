'use server';

import { getSupabaseSafe } from '@/lib/supabase';
import type { GuestConsentRow } from '@/lib/companion/types';
import type { StaffRole } from '@/lib/companion/types';

export type SafetyAckResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type SafetyAckStatus = {
  acknowledged: boolean;
  acknowledgedAt: string | null;
};

export type SafetyAcknowledgementRow = {
  id: string;
  role: string;
  identifier: string;
  acknowledged_at: string;
  user_agent: string | null;
};

export type RulesAckDisplayRow = {
  nameOrRole: string;
  bookingRef: string;
  acknowledgedAt: string;
  userAgent: string | null;
  source: 'guest' | 'staff';
  tourCode: string | null;
};

export type TourRulesAckStats = {
  tour_code: string;
  confirmed: number;
  total: number;
};

function sb() {
  return getSupabaseSafe();
}

function staffRoleForDb(role: StaffRole): string {
  if (role === 'photographer') return 'staff';
  return role;
}

export async function getSafetyAckStatus(input: {
  kind: 'guest';
  bookingRef: string;
}): Promise<SafetyAckResult<SafetyAckStatus>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const { data, error } = await client
    .from('guest_consents')
    .select('consent_rules, rules_acknowledged_at')
    .eq('booking_ref', input.bookingRef.toUpperCase())
    .maybeSingle();

  if (error) return { ok: false, error: error.message };

  const row = data as { consent_rules?: boolean; rules_acknowledged_at?: string } | null;
  return {
    ok: true,
    data: {
      acknowledged: Boolean(row?.consent_rules),
      acknowledgedAt: row?.rules_acknowledged_at ?? null,
    },
  };
}

export async function getSafetyAckStatusForStaff(input: {
  staffRole: StaffRole;
  identifier: string;
}): Promise<SafetyAckResult<SafetyAckStatus>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const role = staffRoleForDb(input.staffRole);
  const { data, error } = await client
    .from('safety_acknowledgements')
    .select('acknowledged_at')
    .eq('role', role)
    .eq('identifier', input.identifier)
    .order('acknowledged_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };

  const at = (data as { acknowledged_at?: string } | null)?.acknowledged_at ?? null;
  return {
    ok: true,
    data: { acknowledged: Boolean(at), acknowledgedAt: at },
  };
}

export async function saveSafetyAcknowledgement(input: {
  kind: 'guest';
  bookingRef: string;
  email?: string;
  tourCode?: string;
  userAgent?: string;
}): Promise<SafetyAckResult<{ acknowledgedAt: string }>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const now = new Date().toISOString();
  const booking_ref = input.bookingRef.trim().toUpperCase();

  const { data: existing } = await client
    .from('guest_consents')
    .select('id')
    .eq('booking_ref', booking_ref)
    .maybeSingle();

  if (existing) {
    const { error } = await client
      .from('guest_consents')
      .update({
        consent_rules: true,
        rules_acknowledged_at: now,
        updated_at: now,
      })
      .eq('booking_ref', booking_ref);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await client.from('guest_consents').insert({
      booking_ref,
      email: input.email ?? null,
      tour_code: input.tourCode ?? null,
      completed_at: now,
      consent_rules: true,
      rules_acknowledged_at: now,
      updated_at: now,
    });
    if (error) return { ok: false, error: error.message };
  }

  return { ok: true, data: { acknowledgedAt: now } };
}

export async function saveStaffSafetyAcknowledgement(input: {
  staffRole: StaffRole;
  identifier: string;
  userAgent?: string;
}): Promise<SafetyAckResult<{ acknowledgedAt: string }>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const now = new Date().toISOString();
  const { error } = await client.from('safety_acknowledgements').insert({
    role: staffRoleForDb(input.staffRole),
    identifier: input.identifier,
    acknowledged_at: now,
    user_agent: input.userAgent ?? null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { acknowledgedAt: now } };
}

export async function listSafetyAcknowledgements(): Promise<
  SafetyAckResult<SafetyAcknowledgementRow[]>
> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const { data, error } = await client
    .from('safety_acknowledgements')
    .select('*')
    .order('acknowledged_at', { ascending: false });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as SafetyAcknowledgementRow[] };
}

export async function listGuestConsentsWithRules(): Promise<
  SafetyAckResult<GuestConsentRow[]>
> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const { data, error } = await client
    .from('guest_consents')
    .select('*')
    .eq('consent_rules', true)
    .order('rules_acknowledged_at', { ascending: false });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as GuestConsentRow[] };
}

export async function getRulesAckDashboard(): Promise<
  SafetyAckResult<{
    rows: RulesAckDisplayRow[];
    statsByTour: TourRulesAckStats[];
  }>
> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const [guestRes, staffRes, bookingsRes] = await Promise.all([
    listGuestConsentsWithRules(),
    listSafetyAcknowledgements(),
    client.from('bookings').select('booking_ref, name, tour_code, status'),
  ]);

  if (!guestRes.ok) return guestRes;
  if (!staffRes.ok) return staffRes;
  if (bookingsRes.error) return { ok: false, error: bookingsRes.error.message };

  const nameByRef = Object.fromEntries(
    (bookingsRes.data ?? []).map((b) => [
      String((b as { booking_ref: string }).booking_ref).toUpperCase(),
      String((b as { name: string }).name),
    ])
  );

  const rows: RulesAckDisplayRow[] = [];

  for (const g of guestRes.data) {
    if (!g.consent_rules || !g.rules_acknowledged_at) continue;
    rows.push({
      nameOrRole: nameByRef[g.booking_ref.toUpperCase()] ?? g.email ?? g.booking_ref,
      bookingRef: g.booking_ref,
      acknowledgedAt: g.rules_acknowledged_at!,
      userAgent: null,
      source: 'guest',
      tourCode: g.tour_code,
    });
  }

  for (const s of staffRes.data) {
    rows.push({
      nameOrRole: s.role === 'staff' ? 'ช่างภาพ (Staff)' : s.role === 'cohost' ? 'Co-Host' : s.role,
      bookingRef: s.identifier,
      acknowledgedAt: s.acknowledged_at,
      userAgent: s.user_agent,
      source: 'staff',
      tourCode: null,
    });
  }

  rows.sort(
    (a, b) => new Date(b.acknowledgedAt).getTime() - new Date(a.acknowledgedAt).getTime()
  );

  const activeBookings = (bookingsRes.data ?? []).filter(
    (b) => (b as { status: string }).status !== 'cancelled'
  ) as { booking_ref: string; tour_code: string }[];

  const confirmedRefs = new Set(
    guestRes.data.filter((g) => g.consent_rules).map((g) => g.booking_ref.toUpperCase())
  );

  const tourTotals: Record<string, { total: number; confirmed: number }> = {};
  for (const b of activeBookings) {
    const code = b.tour_code;
    tourTotals[code] = tourTotals[code] ?? { total: 0, confirmed: 0 };
    tourTotals[code].total += 1;
    if (confirmedRefs.has(b.booking_ref.toUpperCase())) {
      tourTotals[code].confirmed += 1;
    }
  }

  const statsByTour = Object.entries(tourTotals).map(([tour_code, v]) => ({
    tour_code,
    confirmed: v.confirmed,
    total: v.total,
  }));

  return { ok: true, data: { rows, statsByTour } };
}
