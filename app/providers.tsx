'use client';

import { I18nProvider } from '@/lib/i18n';
import AppChrome from '@/components/AppChrome';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AppChrome>{children}</AppChrome>
    </I18nProvider>
  );
}
