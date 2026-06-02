'use client';

type Props = {
  id: string;
  label: string;
  labelTh?: string;
  checked: boolean;
  onToggle: (id: string) => void;
};

export default function ChecklistItem({ id, label, labelTh, checked, onToggle }: Props) {
  return (
    <label className="flex items-start gap-3 rounded-xl bg-companion-card p-3 text-companion-text-dark cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(id)}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-companion-accent focus:ring-companion-accent"
      />
      <span className="text-sm leading-snug">
        <span className="block font-medium">{labelTh ?? label}</span>
        {labelTh && <span className="block text-xs text-slate-500 mt-0.5">{label}</span>}
      </span>
    </label>
  );
}
