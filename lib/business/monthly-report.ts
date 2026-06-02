import { getSupabaseSafe } from '@/lib/supabase';
import type { ExtendedBookingRow } from '@/lib/companion/types';
import type { TripExpenseRow } from '@/lib/companion/types';
import type { MonthlyReportRow } from './types';
import { loadTrips } from '@/lib/trips';

export type MonthlyReportPayload = Omit<MonthlyReportRow, 'id' | 'generated_at'>;

function monthRange(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end, key: `${year}-${String(month).padStart(2, '0')}` };
}

function inRange(iso: string | undefined, start: Date, end: Date) {
  if (!iso) return false;
  const d = new Date(iso);
  return d >= start && d <= end;
}

export async function computeMonthlyReport(
  year: number,
  month: number
): Promise<MonthlyReportPayload> {
  const sb = getSupabaseSafe();
  if (!sb) throw new Error('Supabase unavailable');

  const trips = await loadTrips();
  const priceByCode = Object.fromEntries(trips.map((t) => [t.tour_code, t.price]));
  const { start, end } = monthRange(year, month);

  const { data: bookings } = await sb.from('bookings').select('*');
  const { data: expenses } = await sb.from('trip_expenses').select('*');
  const { data: stats } = await sb.from('customer_stats').select('*');

  let total_revenue_aud = 0;
  let total_bookings = 0;
  let total_guests = 0;
  const tourRevenue: Record<string, number> = {};

  for (const b of (bookings ?? []) as ExtendedBookingRow[]) {
    if (b.status !== 'confirmed') continue;
    if (!inRange(b.created_at, start, end)) continue;
    const price = priceByCode[b.tour_code] ?? 0;
    const total = price * b.seats;
    const pay = b.payment_status ?? 'unpaid';
    let recognized = 0;
    if (pay === 'paid') recognized = total;
    else if (pay === 'deposit' || pay === 'deposit_only') recognized = total * 0.3;
    total_revenue_aud += recognized;
    total_bookings += 1;
    total_guests += b.seats;
    tourRevenue[b.tour_code] = (tourRevenue[b.tour_code] ?? 0) + recognized;
  }

  let total_expenses_aud = 0;
  for (const ex of (expenses ?? []) as TripExpenseRow[]) {
    const d = ex.trip_date ?? ex.created_at;
    if (!inRange(d ?? undefined, start, end)) continue;
    total_expenses_aud += Number(ex.amount_aud) || 0;
  }

  let repeat_customers = 0;
  for (const row of stats ?? []) {
    const tb = Number((row as { total_bookings?: number }).total_bookings) || 0;
    if (tb > 1) repeat_customers += 1;
  }

  const top_tour_code =
    Object.entries(tourRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    year,
    month,
    total_revenue_aud,
    total_expenses_aud,
    net_profit_aud: total_revenue_aud - total_expenses_aud,
    total_bookings,
    total_guests,
    repeat_customers,
    top_tour_code,
    notes: null,
  };
}

export async function upsertMonthlyReport(payload: MonthlyReportPayload) {
  const sb = getSupabaseSafe();
  if (!sb) throw new Error('Supabase unavailable');
  const { data, error } = await sb
    .from('monthly_reports')
    .upsert(
      {
        ...payload,
        generated_at: new Date().toISOString(),
      },
      { onConflict: 'year,month' }
    )
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as MonthlyReportRow;
}

export function monthlyReportCsv(report: MonthlyReportRow): string {
  const monthName = new Date(report.year, report.month - 1).toLocaleString('en-AU', {
    month: 'long',
    year: 'numeric',
  });
  const lines = [
    `Trip2Talk Monthly Report - ${monthName}`,
    'Period,Revenue AUD,Expenses AUD,Net Profit,Bookings,Guests',
    `${monthName},${report.total_revenue_aud},${report.total_expenses_aud},${report.net_profit_aud},${report.total_bookings},${report.total_guests}`,
    '---',
    `Top Trip:,${report.top_tour_code ?? ''}`,
    `Repeat Customers:,${report.repeat_customers}`,
    `Generated:,${report.generated_at ?? new Date().toISOString()}`,
  ];
  return '\ufeff' + lines.join('\n');
}
