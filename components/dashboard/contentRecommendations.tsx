import Card from "@/components/shared/card";
import type { ContentRecommendationResultResponse } from "@/types/bussiness/content-recommendation-type";

// Keys that are bookkeeping, not content.
const HIDDEN_KEYS = new Set(["meta", "success", "error", "warnings", "company_id", "prompt_id", "created_at", "status"]);
const TITLE_KEYS = ["title", "name", "idea", "topic", "hook", "headline", "theme"];

const humanize = (key: string) => key.replace(/[_-]+/g, " ").replace(/^\w/, (char) => char.toUpperCase());
const isPrimitive = (value: unknown) => ["string", "number", "boolean"].includes(typeof value);

function Value({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") return null;
  if (isPrimitive(value)) return <>{String(value)}</>;
  if (Array.isArray(value)) return <>{value.filter(isPrimitive).map(String).join(", ")}</>;
  return null;
}

function ItemCard({ item }: { item: Record<string, unknown> }) {
  const titleKey = TITLE_KEYS.find((key) => typeof item[key] === "string");
  const rows = Object.entries(item).filter(
    ([key, value]) => key !== titleKey && (isPrimitive(value) || (Array.isArray(value) && value.every(isPrimitive) && value.length)),
  );

  return (
    <li className="rounded-2xl border border-[#E6E8F5] bg-white p-4">
      {titleKey ? <p className="text-[13px] font-semibold text-neutral-900">{String(item[titleKey])}</p> : null}
      <dl className="mt-2 space-y-1.5 text-[12px]">
        {rows.map(([key, value]) => (
          <div key={key}>
            <dt className="inline text-neutral-500">{humanize(key)}: </dt>
            <dd className="inline text-neutral-800">
              <Value value={value} />
            </dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

function Block({ label, value, depth = 0 }: { label: string; value: unknown; depth?: number }) {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value) && !value.length) return null;

  const heading = <h3 className={`${depth ? "text-[13px]" : "text-[15px]"} mb-3 font-semibold text-neutral-900`}>{humanize(label)}</h3>;

  if (isPrimitive(value)) {
    return (
      <div>
        {heading}
        <p className="whitespace-pre-line text-[13px] leading-6 text-neutral-700">{String(value)}</p>
      </div>
    );
  }

  if (Array.isArray(value) && value.every(isPrimitive)) {
    return (
      <div>
        {heading}
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li key={String(item)} className="rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-1 text-[12px] text-neutral-700">
              {String(item)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div>
        {heading}
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {value.map((item, index) =>
            item && typeof item === "object" ? <ItemCard key={index} item={item as Record<string, unknown>} /> : null,
          )}
        </ul>
      </div>
    );
  }

  if (typeof value === "object" && depth < 2) {
    return (
      <div>
        {heading}
        <div className="space-y-4 border-l-2 border-[#E6E8F5] pl-4">
          {Object.entries(value as Record<string, unknown>).map(([key, nested]) => (
            <Block key={key} label={key} value={nested} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function ContentRecommendations({ data }: { data: ContentRecommendationResultResponse }) {
  // Results can come back wrapped in `result`, like the other analysis endpoints.
  const content = (data.result && typeof data.result === "object" ? data.result : data) as Record<string, unknown>;
  const entries = Object.entries(content).filter(([key]) => !HIDDEN_KEYS.has(key));

  return (
    <Card className="space-y-6 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-neutral-900">Content recommendations</h2>
      {entries.length ? (
        entries.map(([key, value]) => <Block key={key} label={key} value={value} />)
      ) : (
        <p className="text-sm text-neutral-500">No recommendations returned.</p>
      )}
    </Card>
  );
}
