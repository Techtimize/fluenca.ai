import { Loader2 } from "lucide-react";
import type { BlogPostStatus } from "@/types/bussiness/blog-type";

const STYLES: Record<BlogPostStatus, string> = {
  queued: "bg-amber-50 text-amber-700 ring-amber-100",
  writing: "bg-indigo-50 text-[#5B57E6] ring-indigo-100",
  ready: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  failed: "bg-rose-50 text-rose-700 ring-rose-100",
};

const LABELS: Record<BlogPostStatus, string> = {
  queued: "Queued",
  writing: "Writing",
  ready: "Ready",
  failed: "Failed",
};

export function BlogStatusChip({ status }: { status: BlogPostStatus }) {
  const busy = status === "queued" || status === "writing";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${STYLES[status]}`}
    >
      {busy ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : null}
      {LABELS[status]}
    </span>
  );
}
