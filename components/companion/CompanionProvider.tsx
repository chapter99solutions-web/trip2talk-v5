'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  clearCompanionSession,
  loadCompanionSession,
  saveCompanionSession,
} from '@/lib/companion/session';
import type { CompanionSession } from '@/lib/companion/types';

type CompanionContextValue = {
  session: CompanionSession | null;
  ready: boolean;
  setSession: (s: CompanionSession) => void;
  logout: () => void;
};

const CompanionContext = createContext<CompanionContextValue | null>(null);

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSessionState] = useState<CompanionSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSessionState(loadCompanionSession());
    setReady(true);
  }, []);

  const setSession = useCallback((s: CompanionSession) => {
    saveCompanionSession(s);
    setSessionState(s);
  }, []);

  const logout = useCallback(() => {
    clearCompanionSession();
    setSessionState(null);
    router.replace('/companion');
  }, [router]);

  const value = useMemo(
    () => ({ session, ready, setSession, logout }),
    [session, ready, setSession, logout]
  );

  return <CompanionContext.Provider value={value}>{children}</CompanionContext.Provider>;
}

export function useCompanion() {
  const ctx = useContext(CompanionContext);
  if (!ctx) throw new Error('useCompanion must be used within CompanionProvider');
  return ctx;
}

export function useRequireCompanion() {
  const { session, ready, logout } = useCompanion();
  const router = useRouter();

  useEffect(() => {
    if (ready && !session) router.replace('/companion');
  }, [ready, session, router]);

  return { session, ready, logout };
}
