import { fetchBookings, fetchExpenses } from '@/lib/dashboard-data';
import { loadTrips } from '@/lib/trips';
import DashboardView from '@/components/DashboardView';

export default async function DashboardPage() {
  const [trips, bookings, expenses] = await Promise.all([
    loadTrips(),
    fetchBookings(),
    fetchExpenses(),
  ]);

  return (
    <DashboardView initialTrips={trips} initialBookings={bookings} initialExpenses={expenses} />
  );
}
