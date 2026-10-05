import type { ContentImageItem } from "./utils";

function MetaChip({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-2 py-0.5 text-[10px] font-medium text-neutral-700">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-800">{value}</span>
    </span>
  );
}

export default function ContentImageGrid({ items }: { items: ContentImageItem[] }) {
  if (!items.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white shadow-[0_4px_18px_rgba(17,24,39,0.04)]"
        >
          <div className="relative aspect-square bg-[#F6F7FD]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnailUrl || item.imageUrl}
              alt={item.title || item.headline || "Generated content"}
              className="size-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="space-y-2 p-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-neutral-900">
                {item.title || item.headline || item.projectName || "Generated image"}
              </p>
              {item.prompt ? (
                <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-neutral-500">
                  {item.prompt}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-1">
              <MetaChip label="Platform" value={item.platform} />
              <MetaChip label="Purpose" value={item.purpose} />
              <MetaChip label="Scene" value={item.sceneNumber} />
              <MetaChip label="Status" value={item.status} />
            </div>

            <a
              href={item.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-[12px] font-medium text-[#5B57E6] hover:underline"
            >
              Open full image
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
