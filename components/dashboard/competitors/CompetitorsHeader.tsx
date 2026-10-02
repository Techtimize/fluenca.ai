"use client";

type Props = {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
};

export function CompetitorsHeader({ title, subtitle, lastUpdated }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-neutral-500">{subtitle}</p> : null}
      </div>
      {lastUpdated ? (
        <p className="rounded-full border border-[#E6E8F5] bg-white px-3 py-1.5 text-[12px] text-neutral-500">
          Updated {lastUpdated}
        </p>
      ) : null}
    </div>
  );
}
