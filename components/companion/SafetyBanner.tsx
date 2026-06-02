type Props = {
  children: React.ReactNode;
  variant?: 'warning' | 'info';
};

export default function SafetyBanner({ children, variant = 'warning' }: Props) {
  const styles =
    variant === 'warning'
      ? 'bg-amber-500/15 border-amber-500/40 text-amber-100'
      : 'bg-companion-accent/15 border-companion-accent/40 text-companion-accent';

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${styles}`}>{children}</div>
  );
}
