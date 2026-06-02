'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import OwnerManageView from '@/components/companion/staff/OwnerManageView';

export default function CompanionManagePage() {
  return (
    <StaffGate role="owner">
      <OwnerManageView />
    </StaffGate>
  );
}
