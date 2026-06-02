import type { CompanionSession, StaffRole } from './types';

const STORAGE_KEY = 't2t_companion_session';
const STAFF_ROLE_KEY = 't2t_staff_role';

export function loadCompanionSession(): CompanionSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CompanionSession;
  } catch {
    return null;
  }
}

export function saveCompanionSession(session: CompanionSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  if (session.staffRole || (session.role !== 'guest' && session.role)) {
    const staff =
      session.staffRole ?? (session.role !== 'guest' ? (session.role as StaffRole) : null);
    if (staff) sessionStorage.setItem(STAFF_ROLE_KEY, staff);
  } else {
    sessionStorage.removeItem(STAFF_ROLE_KEY);
  }
}

export function loadStaffRole(): StaffRole | null {
  if (typeof window === 'undefined') return null;
  const v = sessionStorage.getItem(STAFF_ROLE_KEY);
  if (v === 'photographer' || v === 'cohost' || v === 'owner') return v;
  return null;
}

export function clearCompanionSession(): void {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STAFF_ROLE_KEY);
}

export function companionStorageKey(feature: string): string {
  return `t2t_companion_${feature}`;
}
