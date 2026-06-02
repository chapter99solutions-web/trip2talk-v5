'use server';

import { getSupabaseSafe } from '@/lib/supabase';
import type {
  BusinessAssetRow,
  BusinessPassportMetrics,
  CustomerStatRow,
  FinanceDashboardData,
  MonthlyReportRow,
  ReviewRow,
  SopDocumentRow,
} from '@/lib/business/types';
import { getFinanceDashboard } from '@/lib/business/finance-dashboard';
import {
  computeMonthlyReport,
  monthlyReportCsv,
  upsertMonthlyReport,
} from '@/lib/business/monthly-report';
import { loadTrips } from '@/lib/trips';

export type BusinessResult<T> = { ok: true; data: T } | { ok: false; error: string };

function sb() {
  return getSupabaseSafe();
}

export async function getOwnerFinanceDashboard(): Promise<BusinessResult<FinanceDashboardData>> {
  try {
    const data = await getFinanceDashboard();
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'โหลดข้อมูลไม่สำเร็จ' };
  }
}

export async function generateAndSaveMonthlyReport(
  year?: number,
  month?: number
): Promise<BusinessResult<{ report: MonthlyReportRow; csv: string }>> {
  try {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth() + 1;
    const payload = await computeMonthlyReport(y, m);
    const report = await upsertMonthlyReport(payload);
    return { ok: true, data: { report, csv: monthlyReportCsv(report) } };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'สร้างรายงานไม่สำเร็จ' };
  }
}

export async function listReviews(): Promise<BusinessResult<ReviewRow[]>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as ReviewRow[] };
}

export async function getPublishedReviews(): Promise<ReviewRow[]> {
  const client = sb();
  if (!client) return [];
  const { data } = await client
    .from('reviews')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  return (data ?? []) as ReviewRow[];
}

export async function addReview(input: {
  tour_code: string;
  guest_name: string;
  rating: number;
  review_text: string;
  booking_ref?: string;
  photo_url?: string;
}): Promise<BusinessResult<ReviewRow>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client
    .from('reviews')
    .insert({
      tour_code: input.tour_code.toUpperCase(),
      guest_name: input.guest_name,
      rating: input.rating,
      review_text: input.review_text,
      booking_ref: input.booking_ref ?? null,
      photo_url: input.photo_url ?? null,
      is_published: false,
    })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as ReviewRow };
}

export async function setReviewPublished(
  id: string,
  is_published: boolean
): Promise<BusinessResult<ReviewRow>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client
    .from('reviews')
    .update({ is_published })
    .eq('id', id)
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as ReviewRow };
}

export async function listCustomerStats(): Promise<BusinessResult<CustomerStatRow[]>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client
    .from('customer_stats')
    .select('*')
    .order('total_bookings', { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as CustomerStatRow[] };
}

export async function listBusinessAssets(): Promise<BusinessResult<BusinessAssetRow[]>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client.from('business_assets').select('*').order('asset_name');
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as BusinessAssetRow[] };
}

export async function upsertBusinessAsset(
  input: Partial<BusinessAssetRow> & {
    asset_type: string;
    asset_name: string;
  }
): Promise<BusinessResult<BusinessAssetRow>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const row = {
    asset_type: input.asset_type,
    asset_name: input.asset_name,
    description: input.description ?? null,
    estimated_value_aud: input.estimated_value_aud ?? null,
    purchase_date: input.purchase_date ?? null,
    expiry_date: input.expiry_date ?? null,
    login_hint: input.login_hint ?? null,
    notes: input.notes ?? null,
  };
  const q = input.id
    ? client.from('business_assets').update(row).eq('id', input.id)
    : client.from('business_assets').insert(row);
  const { data, error } = await q.select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as BusinessAssetRow };
}

export async function listSopDocuments(): Promise<BusinessResult<SopDocumentRow[]>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client.from('sop_documents').select('*').order('category');
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as SopDocumentRow[] };
}

export async function upsertSopDocument(input: {
  id?: string;
  category: string;
  title: string;
  content: string;
  version?: string;
}): Promise<BusinessResult<SopDocumentRow>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const row = {
    category: input.category,
    title: input.title,
    content: input.content,
    version: input.version ?? '1.0',
    last_updated: new Date().toISOString(),
  };
  const q = input.id
    ? client.from('sop_documents').update(row).eq('id', input.id)
    : client.from('sop_documents').insert(row);
  const { data, error } = await q.select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as SopDocumentRow };
}

export async function listMonthlyReports(): Promise<BusinessResult<MonthlyReportRow[]>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };
  const { data, error } = await client
    .from('monthly_reports')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as MonthlyReportRow[] };
}

export async function getBusinessPassportMetrics(): Promise<BusinessResult<BusinessPassportMetrics>> {
  const client = sb();
  if (!client) return { ok: false, error: 'ไม่สามารถเชื่อมต่อระบบได้' };

  const { data: reports } = await client.from('monthly_reports').select('*');
  const { data: reviews } = await client.from('reviews').select('rating');
  const { data: stats } = await client.from('customer_stats').select('*');

  const year = new Date().getFullYear();
  let totalTripsConducted = 0;
  let totalGuestsServed = 0;
  let revenueThisYear = 0;
  for (const r of reports ?? []) {
    const row = r as MonthlyReportRow;
    totalTripsConducted += row.total_bookings;
    totalGuestsServed += row.total_guests;
    if (row.year === year) revenueThisYear += Number(row.total_revenue_aud);
  }

  const totalCustomers = (stats ?? []).length;
  const repeatCount = (stats ?? []).filter(
    (s) => Number((s as CustomerStatRow).total_bookings) > 1
  ).length;
  const repeatCustomerRate = totalCustomers ? (repeatCount / totalCustomers) * 100 : 0;

  const ratings = (reviews ?? [])
    .map((x) => Number((x as { rating?: number }).rating))
    .filter((n) => n >= 1 && n <= 5);
  const averageRating = ratings.length
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  const trips = await loadTrips();
  const activeTripProducts = trips.filter((t) => t.max_seats > 0).length;

  return {
    ok: true,
    data: {
      totalTripsConducted,
      totalGuestsServed,
      repeatCustomerRate,
      averageRating,
      totalReviews: (reviews ?? []).length,
      activeTripProducts,
      revenueThisYear,
    },
  };
}
