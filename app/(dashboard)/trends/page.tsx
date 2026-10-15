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
  const [keyword, setKeyword] = useState("");

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

  // Narrows the lists already on screen; does not change what is fetched
  const needle = keyword.trim().toLowerCase();
  const matchesKeyword = (item: (typeof nowItems)[number]) =>
    !needle ||
    item.topic.toLowerCase().includes(needle) ||
    item.query.toLowerCase().includes(needle);

  const handleSelectTrend = (query: string) => {
    setExploreInput(query);
    setExploreQuery(query);
  };

  return (
    <main className="min-w-0 space-y-4 pb-28">
          <TopBar
            user={{ name: companyName || "" }}
            placeholder={tTop("searchTrends")}
            onSearch={(query) => {
              if (!query.trim()) return;
              setExploreInput(query);
              setExploreQuery(query.trim());
            }}
          />

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
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

          <section className="rounded-2xl border border-[#E6E8F5] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] sm:p-5">
            <TrendsFiltersBar
              geos={filters.geos}
              categories={filters.categories}
              timeRanges={filters.timeRanges}
              geo={geo}
              category={category}
              time={time}
              keyword={keyword}
              onGeoChange={setGeo}
              onCategoryChange={setCategory}
              onTimeChange={setTime}
              onKeywordChange={setKeyword}
            />
          </section>

          {queryError ? (
            <Card className="border-[#F5D0D0] bg-[#FFF7F7] p-4 text-sm text-[#B42318]">
              {t("error")}
            </Card>
          ) : null}

          <TrendsStatsRow
            items={highlightedItems}
            isLoading={nowQuery.isLoading || trendingQuery.isLoading}
            geoLabel={nowData.meta.geoLabel}
            dateLabel={nowData.meta.dateLabel}
          />

          <div className="grid items-start gap-4 lg:grid-cols-3">
            <TrendsListCard
              title={t("trendingNow")}
              subtitle={t("trendingNowSub")}
              items={nowItems.slice(0, 8).filter(matchesKeyword)}
              isLoading={nowQuery.isLoading}
              variant="trending"
              geoLabel={nowData.meta.geoLabel}
              onSelect={handleSelectTrend}
            />
            <TrendsListCard
              title={t("risingQueries")}
              subtitle={t("risingQueriesSub")}
              items={risingItems.slice(0, 8).filter(matchesKeyword)}
              isLoading={nowQuery.isLoading || trendingQuery.isLoading}
              variant="rising"
              geoLabel={nowData.meta.geoLabel}
              onSelect={handleSelectTrend}
            />
            <TrendsListCard
              title={t("topQueries")}
              subtitle={t("topQueriesSub")}
              items={nowData.topQueries.slice(0, 8).filter(matchesKeyword)}
              isLoading={nowQuery.isLoading}
              variant="top"
              geoLabel={nowData.meta.geoLabel}
              onSelect={handleSelectTrend}
            />
          </div>

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
