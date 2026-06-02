'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import OwnerFinanceView from '@/components/companion/staff/OwnerFinanceView';

export default function CompanionFinancePage() {
  return (
    <StaffGate role="owner">
      <OwnerFinanceView />
    </StaffGate>
  );
}
