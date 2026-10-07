import SharedCard from "@/components/shared/card";
import type {
  ContentPillar,
  ContentStrategyCore,
} from "@/types/bussiness/content-recommendation-type";
import { Chip } from "./chipsandsection";
import SectionHeader from "./sectionHeader";

type Props = {
  strategy?: ContentStrategyCore;
  pillars: ContentPillar[];
  focusTopics: string[];
  businessGoals: string[];
};

export default function StrategySection({
  strategy,
  pillars,
  focusTopics,
  businessGoals,
}: Props) {
  if (
    !strategy?.primary_goal &&
    !strategy?.content_positioning &&
    !pillars.length &&
    !focusTopics.length &&
    !businessGoals.length
  ) {
    return null;
  }

  return (
    <SharedCard className="p-4">
      <SectionHeader label="strategy" />
      <div className="space-y-4">
        {strategy?.primary_goal ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
              Primary goal
            </p>
            <p className="mt-1 text-[13px] leading-5 text-neutral-700">
              {strategy.primary_goal}
            </p>
          </div>
        ) : null}

        {strategy?.content_positioning ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
              Positioning
            </p>
            <p className="mt-1 text-[13px] leading-5 text-neutral-700">
              {strategy.content_positioning}
            </p>
          </div>
        ) : null}

        {businessGoals.length ? (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
              Business goals
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {businessGoals.map((goal) => (
                <li key={goal}>
                  <Chip>{goal}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {focusTopics.length ? (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
              Focus topics
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {focusTopics.map((topic) => (
                <li key={topic}>
                  <Chip>{topic}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {pillars.length ? (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
              Content pillars
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {pillars.map((pillar, index) => (
                <li
                  key={`${pillar.name || "pillar"}-${index}`}
                  className="rounded-xl border border-[#E6E8F5] bg-[#FAFBFF] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-neutral-900">
                      {pillar.name || `Pillar ${index + 1}`}
                    </p>
                    {typeof pillar.percentage === "number" ? (
                      <span className="rounded-full bg-[#ECEBFF] px-2 py-0.5 text-[10px] font-semibold text-[#5B57E6]">
                        {pillar.percentage}%
                      </span>
                    ) : null}
                  </div>
                  {pillar.objective ? (
                    <p className="mt-1.5 text-[12px] text-neutral-600">{pillar.objective}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </SharedCard>
  );
}
