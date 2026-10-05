import type { ReactNode } from "react";
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
    <div className="mb-3 flex items-center gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 items-baseline gap-2">
        <h3 className="text-[14px] font-semibold text-neutral-900">{title}</h3>
        {typeof count === "number" ? (
          <span className="text-[12px] text-neutral-400">· {count}</span>
        ) : null}
      </div>
    </div>
  );
}

function NestedBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#E6E8F5] bg-[#FAFBFF] p-3">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
        {humanize(label)}
      </p>
      {children}
    </div>
  );
}

export default function Section({
  label,
  value,
  depth = 0,
  companyId,
}: {
  label: string;
  value: unknown;
  depth?: number;
  companyId: string;
}) {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value) && !value.length) return null;

  const isRoot = depth === 0;
  const wrap = (content: ReactNode, count?: number) =>
    isRoot ? (
      <SharedCard className="p-4">
        <SectionHeader label={label} count={count} />
        {content}
      </SharedCard>
    ) : (
      <NestedBlock label={label}>{content}</NestedBlock>
    );

  if (isPrimitive(value)) {
    return wrap(
      <p className="whitespace-pre-line text-[13px] leading-5 text-neutral-700">{String(value)}</p>,
    );
  }

  if (Array.isArray(value) && value.every(isPrimitive)) {
    return wrap(
      <ul className="flex flex-wrap gap-1.5">
        {value.map((item) => (
          <li key={String(item)}>
            <Chip>{String(item)}</Chip>
          </li>
        ))}
      </ul>,
      value.length,
    );
  }

  if (Array.isArray(value)) {
    return wrap(
      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {value.map((item, index) =>
          item && typeof item === "object" ? (
            <IdeaCard
              key={index}
              item={item as Record<string, unknown>}
              index={index}
              companyId={companyId}
            />
          ) : isPrimitive(item) ? (
            <li key={index} className="self-start">
              <Chip>{String(item)}</Chip>
            </li>
          ) : null,
        )}
      </ul>,
      value.length,
    );
  }

  if (typeof value === "object" && depth < 2) {
    const nested = Object.entries(value as Record<string, unknown>).filter(
      ([, nestedValue]) => nestedValue != null && nestedValue !== "",
    );
    if (!nested.length) return null;

    const grid = (
      <div className={`grid gap-2.5 ${isRoot ? "md:grid-cols-2" : ""}`}>
        {nested.map(([key, nestedValue]) => (
          <Section
            key={key}
            label={key}
            value={nestedValue}
            depth={depth + 1}
            companyId={companyId}
          />
        ))}
      </div>
    );

    return isRoot ? (
      <SharedCard className="p-4">
        <SectionHeader label={label} />
        {grid}
      </SharedCard>
    ) : (
      grid
    );
  }

  return null;
}
