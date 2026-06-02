import { NextResponse } from 'next/server';
import { upsertMonthlyReport, computeMonthlyReport } from '@/lib/business/monthly-report';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';
    if (!isVercelCron) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const body = await request.json().catch(() => ({}));
    const now = new Date();
    const year = Number(body.year) || now.getFullYear();
    const month = Number(body.month) || now.getMonth() + 1;
    const payload = await computeMonthlyReport(year, month);
    const report = await upsertMonthlyReport(payload);
    return NextResponse.json({
      ok: true,
      report,
      summary: {
        year: report.year,
        month: report.month,
        revenue: report.total_revenue_aud,
        expenses: report.total_expenses_aud,
        profit: report.net_profit_aud,
        bookings: report.total_bookings,
        guests: report.total_guests,
        repeatCustomers: report.repeat_customers,
        topTour: report.top_tour_code,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Report generation failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'POST to generate monthly report for current month',
  });
}
