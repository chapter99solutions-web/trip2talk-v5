import type { CompanionSession } from './types';

const STORAGE_KEY = 't2t_companion_session';

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
}

export function clearCompanionSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function companionStorageKey(feature: string): string {
  return `t2t_companion_${feature}`;
}
