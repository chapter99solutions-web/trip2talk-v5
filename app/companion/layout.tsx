import type { Metadata, Viewport } from 'next';
import CompanionShell from '@/components/companion/CompanionShell';

export const metadata: Metadata = {
  title: 'Trip2Talk Companion',
  description: 'Your travel companion during the journey',
  applicationName: 'Trip2Talk Companion',
};

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function CompanionLayout({ children }: { children: React.ReactNode }) {
  return <CompanionShell>{children}</CompanionShell>;
}
