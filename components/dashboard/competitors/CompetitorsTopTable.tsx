"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import Card from "@/components/shared/card";
import type { CompetitorRow } from "@/types/bussiness/dashboard";

function formatNumber(value?: number | null) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatPercent(value?: number | null) {
  if (typeof value !== "number") return "—";
  const normalized = value <= 1 ? value * 100 : value;
  return `${Math.round(normalized)}%`;
}

type Props = {
  competitors: CompetitorRow[];
};

export function CompetitorsTopTable({ competitors }: Props) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-[#E6E8F5] px-5 py-4">
        <h3 className="text-[15px] font-semibold text-neutral-900">Top competitors</h3>
        <p className="mt-1 text-[13px] text-neutral-500">
          Ranked by match and presence signals from this analysis.
        </p>
      </div>

      {competitors.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#EEF0F8] text-neutral-400">
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-3 py-3 font-medium">Competitor</th>
                <th className="px-3 py-3 font-medium">Followers</th>
                <th className="px-3 py-3 font-medium">Posts</th>
                <th className="px-3 py-3 font-medium">Engagement</th>
                <th className="px-5 py-3 font-medium">Match</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((row) => (
                <tr
                  key={`${row.handle}-${row.rank}`}
                  className="border-b border-[#F3F4FA] last:border-0 hover:bg-[#F8F9FF]"
                >
                  <td className="px-5 py-3 font-mono text-neutral-400">{row.rank}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={row.name} imageUrl={row.imageUrl} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-800">{row.handle}</p>
                        <p className="truncate text-[11px] text-neutral-400">{row.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-neutral-600">{formatNumber(row.followers)}</td>
                  <td className="px-3 py-3 text-neutral-600">{formatNumber(row.posts)}</td>
                  <td className="px-3 py-3 text-neutral-600">{row.avgEngagement.toFixed(2)}%</td>
                  <td className="px-5 py-3">
                    {typeof row.matchScore === "number" ? (
                      <Badge>{formatPercent(row.matchScore)}</Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-5 py-8 text-[13px] text-neutral-500">No competitors ranked yet.</p>
      )}
    </Card>
  );
}
