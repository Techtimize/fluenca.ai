export function StatusChip({ success, status }: { success: boolean; status?: string }) {
    const label = status || (success ? "success" : "failed");
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
          success
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
            : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
        }`}
      >
        {label}
      </span>
    );
  }