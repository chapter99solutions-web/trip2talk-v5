'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanionConsentForm from '@/components/companion/CompanionConsentForm';
import { useRequireCompanion } from '@/components/companion/CompanionProvider';
import { isCompanionConsentComplete } from '@/lib/companion/consent-storage';

export default function CompanionOnboardingPage() {
  const router = useRouter();
  const { session, ready } = useRequireCompanion();

  useEffect(() => {
    if (!ready || !session) return;
    if (session.role !== 'guest') {
      router.replace('/companion/home');
      return;
    }
    if (isCompanionConsentComplete(session.booking.booking_ref)) {
      router.replace('/companion/home');
    }
  }, [ready, session, router]);

  if (!ready || !session) return null;

  return <CompanionConsentForm />;
}
