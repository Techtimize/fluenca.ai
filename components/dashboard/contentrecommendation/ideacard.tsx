import { Chip } from "./chipsandsection";
import { humanize, isPrimitive } from "./utils";

const TITLE_KEYS = ["title", "name", "idea", "topic", "hook", "headline", "theme", "post_type"];
const SKIP_KEYS = new Set(["platform", "priority", "channel"]);

function toDisplay(value: unknown): string {
  if (value == null) return "";
  if (isPrimitive(value)) return String(value);
  if (Array.isArray(value)) {
    return value.filter(isPrimitive).map(String).join(", ");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const primary = TITLE_KEYS.map((key) => record[key]).find(
      (item) => typeof item === "string" || typeof item === "number",
    );
    if (primary != null) return String(primary);
  }
  return "";
}

function PlatformBadge({ platform }: { platform: string }) {
  const lower = platform.toLowerCase();
  const isIg = lower.includes("instagram") || lower.includes("ig");
  const isLi = lower.includes("linkedin");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        isIg
          ? "bg-[#FCE7F3] text-[#BE185D]"
          : isLi
            ? "bg-[#E8F1FB] text-[#0A66C2]"
            : "border border-[#E6E8F5] bg-[#F6F7FD] text-neutral-700"
      }`}
    >
      {platform}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const lower = priority.toLowerCase();
  const tone =
    lower.includes("high") || lower === "1"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : lower.includes("medium") || lower === "2"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${tone}`}>
      {priority}
    </span>
  );
}

export default function IdeaCard({
  item,
  index,
}: {
  item: Record<string, unknown>;
  index: number;
}) {
  const titleKey = TITLE_KEYS.find((key) => typeof item[key] === "string");
  const title = titleKey ? String(item[titleKey]) : `Idea ${index + 1}`;

  const rows = Object.entries(item).filter(([key, value]) => {
    if (key === titleKey || SKIP_KEYS.has(key)) return false;
    if (isPrimitive(value)) return String(value).length > 0;
    if (Array.isArray(value)) return value.length > 0 && value.every(isPrimitive);
    return false;
  });

  const platform =
    typeof item.platform === "string"
      ? item.platform
      : typeof item.channel === "string"
        ? item.channel
        : null;
  const priority =
    typeof item.priority === "string" || typeof item.priority === "number"
      ? String(item.priority)
      : null;

  const descriptionRow = rows.find(([key]) =>
    ["description", "summary", "caption", "body", "content", "angle"].includes(key),
  );
  const otherRows = rows.filter(([key]) => key !== descriptionRow?.[0]).slice(0, 4);

  return (
    <li className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-shadow hover:shadow-[0_8px_28px_rgba(91,87,230,0.10)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#2E2A9E] via-[#5B57E6] to-[#818CF8]" />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[14px] font-semibold leading-5 text-neutral-900">{title}</p>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#ECEBFF] text-[12px] font-semibold text-[#5B57E6]">
            {index + 1}
          </span>
        </div>

        {(platform || priority) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {platform ? <PlatformBadge platform={platform} /> : null}
            {priority ? <PriorityBadge priority={priority} /> : null}
          </div>
        )}

        {descriptionRow ? (
          <p className="mt-3 line-clamp-4 text-[13px] leading-5 text-neutral-600">
            {toDisplay(descriptionRow[1])}
          </p>
        ) : null}

        {otherRows.length ? (
          <dl className="mt-auto space-y-2.5 border-t border-[#EEF0F8] pt-3">
            {otherRows.map(([key, value]) => (
              <div key={key}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                  {humanize(key)}
                </dt>
                <dd className="mt-0.5 text-[12px] leading-5 text-neutral-700">
                  {Array.isArray(value) && value.every(isPrimitive) ? (
                    <ul className="mt-1 flex flex-wrap gap-1.5">
                      {value.slice(0, 4).map((tag) => (
                        <li key={String(tag)}>
                          <Chip>{String(tag)}</Chip>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="line-clamp-3">{toDisplay(value)}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </li>
  );
}
