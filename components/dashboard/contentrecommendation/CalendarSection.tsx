import SharedCard from "@/components/shared/card";
import type {
  ContentCalendar,
  ContentIdea,
} from "@/types/bussiness/content-recommendation-type";
import { humanize } from "./utils";
import IdeaCard from "./ideacard";
import SectionHeader from "./sectionHeader";

export default function CalendarSection({
  calendar,
  items,
  companyId,
}: {
  calendar?: ContentCalendar;
  items: ContentIdea[];
  companyId: string;
}) {
  if (!calendar && !items.length) return null;

  const phaseEntries = Object.entries(calendar?.phases || {}).filter(
    ([, value]) => Array.isArray(value) && value.length,
  );

  return (
    <SharedCard className="p-4">
      <SectionHeader label="content_calendar" count={items.length || undefined} />

      {(calendar?.source_plan_summary ||
        calendar?.start_date ||
        calendar?.end_date ||
        calendar?.days) && (
        <div className="mb-4 space-y-2">
          {calendar?.source_plan_summary ? (
            <p className="text-[13px] leading-5 text-neutral-700">
              {calendar.source_plan_summary}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 text-[11px] text-neutral-500">
            {calendar?.start_date ? (
              <span className="rounded-full bg-[#F6F7FD] px-2.5 py-1">
                Start · {calendar.start_date}
              </span>
            ) : null}
            {calendar?.end_date ? (
              <span className="rounded-full bg-[#F6F7FD] px-2.5 py-1">
                End · {calendar.end_date}
              </span>
            ) : null}
            {typeof calendar?.days === "number" ? (
              <span className="rounded-full bg-[#F6F7FD] px-2.5 py-1">
                {calendar.days} days
              </span>
            ) : null}
            {calendar?.skip_weekends ? (
              <span className="rounded-full bg-[#F6F7FD] px-2.5 py-1">Weekends skipped</span>
            ) : null}
          </div>
        </div>
      )}

      {phaseEntries.length ? (
        <div className="space-y-4">
          {phaseEntries.map(([phaseKey, phaseItems]) => (
            <div key={phaseKey}>
              <p className="mb-2 text-[12px] font-semibold text-neutral-700">
                {humanize(phaseKey)}
                <span className="ml-1 font-normal text-neutral-400">
                  · {phaseItems.length}
                </span>
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {phaseItems.map((item, index) => (
                  <IdeaCard
                    key={`${item.id || item.title || phaseKey}-${index}`}
                    item={item}
                    index={index}
                    companyId={companyId}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : items.length ? (
        <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <IdeaCard
              key={`${item.title || item.topic || "calendar"}-${index}`}
              item={item}
              index={index}
              companyId={companyId}
            />
          ))}
        </ul>
      ) : null}
    </SharedCard>
  );
}
