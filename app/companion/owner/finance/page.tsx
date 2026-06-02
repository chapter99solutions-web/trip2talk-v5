'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import OwnerFinanceDashboard from '@/components/companion/owner/OwnerFinanceDashboard';

export default function OwnerFinancePage() {
  return (
    <StaffGate role="owner">
      <OwnerFinanceDashboard />
    </StaffGate>
  );
}
