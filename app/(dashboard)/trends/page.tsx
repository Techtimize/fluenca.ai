"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import TopBar from "@/components/dashboard/topBar";
import TrendsExploreCard from "@/components/dashboard/trends/TrendsExploreCard";
import TrendsFiltersBar from "@/components/dashboard/trends/TrendsFiltersBar";
import TrendsListCard from "@/components/dashboard/trends/TrendsListCard";
import TrendsStatsRow from "@/components/dashboard/trends/TrendsStatsRow";
import Card from "@/components/shared/card";
import useAuthStore from "@/store/AuthsStore";
import {
  normalizeExploreData,
  normalizeNowResponse,
  normalizeTrendFilters,
  normalizeTrendItems,
  toTrendGeoParam,
} from "@/lib/trends/normalize";
import {
  GoogleTrendExploreQuery,
  GoogleTrendFiltersQuery,
  GoogleTrendNowQuery,
  GoogleTrendTrendingQuery,
} from "@/routes/bussiness/Bussiness-Query";

export default function TrendsPage() {
  const t = useTranslations("trends");
  const tTop = useTranslations("topBar");
  const companyName = useAuthStore((s) => s.company_name);
  const [geo, setGeo] = useState("US");
  const [category, setCategory] = useState("0");
  const [time, setTime] = useState("now 1-d");
  const [exploreInput, setExploreInput] = useState("");
  const [exploreQuery, setExploreQuery] = useState("");

  const filterParams = useMemo(
    () => ({
      geo: toTrendGeoParam(geo),
      category: category === "0" ? undefined : category,
      date: time,
      time,
    }),
    [geo, category, time],
  );

  const filtersQuery = GoogleTrendFiltersQuery();
  const nowQuery = GoogleTrendNowQuery(filterParams);
  const trendingQuery = GoogleTrendTrendingQuery(filterParams);
  const exploreQueryResult = GoogleTrendExploreQuery({
    ...filterParams,
    q: exploreQuery || undefined,
  });

  const filters = useMemo(
    () => normalizeTrendFilters(filtersQuery.data),
    [filtersQuery.data],
  );
  const nowData = useMemo(
    () => normalizeNowResponse(nowQuery.data),
    [nowQuery.data],
  );
  const trendingItems = useMemo(
    () => normalizeTrendItems(trendingQuery.data, "trends"),
    [trendingQuery.data],
  );
  const exploreData = useMemo(
    () => normalizeExploreData(exploreQueryResult.data),
    [exploreQueryResult.data],
  );

  const nowItems = nowData.trends;
  const risingItems =
    nowData.risingQueries.length > 0
      ? nowData.risingQueries
      : trendingItems;
  const highlightedItems =
    nowItems.length > 0
      ? nowItems
      : risingItems.length > 0
        ? risingItems
        : nowData.topQueries;

  const queryError =
    nowQuery.error ||
    trendingQuery.error ||
    filtersQuery.error ||
    exploreQueryResult.error;

  const handleSelectTrend = (query: string) => {
    setExploreInput(query);
    setExploreQuery(query);
  };

  return (
    <main className="min-w-0">
          <TopBar
            user={{ name: companyName || "" }}
            placeholder={tTop("searchTrends")}
            onSearch={(query) => {
              if (!query.trim()) return;
              setExploreInput(query);
              setExploreQuery(query.trim());
            }}
          />

          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {t("subtitle")}
              {nowData.meta.geoLabel
                ? ` Showing ${nowData.meta.geoLabel}${
                    nowData.meta.dateLabel
                      ? ` · ${nowData.meta.dateLabel}`
                      : ""
                  }.`
                : null}
            </p>
          </div>

          <Card className="mb-4 p-5 sm:p-6">
            <TrendsFiltersBar
              geos={filters.geos}
              categories={filters.categories}
              timeRanges={filters.timeRanges}
              geo={geo}
              category={category}
              time={time}
              onGeoChange={setGeo}
              onCategoryChange={setCategory}
              onTimeChange={setTime}
            />
          </Card>

          {queryError ? (
            <Card className="mb-4 border-[#F5D0D0] bg-[#FFF7F7] p-4 text-sm text-[#B42318]">
              {t("error")}
            </Card>
          ) : null}

          <TrendsStatsRow
            items={highlightedItems}
            isLoading={nowQuery.isLoading || trendingQuery.isLoading}
            geoLabel={nowData.meta.geoLabel}
            dateLabel={nowData.meta.dateLabel}
          />

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <TrendsListCard
              title={t("trendingNow")}
              subtitle={t("trendingNowSub")}
              items={nowItems.slice(0, 8)}
              isLoading={nowQuery.isLoading}
              onSelect={handleSelectTrend}
            />
            <TrendsListCard
              title={t("risingQueries")}
              subtitle={t("risingQueriesSub")}
              items={risingItems.slice(0, 8)}
              isLoading={nowQuery.isLoading || trendingQuery.isLoading}
              showRising
              onSelect={handleSelectTrend}
            />
          </div>

          {nowData.topQueries.length > 0 ? (
            <div className="mt-4">
              <TrendsListCard
                title={t("topQueries")}
                subtitle={t("topQueriesSub")}
                items={nowData.topQueries.slice(0, 8)}
                isLoading={nowQuery.isLoading}
                onSelect={handleSelectTrend}
              />
            </div>
          ) : null}

          {/* <div className="mt-4">
            <TrendsExploreCard
              query={exploreInput}
              onQueryChange={setExploreInput}
              onSubmit={() => setExploreQuery(exploreInput.trim())}
              data={exploreData}
              isLoading={exploreQueryResult.isLoading && Boolean(exploreQuery)}
              isFetching={exploreQueryResult.isFetching}
              onSelect={handleSelectTrend}
            />
          </div> */}
        </main>
  );
}
