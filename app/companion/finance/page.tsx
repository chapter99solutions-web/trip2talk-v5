'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** @deprecated Use /companion/owner/finance */
export default function CompanionFinanceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/companion/owner/finance');
  }, [router]);
  return null;
}
