import type { CompanionSession, StaffRole } from './types';

export function sessionStaffRole(session: CompanionSession): StaffRole | null {
  if (session.role === 'guest') return null;
  return session.staffRole ?? (session.role as StaffRole);
}

export function isGuestSession(session: CompanionSession): boolean {
  return session.role === 'guest';
}
