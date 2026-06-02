'use client';

import { STAFF_GREETINGS } from '@/lib/companion/staff-nav';
import type { StaffRole } from '@/lib/companion/types';

export default function StaffPageHeader({
  staffRole,
  title,
  subtitle,
}: {
  staffRole: StaffRole;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="px-4 pt-6 pb-4">
      <p className="text-companion-accent text-sm font-medium">{STAFF_GREETINGS[staffRole]}</p>
      {title && <h1 className="font-serif text-2xl font-semibold mt-2">{title}</h1>}
      {subtitle && <p className="text-white/60 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
