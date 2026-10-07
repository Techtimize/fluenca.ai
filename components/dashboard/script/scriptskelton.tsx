import { Skeleton } from "@/components/ui/skeleton";


export function ScriptLibrarySkeleton() {
    return (
      <section className="space-y-4" aria-busy="true" aria-live="polite">
        <div className="flex items-end justify-between gap-3 px-1">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 rounded-full bg-[#ECEBFF]" />
            <Skeleton className="h-4 w-64 rounded-full bg-[#F0F1F8]" />
          </div>
          <Skeleton className="h-4 w-20 rounded-full bg-[#F0F1F8]" />
        </div>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <li
              key={index}
              className={`overflow-hidden rounded-[24px] border border-[#E6E8F5] bg-white ${
                index === 0 ? "md:col-span-2 xl:col-span-2" : ""
              }`}
            >
              <div className="h-1 w-full bg-gradient-to-r from-[#ECEBFF] via-[#F0F1F8] to-[#ECEBFF]" />
              <div className="space-y-3 p-5">
                <div className="flex items-start gap-3">
                  <Skeleton className="size-11 rounded-2xl bg-[#ECEBFF]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-16 rounded-full bg-[#F0F1F8]" />
                    <Skeleton className="h-4 w-3/4 rounded-full bg-[#ECEBFF]" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full rounded-2xl bg-[#F8F9FF]" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full bg-[#F0F1F8]" />
                  <Skeleton className="h-6 w-16 rounded-full bg-[#F0F1F8]" />
                </div>
                <div className="flex justify-between pt-1">
                  <Skeleton className="h-7 w-28 rounded-full bg-[#F0F1F8]" />
                  <Skeleton className="h-9 w-32 rounded-full bg-[#ECEBFF]" />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="sr-only">Loading your scripts</p>
      </section>
    );
  }