"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  ExternalLink,
  Globe2,
  Heart,
  ImageIcon,
  Lightbulb,
  MessageCircle,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import ApiNotFoundCard from "@/components/notfound";
import Card from "@/components/shared/card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import type {
  CompetitiveBriefCompetitor,
  CompetitiveBriefComparison,
  CompetitiveBriefEmployee,
  CompetitiveBriefGapItem,
  CompetitiveBriefInstagramPost,
  CompetitiveBriefInstagramProfile,
  CompetitiveBriefLinkedInComparison,
  CompetitiveBriefOpportunityItem,
  CompetitiveBriefPositioning,
  CompetitiveBriefRecommendedAction,
  CompetitiveBriefWebsiteComparison,
  CompetitiveBriefWebsiteProfile,
  CompetitorsListResponse,
} from "@/types/bussiness/competitoranalysis-type";
import Image from "next/image";
import { FOCUS_RING } from "@/utils/ui-classes";

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-2.5 py-1 text-[11px] font-medium text-neutral-700">
      {children}
    </span>
  );
}

function ChipList({ items }: { items?: string[] | null }) {
  const labels = (items ?? []).filter(Boolean);
  if (!labels.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {labels.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

function formatCompact(value?: number | null) {
  if (typeof value !== "number") return null;
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function StatPill({ label, value }: { label: string; value?: number | null }) {
  const formatted = formatCompact(value);
  if (!formatted) return null;
  return (
    <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-[#E6E8F5]">
      <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-neutral-400">{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold tabular-nums text-neutral-900">{formatted}</p>
    </div>
  );
}

function Section({
  title,
  description,
  icon: Icon,
  children,
  aside,
}: {
  title: string;
  description?: string;
  icon?: typeof Target;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[#E6E8F5] bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon ? (
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
              <Icon className="size-4" aria-hidden="true" />
            </span>
          ) : null}
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">{title}</h3>
            {description ? (
              <p className="mt-1 max-w-2xl text-[13px] leading-5 text-neutral-500">{description}</p>
            ) : null}
          </div>
        </div>
        {aside}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PlatformIcon({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <Image src={src} alt={alt} className="size-3.5 object-contain" width={14} height={14} />
  );
}

function LinkPill({
  href,
  label,
  iconSrc,
}: {
  href?: string | null;
  label: string;
  iconSrc?: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#5B57E6] ring-1 ring-[#E6E8F5] transition-colors hover:bg-[#F6F7FD] ${FOCUS_RING}`}
    >
      {iconSrc ? (
        <PlatformIcon src={iconSrc} alt="" />
      ) : (
        <ExternalLink className="size-3" aria-hidden="true" />
      )}
      {label}
    </a>
  );
}

function positioningText(
  value?: string | CompetitiveBriefPositioning | null,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.primary_message || "";
}

function isBriefCompetitor(item: unknown): item is CompetitiveBriefCompetitor {
  if (!item || typeof item !== "object") return false;
  const record = item as Record<string, unknown>;
  return (
    "why_competitor" in record ||
    "what_they_sell" in record ||
    "who_they_target" in record ||
    "links" in record
  );
}

function asGapList(value: unknown): CompetitiveBriefGapItem[] {
  return Array.isArray(value) ? (value as CompetitiveBriefGapItem[]) : [];
}

function CompetitorCards({
  competitors,
  instagramPosts,
  competitorsInstagram,
}: {
  competitors: CompetitiveBriefCompetitor[];
  instagramPosts: CompetitiveBriefInstagramPost[];
  competitorsInstagram?: CompetitiveBriefInstagramProfile[];
}) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {competitors.map((item, index) => {
        const pitch =
          positioningText(item.positioning) || item.website?.positioning || "";
        const sells =
          item.what_they_sell ||
          item.offers?.core_offers ||
          item.website?.products ||
          item.website?.services ||
          [];
        const targets =
          item.who_they_target ||
          item.target_audience ||
          (item.website?.target_audience
            ? item.website.target_audience.split(/,\s*/)
            : []);
        const nameKey = (item.name || "").toLowerCase();
        const userKey = (item.username || "").replace(/^@/, "").toLowerCase();

        const igProfile = (competitorsInstagram || []).find((profile) => {
          const profileName = (profile.name || "").toLowerCase();
          const profileUser = (profile.username || "").replace(/^@/, "").toLowerCase();
          return (
            (nameKey && profileName === nameKey) ||
            (userKey && profileUser === userKey)
          );
        });

        const avatarUrl =
          item.profile_picture_url ||
          item.image_url ||
          item.links?.instagram?.profile_picture_url ||
          igProfile?.profile_picture_url;
        const handle =
          item.username ||
          item.links?.instagram?.username ||
          igProfile?.username;
        const handleLabel = handle
          ? handle.startsWith("@")
            ? handle
            : `@${handle}`
          : null;
        const instagramHref =
          item.links?.instagram?.url ||
          item.profile_url ||
          igProfile?.profile_url;
        const profileHref =
          instagramHref || item.links?.website?.url || item.website?.url;
        const followers =
          item.followers ??
          item.links?.instagram?.followers ??
          igProfile?.followers;
        const following =
          item.following ??
          item.links?.instagram?.following ??
          igProfile?.following;
        const posts =
          item.posts_count ??
          item.media_count ??
          item.links?.instagram?.media_count ??
          igProfile?.posts_count ??
          igProfile?.media_count;
        const hasIgStats =
          typeof followers === "number" ||
          typeof following === "number" ||
          typeof posts === "number";
        const linkedinFollowers =
          item.linkedin_followers ?? item.links?.linkedin?.followers;
        const linkedinEmployees =
          item.linkedin_total_employees ??
          item.employee_count ??
          item.links?.linkedin?.total_employees;
        const linkedinCompanySize =
          item.linkedin_company_size || item.links?.linkedin?.company_size;
        const hasLinkedInStats =
          typeof linkedinFollowers === "number" ||
          typeof linkedinEmployees === "number" ||
          Boolean(linkedinCompanySize);

        const competitorPosts =
          (item.posts?.length ? item.posts : null) ||
          (igProfile?.posts?.length ? igProfile.posts : null) ||
          instagramPosts.filter((post) => {
            const postName = (post.competitor_name || "").toLowerCase();
            const postUser = (post.username || "").replace(/^@/, "").toLowerCase();
            return (
              (nameKey && postName === nameKey) ||
              (userKey && postUser === userKey) ||
              (userKey && postName.includes(userKey))
            );
          });

        const website = item.website;
        const employees = item.employees || [];
        const linkedinHref = item.linkedin_url || item.links?.linkedin?.url;
        const websiteHref = website?.url || item.links?.website?.url;

        return (
          <li key={`${item.name || "competitor"}-${index}`}>
            <article className="flex h-full flex-col rounded-[22px] border border-[#E6E8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFBFF_100%)] p-5">
              <div className="flex items-start gap-3">
                <Avatar name={item.name || "Competitor"} imageUrl={avatarUrl} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="truncate text-[16px] font-semibold tracking-tight text-neutral-900">
                      {item.name || "Competitor"}
                    </h4>
                    {handleLabel ? (
                      profileHref ? (
                        <a
                          href={profileHref}
                          target="_blank"
                          rel="noreferrer"
                          className={`truncate text-[12px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
                        >
                          {handleLabel}
                        </a>
                      ) : (
                        <span className="truncate text-[12px] text-neutral-500">{handleLabel}</span>
                      )
                    ) : null}
                    {item.is_hiring === true ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-emerald-700">
                        Hiring
                      </span>
                    ) : null}
                  </div>
                  {pitch ? (
                    <p className="mt-2 text-[13px] leading-5 text-neutral-600">{pitch}</p>
                  ) : website?.description ? (
                    <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-neutral-600">
                      {website.description}
                    </p>
                  ) : null}
                </div>
              </div>

              {hasIgStats ? (
                <div className="mt-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                    <PlatformIcon src="/assets/insta.png" alt="" />
                    Instagram
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <StatPill label="Followers" value={followers} />
                    <StatPill label="Following" value={following} />
                    <StatPill label="Posts" value={posts} />
                  </div>
                </div>
              ) : null}

              {hasLinkedInStats ? (
                <div className={hasIgStats ? "mt-3" : "mt-4"}>
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                    <PlatformIcon src="/assets/linkedin.png" alt="" />
                    LinkedIn
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <StatPill label="Followers" value={linkedinFollowers} />
                    <StatPill label="Employees" value={linkedinEmployees} />
                    {linkedinCompanySize ? (
                      <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-[#E6E8F5]">
                        <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-neutral-400">
                          Size
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[12px] font-semibold text-neutral-900">
                          {linkedinCompanySize}
                        </p>
                      </div>
                    ) : website?.business_model ? (
                      <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-[#E6E8F5]">
                        <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-neutral-400">
                          Model
                        </p>
                        <p className="mt-0.5 truncate text-[12px] font-semibold text-neutral-900">
                          {website.business_model}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : !hasIgStats && (website?.pricing_model || website?.business_model) ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {website?.business_model ? (
                    <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-[#E6E8F5]">
                      <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-neutral-400">
                        Model
                      </p>
                      <p className="mt-0.5 truncate text-[12px] font-semibold text-neutral-900">
                        {website.business_model}
                      </p>
                    </div>
                  ) : null}
                  {website?.pricing_model ? (
                    <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-[#E6E8F5]">
                      <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-neutral-400">
                        Pricing
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[12px] font-semibold text-neutral-900">
                        {website.pricing_model}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {item.why_competitor ? (
                <p className="mt-4 rounded-2xl bg-[#F6F7FD] px-3.5 py-3 text-[13px] leading-5 text-neutral-700">
                  {item.why_competitor}
                </p>
              ) : null}

              {sells.length ? (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                    What they sell
                  </p>
                  <ChipList items={sells.slice(0, 6)} />
                </div>
              ) : null}

              {targets.length ? (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                    Who they target
                  </p>
                  <ChipList items={targets} />
                </div>
              ) : null}

              {website?.technologies?.length || website?.industries?.length ? (
                <div className="mt-4 space-y-3">
                  {website.technologies?.length ? (
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                        Technologies
                      </p>
                      <ChipList items={website.technologies} />
                    </div>
                  ) : null}
                  {website.industries?.length ? (
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                        Industries
                      </p>
                      <ChipList items={website.industries} />
                    </div>
                  ) : null}
                </div>
              ) : null}

              {employees.length ? (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                    Leadership
                  </p>
                  <ul className="space-y-2">
                    {employees.slice(0, 3).map((employee, empIndex) => (
                      <li key={`${employee.name}-${empIndex}`}>
                        <EmployeeRow employee={employee} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <LinkPill
                  href={websiteHref}
                  label="Website"
                  iconSrc="/assets/globe.png"
                />
                <LinkPill
                  href={linkedinHref}
                  label="LinkedIn"
                  iconSrc="/assets/linkedin.png"
                />
                <LinkPill
                  href={instagramHref}
                  label={handleLabel || "Instagram"}
                  iconSrc="/assets/insta.png"
                />
              </div>

              {competitorPosts.length ? (
                <div className="mt-auto pt-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                      Instagram content
                    </p>
                    <span className="text-[11px] text-neutral-400">
                      {competitorPosts.length} post{competitorPosts.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="-mx-1 overflow-x-auto pb-1 [scrollbar-width:thin]">
                    <ul className="flex w-max gap-2 px-1">
                      {competitorPosts.map((post, postIndex) => {
                        const image = post.thumbnail_url || post.media_url;
                        return (
                          <li
                            key={`${post.permalink || post.id || postIndex}`}
                            className="w-[132px] shrink-0"
                          >
                            <article className="overflow-hidden rounded-xl border border-[#E6E8F5] bg-white">
                              <a
                                href={post.permalink || undefined}
                                target={post.permalink ? "_blank" : undefined}
                                rel={post.permalink ? "noreferrer" : undefined}
                                className={`block ${FOCUS_RING}`}
                              >
                                <div className="relative aspect-square bg-[#F3F4F8]">
                                  {image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={image}
                                      alt={
                                        post.caption?.slice(0, 60) ||
                                        post.competitor_name ||
                                        "Instagram post"
                                      }
                                      className="size-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="grid size-full place-items-center text-neutral-300">
                                      <ImageIcon className="size-5" aria-hidden="true" />
                                    </div>
                                  )}
                                  {post.media_type ? (
                                    <span className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.04em] text-neutral-700 backdrop-blur">
                                      {post.media_type}
                                    </span>
                                  ) : null}
                                </div>
                              </a>
                              <div className="space-y-1 p-2">
                                {post.caption ? (
                                  <p className="line-clamp-2 text-[10px] leading-3.5 text-neutral-600">
                                    {post.caption}
                                  </p>
                                ) : null}
                                <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                                  <span className="inline-flex items-center gap-0.5">
                                    <Heart className="size-2.5" aria-hidden="true" />
                                    {post.likes ?? 0}
                                  </span>
                                  <span className="inline-flex items-center gap-0.5">
                                    <MessageCircle className="size-2.5" aria-hidden="true" />
                                    {post.comments ?? 0}
                                  </span>
                                </div>
                              </div>
                            </article>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ) : null}
            </article>
          </li>
        );
      })}
    </ul>
  );
}

function RecommendedActionsPanel({
  actions,
}: {
  actions: CompetitiveBriefRecommendedAction[];
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#E6E8F5] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <div className="relative border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-5 py-5 sm:px-6">
        <span
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#5B57E6] via-[#8B87F0] to-[#C4C2FF]"
          aria-hidden="true"
        />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-[16px] font-semibold tracking-tight text-neutral-900">
                Recommended actions
              </h3>
              <p className="mt-1 text-[13px] text-neutral-500">
                Concrete next steps with why and how.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#ECEBFF] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[#5B57E6]">
            {actions.length} action{actions.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <ol className="grid gap-4 p-4 sm:p-5 lg:grid-cols-3">
        {actions.map((item, index) => (
          <li key={`${item.action}-${index}`} className="min-w-0">
            <article className="flex h-full flex-col rounded-[20px] border border-[#E6E8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFBFF_100%)] p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#5B57E6] text-[13px] font-bold leading-none text-white shadow-[0_6px_16px_rgba(91,87,230,0.28)]">
                  {index + 1}
                </span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {item.impact ? (
                    <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#047857]">
                      Impact · {item.impact}
                    </span>
                  ) : null}
                  {item.effort ? (
                    <span className="rounded-full bg-[#FFF7ED] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#C2410C]">
                      Effort · {item.effort}
                    </span>
                  ) : null}
                </div>
              </div>

              <h4 className="mt-3 text-[14px] font-semibold leading-5 tracking-tight text-neutral-900">
                {item.action}
              </h4>

              <div className="mt-4 flex flex-1 flex-col gap-2.5">
                {item.why ? (
                  <div className="rounded-xl border border-[#E6E8F5] bg-white px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5B57E6]">
                      Why
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-neutral-600">{item.why}</p>
                  </div>
                ) : null}
                {item.how ? (
                  <div className="rounded-xl border border-[#D8D6F5] bg-[#F6F5FF] px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5B57E6]">
                      How
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-neutral-700">{item.how}</p>
                  </div>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

function InsightsTrio({
  problems,
  problemSummary,
  gaps,
  opportunities,
}: {
  problems: Array<{
    problem?: string;
    why_it_matters?: string;
    competitors_involved?: string[];
  }>;
  problemSummary?: string;
  gaps: CompetitiveBriefGapItem[];
  opportunities: CompetitiveBriefOpportunityItem[];
}) {
  const columns = [
    {
      key: "problems",
      title: "Customer problems",
      subtitle: "Where buyers feel friction",
      icon: AlertTriangle,
      accent: {
        header: "from-[#FFF4ED] to-[#FFFBF7]",
        iconBg: "bg-[#FFE8D9] text-[#C2410C]",
        badge: "bg-[#FFF1E8] text-[#C2410C]",
        bar: "bg-[#FB923C]",
      },
      count: problems.length,
      body: (
        <>
          {problemSummary ? (
            <p className="mb-3 rounded-xl bg-white/80 px-3 py-2.5 text-[12px] leading-5 text-neutral-600 ring-1 ring-[#F3E7DC]">
              {problemSummary}
            </p>
          ) : null}
          {problems.length ? (
            <ul className="space-y-2.5">
              {problems.map((item, index) => (
                <li
                  key={`${item.problem}-${index}`}
                  className="rounded-xl border border-[#F3E7DC] bg-white p-3.5 shadow-[0_1px_0_rgba(15,23,42,0.02)]"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-[#FFF1E8] text-[11px] font-semibold text-[#C2410C]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold leading-5 text-neutral-900">
                        {item.problem}
                      </p>
                      {item.why_it_matters ? (
                        <p className="mt-1.5 text-[12px] leading-5 text-neutral-600">
                          {item.why_it_matters}
                        </p>
                      ) : null}
                      {item.competitors_involved?.length ? (
                        <div className="mt-2.5">
                          <ChipList items={item.competitors_involved} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-[12px] text-neutral-400">
              No customer problems flagged.
            </p>
          )}
        </>
      ),
    },
    {
      key: "gaps",
      title: "Competitive gaps",
      subtitle: "Openings in messaging & proof",
      icon: Target,
      accent: {
        header: "from-[#ECEBFF] to-[#F8F7FF]",
        iconBg: "bg-[#E0DEFF] text-[#5B57E6]",
        badge: "bg-[#ECEBFF] text-[#5B57E6]",
        bar: "bg-[#5B57E6]",
      },
      count: gaps.length,
      body: gaps.length ? (
        <ul className="space-y-2.5">
          {gaps.map((gap, index) => (
            <li
              key={`${gap.gap}-${index}`}
              className="rounded-xl border border-[#E6E8F5] bg-white p-3.5 shadow-[0_1px_0_rgba(15,23,42,0.02)]"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-[#ECEBFF] text-[11px] font-semibold text-[#5B57E6]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-5 text-neutral-900">
                    {gap.gap}
                  </p>
                  {gap.evidence ? (
                    <p className="mt-1.5 text-[12px] leading-5 text-neutral-600">
                      {gap.evidence}
                    </p>
                  ) : null}
                  {gap.competitors_involved?.length ? (
                    <div className="mt-2.5">
                      <ChipList items={gap.competitors_involved} />
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-[12px] text-neutral-400">
          No competitive gaps found.
        </p>
      ),
    },
    {
      key: "opportunities",
      title: "Opportunities",
      subtitle: "How to turn gaps into moves",
      icon: Lightbulb,
      accent: {
        header: "from-[#ECFDF5] to-[#F7FFFB]",
        iconBg: "bg-[#D1FAE5] text-[#047857]",
        badge: "bg-[#ECFDF5] text-[#047857]",
        bar: "bg-[#34D399]",
      },
      count: opportunities.length,
      body: opportunities.length ? (
        <ul className="space-y-2.5">
          {opportunities.map((item, index) => (
            <li
              key={`${item.opportunity}-${index}`}
              className="rounded-xl border border-[#D1FAE5] bg-white p-3.5 shadow-[0_1px_0_rgba(15,23,42,0.02)]"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-[#ECFDF5] text-[11px] font-semibold text-[#047857]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-5 text-neutral-900">
                    {item.opportunity}
                  </p>
                  {item.why_it_matters || item.why ? (
                    <p className="mt-1.5 text-[12px] leading-5 text-neutral-600">
                      {item.why_it_matters || item.why}
                    </p>
                  ) : null}
                  {item.gap ? (
                    <p className="mt-2 rounded-lg bg-[#F6F7FD] px-2.5 py-2 text-[11px] leading-4 text-neutral-500">
                      <span className="font-semibold text-neutral-700">From gap: </span>
                      {item.gap}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-[12px] text-neutral-400">
          No opportunities listed.
        </p>
      ),
    },
  ] as const;

  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
      {columns.map((column) => {
        const Icon = column.icon;
        return (
          <article
            key={column.key}
            className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#E6E8F5] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]"
          >
            <div
              className={`relative border-b border-[#EEF0F8] bg-gradient-to-br ${column.accent.header} px-4 py-4`}
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 ${column.accent.bar}`}
                aria-hidden="true"
              />
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-2xl ${column.accent.iconBg}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
                      {column.title}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-neutral-500">{column.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums ${column.accent.badge}`}
                >
                  {column.count}
                </span>
              </div>
            </div>
            <div className="max-h-[420px] flex-1 overflow-y-auto p-3.5 [scrollbar-width:thin]">
              {column.body}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function EmployeeRow({ employee }: { employee: CompetitiveBriefEmployee }) {
  const title = employee.title || employee.designation;
  const content = (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#ECEBFF] text-[#5B57E6]">
        <Briefcase className="size-3.5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-neutral-900">
          {employee.name || "Team member"}
        </p>
        {title ? (
          <p className="truncate text-[11px] text-neutral-500">{title}</p>
        ) : null}
      </div>
    </div>
  );

  if (employee.linkedin_url) {
    return (
      <a
        href={employee.linkedin_url}
        target="_blank"
        rel="noreferrer"
        className={`block rounded-xl border border-[#E6E8F5] bg-white px-3 py-2 transition-colors hover:bg-[#F8F9FF] ${FOCUS_RING}`}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="rounded-xl border border-[#E6E8F5] bg-white px-3 py-2">{content}</div>
  );
}

function WebsiteIntelCards({
  profiles,
}: {
  profiles: Array<CompetitiveBriefWebsiteProfile & { name?: string }>;
}) {
  if (!profiles.length) return null;
  return (
    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {profiles.map((item, index) => (
        <li
          key={`${item.name || item.url || "site"}-${index}`}
          className="rounded-2xl border border-[#E6E8F5] bg-white p-4"
        >
          <div className="flex items-start gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
              <Building2 className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-neutral-900">
                {item.name || "Company"}
              </p>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-0.5 inline-flex truncate text-[12px] text-[#5B57E6] hover:underline ${FOCUS_RING}`}
                >
                  {item.url.replace(/^https?:\/\//, "")}
                </a>
              ) : null}
            </div>
          </div>
          {item.description ? (
            <p className="mt-3 line-clamp-3 text-[12px] leading-5 text-neutral-600">
              {item.description}
            </p>
          ) : null}
          {item.services?.length ? (
            <div className="mt-3">
              <ChipList items={item.services.slice(0, 4)} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function LinkedInIntel({
  comparison,
}: {
  comparison: CompetitiveBriefLinkedInComparison;
}) {
  const sides = comparison.competitors || [];
  if (!sides.length) return null;

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {sides.map((side, index) => (
        <li
          key={`${side.name || "linkedin"}-${index}`}
          className="rounded-2xl border border-[#E6E8F5] bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF]">
                <PlatformIcon src="/assets/linkedin.png" alt="" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-neutral-900">
                  {side.name || "Competitor"}
                </p>
                {side.linkedin_url ? (
                  <a
                    href={side.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-0.5 inline-flex text-[12px] text-[#5B57E6] hover:underline ${FOCUS_RING}`}
                  >
                    View LinkedIn
                  </a>
                ) : null}
              </div>
            </div>
            {side.is_hiring === true ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-emerald-700">
                Hiring
              </span>
            ) : side.is_hiring === false ? (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-neutral-500">
                Not hiring
              </span>
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <StatPill label="Followers" value={side.linkedin_followers} />
            <StatPill
              label="Employees"
              value={side.linkedin_total_employees ?? side.employees?.length}
            />
            {side.linkedin_company_size ? (
              <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-[#E6E8F5]">
                <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-neutral-400">
                  Size
                </p>
                <p className="mt-0.5 line-clamp-2 text-[12px] font-semibold text-neutral-900">
                  {side.linkedin_company_size}
                </p>
              </div>
            ) : (
              <StatPill label="Profiles" value={side.linkedin_profiles_sampled} />
            )}
          </div>

          {side.employees?.length ? (
            <ul className="mt-3 space-y-2">
              {side.employees.slice(0, 4).map((employee, empIndex) => (
                <li key={`${employee.name}-${empIndex}`}>
                  <EmployeeRow employee={employee} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[12px] text-neutral-400">No leadership profiles found.</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function InstagramProfileCard({
  title,
  profile,
}: {
  title: string;
  profile?: CompetitiveBriefInstagramProfile | null;
}) {
  if (!profile) return null;
  const handle = profile.username
    ? profile.username.startsWith("@")
      ? profile.username
      : `@${profile.username}`
    : null;

  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-white/80 p-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Avatar
          name={profile.username || title}
          imageUrl={profile.profile_picture_url}
          size="lg"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            {title}
          </p>
          {handle ? (
            profile.profile_url ? (
              <a
                href={profile.profile_url}
                target="_blank"
                rel="noreferrer"
                className={`mt-0.5 inline-flex text-[14px] font-semibold text-[#5B57E6] hover:underline ${FOCUS_RING}`}
              >
                {handle}
              </a>
            ) : (
              <p className="mt-0.5 text-[14px] font-semibold text-neutral-900">{handle}</p>
            )
          ) : null}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <StatPill label="Followers" value={profile.followers} />
        <StatPill label="Following" value={profile.following} />
        <StatPill
          label="Posts"
          value={profile.posts_count ?? profile.media_count}
        />
      </div>
    </div>
  );
}

function ComparisonTable({
  comparison,
  competitors,
  yourProfile,
  yourName,
}: {
  comparison:
    | CompetitiveBriefComparison
    | CompetitiveBriefWebsiteComparison
    | CompetitiveBriefLinkedInComparison;
  competitors: CompetitiveBriefCompetitor[];
  yourProfile?: CompetitiveBriefInstagramProfile | null;
  yourName?: string;
}) {
  const columns = comparison.columns?.length
    ? comparison.columns
    : ["Your Company", ...(Object.keys(comparison.rows?.[0]?.competitors || {}))];

  const competitorColumns = columns.slice(1);

  const profileByName = new Map<string, string | undefined>();
  competitors.forEach((item) => {
    if (!item.name) return;
    profileByName.set(
      item.name,
      item.profile_picture_url ||
        item.image_url ||
        item.links?.instagram?.profile_picture_url,
    );
  });

  function columnAvatar(column: string, index: number) {
    if (index === 0) {
      return {
        name: yourName || column,
        imageUrl: yourProfile?.profile_picture_url,
      };
    }
    return {
      name: column,
      imageUrl: profileByName.get(column),
    };
  }

  return (
    <div className="space-y-4">
      {comparison.so_what ? (
        <p className="rounded-2xl border border-[#D8D6F5] bg-[#F6F5FF] px-4 py-3 text-[13px] leading-5 text-[#3F3B9E]">
          {comparison.so_what}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-[#E6E8F5]">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#F8F9FF]">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                Area
              </th>
              {columns.map((column, index) => {
                const avatar = columnAvatar(column, index);
                return (
                  <th
                    key={column}
                    className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500"
                  >
                    <span className="inline-flex items-center gap-2 normal-case tracking-normal">
                      <Avatar
                        name={avatar.name}
                        imageUrl={avatar.imageUrl}
                        size="sm"
                      />
                      <span className="max-w-[140px] truncate text-[12px] font-semibold text-neutral-700">
                        {column}
                      </span>
                    </span>
                  </th>
                );
              })}
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                Insight
              </th>
            </tr>
          </thead>
          <tbody>
            {(comparison.rows || []).map((row, index) => (
              <tr
                key={`${row.area}-${index}`}
                className="border-t border-[#EEF0F8] align-top odd:bg-white even:bg-[#FCFCFF]"
              >
                <td className="px-4 py-3 text-[12px] font-semibold text-neutral-900">
                  {row.area}
                </td>
                <td className="px-4 py-3 text-[12px] leading-5 text-neutral-700">
                  {row.your_company || "—"}
                </td>
                {competitorColumns.map((column) => (
                  <td
                    key={`${row.area}-${column}`}
                    className="px-4 py-3 text-[12px] leading-5 text-neutral-700"
                  >
                    {row.competitors?.[column] || "—"}
                  </td>
                ))}
                <td className="px-4 py-3">
                  {row.insight ? (
                    <span className="inline-flex rounded-full bg-[#ECEBFF] px-2.5 py-1 text-[11px] font-medium text-[#5B57E6]">
                      {row.insight}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Props = {
  data?: CompetitorsListResponse | null;
  isLoading?: boolean;
  isError?: boolean;
  isNotFound?: boolean;
  errorMessage?: string;
  onRunAnalysis?: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
};

export default function CompetitiveBriefResults({
  data,
  isLoading,
  isError,
  isNotFound,
  errorMessage,
  onRunAnalysis,
  onRetry,
  isRetrying,
}: Props) {
  const brief = data?.result ?? data;
  const company = brief?.company || data?.company;
  const competitors = (
    brief?.competitors ||
    data?.competitors ||
    []
  ).filter(isBriefCompetitor);
  const customerProblem = brief?.customer_problem || data?.customer_problem;
  const gaps = asGapList(brief?.competitive_gaps ?? data?.competitive_gaps);
  const opportunities =
    brief?.opportunities || data?.opportunities || ([] as CompetitiveBriefOpportunityItem[]);
  const actions =
    brief?.recommended_actions ||
    data?.recommended_actions ||
    ([] as CompetitiveBriefRecommendedAction[]);
  const comparison = brief?.competitive_comparison || data?.competitive_comparison;
  const websiteComparison =
    brief?.website_comparison || data?.website_comparison;
  const linkedinComparison =
    brief?.linkedin_comparison || data?.linkedin_comparison;
  const instagram = brief?.instagram_content || data?.instagram_content || [];
  const competitorsInstagram =
    brief?.competitors_instagram || data?.competitors_instagram || [];
  const userInstagram = brief?.user_instagram || data?.user_instagram || company?.instagram;
  const summary = customerProblem?.summary || brief?.summary || data?.summary;
  const postCount = data?.post_count ?? brief?.post_count ?? instagram.length;
  const hasAnalysis = Boolean(
    company ||
      competitors.length ||
      customerProblem ||
      gaps.length ||
      opportunities.length ||
      actions.length ||
      comparison ||
      websiteComparison ||
      linkedinComparison ||
      instagram.length ||
      competitorsInstagram.length ||
      userInstagram,
  );

  if (isLoading) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
            <Search className="size-4 animate-pulse" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-neutral-900">Loading competitive brief…</p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              Pulling the latest competitor intelligence.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (isNotFound) {
    return (
      <ApiNotFoundCard
        resource="competitors"
        onRetry={onRetry}
        isRetrying={isRetrying}
        actionLabel={onRunAnalysis ? "Run competitor analysis" : undefined}
        onAction={onRunAnalysis}
      />
    );
  }

  if (isError) {
    return (
      <Card className="border-rose-200 bg-rose-50/80 p-5 sm:p-6">
        <p className="text-sm text-rose-700">
          {errorMessage || "Failed to load AI competitor analysis"}
        </p>
      </Card>
    );
  }

  if (!hasAnalysis) {
    return (
      <ApiNotFoundCard
        resource="competitors"
        title="No AI competitor brief yet"
        description="Run AI discovery to generate a competitive brief for your company."
        actionLabel={onRunAnalysis ? "Run competitor analysis" : undefined}
        onAction={onRunAnalysis}
      />
    );
  }

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_52%)] p-5 sm:p-7">
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-start">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6]">
              Competitive brief
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-[28px]">
              {company?.name || "Your company"}
            </h2>
            {summary ? (
              <p className="mt-3 text-[14px] leading-6 text-neutral-600">{summary}</p>
            ) : company?.one_liner ? (
              <p className="mt-3 text-[14px] leading-6 text-neutral-600">{company.one_liner}</p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {company?.market ? <Chip>{company.market}</Chip> : null}
              {company?.region ? <Chip>{company.region}</Chip> : null}
              {company?.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 rounded-full border border-[#E6E8F5] bg-white px-2.5 py-1 text-[11px] font-medium text-[#5B57E6] ${FOCUS_RING}`}
                >
                  <ExternalLink className="size-3" aria-hidden="true" />
                  Website
                </a>
              ) : null}
              <Chip>{`${competitors.length} competitors`}</Chip>
              {postCount ? <Chip>{`${postCount} posts analyzed`}</Chip> : null}
            </div>
          </div>

          <InstagramProfileCard title="Your Instagram" profile={userInstagram} />
        </div>
      </section>

      <Section
        title="Competitors"
        description={
          competitors.length
            ? `${competitors.length} competitors mapped from website, LinkedIn, and Instagram signals`
            : "No competitors returned in this run."
        }
        icon={Users}
      >
        {competitors.length ? (
          <CompetitorCards
            competitors={competitors}
            instagramPosts={instagram}
            competitorsInstagram={competitorsInstagram}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E6E8F5] bg-[#F8F9FF] px-4 py-8 text-center">
            <p className="text-[13px] text-neutral-600">No competitor profiles returned.</p>
            {onRunAnalysis ? (
              <Button
                type="button"
                onClick={onRunAnalysis}
                className="mt-4 h-10 gap-2 rounded-full bg-[#5B57E6] px-4 text-white hover:bg-[#4A46D0]"
              >
                <Sparkles className="size-4" />
                Run analysis again
              </Button>
            ) : null}
          </div>
        )}
      </Section>

      {websiteComparison?.rows?.length || websiteComparison?.competitors?.length ? (
        <Section
          title="Website comparison"
          description="Services, positioning, tech, and pricing pulled from competitor sites."
          icon={Globe2}
        >
          <div className="space-y-5">
            {websiteComparison.competitors?.length ? (
              <WebsiteIntelCards profiles={websiteComparison.competitors} />
            ) : null}
            {websiteComparison.rows?.length ? (
              <ComparisonTable
                comparison={websiteComparison}
                competitors={competitors}
                yourProfile={userInstagram}
                yourName={company?.name}
              />
            ) : null}
          </div>
        </Section>
      ) : null}

      {linkedinComparison?.rows?.length || linkedinComparison?.competitors?.length ? (
        <Section
          title="LinkedIn comparison"
          description="Leadership presence, hiring signals, and company reach."
          icon={Briefcase}
        >
          <div className="space-y-5">
            <LinkedInIntel comparison={linkedinComparison} />
            {linkedinComparison.rows?.length ? (
              <ComparisonTable
                comparison={linkedinComparison}
                competitors={competitors}
                yourProfile={userInstagram}
                yourName={company?.name}
              />
            ) : null}
          </div>
        </Section>
      ) : null}

      {customerProblem?.problems?.length || gaps.length || opportunities.length ? (
        <InsightsTrio
          problems={customerProblem?.problems || []}
          problemSummary={customerProblem?.summary}
          gaps={gaps}
          opportunities={opportunities}
        />
      ) : null}

      {comparison?.rows?.length ? (
        <Section
          title="Competitive comparison"
          description="Side-by-side view of audience, offer, positioning, and proof."
          icon={Target}
        >
          <ComparisonTable
            comparison={comparison}
            competitors={competitors}
            yourProfile={userInstagram}
            yourName={company?.name}
          />
        </Section>
      ) : null}

      {actions.length ? <RecommendedActionsPanel actions={actions} /> : null}

    </div>
  );
}
