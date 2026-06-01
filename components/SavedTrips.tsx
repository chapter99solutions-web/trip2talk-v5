'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteHeader from './SiteHeader';
import { useI18n } from '@/lib/i18n';

const STORAGE_KEY = 't2t_saved_trips';

export function saveTripCode(code: string) {
  if (typeof window === 'undefined') return;
  const existing = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[]);
  existing.add(code.toUpperCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing]));
}

export default function SavedTrips() {
  const { t } = useI18n();
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    try {
      setCodes(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
      setCodes([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <h1 className="font-serif text-3xl text-navy mb-6">{t('Saved trips', 'ทริปที่บันทึก')}</h1>
        {codes.length === 0 ? (
          <p className="text-slate-500">{t('No saved trips yet. Open a trip and bookmark it from the detail page.', 'ยังไม่มีทริปที่บันทึก')}</p>
        ) : (
          <ul className="space-y-2">
            {codes.map((code) => (
              <li key={code}>
                <Link href={`/trips/${code}`} className="text-navy font-medium hover:underline">
                  {code}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8 text-sm text-slate-500">
          <Link href="/#trips" className="text-emerald-700 hover:underline">
            {t('Browse all trips', 'ดูทริปทั้งหมด')}
          </Link>
        </p>
      </main>
    </div>
  );
}
