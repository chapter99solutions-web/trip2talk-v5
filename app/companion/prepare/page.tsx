'use client';

import PrepareView from '@/components/companion/PrepareView';
import { useRequireCompanion } from '@/components/companion/CompanionProvider';

export default function CompanionPreparePage() {
  const { session, ready } = useRequireCompanion();
  if (!ready || !session) return null;
  return <PrepareView tourCode={session.trip.tour_code} />;
}
