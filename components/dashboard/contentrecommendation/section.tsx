import SharedCard from "@/components/shared/card";
import { Chip, sectionIcon } from "./chipsandsection";
import IdeaCard from "./ideacard";
import { humanize, isPrimitive } from "./utils";

function SectionHeader({
  label,
  count,
}: {
  label: string;
  count?: number;
}) {
  const Icon = sectionIcon(label);
  const title = humanize(label);

  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6] shadow-[0_4px_12px_rgba(91,87,230,0.12)]">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
        {typeof count === "number" ? (
          <p className="text-[12px] text-neutral-500">
            {count} item{count === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function Section({
  label,
  value,
  depth = 0,
}: {
  label: string;
  value: unknown;
  depth?: number;
}) {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value) && !value.length) return null;

  const title = humanize(label);

  if (isPrimitive(value)) {
    return (
      <SharedCard className="p-5 sm:p-6">
        <SectionHeader label={label} />
        <p className="whitespace-pre-line text-[13px] leading-6 text-neutral-700">
          {String(value)}
        </p>
      </SharedCard>
    );
  }

  if (Array.isArray(value) && value.every(isPrimitive)) {
    return (
      <SharedCard className="p-5 sm:p-6">
        <SectionHeader label={label} count={value.length} />
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li key={String(item)}>
              <Chip>{String(item)}</Chip>
            </li>
          ))}
        </ul>
      </SharedCard>
    );
  }

  if (Array.isArray(value)) {
    return (
      <SharedCard className="p-5 sm:p-6">
        <SectionHeader label={label} count={value.length} />
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {value.map((item, index) =>
            item && typeof item === "object" ? (
              <IdeaCard key={index} item={item as Record<string, unknown>} index={index} />
            ) : isPrimitive(item) ? (
              <li key={index} className="self-start">
                <Chip>{String(item)}</Chip>
              </li>
            ) : null,
          )}
        </ul>
      </SharedCard>
    );
  }

  if (typeof value === "object" && depth < 2) {
    const nested = Object.entries(value as Record<string, unknown>).filter(
      ([, nestedValue]) => nestedValue != null && nestedValue !== "",
    );
    if (!nested.length) return null;

    if (depth > 0) {
      return (
        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-neutral-900">{title}</p>
          {nested.map(([key, nestedValue]) => (
            <div key={key} className="rounded-xl bg-white/80 p-3 ring-1 ring-[#E6E8F5]">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-400">
                {humanize(key)}
              </p>
              {isPrimitive(nestedValue) ? (
                <p className="whitespace-pre-line text-[13px] leading-5 text-neutral-700">
                  {String(nestedValue)}
                </p>
              ) : Array.isArray(nestedValue) && nestedValue.every(isPrimitive) ? (
                <ul className="flex flex-wrap gap-2">
                  {nestedValue.map((item) => (
                    <li key={String(item)}>
                      <Chip>{String(item)}</Chip>
                    </li>
                  ))}
                </ul>
              ) : (
                <Section label={key} value={nestedValue} depth={depth + 1} />
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <SharedCard className="p-5 sm:p-6">
        <SectionHeader label={label} />
        <div className="grid gap-3 md:grid-cols-2">
          {nested.map(([key, nestedValue]) => (
            <div
              key={key}
              className="rounded-2xl border border-[#E6E8F5] bg-[linear-gradient(180deg,#F8F9FF_0%,#FFFFFF_100%)] p-4"
            >
              <Section label={key} value={nestedValue} depth={depth + 1} />
            </div>
          ))}
        </div>
      </SharedCard>
    );
  }

  return null;
}
