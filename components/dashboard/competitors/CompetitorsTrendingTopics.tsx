"use client";

import Card from "@/components/shared/card";

type Props = {
  topics: string[];
};

export function CompetitorsTrendingTopics({ topics }: Props) {
  return (
    <Card className="p-5">
      <h3 className="text-[15px] font-semibold text-neutral-900">Trending topics</h3>
      <p className="mt-1 text-[13px] text-neutral-500">Themes and content gaps surfacing in this market</p>

      {topics.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-[#E6E8F5] bg-[#F8F9FF] px-3 py-1.5 text-[12px] text-neutral-700"
            >
              {topic}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[13px] text-neutral-500">No trending topics yet.</p>
      )}
    </Card>
  );
}
