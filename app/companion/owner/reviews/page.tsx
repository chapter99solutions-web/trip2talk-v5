'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import OwnerReviewsView from '@/components/companion/owner/OwnerReviewsView';

export default function OwnerReviewsPage() {
  return (
    <StaffGate role="owner">
      <OwnerReviewsView />
    </StaffGate>
  );
}
