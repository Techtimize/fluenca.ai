import Card from "@/components/shared/card";
import { Skeleton } from "@/components/ui/skeleton";

function CompanyCardSkeleton() {
  return (
    <Card className="flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="size-11 shrink-0 rounded-2xl" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="size-8 rounded-lg" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-24 rounded-lg" />
        <Skeleton className="h-7 w-16 rounded-lg" />
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[78%]" />
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <Skeleton className="h-4 w-24" />
        <div className="grid gap-2.5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#E6E8F5] bg-white p-3"
            >
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function DocumentationCardSkeleton() {
  return (
    <Card as="aside" className="flex h-full flex-col p-5">
      <Skeleton className="mb-3 h-4 w-28" />
      <ul className="flex-1 space-y-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="size-4 rounded" />
          </li>
        ))}
      </ul>
      <Skeleton className="mt-4 h-11 w-full rounded-full" />
    </Card>
  );
}

function AnalyticsSectionSkeleton() {
  return (
    <Card className="mt-4 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="size-7 rounded-md" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-22 rounded-full" />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#E6E8F5] bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="size-4 rounded" />
            </div>
            <Skeleton className="mt-4 h-8 w-16" />
            <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mx-auto mt-6 size-36 rounded-full" />
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
            <Skeleton className="h-4 w-40" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
          <div className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-4 h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function DashboardSkeleton({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div
        className={`grid gap-4 ${compact ? "" : "xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]"}`}
      >
        <CompanyCardSkeleton />
        {!compact ? <DocumentationCardSkeleton /> : null}
      </div>
      <AnalyticsSectionSkeleton />
    </div>
  );
}
