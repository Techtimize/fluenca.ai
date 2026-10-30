"use client";

import { useState, type ReactNode } from "react";
import {
  CalendarRange,
  CheckCircle2,
  ExternalLink,
  Heart,
  Lightbulb,
  MessageCircle,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import {
  EmptyAction,
  ErrorText,
  GrowthSection,
  LABEL,
  LoadingBlock,
} from "@/components/dashboard/linkedin-growth/ui";
import { getApiErrorMessage, isApiNotFoundError } from "@/errors/error-utils";
import { StoryBankWeeklyHistoryQuery, StoryBankWeeklyQuery } from "@/routes/bussiness/Bussiness-Query";
import type { StoryBankWeeklyReport, WeeklyTopPost } from "@/types/bussiness/story-bank-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/** "2026-10-20" → "Oct 20" (dates from the API are calendar days, so read them as local). */
const shortDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return y && m && d
    ? new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : value;
};

const weekLabel = (report: Pick<StoryBankWeeklyReport, "week_start" | "week_end">) =>
  `${shortDate(report.week_start)} – ${shortDate(report.week_end)}`;

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function PlatformIcon({ platform, className = "size-3.5" }: { platform: string; className?: string }) {
  if (platform === "linkedin") return <LinkedInIcon className={`${className} text-[#0A66C2]`} />;
  if (platform === "instagram") return <InstagramIcon className={`${className} text-[#E1306C]`} />;
  return null;
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className={LABEL}>{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** What's working this week: the week's posts against the company's typical post, plus suggestions. */
export default function WeeklyReportSection() {
  // null = the latest full week (the API default).
  const [weekStart, setWeekStart] = useState<string | null>(null);
  const reportQuery = StoryBankWeeklyQuery({ week_start: weekStart });
  const historyQuery = StoryBankWeeklyHistoryQuery();
  const report = reportQuery.data;
  const history = historyQuery.data ?? [];

  // The picker lists the current report's week plus earlier ones, without duplicates.
  const weeks = [report, ...history]
    .filter((item): item is StoryBankWeeklyReport => Boolean(item))
    .filter((item, index, all) => all.findIndex((other) => other.week_start === item.week_start) === index);

  const picker = weeks.length > 1 ? (
    <label className="flex items-center gap-2 text-[12px] text-neutral-500">
      <CalendarRange className="size-3.5" aria-hidden="true" />
      <span className="sr-only">Week</span>
      <select
        value={weekStart ?? report?.week_start ?? ""}
        onChange={(event) => setWeekStart(event.target.value || null)}
        className={`h-8 rounded-full border border-[#E6E8F5] bg-white px-3 text-[12px] font-medium text-neutral-700 ${FOCUS_RING}`}
      >
        {weeks.map((week) => (
          <option key={week.week_start} value={week.week_start}>
            {weekLabel(week)}
          </option>
        ))}
      </select>
    </label>
  ) : null;

  return (
    <GrowthSection
      icon={TrendingUp}
      title="What's working this week"
      description={
        report
          ? `Your posts from ${weekLabel(report)}, compared with your typical post.`
          : "Your week's posts compared with your typical post, with suggestions for next week."
      }
      action={picker}
    >
      {reportQuery.isLoading ? (
        <LoadingBlock />
      ) : reportQuery.isError ? (
        isApiNotFoundError(reportQuery.error) ? (
          <EmptyAction text="Your weekly report shows up here once your story bank has posts. Connect Instagram or LinkedIn and keep posting." />
        ) : (
          <ErrorText>{getApiErrorMessage(reportQuery.error, "Could not load the weekly report")}</ErrorText>
        )
      ) : report ? (
        <WeeklyReport report={report} fetching={reportQuery.isFetching} />
      ) : null}
    </GrowthSection>
  );
}

function WeeklyReport({ report, fetching }: { report: StoryBankWeeklyReport; fetching: boolean }) {
  const platforms = Object.entries(report.posts_by_platform).filter(([, count]) => count > 0);
  const formats = [...report.formats].sort((a, b) => b.median_relative - a.median_relative);

  return (
    <div className={`space-y-5 transition-opacity ${fetching ? "opacity-60" : ""}`}>
      {/* The week at a glance */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-xl bg-[#F6F9FD] px-3 py-2 text-[13px] text-neutral-700">
          <span className="text-lg font-semibold text-neutral-900">{report.posts_published}</span> post
          {report.posts_published === 1 ? "" : "s"} published
        </span>
        {platforms.map(([platform, count]) => (
          <span
            key={platform}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#F6F9FD] px-3 py-2 text-[13px] text-neutral-700"
          >
            <PlatformIcon platform={platform} />
            {count} on {capitalize(platform)}
          </span>
        ))}
      </div>

      {report.posts_published === 0 && !report.whats_working.length ? (
        <EmptyAction text="No posts were published this week. Post a few times and your next report will show what's working." />
      ) : null}

      {report.whats_working.length || report.try_next.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {report.whats_working.length ? (
            <div className="rounded-2xl bg-[#F0FAF4] p-4">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#16803C]">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                What&rsquo;s working
              </p>
              <ul className="mt-2 space-y-1.5">
                {report.whats_working.map((text) => (
                  <li key={text} className="text-[13px] leading-5 text-neutral-700">
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {report.try_next.length ? (
            <div className="rounded-2xl bg-[#F4F3FF] p-4">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#4544C9]">
                <Lightbulb className="size-4" aria-hidden="true" />
                Try next week
              </p>
              <ul className="mt-2 space-y-1.5">
                {report.try_next.map((text) => (
                  <li key={text} className="text-[13px] leading-5 text-neutral-700">
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {report.top_posts.length ? (
        <Block label="Your best posts this week">
          <ul className="grid gap-2.5 md:grid-cols-2">
            {report.top_posts.map((post) => (
              <li key={post.id}>
                <TopPost post={post} />
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {report.hooks_that_work.length ? (
        <Block label="Hooks that work">
          <ul className="space-y-2.5">
            {report.hooks_that_work.map((hook, index) => (
              <li key={`${hook.pattern}-${index}`} className="flex gap-2.5">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-[#F5A70B]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-900">
                    {hook.pattern}
                    <PlatformIcon platform={hook.platform} className="size-3" />
                  </p>
                  {hook.example ? <p className="mt-0.5 text-[12px] italic text-neutral-600">“{hook.example}”</p> : null}
                  {hook.evidence ? <p className="mt-0.5 text-[11px] text-neutral-400">{hook.evidence}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {formats.length ? (
        <Block label="Formats compared with your typical post">
          <ul className="space-y-2">
            {formats.map((format) => {
              // 1.0 = typical; the bar is scaled so 2× fills it.
              const width = Math.min(100, Math.max(6, (format.median_relative / 2) * 100));
              const better = format.median_relative >= 1;
              return (
                <li key={`${format.platform}-${format.format}`} className="flex items-center gap-3 text-[12px]">
                  <span className="flex w-32 shrink-0 items-center gap-1.5 text-neutral-700">
                    <PlatformIcon platform={format.platform} className="size-3" />
                    {capitalize(format.format)}
                    <span className="text-neutral-400">({format.posts})</span>
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <span
                      className={`block h-full rounded-full ${better ? "bg-[#16A34A]" : "bg-[#F59E0B]"}`}
                      style={{ width: `${width}%` }}
                    />
                  </span>
                  <span className={`w-12 shrink-0 text-right font-semibold ${better ? "text-[#16803C]" : "text-[#B45309]"}`}>
                    {format.median_relative.toFixed(1)}×
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[11px] text-neutral-400">1.0× is your typical post; higher is better.</p>
        </Block>
      ) : null}

      {report.notes.length ? (
        <ul className="space-y-1 border-t border-[#F1F2FB] pt-3">
          {report.notes.map((note) => (
            <li key={note} className="text-[11px] leading-5 text-neutral-400">
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function TopPost({ post }: { post: WeeklyTopPost }) {
  const stats = [
    { icon: Heart, value: post.likes, label: "likes" },
    { icon: MessageCircle, value: post.comments, label: "comments" },
    { icon: Share2, value: post.shares, label: "shares" },
  ].filter((stat) => typeof stat.value === "number");

  return (
    <article className="flex h-full flex-col rounded-xl border border-[#EEF0FA] p-3">
      <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
        <PlatformIcon platform={post.platform} className="size-3" />
        <span className="capitalize">{post.format}</span>
        {post.posted_at ? <span>· {new Date(post.posted_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span> : null}
      </p>
      <p className="mt-1.5 line-clamp-3 text-[13px] leading-5 text-neutral-800">{post.hook}</p>
      {post.highlight ? (
        <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-[#16803C]">
          <TrendingUp className="size-3" aria-hidden="true" />
          {post.highlight}
        </p>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-[11px] text-neutral-500">
        {stats.map(({ icon: Icon, value, label }) => (
          <span key={label} className="inline-flex items-center gap-1" aria-label={`${value} ${label}`}>
            <Icon className="size-3" aria-hidden="true" />
            {compact.format(value as number)}
          </span>
        ))}
        {post.permalink ? (
          <a
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className={`ml-auto inline-flex items-center gap-1 rounded text-[#0A66C2] hover:underline ${FOCUS_RING}`}
          >
            View post
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
