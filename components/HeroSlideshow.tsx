'use client';

import { useEffect, useState } from 'react';

export default function HeroSlideshow({ images }: { images: string[] }) {
  const slides = images.length ? images : [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[idx] ?? slides[0];

  return (
    <div className="absolute inset-0">
      {current ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={current} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-navy" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
    </div>
  );
}
