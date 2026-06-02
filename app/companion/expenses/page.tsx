'use client';

import { StaffGate } from '@/components/companion/StaffGate';
import ExpensesView from '@/components/companion/staff/ExpensesView';
import { useRequireCompanion } from '@/components/companion/CompanionProvider';

export default function CompanionExpensesPage() {
  const { session, ready } = useRequireCompanion();
  if (!ready || !session) return null;
  const code = session.activeTourCode ?? session.trip?.tour_code ?? 'NZ-6D5N';
  return (
    <StaffGate role="photographer">
      <ExpensesView defaultTourCode={code} />
    </StaffGate>
  );
}
