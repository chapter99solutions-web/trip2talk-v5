'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import CohostBookingsView from '@/components/companion/staff/CohostBookingsView';

export default function CompanionBookingsPage() {
  return (
    <StaffGate role="cohost">
      <CohostBookingsView />
    </StaffGate>
  );
}
