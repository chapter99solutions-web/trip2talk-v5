'use client';

import { useI18n } from '@/lib/i18n';

export default function LangToggle() {
  const { lang, toggle } = useI18n();
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-white/40 bg-black/30 px-3 py-1.5 text-sm font-medium text-white backdrop-blur hover:bg-black/50"
      aria-label="Toggle language"
    >
      {lang === 'EN' ? 'TH' : 'EN'}
    </button>
  );
}
