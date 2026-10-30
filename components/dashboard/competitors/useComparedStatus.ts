import { useCallback } from "react";
import { TrackedCompetitorsQuery } from "@/routes/bussiness/Bussiness-Query";
import type { Competitor } from "@/types/dashboard";

const normalize = (name: string) => name.trim().toLowerCase();

/**
 * Adds `compared` / `comparedAt` from GET /competitorAnalysis/tracked to a list of competitors,
 * matched by tracked id, else by name.
 */
export function useComparedStatus() {
  const { data } = TrackedCompetitorsQuery();

  return useCallback(
    (competitors: Competitor[]): Competitor[] => {
      const tracked = data?.competitors ?? [];
      if (!tracked.length) return competitors;
      const byId = new Map(tracked.map((row) => [row.id, row]));
      const byName = new Map(tracked.map((row) => [normalize(row.name), row]));

      return competitors.map((competitor) => {
        const row = byId.get(competitor.id) ?? byName.get(normalize(competitor.name));
        return row
          ? {
              ...competitor,
              compared: row.compared,
              comparedAt: row.compared_at,
              comparisonMode: row.comparison_mode,
              comparisonVersion: row.comparison_version,
            }
          : competitor;
      });
    },
    [data],
  );
}
