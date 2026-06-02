'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import OwnerConsentsView from '@/components/companion/staff/OwnerConsentsView';

export default function CompanionConsentsPage() {
  return (
    <StaffGate role="owner">
      <OwnerConsentsView />
    </StaffGate>
  );
}
