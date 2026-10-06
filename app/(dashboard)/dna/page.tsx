"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Building2,
  CircleCheck,
  CircleHelp,
  Compass,
  ExternalLink,
  Gem,
  MapPin,
  Rocket,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import { InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import TopBar from "@/components/dashboard/topBar";
import TopicalMapSection from "@/components/dashboard/dna/topicalMapSection";
import useAuthStore from "@/store/AuthsStore";
import { AnalyzeCompanyResultsQuery, DnaQuery } from "@/routes/bussiness/Bussiness-Query";
import type { AnalyzeCompanyResponse, AnalyzeCompanyResultsResponse } from "@/types/bussiness/analyzecompany-type";

const PAIN_POINTS_PREVIEW = 8;
const hasValue = (value: unknown) => value !== null && value !== undefined && value !== "";
const hostLabel = (url?: string | null) =>
  url ? url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") : "";

const initials = (name?: string | null) =>
  (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "—";

const asNumber = (value: unknown) => (typeof value === "number" ? value : null);
function Panel({ title, icon: Icon, action, children }: { title: string; icon: LucideIcon; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#E6E8F5] bg-white p-5 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-neutral-100 text-neutral-700">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatTile({ label, value, icon, progress }: { label: string; value: string; icon: ReactNode; progress?: number | null }) {
  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-white p-4 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-500">{label}</p>
        <span className="text-neutral-500">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-neutral-900">{value}</p>
      {typeof progress === "number" ? <ProgressBar value={progress} className="mt-3" /> : null}
    </div>
  );
}

function ProgressBar({ value, tone = "green", className = "" }: { value: number; tone?: "green" | "orange"; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 ${className}`}>
      <div
        className={`h-full rounded-full ${tone === "green" ? "bg-emerald-500" : "bg-amber-500"}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

function KvRows({ items }: { items: Array<{ label: string; value: ReactNode }> }) {
  const visible = items.filter((item) => hasValue(item.value));
  if (!visible.length) return <Empty />;
  return (
    <dl className="divide-y divide-neutral-100">
      {visible.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-4 py-3 text-[13px]">
          <dt className="shrink-0 text-neutral-500">{item.label}</dt>
          <dd className="text-right font-medium text-neutral-800">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ItemList({ items, icon: Icon, iconClass }: { items?: string[] | null; icon: LucideIcon; iconClass: string }) {
  if (!items?.length) return <Empty />;
  return (
    <ul className="divide-y divide-neutral-100 rounded-2xl border border-[#E6E8F5] px-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 py-2.5 text-[13px] text-neutral-800">
          <Icon className={`mt-0.5 size-4 shrink-0 ${iconClass}`} aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ListHeading({ label, count, icon: Icon, className }: { label: string; count: number; icon: LucideIcon; className: string }) {
  return (
    <p className={`mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.06em] ${className}`}>
      <Icon className="size-4" aria-hidden="true" />
      {label}
      <span className="font-normal text-neutral-400">({count})</span>
    </p>
  );
}

function ExternalValue({ href, label }: { href?: string | null; label: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
      {label}
      <ExternalLink className="size-3.5" aria-hidden="true" />
    </a>
  );
}

function PriorityPill({ value }: { value?: string | null }) {
  if (!value) return null;
  const high = value.toUpperCase() === "HIGH";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        high ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      }`}
    >
      {value.toUpperCase()}
    </span>
  );
}

function Empty() {
  return <p className="text-[13px] text-neutral-400">No data yet</p>;
}

function AnalyzeCompanyHeader({ data }: { data: AnalyzeCompanyResponse }) {
  const company = data.company;
  const brief = data.company_summary?.brief;

  return (
    <section className="rounded-3xl border border-[#E6E8F5] bg-white p-5 shadow-[0_4px_20px_rgba(17,24,39,0.04)] sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-700">
          {initials(company?.name)}
        </span>
        <div className="min-w-0 space-y-2">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-neutral-900">
            {company?.name || "Your company"}
            {company?.website ? (
              <a href={company.website} target="_blank" rel="noreferrer" aria-label="Open website" className="text-neutral-500 hover:text-neutral-800">
                <ExternalLink className="size-4" />
              </a>
            ) : null}
          </h2>
          {brief?.website_signals?.summary ? (
            <p className="flex gap-1.5 text-[13px] leading-5 text-neutral-600">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-rose-400" aria-hidden="true" />
              {brief.website_signals.summary}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            {company?.industry ? <span className="rounded-full border border-[#E6E8F5] px-3 py-1 font-medium text-neutral-800">{company.industry}</span> : null}
            {company?.website ? (
              <span className="text-neutral-600">
                <ExternalValue href={company.website} label={hostLabel(company.website)} />
              </span>
            ) : null}
            {company?.business_model ? <span className="rounded-full border border-[#E6E8F5] px-3 py-1 font-medium text-neutral-800">{company.business_model}</span> : null}
          </div>
          {company?.positioning ? <p className="text-[13px] text-neutral-600">{company.positioning}</p> : null}
          <div className="flex items-center gap-2 pt-1">
            {company?.linkedin_url ? (
              <a href={company.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full border border-[#E6E8F5] text-[#0A66C2] hover:bg-neutral-50">
                <LinkedInIcon />
              </a>
            ) : null}
            {company?.instagram_url ? (
              <a href={company.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-full border border-[#E6E8F5] text-[#E1306C] hover:bg-neutral-50">
                <InstagramIcon />
              </a>
            ) : null}
            {company?.instagram_username ? <span className="text-[12px] text-neutral-500">@{company.instagram_username.replace(/^@/, "")}</span> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyzeCompanyInsights({ data }: { data: AnalyzeCompanyResponse }) {
  const [showAllPains, setShowAllPains] = useState(false);

  const company = data.company;
  const snap = data.executive_snapshot;
  const presence = data.digital_presence;
  const market = data.market_position;
  const positioning = data.positioning_analysis;
  const strengths = data.strengths_and_weaknesses;
  const instagram = (data.company_analysis?.instagram ?? {}) as Record<string, unknown>;

  const painPoints = company?.pain_points ?? [];
  const visiblePains = showAllPains ? painPoints : painPoints.slice(0, PAIN_POINTS_PREVIEW);
  const audience = snap?.primary_customers?.length ? snap.primary_customers : company?.target_audience ?? [];
  const growth = (data.growth_opportunities ?? []).filter((item) => item.area || item.finding);
  const actions = (data.recommended_actions ?? []).filter((item) => item.title || item.action);

  const instagramScore = asNumber(presence?.instagram?.score);
  const linkedinScore = asNumber(presence?.linkedin?.score);
  const differentiation = asNumber(market?.differentiation_strength);
  const clarity = asNumber(market?.positioning_clarity);

  const igFollowers = presence?.instagram?.followers ?? asNumber(instagram.followers);
  const igEngagement = presence?.instagram?.engagement_rate ?? asNumber(instagram.engagement_rate);
  const igHashtags = Array.isArray(instagram.top_hashtags) ? (instagram.top_hashtags as Array<{ tag?: string; count?: number }>) : [];
  const showInstagram = hasValue(igFollowers) || hasValue(igEngagement) || igHashtags.length > 0;

  return (
    <div className="mt-4 space-y-4">
      {/* Score tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile
          label="Differentiation score"
          value={differentiation !== null ? `${differentiation} / 100` : "—"}
          icon={<Star className="size-4" />}
          progress={differentiation}
        />
        <StatTile label="Market focus" value={market?.geographic_focus || "—"} icon={<Target className="size-4" />} />
        <StatTile label="Website score" value={hasValue(presence?.website?.score) ? String(presence?.website?.score) : "—"} icon={<Compass className="size-4" />} />
        <StatTile
          label="Instagram score"
          value={instagramScore !== null ? String(instagramScore) : presence?.instagram?.status || "—"}
          icon={<InstagramIcon />}
        />
        <StatTile
          label="LinkedIn score"
          value={linkedinScore !== null ? String(linkedinScore) : presence?.linkedin?.status || "—"}
          icon={<LinkedInIcon />}
        />
      </div>

      {/* Overview row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Panel title="Enterprise Overview" icon={Target}>
          <KvRows
            items={[
              { label: "Industry", value: company?.industry },
              { label: "Business maturity", value: snap?.business_maturity },
              { label: "Business Model", value: snap?.business_model },
              { label: "Company type", value: snap?.company_type },
              { label: "Primary market", value: snap?.primary_market },
              { label: "Core offering", value: snap?.core_offering },
              { label: "Website", value: company?.website ? <ExternalValue href={company.website} label={hostLabel(company.website)} /> : null },
              { label: "LinkedIn", value: company?.linkedin_url ? <ExternalValue href={company.linkedin_url} label="Open" /> : null },
              {
                label: "Instagram",
                value: company?.instagram_username ? (
                  <ExternalValue href={company.instagram_url} label={`@${company.instagram_username.replace(/^@/, "")}`} />
                ) : null,
              },
            ]}
          />
        </Panel>

        <Panel
          title={`Pain Points (${painPoints.length})`}
          icon={TriangleAlert}
          action={
            painPoints.length > PAIN_POINTS_PREVIEW ? (
              <button type="button" onClick={() => setShowAllPains((value) => !value)} className="text-[12px] text-neutral-500 hover:text-neutral-800">
                {showAllPains ? "Show less" : "View all"}
              </button>
            ) : null
          }
        >
          {painPoints.length ? (
            <>
              <ul className="space-y-2.5">
                {visiblePains.map((item) => (
                  <li key={item} className="flex gap-2 text-[13px] leading-5 text-neutral-800">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              {!showAllPains && painPoints.length > PAIN_POINTS_PREVIEW ? (
                <button type="button" onClick={() => setShowAllPains(true)} className="mt-3 text-[12px] text-neutral-500 hover:text-neutral-800">
                  + {painPoints.length - PAIN_POINTS_PREVIEW} more
                </button>
              ) : null}
            </>
          ) : (
            <Empty />
          )}
        </Panel>

        <Panel title="Target Audience" icon={Users}>
          {audience.length ? (
            <ul className="space-y-2.5">
              {audience.map((item) => (
                <li key={item} className="flex items-center gap-2.5 rounded-2xl border border-[#E6E8F5] px-4 py-3 text-[13px] font-medium text-neutral-800">
                  <Users className="size-4 shrink-0 text-neutral-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </Panel>

        <Panel title="Positioning" icon={Compass}>
          <div className="space-y-4 text-[13px] leading-6">
            {company?.positioning ? <p className="text-neutral-600">{company.positioning}</p> : null}
            {positioning?.recommended_positioning ? <p className="font-medium text-emerald-600">{positioning.recommended_positioning}</p> : null}
            {company?.value_proposition ? (
              <div>
                <p className="mb-2 flex items-center gap-2 font-semibold text-neutral-800">
                  <Gem className="size-4" aria-hidden="true" />
                  Value Proposition:
                </p>
                <p className="text-neutral-600">{company.value_proposition}</p>
              </div>
            ) : null}
            {!company?.positioning && !company?.value_proposition ? <Empty /> : null}
          </div>
        </Panel>
      </div>

      {/* Analysis row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Panel title="Market Position" icon={Target}>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E6E8F5] bg-neutral-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">Market position</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">{market?.position || "—"}</p>
              {market?.category ? <p className="mt-1 text-[13px] text-neutral-500">{market.category}</p> : null}
            </div>
            {market?.assessment ? <p className="border-l-2 border-neutral-300 pl-3 text-[13px] text-neutral-600">{market.assessment}</p> : null}
            <div className="rounded-2xl border border-[#E6E8F5] px-4">
              <KvRows
                items={[
                  { label: "Category", value: market?.category },
                  { label: "Position in market", value: market?.position },
                  { label: "Geographic focus", value: market?.geographic_focus },
                  { label: "Enterprise focus", value: market?.enterprise_focus },
                  { label: "Specialization", value: market?.specialization },
                  { label: "Service breadth", value: market?.service_breadth },
                ]}
              />
            </div>
            {differentiation !== null || clarity !== null ? (
              <div className="space-y-4 rounded-2xl border border-[#E6E8F5] p-4 text-[13px]">
                {differentiation !== null ? (
                  <div>
                    <div className="mb-2 flex justify-between text-neutral-600">
                      Differentiation strength <span className="font-medium text-neutral-900">{differentiation} / 100</span>
                    </div>
                    <ProgressBar value={differentiation} />
                  </div>
                ) : null}
                {clarity !== null ? (
                  <div>
                    <div className="mb-2 flex justify-between text-neutral-600">
                      Positioning clarity <span className="font-medium text-neutral-900">{clarity} / 100</span>
                    </div>
                    <ProgressBar value={clarity} tone="orange" />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel title="Positioning Analysis" icon={Rocket}>
          <div className="space-y-4">
            {positioning?.recommended_positioning ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-emerald-700">Recommended positioning</p>
                <p className="mt-1 text-[14px] font-semibold leading-6 text-neutral-900">{positioning.recommended_positioning}</p>
              </div>
            ) : null}
            <div>
              <ListHeading label="Known for" count={positioning?.what_you_are_known_for?.length ?? 0} icon={Gem} className="text-sky-700" />
              <ItemList items={positioning?.what_you_are_known_for} icon={Gem} iconClass="text-sky-500" />
            </div>
            <div>
              <ListHeading label="What's unclear" count={positioning?.what_is_unclear?.length ?? 0} icon={CircleHelp} className="text-violet-700" />
              <ItemList items={positioning?.what_is_unclear} icon={CircleHelp} iconClass="text-violet-500" />
            </div>
          </div>
        </Panel>

        <Panel title="Company Strengths & Weaknesses" icon={ThumbsUp}>
          <div className="space-y-4">
            <div>
              <ListHeading label="Strengths" count={strengths?.strengths?.length ?? 0} icon={CircleCheck} className="text-emerald-700" />
              <ItemList items={strengths?.strengths} icon={CircleCheck} iconClass="text-emerald-500" />
            </div>
            <div>
              <ListHeading label="Weaknesses" count={strengths?.weaknesses?.length ?? 0} icon={TriangleAlert} className="text-amber-700" />
              <ItemList items={strengths?.weaknesses} icon={TriangleAlert} iconClass="text-amber-500" />
            </div>
          </div>
        </Panel>

        <Panel title="Website Strengths & Weaknesses" icon={Compass}>
          <div className="space-y-4">
            <div>
              <ListHeading label="Strengths" count={presence?.website?.strengths?.length ?? 0} icon={CircleCheck} className="text-emerald-700" />
              <ItemList items={presence?.website?.strengths} icon={CircleCheck} iconClass="text-emerald-500" />
            </div>
            <div>
              <ListHeading label="Weaknesses" count={presence?.website?.weaknesses?.length ?? 0} icon={TriangleAlert} className="text-amber-700" />
              <ItemList items={presence?.website?.weaknesses} icon={TriangleAlert} iconClass="text-amber-500" />
            </div>
          </div>
        </Panel>
      </div>

      {/* Growth + actions */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Growth Opportunities" icon={TrendingUp}>
          {growth.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-140 text-left text-[13px]">
                <thead className="text-[12px] text-neutral-500">
                  <tr className="border-b border-neutral-100">
                    <th className="py-2 pr-3 font-medium">Priority</th>
                    <th className="py-2 pr-3 font-medium">Area</th>
                    <th className="py-2 pr-3 font-medium">Finding &amp; action</th>
                    <th className="py-2 font-medium">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 align-top">
                  {growth.map((item) => (
                    <tr key={`${item.area}-${item.finding}`}>
                      <td className="py-3 pr-3"><PriorityPill value={item.priority} /></td>
                      <td className="py-3 pr-3 font-semibold text-neutral-900">{item.area}</td>
                      <td className="py-3 pr-3">
                        <p className="text-neutral-600">{item.finding}</p>
                        {item.action ? <p className="mt-1.5 text-emerald-600">{item.action}</p> : null}
                      </td>
                      <td className="py-3 text-neutral-600">{item.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </Panel>

        <Panel title="Recommended Actions" icon={Star}>
          {actions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-140 text-left text-[13px]">
                <thead className="text-[12px] text-neutral-500">
                  <tr className="border-b border-neutral-100">
                    <th className="py-2 pr-3 font-medium">#</th>
                    <th className="py-2 pr-3 font-medium">Title</th>
                    <th className="py-2 pr-3 font-medium">Action</th>
                    <th className="py-2 font-medium">Impact / effort</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 align-top">
                  {actions.map((item, index) => (
                    <tr key={`${item.priority}-${item.title}`}>
                      <td className="py-3 pr-3">
                        <span className="grid size-6 place-items-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-700">
                          {item.priority ?? index + 1}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-neutral-900">{item.title}</p>
                        {item.category ? (
                          <span className="mt-2 inline-block rounded-full border border-[#E6E8F5] px-3 py-1 text-[12px] text-neutral-700">{item.category}</span>
                        ) : null}
                      </td>
                      <td className="py-3 pr-3 text-neutral-600">{item.action}</td>
                      <td className="py-3">
                        <p className="text-neutral-800">{item.impact}</p>
                        {item.effort ? <p className="text-[12px] text-neutral-500">Effort: {item.effort}</p> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </Panel>
      </div>

      {/* Instagram insights (only when the analysis includes Instagram data) */}
      {showInstagram ? (
        <Panel title="Instagram Insights" icon={Building2}>
          <div className="grid gap-x-6 sm:grid-cols-2">
            <KvRows
              items={[
                { label: "Followers", value: igFollowers },
                { label: "Primary format", value: instagram.primary_format as string | undefined },
                { label: "Posts / week", value: instagram.posts_per_week as number | undefined },
              ]}
            />
            <KvRows
              items={[
                { label: "Engagement", value: hasValue(igEngagement) ? `${igEngagement}%` : null },
                { label: "Top category", value: instagram.top_category as string | undefined },
              ]}
            />
          </div>
          {igHashtags.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {igHashtags.map((tag) => (
                <li key={tag.tag} className="rounded-full border border-[#E6E8F5] px-3 py-1.5 text-[12px] text-neutral-800">
                  #{tag.tag?.replace(/^#/, "")}
                  {typeof tag.count === "number" ? ` · ${tag.count}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      ) : null}
    </div>
  );
}

/* ---------- Page ---------- */
export default function DnaPage() {
  const t = useTranslations("dna");
  const tTop = useTranslations("topBar");
  const companyId = useAuthStore((state) => state.company_id);
  const companyName = useAuthStore((state) => state.company_name);
  const { data: analyzeCompanyResults, isLoading, isError } = AnalyzeCompanyResultsQuery(companyId);
  const analysis = (analyzeCompanyResults as AnalyzeCompanyResultsResponse | undefined)?.result;
  const { data: dna } = DnaQuery();
  const dnaReady = dna?.status === "ready";

  return (
    <main className="min-w-0">
      <TopBar user={{ name: companyName || "" }} placeholder={tTop("searchDna")} />
      {isError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {t("error")}
        </div>
      ) : null}

      {analysis ? (
        <>
          <AnalyzeCompanyHeader data={analysis} />
          <AnalyzeCompanyInsights data={analysis} />
          <div className="mt-4">
            <TopicalMapSection dnaReady={dnaReady} />
          </div>
        </>
      ) : null}
    </main>
  );
}
