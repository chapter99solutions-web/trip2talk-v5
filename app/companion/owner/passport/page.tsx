'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import OwnerPassportView from '@/components/companion/owner/OwnerPassportView';

export default function OwnerPassportPage() {
  return (
    <StaffGate role="owner">
      <OwnerPassportView />
    </StaffGate>
  );
}
