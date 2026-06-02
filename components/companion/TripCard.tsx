type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

/** White card container for companion screens. */
export default function TripCard({ title, subtitle, children }: Props) {
  return (
    <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark shadow-lg">
      <p className="font-semibold">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
