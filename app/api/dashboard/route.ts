import { NextResponse } from 'next/server';
import { fetchBookings, fetchExpenses } from '@/lib/dashboard-data';
import { loadTrips } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [trips, bookings, expenses] = await Promise.all([
    loadTrips(),
    fetchBookings(),
    fetchExpenses(),
  ]);
  return NextResponse.json({ trips, bookings, expenses });
}
