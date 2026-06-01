import { loadTrips } from '@/lib/trips';
import { listHeroSlides } from '@/lib/storage';
import HomePage from '@/components/HomePage';

export default async function Page() {
  const [trips, slides] = await Promise.all([loadTrips(), listHeroSlides()]);
  return <HomePage trips={trips} slides={slides} />;
}
