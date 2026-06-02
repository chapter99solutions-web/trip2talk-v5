'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import OwnerTripsView from '@/components/companion/staff/OwnerTripsView';

export default function CompanionTripsAdminPage() {
  return (
    <StaffGate role="owner">
      <OwnerTripsView />
    </StaffGate>
  );
}
