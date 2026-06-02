import { sortTripsForDisplay } from '@/lib/seed-trips';
import { loadTrips } from '@/lib/trips';
import HomePage from '@/components/HomePage';
import './home-luxury.css';

export default async function Page() {
  const trips = sortTripsForDisplay(await loadTrips());
  return <HomePage trips={trips} />;
}
