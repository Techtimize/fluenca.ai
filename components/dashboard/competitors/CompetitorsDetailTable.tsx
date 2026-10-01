"use client";

import { Avatar } from "@/components/ui/Avatar";
import Card from "@/components/shared/card";
import type { CompetitorListItem } from "@/types/bussiness/competitoranalysis-type";

function formatNumber(value?: number | null) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatPercent(value?: number | null) {
  if (typeof value !== "number") return "—";
  return `${Math.round(value)}%`;
}

function formatEngagement(value?: number | null) {
  if (typeof value !== "number") return "—";
  return `${value.toFixed(2)}%`;
}

function competitorLabel(item: CompetitorListItem) {
  return item.name || item.company_name || item.username || "Competitor";
}

function competitorHandle(item: CompetitorListItem) {
  if (item.username) return item.username.startsWith("@") ? item.username : `@${item.username}`;
  return item.company_name || item.website || "—";
}

function mediaShare(item: CompetitorListItem, type: string) {
  const match = item.content_strategy?.media_types?.find(
    (entry) => (entry.type ?? "").toLowerCase() === type.toLowerCase(),
  );
  return formatPercent(match?.share_pct);
}

interface CompetitorsDetailTableProps {
  competitors: CompetitorListItem[];
}

export function CompetitorsDetailTable({ competitors }: CompetitorsDetailTableProps) {
  if (!competitors.length) {
    return (
      <Card className="p-5 sm:p-6">
        <h3 className="text-[15px] font-semibold text-neutral-900">Competitor comparison</h3>
        <p className="mt-2 text-[13px] text-neutral-500">No competitors to compare yet.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-[#E6E8F5] px-5 py-4 sm:px-6">
        <h3 className="text-[15px] font-semibold text-neutral-900">Competitor comparison</h3>
        <p className="mt-1 text-[13px] text-neutral-500">
          Followers, engagement, format mix, and match score across discovered peers.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-[#EEF0F8] text-neutral-400">
              <th className="px-5 py-3 font-medium sm:px-6">Competitor</th>
              <th className="px-3 py-3 font-medium">Followers</th>
              <th className="px-3 py-3 font-medium">Posts</th>
              <th className="px-3 py-3 font-medium">Avg. engagement</th>
              <th className="px-3 py-3 font-medium">Reels %</th>
              <th className="px-3 py-3 font-medium">Carousel %</th>
              <th className="px-3 py-3 font-medium">Image %</th>
              <th className="px-3 py-3 font-medium">Top theme</th>
              <th className="px-3 py-3 font-medium">Primary format</th>
              <th className="px-5 py-3 font-medium sm:px-6">Match</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((row, index) => {
              const name = competitorLabel(row);
              const image = row.profile_picture_url || row.image_url;
              const topTheme =
                row.content_strategy?.themes?.[0]?.theme ||
                row.content_strategy?.primary_content_category ||
                "—";
              const primaryFormat =
                row.content_strategy?.primary_format ||
                row.content_strategy?.best_performing_format?.format ||
                "—";

              return (
                <tr
                  key={`${row.username || row.name || index}`}
                  className="border-b border-[#F3F4FA] transition-colors last:border-0 hover:bg-[#F8F9FF]"
                >
                  <td className="px-5 py-3 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={name} imageUrl={image} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-800">
                          {competitorHandle(row)}
                        </p>
                        <p className="truncate text-[11px] text-neutral-400">{name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-neutral-600">{formatNumber(row.followers)}</td>
                  <td className="px-3 py-3 text-neutral-600">
                    {formatNumber(row.post_count ?? row.content_strategy?.post_count)}
                  </td>
                  <td className="px-3 py-3 font-medium text-neutral-800">
                    {formatEngagement(row.content_strategy?.avg_engagement_rate)}
                  </td>
                  <td className="px-3 py-3 text-neutral-600">{mediaShare(row, "reel")}</td>
                  <td className="px-3 py-3 text-neutral-600">{mediaShare(row, "carousel")}</td>
                  <td className="px-3 py-3 text-neutral-600">{mediaShare(row, "image")}</td>
                  <td className="px-3 py-3 text-neutral-600">{topTheme}</td>
                  <td className="px-3 py-3 text-neutral-600">{primaryFormat}</td>
                  <td className="px-5 py-3 font-medium text-[#5B57E6] sm:px-6">
                    {formatPercent(row.match_score)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
