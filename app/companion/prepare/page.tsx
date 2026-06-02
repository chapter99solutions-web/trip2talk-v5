'use client';

import PrepareView from '@/components/companion/PrepareView';
import { useRequireCompanion } from '@/components/companion/CompanionProvider';

export default function CompanionPreparePage() {
  const { session, ready } = useRequireCompanion();
  if (!ready || !session) return null;
  const code = session.trip?.tour_code ?? session.activeTourCode;
  if (!code) {
    return <p className="p-6 text-white/60 text-center">ไม่พบทริปสำหรับหน้านี้</p>;
  }
  return <PrepareView tourCode={code} />;
}
