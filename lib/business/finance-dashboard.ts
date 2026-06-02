import { getSupabaseSafe } from '@/lib/supabase';
import type { ExtendedBookingRow } from '@/lib/companion/types';
import type { TripExpenseRow } from '@/lib/companion/types';
import type {
  FinanceDashboardData,
  MonthChartPoint,
  PendingPaymentRow,
  TripFinanceRow,
} from './types';
import { loadTrips } from '@/lib/trips';
import { computeMonthlyReport } from './monthly-report';

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function parseMonthKey(key: string) {
  const [y, m] = key.split('-').map(Number);
  return { year: y, month: m };
}

function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const trip = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  trip.setHours(0, 0, 0, 0);
  return Math.ceil((trip.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function isPendingPayment(status: string | null | undefined) {
  const p = (status ?? 'unpaid').toLowerCase();
  return p === 'pending' || p === 'unpaid' || p === 'deposit' || p === 'deposit_only';
}

export async function getFinanceDashboard(): Promise<FinanceDashboardData> {
  const sb = getSupabaseSafe();
  if (!sb) throw new Error('Supabase unavailable');

  const monthKey = currentMonthKey();
  const { year, month } = parseMonthKey(monthKey);
  const current = await computeMonthlyReport(year, month);

  const { data: stats } = await sb.from('customer_stats').select('*');
  const repeatCustomers = (stats ?? []).filter(
    (r) => Number((r as { total_bookings?: number }).total_bookings) > 1
  ).length;

  const chart: MonthChartPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const label = d.toLocaleString('en-AU', { month: 'short', year: '2-digit' });
    const snap = await computeMonthlyReport(y, m);
    chart.push({
      label,
      year: y,
      month: m,
      revenue: snap.total_revenue_aud,
      expenses: snap.total_expenses_aud,
    });
  }

  const trips = await loadTrips();
  const priceByCode = Object.fromEntries(trips.map((t) => [t.tour_code, t.price]));
  const tripDateByCode = Object.fromEntries(trips.map((t) => [t.tour_code, t.date]));

  const { data: bookings } = await sb.from('bookings').select('*');
  const { data: expenses } = await sb.from('trip_expenses').select('*');

  const monthStart = `${monthKey}-01`;
  const inCurrentMonth = (iso?: string) => !iso || iso.startsWith(monthKey);

  const byTripMap: Record<string, TripFinanceRow> = {};
  for (const b of (bookings ?? []) as ExtendedBookingRow[]) {
    if (b.status !== 'confirmed' || !inCurrentMonth(b.created_at)) continue;
    const price = priceByCode[b.tour_code] ?? 0;
    const total = price * b.seats;
    const pay = b.payment_status ?? 'unpaid';
    let rev = pay === 'paid' ? total : pay === 'deposit' || pay === 'deposit_only' ? total * 0.3 : 0;
    if (!byTripMap[b.tour_code]) {
      byTripMap[b.tour_code] = {
        tour_code: b.tour_code,
        guests: 0,
        revenue: 0,
        expenses: 0,
        profit: 0,
      };
    }
    byTripMap[b.tour_code].guests += b.seats;
    byTripMap[b.tour_code].revenue += rev;
  }

  for (const ex of (expenses ?? []) as TripExpenseRow[]) {
    const monthPrefix = monthKey;
    if (ex.trip_date) {
      if (!ex.trip_date.startsWith(monthPrefix)) continue;
    } else if (!ex.created_at?.startsWith(monthPrefix)) {
      continue;
    }
    if (!byTripMap[ex.tour_code]) {
      byTripMap[ex.tour_code] = {
        tour_code: ex.tour_code,
        guests: 0,
        revenue: 0,
        expenses: 0,
        profit: 0,
      };
    }
    byTripMap[ex.tour_code].expenses += Number(ex.amount_aud) || 0;
  }

  const byTrip = Object.values(byTripMap).map((r) => ({
    ...r,
    profit: r.revenue - r.expenses,
  }));

  const pending: PendingPaymentRow[] = [];
  for (const b of (bookings ?? []) as ExtendedBookingRow[]) {
    if (b.status === 'cancelled') continue;
    const pay = b.payment_status ?? 'unpaid';
    if (!isPendingPayment(pay) && b.status !== 'pending') continue;
    if (pay === 'paid') continue;
    const price = priceByCode[b.tour_code] ?? 0;
    const total = price * b.seats;
    const received = pay === 'deposit' || pay === 'deposit_only' ? total * 0.3 : 0;
    pending.push({
      id: b.id,
      name: b.name,
      tour_code: b.tour_code,
      amount_remaining: total - received,
      days_until_trip: daysUntil(tripDateByCode[b.tour_code]),
      payment_status: pay,
    });
  }

  return {
    currentMonth: monthKey,
    overview: {
      revenue: current.total_revenue_aud,
      expenses: current.total_expenses_aud,
      profit: current.net_profit_aud,
      totalGuests: current.total_guests,
      repeatCustomers,
    },
    chart,
    byTrip,
    pending,
  };
}
