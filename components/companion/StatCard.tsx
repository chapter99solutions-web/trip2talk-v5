type Props = {
  label: string;
  value: string;
  sub?: string;
};

export default function StatCard({ label, value, sub }: Props) {
  return (
    <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark shadow-lg min-w-0">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-lg font-semibold mt-1 leading-tight">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}
