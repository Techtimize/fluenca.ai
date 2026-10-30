"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Heart,
  Lightbulb,
  ListChecks,
  MessageCircle,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { isBriefCompetitor } from "@/components/dashboard/competitors/CompetitiveBriefResults";
import AssetImage from "@/components/shared/assetImage";
import { InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import type {
  CompetitiveBriefCompetitor,
  CompetitiveBriefGapItem,
  CompetitiveBriefInstagramPost,
  CompetitiveBriefRecommendedAction,
  CompetitorsListResponse,
} from "@/types/bussiness/competitoranalysis-type";
import { FOCUS_RING } from "@/utils/ui-classes";

type Tab = "overview" | "plan" | "content";

const TABS: { id: Tab; label: string; icon: typeof Target }[] = [
  { id: "overview", label: "Overview", icon: Target },
  { id: "plan", label: "Action plan", icon: ListChecks },
  { id: "content", label: "Their content", icon: Sparkles },
];

const SWATCHES = ["#4F6BF6", "#3E9E1C", "#F5A70B", "#0E8F9B", "#E0457B", "#7C4FF0"];

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/** "User-provided competitor (user_provided_linkedin)" → "LinkedIn", to tell same-named rivals apart. */
function sourceLabel(why?: string) {
  const match = why?.match(/user_provided_(\w+)/i);
  if (!match) return "";
  const source = match[1].toLowerCase();
  return source === "linkedin" ? "LinkedIn" : source === "instagram" ? "Instagram" : source === "website" ? "Website" : "";
}

const cleanThemes = (themes?: string[]) =>
  [...new Set((themes ?? []).filter((theme) => theme && !theme.includes("\\") && !theme.includes("|")))];
const cleanTitle = (title?: string) => (title ?? "").replace(/^headline:\s*/i, "").trim();

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

type Rival = {
  key: string;
  label: string;
  data: CompetitiveBriefCompetitor;
  logo: string | null;
  color: string;
};

function buildRivals(competitors: CompetitiveBriefCompetitor[]): Rival[] {
  const counts = new Map<string, number>();
  for (const c of competitors) counts.set((c.name ?? "").toLowerCase(), (counts.get((c.name ?? "").toLowerCase()) ?? 0) + 1);

  return competitors.map((c, index) => {
    const name = c.name || `Competitor ${index + 1}`;
    const duplicate = (counts.get(name.toLowerCase()) ?? 0) > 1;
    const source = sourceLabel(c.why_competitor);
    return {
      key: `${name}-${index}`,
      label: duplicate ? `${name} · ${source || index + 1}` : name,
      data: c,
      logo: c.logo_url || c.linkedin_image_url || c.profile_picture_url || c.image_url || null,
      color: SWATCHES[index % SWATCHES.length],
    };
  });
}

// ---------- Root ----------

export default function CompareResults({
  data,
  competitorNames,
}: {
  data: CompetitorsListResponse;
  competitorNames: string[];
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const brief = data.result ?? data;

  const nameSet = new Set(competitorNames.map((n) => n.toLowerCase()));
  const all = (brief.competitors ?? []).filter(isBriefCompetitor) as CompetitiveBriefCompetitor[];
  const matched = all.filter((c) => c.name && nameSet.has(c.name.toLowerCase()));
  const rivals = buildRivals(matched.length ? matched : all);

  if (!rivals.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[#E6E8F5] bg-[#FBFBFF] px-4 py-10 text-center text-[13px] text-neutral-500">
        We couldn&rsquo;t find enough details about these competitors yet. Try again in a little while.
      </p>
    );
  }

  const actions = brief.recommended_actions ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Comparison">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${FOCUS_RING} ${
              tab === id ? "bg-[#5B57E6] text-white" : "bg-[#F1F2FB] text-neutral-600 hover:bg-[#E6E8F5]"
            }`}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
            {id === "plan" && actions.length ? (
              <span className={`text-[11px] ${tab === id ? "text-white/75" : "text-neutral-400"}`}>{actions.length}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {tab === "overview" ? <OverviewTab brief={brief} rivals={rivals} onOpenPlan={() => setTab("plan")} /> : null}
        {tab === "plan" ? <PlanTab brief={brief} /> : null}
        {tab === "content" ? <ContentTab rivals={rivals} /> : null}
      </div>
    </div>
  );
}


function Block({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-[14px] font-semibold text-neutral-900">{title}</h3>
      {hint ? <p className="mt-0.5 text-[12px] text-neutral-500">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Avatar({ rival, size = "size-9" }: { rival: Rival; size?: string }) {
  return rival.logo ? (
    <AssetImage
      src={rival.logo}
      alt=""
      width={36}
      height={36}
      className={`${size} shrink-0 rounded-xl bg-neutral-50 object-contain ring-1 ring-[#EEF0F8]`}
    />
  ) : (
    <span
      className={`${size} grid shrink-0 place-items-center rounded-xl text-[11px] font-semibold text-white`}
      style={{ backgroundColor: rival.color }}
      aria-hidden="true"
    >
      {initials(rival.data.name || "?")}
    </span>
  );
}

const PRIORITY: Record<string, { label: string; className: string; rank: number }> = {
  high: { label: "Do first", className: "bg-rose-50 text-rose-700", rank: 0 },
  medium: { label: "Do next", className: "bg-amber-50 text-amber-700", rank: 1 },
  low: { label: "Nice to have", className: "bg-emerald-50 text-emerald-700", rank: 2 },
};

const priorityOf = (value?: string) => PRIORITY[(value ?? "").toLowerCase()] ?? PRIORITY.medium;

function PriorityBadge({ value }: { value?: string }) {
  const p = priorityOf(value);
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${p.className}`}>{p.label}</span>;
}

type MetricRow = {
  label: string;
  hint: string;
  you: string;
  values: string[];
};

function OverviewTab({
  brief,
  rivals,
  onOpenPlan,
}: {
  brief: NonNullable<CompetitorsListResponse["result"]> | CompetitorsListResponse;
  rivals: Rival[];
  onOpenPlan: () => void;
}) {
  const you = brief.linkedin_comparison?.your_company;
  const yourInstagram = brief.user_instagram ?? brief.company?.instagram;
  const dash = "—";
  const num = (value?: number | null) => (typeof value === "number" && value > 0 ? compact.format(value) : dash);

  const rows: MetricRow[] = [
    {
      label: "Instagram followers",
      hint: "People following them on Instagram",
      you: num(yourInstagram?.followers),
      values: rivals.map((r) => num(r.data.followers)),
    },
    {
      label: "Instagram posts",
      hint: "How much they've posted in total",
      you: num(yourInstagram?.media_count ?? yourInstagram?.posts_count),
      values: rivals.map((r) => num(r.data.media_count ?? r.data.posts_count)),
    },
    {
      label: "LinkedIn followers",
      hint: "People following their company page",
      you: num(you?.linkedin_followers),
      values: rivals.map((r) => num(r.data.linkedin_followers)),
    },
    {
      label: "Team size",
      hint: "Roughly how many people work there",
      you: you?.linkedin_company_size ?? num(you?.linkedin_total_employees),
      values: rivals.map((r) => r.data.linkedin_company_size?.replace(" employees", "") ?? num(r.data.employee_count)),
    },
    {
      label: "Hiring now",
      hint: "A sign they're growing",
      you: you?.is_hiring == null ? dash : you.is_hiring ? "Yes" : "No",
      values: rivals.map((r) => (r.data.is_hiring == null ? dash : r.data.is_hiring ? "Yes" : "No")),
    },
  ].filter((row) => row.you !== dash || row.values.some((v) => v !== dash));

  const youMissing = rows.length > 0 && rows.every((row) => row.you === dash);
  const takeaways = (brief.linkedin_comparison?.rows ?? [])
    .map((row) => row.insight?.trim())
    .filter((text): text is string => Boolean(text));
  const gaps = (Array.isArray(brief.competitive_gaps) ? (brief.competitive_gaps as CompetitiveBriefGapItem[]) : []).filter(
    (gap) => gap.gap,
  );
  const topActions = [...(brief.recommended_actions ?? [])]
    .sort((a, b) => priorityOf(a.priority).rank - priorityOf(b.priority).rank)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Who you're up against */}
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {rivals.map((rival) => (
          <li key={rival.key} className="flex items-center gap-3 rounded-2xl border border-[#E6E8F5] p-3">
            <Avatar rival={rival} size="size-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-neutral-900">{rival.label}</p>
              <p className="truncate text-[12px] text-neutral-500">
                {[rival.data.linkedin_company_size, rival.data.website?.url?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")]
                  .filter(Boolean)
                  .join(" · ") || "Competitor"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {rival.data.linkedin_url ? <IconLink href={rival.data.linkedin_url} label={`${rival.label} on LinkedIn`} icon={<LinkedInIcon className="size-3.5" />} /> : null}
              {rival.data.profile_url ? <IconLink href={rival.data.profile_url} label={`${rival.label} on Instagram`} icon={<InstagramIcon className="size-3.5" />} /> : null}
              {rival.data.website?.url ? <IconLink href={rival.data.website.url} label={`${rival.label} website`} icon={<ArrowUpRight className="size-3.5" />} /> : null}
            </div>
          </li>
        ))}
      </ul>

      {rows.length ? (
        <Block title="Side by side" hint="How your reach compares with theirs.">
          <div className="overflow-x-auto rounded-2xl border border-[#E6E8F5]">
            <table className="w-full min-w-md text-left text-[13px]">
              <thead className="bg-[#F8F9FF] text-[12px] text-neutral-500">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-medium" />
                  <th scope="col" className="px-3 py-2.5 font-semibold text-[#4544C9]">You</th>
                  {rivals.map((rival) => (
                    <th key={rival.key} scope="col" className="px-3 py-2.5 font-semibold text-neutral-800">
                      {rival.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F2FB]">
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="px-3 py-2.5 font-normal">
                      <span className="block font-medium text-neutral-800">{row.label}</span>
                      <span className="block text-[11px] text-neutral-400">{row.hint}</span>
                    </th>
                    <td className="px-3 py-2.5 font-semibold text-[#4544C9]">{row.you}</td>
                    {row.values.map((value, index) => (
                      <td key={rivals[index].key} className="px-3 py-2.5 font-semibold text-neutral-900">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {youMissing ? (
            <p className="mt-2 text-[12px] text-neutral-500">
              Your own numbers show as &ldquo;—&rdquo;. Connect your Instagram and LinkedIn to see how you stack up.
            </p>
          ) : null}
        </Block>
      ) : null}

      {takeaways.length || gaps.length ? (
        <Block title="What this means for you">
          <ul className="space-y-2">
            {takeaways.map((text) => (
              <li key={text} className="flex items-start gap-2 text-[13px] leading-5 text-neutral-700">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-[#F5A70B]" aria-hidden="true" />
                {text}
              </li>
            ))}
            {gaps.map((gap) => (
              <li key={gap.gap} className="flex items-start gap-2 text-[13px] leading-5 text-neutral-700">
                <Target className="mt-0.5 size-4 shrink-0 text-[#5B57E6]" aria-hidden="true" />
                <span>
                  <span className="font-medium text-neutral-900">Room to stand out:</span> {gap.gap}
                  {gap.priority?.toLowerCase() === "high" ? (
                    <span className="ms-1.5 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                      Big opportunity
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {topActions.length ? (
        <Block title="Start here" hint="The most important steps from your action plan.">
          <ol className="space-y-2">
            {topActions.map((action, index) => (
              <li key={`${action.action}-${index}`} className="flex items-start gap-3 rounded-2xl bg-[#F8F9FF] p-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#5B57E6] text-[12px] font-semibold text-white">
                  {index + 1}
                </span>
                <p className="min-w-0 flex-1 text-[13px] leading-5 text-neutral-800">{action.action}</p>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={onOpenPlan}
            className={`mt-3 inline-flex items-center gap-1 rounded-full text-[13px] font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
          >
            See the full action plan
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </button>
        </Block>
      ) : null}
    </div>
  );
}

function IconLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`grid size-7 place-items-center rounded-full bg-[#F1F2FB] text-neutral-600 hover:bg-[#E6E8F5] hover:text-[#5B57E6] ${FOCUS_RING}`}
    >
      {icon}
    </a>
  );
}

const CATEGORY: Record<string, string> = {
  action: "Growth",
  positioning: "Positioning",
  seo: "Google search",
  content: "Content",
  format: "Post format",
};

function PlanTab({ brief }: { brief: NonNullable<CompetitorsListResponse["result"]> | CompetitorsListResponse }) {
  const actions = [...(brief.recommended_actions ?? [])]
    .filter((a) => a.action)
    .sort((a, b) => priorityOf(a.priority).rank - priorityOf(b.priority).rank);
  const opportunities = (brief.opportunities ?? []).filter((o) => o.opportunity || o.gap);

  if (!actions.length && !opportunities.length) {
    return <p className="text-[13px] text-neutral-500">No recommendations for this comparison yet.</p>;
  }

  return (
    <div className="space-y-6">
      {actions.length ? (
        <Block title="Your action plan" hint="Ordered by what will help most. Tap a step to see why it matters.">
          <ol className="space-y-2">
            {actions.map((action, index) => (
              <ActionItem key={`${action.action}-${index}`} action={action} index={index} />
            ))}
          </ol>
        </Block>
      ) : null}

      {opportunities.length ? (
        <Block title="Opportunities">
          <ul className="space-y-2">
            {opportunities.map((o, index) => (
              <li key={`${o.opportunity ?? o.gap}-${index}`} className="flex items-start gap-2 rounded-2xl border border-[#E6E8F5] p-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-neutral-900">{o.opportunity ?? o.gap}</p>
                  {o.why_it_matters || o.why ? (
                    <p className="mt-0.5 text-[12px] leading-5 text-neutral-500">{o.why_it_matters ?? o.why}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}
    </div>
  );
}

function actionContext(action: CompetitiveBriefRecommendedAction) {
  const detail = (action.detail ?? action.why ?? "").trim();
  if (!detail || detail === action.action) return "";
  return detail.split(/\s*Action:\s*/i)[0].trim().replace(/\.$/, "") || "";
}

function ActionItem({ action, index }: { action: CompetitiveBriefRecommendedAction; index: number }) {
  const context = actionContext(action);
  const category = CATEGORY[(action.type ?? "").toLowerCase()];

  const header = (
    <div className="flex items-start gap-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-[12px] font-semibold text-[#4544C9]">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-5 text-neutral-800">{action.action}</p>
        {category ? <p className="mt-0.5 text-[11px] text-neutral-400">{category}</p> : null}
      </div>
      <PriorityBadge value={action.priority} />
    </div>
  );

  if (!context && !action.how) {
    return <li className="rounded-2xl border border-[#E6E8F5] p-3">{header}</li>;
  }

  return (
    <li className="rounded-2xl border border-[#E6E8F5]">
      <details className="group">
        <summary className={`cursor-pointer list-none rounded-2xl p-3 hover:bg-[#FAFAFF] ${FOCUS_RING} [&::-webkit-details-marker]:hidden`}>
          {header}
        </summary>
        <div className="space-y-1 border-t border-[#F1F2FB] px-3 py-2.5 ps-12 text-[12px] leading-5 text-neutral-600">
          {context ? <p>{context}.</p> : null}
          {action.how ? <p><span className="font-medium text-neutral-800">How:</span> {action.how}</p> : null}
        </div>
      </details>
    </li>
  );
}


function ContentTab({ rivals }: { rivals: Rival[] }) {
  return (
    <div className="space-y-6">
      {rivals.map((rival) => (
        <RivalContent key={rival.key} rival={rival} />
      ))}
    </div>
  );
}

const postDate = (timestamp?: string) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.replace(/\+0000$/, "Z"));
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
};

function RivalContent({ rival }: { rival: Rival }) {
  const themes = cleanThemes(rival.data.linkedin_content_themes);
  const posts = [...(rival.data.posts ?? [])]
    .sort((a, b) => (b.likes ?? 0) + (b.comments ?? 0) - ((a.likes ?? 0) + (a.comments ?? 0)))
    .slice(0, 3);
  const people = (rival.data.employees ?? []).filter((person) => person.name).slice(0, 3);

  if (!themes.length && !posts.length && !people.length) {
    return (
      <section className="rounded-2xl border border-[#E6E8F5] p-4">
        <RivalHeading rival={rival} />
        <p className="mt-2 text-[12px] text-neutral-500">No posts or topics found for them yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#E6E8F5] p-4">
      <RivalHeading rival={rival} />

      {themes.length ? (
        <div className="mt-4">
          <p className="text-[12px] font-medium text-neutral-500">What they talk about</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {themes.map((theme) => (
              <li key={theme} className="rounded-full bg-[#F1F2FB] px-2.5 py-1 text-[12px] text-neutral-700">
                {theme}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {posts.length ? (
        <div className="mt-4">
          <p className="text-[12px] font-medium text-neutral-500">Their most liked Instagram posts</p>
          <ul className="mt-1.5 grid gap-2.5 sm:grid-cols-3">
            {posts.map((post, index) => (
              <li key={post.id ?? index}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {people.length ? (
        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-500">
            <Users className="size-3.5" aria-hidden="true" />
            Leadership
          </p>
          <ul className="mt-1.5 space-y-1">
            {people.map((person, index) => (
              <li key={`${person.name}-${index}`} className="flex flex-wrap items-center gap-x-2 text-[13px]">
                <span className="font-medium text-neutral-900">{person.name}</span>
                <span className="text-neutral-500">{cleanTitle(person.title ?? person.designation)}</span>
                {person.linkedin_url ? (
                  <a
                    href={person.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${person.name} on LinkedIn`}
                    className={`rounded text-[#5B57E6] hover:text-[#4544C9] ${FOCUS_RING}`}
                  >
                    <LinkedInIcon className="size-3.5" />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function RivalHeading({ rival }: { rival: Rival }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar rival={rival} size="size-8" />
      <h3 className="text-[14px] font-semibold text-neutral-900">{rival.label}</h3>
    </div>
  );
}

function PostCard({ post }: { post: CompetitiveBriefInstagramPost }) {
  const image = post.thumbnail_url || (post.media_type !== "VIDEO" ? post.media_url : undefined);
  const content = (
    <>
      {image ? (
        <AssetImage src={image} alt="" width={240} height={240} className="aspect-square w-full rounded-xl object-cover" />
      ) : (
        <span className="grid aspect-square w-full place-items-center rounded-xl bg-[#F1F2FB] text-neutral-400">
          <InstagramIcon className="size-6" />
        </span>
      )}
      {post.caption ? <p className="mt-1.5 line-clamp-2 text-[12px] leading-4 text-neutral-700">{post.caption}</p> : null}
      <p className="mt-1 flex items-center gap-2.5 text-[11px] text-neutral-500">
        <span className="inline-flex items-center gap-0.5">
          <Heart className="size-3" aria-hidden="true" />
          {compact.format(post.likes ?? 0)}
        </span>
        <span className="inline-flex items-center gap-0.5">
          <MessageCircle className="size-3" aria-hidden="true" />
          {compact.format(post.comments ?? 0)}
        </span>
        {postDate(post.timestamp) ? <span>{postDate(post.timestamp)}</span> : null}
      </p>
    </>
  );

  return post.permalink ? (
    <a href={post.permalink} target="_blank" rel="noreferrer" className={`block rounded-xl ${FOCUS_RING}`}>
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}
