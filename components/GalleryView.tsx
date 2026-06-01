'use client';

import { useEffect, useState } from 'react';
import { GALLERY_TABS } from '@/lib/constants';
import type { StorageImage } from '@/lib/storage';
import { useI18n } from '@/lib/i18n';

export default function GalleryView() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState('all');
  const [images, setImages] = useState<StorageImage[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/gallery?tab=${tab}`)
      .then((r) => r.json())
      .then((data: { images?: StorageImage[] }) => {
        if (!cancelled) setImages(data.images ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-serif text-3xl text-navy mb-6">{t('Gallery', 'แกลเลอรี')}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {GALLERY_TABS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setTab(g.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                tab === g.id ? 'bg-navy text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lang === 'TH' ? g.labelTh : g.labelEn}
            </button>
          ))}
        </div>
        {loading ? (
          <p className="text-slate-500">{t('Loading…', 'กำลังโหลด…')}</p>
        ) : images.length === 0 ? (
          <p className="text-slate-500">{t('No images in this folder yet.', 'ยังไม่มีรูปในโฟลเดอร์นี้')}</p>
        ) : (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {images.map((img) => (
              <button
                key={img.url}
                type="button"
                className="block w-full break-inside-avoid mb-4 rounded-xl overflow-hidden focus:ring-2 ring-navy"
                onClick={() => setLightbox(img.url)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-auto object-cover hover:opacity-95" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
