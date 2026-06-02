'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import OwnerCustomersView from '@/components/companion/owner/OwnerCustomersView';

export default function OwnerCustomersPage() {
  return (
    <StaffGate role="owner">
      <OwnerCustomersView />
    </StaffGate>
  );
}
