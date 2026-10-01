import type { Vital, VitalStatus, VitalsGroup } from "@/types/dashboard";

const STATUS: Record<VitalStatus, { text: string; bar: string; filled: number; label: string }> = {
  good: { text: "text-[#3BA61F]", bar: "bg-[#3BA61F]", filled: 4, label: "Good" },
  needs: { text: "text-[#E08A0B]", bar: "bg-[#F5A623]", filled: 3, label: "Needs improvement" },
  poor: { text: "text-[#D62839]", bar: "bg-[#D62839]", filled: 1, label: "Poor" },
};

function VitalTile({ vital }: { vital: Vital }) {
  const s = STATUS[vital.status];
  return (
    <li className="flex items-center justify-between rounded-xl bg-[#F1F4FF] px-3 py-2.5">
      <div>
        <p className="text-xs font-medium text-neutral-800">{vital.label}</p>
        <p className={`text-sm font-semibold ${s.text}`}>{vital.value}</p>
        <span className="sr-only">{s.label}</span>
      </div>
      <div className="flex flex-col gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-[4px] w-6 rounded-full ${i >= 4 - s.filled ? s.bar : "bg-[#DCDDF5]"}`} />
        ))}
      </div>
    </li>
  );
}

export default function VitalsCard({ group }: { group: VitalsGroup }) {
  return (
    <section className="rounded-2xl border border-[#E6E8F5] bg-white p-5">
      <h3 className="text-[13px] font-semibold text-neutral-900">{group.title}</h3>
      <p className="mb-4 mt-1 text-xs text-neutral-500">{group.summary}</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {group.vitals.map((v) => (
          <VitalTile key={v.id} vital={v} />
        ))}
      </ul>
    </section>
  );
}