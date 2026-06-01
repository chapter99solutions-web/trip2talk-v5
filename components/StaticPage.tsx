'use client';

import SiteHeader from './SiteHeader';
import { useI18n } from '@/lib/i18n';

type Props = {
  titleEn: string;
  titleTh: string;
  children: React.ReactNode;
};

export default function StaticPage({ titleEn, titleTh, children }: Props) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <h1 className="font-serif text-3xl text-navy mb-6">{t(titleEn, titleTh)}</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">{children}</div>
      </main>
    </div>
  );
}
