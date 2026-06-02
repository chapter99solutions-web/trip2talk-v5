'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import CohostGuestsView from '@/components/companion/staff/CohostGuestsView';

export default function CompanionGuestsPage() {
  return (
    <StaffGate role="cohost">
      <CohostGuestsView />
    </StaffGate>
  );
}
