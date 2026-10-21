"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Loader2, Newspaper, RotateCw, Search, X } from "lucide-react";
import { getApiErrorMessage } from "@/errors/error-utils";
import { NewsQuery } from "@/routes/bussiness/Bussiness-Query";
import { NEWS_MAX_SIZE, type NewsArticle } from "@/types/bussiness/news-type";
import { FOCUS_RING } from "@/utils/ui-classes";

/** published_at comes as "2026-10-16 10:12:45" with no zone; read it as UTC. */
function parsePublished(value: string | null) {
  if (!value) return null;
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(value) ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function timeAgo(value: string | null) {
  const date = parsePublished(value);
  if (!date) return null;
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days < 7 ? `${days}d ago` : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ArticleCard({ article }: { article: NewsArticle }) {
  const when = timeAgo(article.published_at);
  const published = parsePublished(article.published_at);
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white transition-[border-color,box-shadow] hover:border-[#C8C6F5] hover:shadow-[0_12px_32px_rgba(91,87,230,0.08)] ${FOCUS_RING}`}
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[linear-gradient(135deg,#EEF0FF,#F6F4FF)]">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- images come from any news site, not a configured host
          <img
            src={article.image_url}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-[#A5A8F5]">
            <Newspaper className="size-8" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-[12px] text-neutral-500">
          {article.source_icon ? (
            // eslint-disable-next-line @next/next/no-img-element -- source favicon from the news provider
            <img src={article.source_icon} alt="" className="size-4 shrink-0 rounded-sm object-contain" />
          ) : null}
          <span className="truncate font-medium text-neutral-700">{article.source || "News"}</span>
          {when ? (
            <time className="shrink-0" dateTime={published?.toISOString()} title={published?.toLocaleString()}>
              · {when}
            </time>
          ) : null}
          <ArrowUpRight
            className="ms-auto size-4 shrink-0 text-neutral-400 transition-colors group-hover:text-[#5B57E6]"
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-2 line-clamp-3 text-[15px] font-semibold leading-6 text-neutral-900 group-hover:text-[#4544C9]">
          {article.title}
        </h2>
        {article.description ? (
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-neutral-500">{article.description}</p>
        ) : null}

        {article.categories?.length ? (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-3">
            {article.categories.slice(0, 3).map((category) => (
              <li key={category} className="rounded-full bg-[#F1F2FB] px-2 py-0.5 text-[11px] capitalize text-[#4544C9]">
                {category}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </a>
  );
}

/** News for the company's niche from GET /news, or for a topic the user searches. */
export default function NewsPage() {
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const news = NewsQuery({ topic, size: NEWS_MAX_SIZE });
  const data = news.data;
  const articles = data?.articles ?? [];
  const searching = Boolean(topic);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTopic(input.trim());
  };
  const clearTopic = () => {
    setInput("");
    setTopic("");
  };

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
          <Newspaper className="size-3.5" aria-hidden="true" />
          News
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
          {searching ? `News about “${topic}”` : "News for your niche"}
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
          Fresh stories you can react to, comment on or turn into a post.
        </p>

        {data?.niche?.length || data?.country ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px]">
            {!searching
              ? data?.niche?.map((term) => (
                  <span key={term} className="rounded-full bg-white px-2.5 py-1 font-medium text-[#3F3D9E] ring-1 ring-[#E3E6FF]">
                    {term}
                  </span>
                ))
              : null}
            {data?.country ? (
              <span className="rounded-full bg-white/70 px-2.5 py-1 uppercase tracking-wide text-neutral-500 ring-1 ring-[#E6E8F5]">
                {[data.country, data.language].filter(Boolean).join(" · ")}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* <form onSubmit={submit} role="search" className="mt-4 flex max-w-xl gap-2">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search news by topic</span>
            <Search
              className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Search another topic, e.g. teeth whitening"
              className="h-11 w-full rounded-full border border-[#E6E8F5] bg-white ps-10 pe-4 text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#5B57E6] focus:ring-2 focus:ring-[#5B57E6]/20"
            />
          </label>
          <button
            type="submit"
            disabled={!input.trim() || news.isFetching}
            className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#5B57E6] px-5 text-[14px] font-semibold text-white hover:bg-[#4A46D0] disabled:opacity-55 ${FOCUS_RING}`}
          >
            {news.isFetching && searching ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Search
          </button>
        </form> */}
        {searching ? (
          <button
            type="button"
            onClick={clearTopic}
            className={`mt-2 inline-flex items-center gap-1 rounded text-[13px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
          >
            <X className="size-3.5" aria-hidden="true" />
            Back to my niche
          </button>
        ) : null}
      </section>

      {data?.broadened && articles.length ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-800">
          Nothing matched exactly, so these are from a wider search.
        </p>
      ) : null}

      {news.isLoading ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="h-80 animate-pulse rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF]" />
          ))}
        </ul>
      ) : news.isError ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-[13px] text-rose-700">{getApiErrorMessage(news.error, "Could not load the news")}</p>
          <button
            type="button"
            onClick={() => void news.refetch()}
            disabled={news.isRefetching}
            className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 disabled:opacity-60 ${FOCUS_RING}`}
          >
            {news.isRefetching ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCw className="size-3.5" />}
            Try again
          </button>
        </div>
      ) : articles.length ? (
        <ul className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${news.isFetching ? "opacity-60" : ""}`}>
          {articles.map((article) => (
            <li key={article.url}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#E6E8F5] bg-white px-6 py-12 text-center">
          <Newspaper className="size-6 text-[#A5A8F5]" aria-hidden="true" />
          <p className="mt-3 text-[14px] font-semibold text-neutral-900">
            {searching ? `No news about “${topic}” right now` : "No news for your niche right now"}
          </p>
          <p className="mt-1 max-w-sm text-[13px] text-neutral-500">
            {searching ? "Try a broader topic." : "Check back later, or search a related topic above."}
          </p>
        </div>
      )}
    </main>
  );
}
