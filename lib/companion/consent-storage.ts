import { companionStorageKey } from './session';
import { CONSENT_ITEM_IDS, type ConsentItemId } from './consent-items';

const CONSENT_COMPLETE_KEY = companionStorageKey('consent_complete_v1');

export type ConsentCompletion = {
  completedAt: string;
  items: Record<ConsentItemId, boolean>;
  bookingRef?: string;
};

export function isCompanionConsentComplete(bookingRef?: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(CONSENT_COMPLETE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as ConsentCompletion;
    if (bookingRef && parsed.bookingRef && parsed.bookingRef !== bookingRef) return false;
    return CONSENT_ITEM_IDS.every((id) => parsed.items[id]);
  } catch {
    return false;
  }
}

export function saveCompanionConsentComplete(bookingRef: string) {
  const items = Object.fromEntries(CONSENT_ITEM_IDS.map((id) => [id, true])) as Record<
    ConsentItemId,
    boolean
  >;
  const payload: ConsentCompletion = {
    completedAt: new Date().toISOString(),
    items,
    bookingRef,
  };
  localStorage.setItem(CONSENT_COMPLETE_KEY, JSON.stringify(payload));
}
