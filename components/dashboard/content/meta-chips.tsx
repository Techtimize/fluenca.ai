export function MetaChip({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) {
    if (value == null || value === "") return null;
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-2 py-0.5 text-[10px] font-medium text-neutral-700">
        <span className="text-neutral-500">{label}</span>
        <span className="text-neutral-800">{value}</span>
      </span>
    );
  }