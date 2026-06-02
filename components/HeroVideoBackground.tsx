'use client';

import { useState } from 'react';

const HERO_VIDEO_SRC =
  'https://pcqxewzzypwxfldxkcxp.supabase.co/storage/v1/object/public/Trip2Talk%20Photos/VDO/NZ/let%20go%20Nz%20again.mp4';

export default function HeroVideoBackground() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!failed ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-[#0a0a0a]" aria-hidden />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/55 via-black/25 to-[#050505]"
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.55)_100%)]"
        aria-hidden
      />
    </div>
  );
}
