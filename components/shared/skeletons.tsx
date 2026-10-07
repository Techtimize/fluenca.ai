// Loading skeletons for every page, one export per page. Each mirrors its page's real layout.
import Card from "@/components/shared/card";
import { Skeleton } from "@/components/ui/skeleton";

const BOX = "rounded-2xl border border-[#E6E8F5] bg-white";
const repeat = (count: number) => Array.from({ length: count }, (_, i) => i);

/* ------------------------------ Dashboard ------------------------------ */

function CompanyCardSkeleton() {
  return (
    <Card className="flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["w-20", "w-32", "w-28", "w-24"].map((w) => (
          <Skeleton key={w} className={`h-7 rounded-lg ${w}`} />
        ))}
      </div>
      <div className="mt-4 space-y-2.5">
        {["w-full", "w-[95%]", "w-[88%]", "w-[60%]"].map((w) => (
          <Skeleton key={w} className={`h-4 ${w}`} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-6">
        {["w-24", "w-20", "w-28"].map((w) => (
          <div key={w} className="flex items-center gap-2.5">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className={`h-4 ${w}`} />
          </div>
        ))}
      </div>
      <Skeleton className="mt-5 h-4 w-24" />
      <div className="mt-2.5 flex flex-wrap gap-3">
        {repeat(3).map((i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-[#E6E8F5] py-1.5 pl-1.5 pr-4">
            <Skeleton className="size-7 rounded-lg" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function DocumentationCardSkeleton() {
  return (
    <Card as="aside" className="flex h-full flex-col p-5">
      <Skeleton className="mb-3 h-4 w-28" />
      <ul className="flex-1 space-y-1">
        {repeat(4).map((i) => (
          <li key={i} className="flex items-center gap-3 px-2 py-2.5">
            <Skeleton className="size-9 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
          </li>
        ))}
      </ul>
      <Skeleton className="mt-4 h-11 w-full rounded-full" />
    </Card>
  );
}

function AnalyticsSectionSkeleton({ compact }: { compact: boolean }) {
  return (
    <Card className="mt-4 p-5 sm:p-6">
      <Skeleton className="h-5 w-24" />
      <div className="mt-3 flex gap-2">
        {["w-20", "w-24", "w-22"].map((w) => (
          <Skeleton key={w} className={`h-8 rounded-full ${w}`} />
        ))}
      </div>

      {/* metric cards */}
      <div className={`mt-4 grid gap-4 ${compact ? "sm:grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
        {repeat(4).map((i) => (
          <div key={i} className={`${BOX} p-4`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <Skeleton className="h-7 w-9" />
            </div>
            <Skeleton className="mt-4 h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* overall gauge + three charts */}
      <div className={`mt-4 grid gap-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
        <div className={`${BOX} p-5`}>
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-2 h-3 w-48" />
          <Skeleton className="mx-auto mt-6 h-28 w-52 rounded-t-full" />
        </div>
        <div className={`${BOX} p-5`}>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-3 w-32" />
          <div className="mt-6 space-y-4">
            {["w-full", "w-1/2", "w-2/3", "w-1/4"].map((w) => (
              <Skeleton key={w} className={`h-2.5 ${w}`} />
            ))}
          </div>
        </div>
        <div className={`${BOX} p-5`}>
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-2 h-3 w-40" />
          <div className="mt-6 flex h-32 items-end justify-around border-b border-neutral-100">
            {["h-6", "h-28", "h-10"].map((h) => (
              <Skeleton key={h} className={`w-10 rounded-b-none ${h}`} />
            ))}
          </div>
        </div>
        <div className={`${BOX} p-5`}>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-3 w-44" />
          <div className="mt-6 grid grid-cols-3 gap-1">
            {repeat(9).map((i) => (
              <Skeleton key={i} className="h-12 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DashboardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading dashboard">
      <div className={`grid gap-4 ${compact ? "" : "xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]"}`}>
        <CompanyCardSkeleton />
        {!compact ? <DocumentationCardSkeleton /> : null}
      </div>
      <AnalyticsSectionSkeleton compact={compact} />
    </div>
  );
}
