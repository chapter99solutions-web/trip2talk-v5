'use client';

import { useState } from 'react';
import { TRIP_COVER_GRADIENT, normalizeCoverImageUrl, isRealTourCode, type TourCode } from '@/lib/constants';

type Props = {
  src?: string | null;
  alt: string;
  tourCode?: string;
  className?: string;
  imgClassName?: string;
};

export default function CoverImage({ src, alt, tourCode, className = '', imgClassName = '' }: Props) {
  const [failed, setFailed] = useState(false);
  const code = tourCode?.toUpperCase() ?? '';
  const gradient =
    isRealTourCode(code) ? TRIP_COVER_GRADIENT[code as TourCode] : 'from-slate-600 via-slate-700 to-slate-900';
  const resolved = normalizeCoverImageUrl(src);

  if (!resolved || failed) {
    return (
      <div
        className={`bg-gradient-to-br ${gradient} ${className}`}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className={imgClassName || className}
      onError={() => setFailed(true)}
    />
  );
}
