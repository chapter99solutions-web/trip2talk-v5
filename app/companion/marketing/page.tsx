'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import CohostMarketingView from '@/components/companion/staff/CohostMarketingView';

export default function CompanionMarketingPage() {
  return (
    <StaffGate role="cohost">
      <CohostMarketingView />
    </StaffGate>
  );
}
