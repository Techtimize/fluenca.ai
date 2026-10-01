import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  Building2,
  Crosshair,
  Dna,
  Globe2,
  Info,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Card from "@/components/shared/card";
import type {
  AnalyzeCompanyDigitalPresenceChannel,
  AnalyzeCompanyResponse,
} from "@/types/bussiness/analyzecompany-type";

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-1 text-[12px] text-neutral-700">
      {children}
    </span>
  );
}

function Section({
  id,
  title,
  description,
  icon: Icon,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  icon?: typeof Target;
  children: ReactNode;
}) {
  return (
    <Card id={id} className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-[13px] leading-5 text-neutral-500">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function ChipList({ items, empty = "No data yet" }: { items?: string[] | null; empty?: string }) {
  if (!items?.length) {
    return <p className="text-[13px] text-neutral-500">{empty}</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items, empty = "No data yet" }: { items?: string[] | null; empty?: string }) {
  if (!items?.length) {
    return <p className="text-[13px] text-neutral-500">{empty}</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-[13px] leading-5 text-neutral-700">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#5B57E6]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function KvGrid({
  items,
}: {
  items: Array<{ label: string; value?: string | number | boolean | null }>;
}) {
  const visible = items.filter(
    (item) => item.value !== null && item.value !== undefined && item.value !== "",
  );
  if (!visible.length) {
    return <p className="text-[13px] text-neutral-500">No data yet</p>;
  }

  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {visible.map((item) => (
        <div key={item.label} className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
          <dt className="text-[11px] font-medium uppercase tracking-[0.04em] text-neutral-500">
            {item.label}
          </dt>
          <dd className="mt-1 break-words text-[13px] font-medium text-neutral-900">
            {formatValue(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function PriorityBadge({ value }: { value: string | number }) {
  return (
    <span className="rounded-full bg-[#ECEBFF] px-2.5 py-0.5 text-[11px] font-medium text-[#5B57E6]">
      {typeof value === "number" ? `P${value}` : value}
    </span>
  );
}

function formatValue(value?: string | number | boolean | null): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function formatScore(value?: number | null, max = 100): string {
  if (typeof value !== "number") return "—";
  return `${Math.round(value)}/${max}`;
}

function firstList(...lists: Array<string[] | null | undefined>): string[] {
  for (const list of lists) {
    if (list?.length) return list;
  }
  return [];
}

function firstText(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    if (value?.trim()) return value;
  }
  return "";
}

function recordEntries(value?: Record<string, unknown> | null) {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([label, v]) => ({
      label: label.replace(/_/g, " "),
      value:
        typeof v === "string" || typeof v === "number" || typeof v === "boolean"
          ? v
          : Array.isArray(v)
            ? v.map(String).join(", ")
            : JSON.stringify(v),
    }));
}

function ChannelCard({
  title,
  channel,
}: {
  title: string;
  channel?: AnalyzeCompanyDigitalPresenceChannel | null;
}) {
  if (!channel) {
    return (
      <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
        <p className="text-[13px] font-semibold text-neutral-900">{title}</p>
        <p className="mt-2 text-[13px] text-neutral-500">No channel data</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-neutral-900">{title}</p>
        <span className="text-[12px] font-medium text-[#5B57E6]">{formatScore(channel.score)}</span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
        {[
          { label: "Status", value: channel.status },
          { label: "Followers", value: channel.followers },
          {
            label: "Engagement",
            value:
              typeof channel.engagement_rate === "number"
                ? `${channel.engagement_rate}%`
                : null,
          },
          { label: "Content", value: formatScore(channel.content_strength) },
          { label: "Audience", value: formatScore(channel.audience_strength) },
        ]
          .filter((item) => item.value !== null && item.value !== undefined && item.value !== "—")
          .map((item) => (
            <div key={item.label}>
              <dt className="text-neutral-500">{item.label}</dt>
              <dd className="font-medium text-neutral-800">{formatValue(item.value)}</dd>
            </div>
          ))}
      </dl>
      {(channel.strengths?.length || channel.weaknesses?.length) ? (
        <div className="mt-3 grid gap-3">
          <div>
            <p className="mb-1 text-[11px] font-medium text-emerald-700">Strengths</p>
            <BulletList items={channel.strengths} empty="—" />
          </div>
          <div>
            <p className="mb-1 text-[11px] font-medium text-rose-700">Weaknesses</p>
            <BulletList items={channel.weaknesses} empty="—" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AnalyzeCompanyInsights({ data }: { data: AnalyzeCompanyResponse }) {
  const company = data.company;
  const brief = data.company_summary?.brief;
  const config = data.company_summary?.config_patch;
  const dna = data.company_analysis?.company_dna;
  const analysis = data.company_analysis;
  const snap = data.executive_snapshot;
  const presence = data.digital_presence;
  const market = data.market_position;
  const positioning = data.positioning_analysis;
  const sw = data.strengths_and_weaknesses;
  const meta = data.meta;

  const summaryText = firstText(
    data.company_summary?.summary_text,
    config?.company_description,
  );
  const detectedNiche = firstText(config?.detected_niche, company?.industry, brief?.industry);
  const positioningText = firstText(dna?.positioning, company?.positioning, brief?.positioning);
  const valueProposition = firstText(
    dna?.value_proposition,
    company?.value_proposition,
    brief?.value_proposition,
  );
  const businessModel = firstText(
    dna?.business_model,
    company?.business_model,
    brief?.business_model,
    snap?.business_model,
  );

  const services = firstList(dna?.services, company?.services, brief?.services);
  const flagshipServices = firstList(company?.flagship_services, brief?.flagship_services);
  const technologies = firstList(dna?.technologies, company?.technologies, brief?.technologies);
  const keywords = firstList(dna?.keywords, company?.keywords, brief?.keywords, config?.niche_keywords);
  const targetAudience = firstList(
    dna?.target_audience,
    company?.target_audience,
    brief?.target_audience,
  );
  const painPoints = firstList(dna?.pain_points, company?.pain_points, brief?.pain_points);
  const pricing = firstList(dna?.pricing, brief?.pricing_signals);
  const industries = firstList(dna?.industries, brief?.industries_targeted);
  const differentiators = firstList(dna?.differentiators);
  const geography = firstList(brief?.geography);

  const website = firstText(config?.company_website, company?.website, brief?.website);
  const instagramUsername = firstText(
    config?.company_instagram_username,
    company?.instagram_username,
    brief?.instagram?.username,
  );
  const linkedinUrl = firstText(
    config?.company_linkedin_url,
    company?.linkedin_url,
    brief?.linkedin?.url,
    analysis?.linkedin_url ?? undefined,
  );

  const instagramEntries = recordEntries(analysis?.instagram);
  const socialHandleEntries = recordEntries(analysis?.social_handles);

  return (
    <div className="mt-4 space-y-4">
      {data.warnings?.length ? (
        <Section title="Warnings" icon={AlertTriangle}>
          <BulletList items={data.warnings} />
        </Section>
      ) : null}

      <Section
        title="Company overview"
        description={summaryText || "Company intelligence summary"}
        icon={Building2}
      >
        <KvGrid
          items={[
            { label: "Name", value: company?.name || config?.company_name },
            { label: "Detected niche", value: detectedNiche },
            { label: "Industry", value: company?.industry || brief?.industry },
            { label: "Region", value: company?.region || brief?.region },
            { label: "Website", value: website },
            { label: "Instagram", value: instagramUsername },
            { label: "LinkedIn", value: linkedinUrl },
            { label: "Business model", value: businessModel },
            { label: "Source", value: data.company_summary?.source },
          ]}
        />
      </Section>

      <Section title="Channels & website signals" icon={Globe2}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
            <p className="text-[12px] font-medium text-neutral-600">Website</p>
            <p className="mt-2 break-all text-[13px] text-neutral-900">{website || "—"}</p>
            <p className="mt-1 text-[12px] text-neutral-500">
              {brief?.website_signals?.crawled ? "Crawled" : "Not crawled"}
            </p>
            {brief?.website_signals?.summary ? (
              <p className="mt-2 text-[12px] leading-5 text-neutral-600">
                {brief.website_signals.summary}
              </p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
            <p className="text-[12px] font-medium text-neutral-600">Instagram</p>
            <p className="mt-2 text-[13px] text-neutral-900">
              {instagramUsername ? `@${instagramUsername.replace(/^@/, "")}` : "—"}
            </p>
            <p className="mt-1 text-[12px] text-neutral-500">
              {brief?.instagram?.analyzed || config?.user_instagram_analyzed
                ? "Analyzed"
                : "Not analyzed"}
            </p>
            {company?.instagram_url ? (
              <p className="mt-2 break-all text-[12px] text-neutral-600">{company.instagram_url}</p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3">
            <p className="text-[12px] font-medium text-neutral-600">LinkedIn</p>
            <p className="mt-2 break-all text-[13px] text-neutral-900">{linkedinUrl || "—"}</p>
            <p className="mt-1 text-[12px] text-neutral-500">
              {brief?.linkedin?.analyzed || config?.user_linkedin_analyzed
                ? "Analyzed"
                : "Not analyzed"}
              {brief?.linkedin?.is_hiring || analysis?.is_hiring ? " · Hiring" : ""}
            </p>
          </div>
        </div>
      </Section>

      <Section title="Company DNA" icon={Dna}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Services</p>
            <ChipList items={services} />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Flagship services</p>
            <ChipList items={flagshipServices} empty="No flagship services" />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Target audience</p>
            <ChipList items={targetAudience} />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Pain points</p>
            <BulletList items={painPoints} />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Technologies</p>
            <ChipList items={technologies} />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Keywords</p>
            <ChipList items={keywords} />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Pricing</p>
            <ChipList items={pricing} empty="No pricing signals" />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Industries</p>
            <ChipList items={industries} />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Geography</p>
            <ChipList items={geography} empty="No geography signals" />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Differentiators</p>
            <ChipList items={differentiators} empty="No differentiators" />
          </div>
        </div>
      </Section>

      <Section title="Executive snapshot" icon={Briefcase}>
        <KvGrid
          items={[
            { label: "Company type", value: snap?.company_type },
            { label: "Business model", value: snap?.business_model || businessModel },
            { label: "Primary market", value: snap?.primary_market },
            { label: "Market position", value: snap?.market_position },
            { label: "Business maturity", value: snap?.business_maturity },
            {
              label: "Digital presence",
              value:
                typeof snap?.overall_digital_presence_score === "number"
                  ? formatScore(snap.overall_digital_presence_score)
                  : null,
            },
            { label: "Core offering", value: snap?.core_offering },
            { label: "Detected niche", value: detectedNiche },
          ]}
        />
        <div className="mt-4">
          <p className="mb-2 text-[12px] font-medium text-neutral-600">Primary customers</p>
          <ChipList items={snap?.primary_customers} />
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Positioning" icon={Crosshair}>
          <p className="text-[13px] leading-6 text-neutral-700">
            {positioningText || "No positioning captured yet."}
          </p>
          {valueProposition ? (
            <p className="mt-3 rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-3 text-[13px] leading-6 text-neutral-700">
              <span className="font-medium text-neutral-900">Value proposition: </span>
              {valueProposition}
            </p>
          ) : null}
        </Section>
        <Section
          id="positioning-analysis"
          title="Positioning analysis"
          description={positioning?.recommended_positioning}
          icon={Sparkles}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[12px] font-medium text-neutral-600">Known for</p>
              <BulletList items={positioning?.what_you_are_known_for} />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-neutral-600">Still unclear</p>
              <BulletList items={positioning?.what_is_unclear} />
            </div>
          </div>
        </Section>
      </div>

      <Section
        title="Digital presence"
        description={`Overall score: ${formatScore(presence?.overall_score)}`}
        icon={Activity}
      >
        <div className="grid gap-3 lg:grid-cols-3">
          <ChannelCard title="Website" channel={presence?.website} />
          <ChannelCard title="Instagram" channel={presence?.instagram} />
          <ChannelCard title="LinkedIn" channel={presence?.linkedin} />
        </div>
      </Section>

      <Section
        id="market-position"
        title="Market position"
        description={market?.assessment}
        icon={TrendingUp}
      >
        <KvGrid
          items={[
            { label: "Category", value: market?.category },
            { label: "Position", value: market?.position },
            { label: "Specialization", value: market?.specialization },
            { label: "Service breadth", value: market?.service_breadth },
            { label: "Geographic focus", value: market?.geographic_focus },
            { label: "Enterprise focus", value: market?.enterprise_focus },
            {
              label: "Differentiation",
              value:
                typeof market?.differentiation_strength === "number"
                  ? formatScore(market.differentiation_strength, 10)
                  : null,
            },
            {
              label: "Positioning clarity",
              value:
                typeof market?.positioning_clarity === "number"
                  ? formatScore(market.positioning_clarity, 10)
                  : null,
            },
          ]}
        />
      </Section>

      <Section id="strengths-weaknesses" title="Strengths & weaknesses" icon={Zap}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-emerald-700">Strengths</p>
            <BulletList items={sw?.strengths} />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-rose-700">Weaknesses</p>
            <BulletList items={sw?.weaknesses} />
          </div>
        </div>
      </Section>

      <Section title="Growth opportunities" icon={TrendingUp}>
        {data.growth_opportunities?.length ? (
          <ul className="space-y-3">
            {data.growth_opportunities.map((item) => (
              <li
                key={`${item.priority}-${item.area}-${item.finding}`}
                className="rounded-2xl border border-[#E6E8F5] bg-[#F8F9FF] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <PriorityBadge value={item.priority} />
                  <p className="text-[13px] font-semibold text-neutral-900">{item.area}</p>
                  <span className="text-[11px] text-neutral-500">{item.impact}</span>
                </div>
                <p className="mt-2 text-[13px] leading-5 text-neutral-700">{item.finding}</p>
                <p className="mt-2 text-[12px] leading-5 text-[#5B57E6]">{item.action}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-neutral-500">No growth opportunities yet.</p>
        )}
      </Section>

      <Section id="recommended-actions" title="Recommended actions" icon={ArrowUpRight}>
        {data.recommended_actions?.length ? (
          <ul className="space-y-3">
            {data.recommended_actions.map((item) => (
              <li
                key={`${item.priority}-${item.title}`}
                className="rounded-2xl border border-[#E6E8F5] bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <PriorityBadge value={item.priority} />
                  <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
                    {item.category}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-5 text-neutral-700">{item.action}</p>
                <p className="mt-2 text-[12px] text-neutral-500">
                  Impact: {item.impact} · Effort: {item.effort}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-neutral-500">No recommended actions yet.</p>
        )}
      </Section>

      <Section title="Hiring & social signals" icon={Users}>
        <KvGrid
          items={[
            { label: "Is hiring", value: analysis?.is_hiring ?? brief?.linkedin?.is_hiring },
            { label: "Company size", value: analysis?.company_size },
            { label: "LinkedIn URL", value: analysis?.linkedin_url || linkedinUrl },
          ]}
        />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Job openings</p>
            <BulletList items={analysis?.job_openings} empty="No job openings" />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-600">LinkedIn content themes</p>
            <ChipList items={analysis?.linkedin_content_themes} />
          </div>
        </div>
        {instagramEntries.length ? (
          <div className="mt-4">
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Instagram analysis</p>
            <KvGrid items={instagramEntries} />
          </div>
        ) : null}
        {socialHandleEntries.length ? (
          <div className="mt-4">
            <p className="mb-2 text-[12px] font-medium text-neutral-600">Social handles</p>
            <KvGrid items={socialHandleEntries} />
          </div>
        ) : null}
      </Section>

      <Section title="Analysis details" icon={Info}>
        <KvGrid
          items={[
            { label: "Status", value: meta?.status },
            { label: "Duration (sec)", value: meta?.duration_sec },
            { label: "Timestamp", value: meta?.timestamp },
            { label: "Agent mode", value: meta?.agent_mode },
            { label: "Company ID", value: meta?.company_id },
            { label: "Analysis ID", value: meta?.analysis_id },
            { label: "Prompt ID", value: meta?.prompt_id },
            { label: "Storage error", value: meta?.storage_error },
          ]}
        />
      </Section>
    </div>
  );
}
