"use client";

import type { ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Globe, X } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import { AnalyzeCompanyDashboardDocumentationQuery } from "@/routes/bussiness/Bussiness-Query";
import type {
  CompanyDocumentationDetails,
  CompetitorsDocumentationDetails,
  DashboardDocumentationData,
  MarketingDocumentationDetails,
  PainPointsDocumentationDetails,
} from "@/types/bussiness/dashboard-documentation-type";
import type { DocItem } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  companyId: string;
  item: DocItem | null;
  onClose: () => void;
};

export default function DocumentationSheet({ companyId, item, onClose }: Props) {
  const open = item !== null;
  const { data, isLoading, isError } = AnalyzeCompanyDashboardDocumentationQuery(companyId, open);
  const section = item ? data?.data?.[item.id as keyof DashboardDocumentationData] : undefined;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/30 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-y-3 right-3 z-50 flex w-[calc(100%-1.5rem)] max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl outline-none duration-200 data-open:animate-in data-open:slide-in-from-right-10 data-open:fade-in-0 data-closed:animate-out data-closed:slide-out-to-right-10 data-closed:fade-out-0">
          <header className="mx-5 flex items-center justify-between gap-3 border-b border-[#ECEDF5] py-4">
            <DialogPrimitive.Title className="text-base font-semibold text-neutral-900">
              {section?.title ?? item?.title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className={`grid size-8 place-items-center rounded-full text-neutral-700 transition-colors hover:bg-[#F1F2F8] ${FOCUS_RING}`}
            >
              <X className="size-4.5" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </header>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            {isLoading ? (
              <SheetSkeleton />
            ) : isError ? (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                Could not load these details. Please try again.
              </p>
            ) : !section ? (
              <p className="text-sm text-neutral-500">No details available yet.</p>
            ) : item?.id === "company" ? (
              <CompanyDetails details={section.details as CompanyDocumentationDetails} />
            ) : item?.id === "marketing" ? (
              <MarketingDetails details={section.details as MarketingDocumentationDetails} />
            ) : item?.id === "pain_points" ? (
              <PainPointsDetails details={section.details as PainPointsDocumentationDetails} />
            ) : item?.id === "competitors" ? (
              <CompetitorsDetails details={section.details as CompetitorsDocumentationDetails} />
            ) : null}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ---------- Sections ---------- */

function CompanyDetails({ details }: { details: CompanyDocumentationDetails }) {
  const { socials } = details;
  const links = [
    details.website ? { href: details.website, label: hostLabel(details.website), icon: <Globe className="size-3.5" /> } : null,
    socials?.instagram_url
      ? { href: socials.instagram_url, label: pathLabel(socials.instagram_url, "Instagram"), icon: <InstagramIcon className="size-3.5" /> }
      : null,
    socials?.linkedin_url
      ? { href: socials.linkedin_url, label: pathLabel(socials.linkedin_url, "LinkedIn"), icon: <LinkedInIcon className="size-3.5" /> }
      : null,
    socials?.facebook_url
      ? { href: socials.facebook_url, label: pathLabel(socials.facebook_url, "Facebook"), icon: <FacebookIcon className="size-3.5" /> }
      : null,
  ].filter((link): link is NonNullable<typeof link> => Boolean(link));

  return (
    <>
      <Section title={details.name}>
        {details.summary ? <Paragraph>{details.summary}</Paragraph> : null}
      </Section>

      {links.length ? (
        <Section title="Social Links" small>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 rounded-full text-xs text-neutral-800 hover:text-[#5452F6] ${FOCUS_RING}`}
              >
                <span className="grid size-7 place-items-center rounded-full bg-[#EEF0FF] text-[#5452F6]">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="What It Does">
        {details.core_offering ? <Paragraph>{details.core_offering}</Paragraph> : null}
        <Tags items={details.services} />
      </Section>

      <Fields
        fields={[
          ["Industry", details.industry],
          ["Region", details.region],
          ["Business Model", details.business_model],
          ["Maturity", details.business_maturity],
        ]}
      />

      <TagSection title="Target Audience" items={details.target_audience} />
      <TagSection title="Industries Targeted" items={details.industries_targeted} />
      <TagSection title="Technologies" items={details.technologies} />
    </>
  );
}

function MarketingDetails({ details }: { details: MarketingDocumentationDetails }) {
  const scores = [
    { label: "Positioning Clarity", value: details.scores?.positioning_clarity },
    { label: "Differentiation", value: details.scores?.differentiation_strength },
  ].filter((score): score is { label: string; value: number } => typeof score.value === "number");

  return (
    <>
      {details.positioning ? (
        <Section title="Positioning">
          <Paragraph>{details.positioning}</Paragraph>
          {details.assessment ? <p className="text-xs font-medium text-[#5452F6]">{details.assessment}</p> : null}
        </Section>
      ) : null}

      {scores.length ? (
        <div className="grid grid-cols-2 gap-3">
          {scores.map((score) => (
            <div key={score.label} className="rounded-xl bg-[#F1F4FF] px-3 py-2.5">
              <p className="text-xs text-neutral-600">{score.label}</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">{score.value}/100</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[#5452F6]" style={{ width: `${Math.min(100, Math.max(0, score.value))}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {details.value_proposition ? (
        <Section title="Value Proposition">
          <Paragraph>{details.value_proposition}</Paragraph>
        </Section>
      ) : null}

      <Fields
        fields={[
          ["Specialization", details.attributes?.specialization],
          ["Service Breadth", details.attributes?.service_breadth],
          ["Enterprise Focus", details.attributes?.enterprise_focus],
          ["Geographic Focus", details.attributes?.geographic_focus],
        ]}
      />

      <TagSection title="Known For" items={details.known_for} />

      {details.what_is_unclear?.length ? (
        <Section title="What Is Unclear">
          <BulletList items={details.what_is_unclear} />
        </Section>
      ) : null}

      <TagSection title="Keywords" items={details.keywords} />

      {details.content_pillars?.length ? (
        <Section title="Content Pillars">
          <div className="space-y-2.5">
            {details.content_pillars.map((pillar) => (
              <div key={pillar.name} className="rounded-xl border border-[#ECEDF5] p-3">
                <p className="text-sm font-medium text-neutral-900">{pillar.name}</p>
                {pillar.topics?.length ? (
                  <div className="mt-2">
                    <BulletList items={pillar.topics} />
                  </div>
                ) : null}
                {pillar.services?.length ? (
                  <div className="mt-2.5">
                    <Tags items={pillar.services} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

function PainPointsDetails({ details }: { details: PainPointsDocumentationDetails }) {
  return (
    <>
      {details.pain_points?.length ? (
        <Section title="Pain Points">
          <ol className="space-y-2">
            {details.pain_points.map((point, index) => (
              <li key={point} className="flex gap-3 rounded-xl bg-[#F8F9FF] px-3 py-2.5 text-sm text-neutral-800">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-[11px] font-semibold text-[#5452F6]">
                  {index + 1}
                </span>
                {point}
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
      <TagSection title="Who Feels It" items={details.who_feels_it} />
      <TagSection title="How You Solve It" items={details.how_you_solve_it} />
    </>
  );
}

function CompetitorsDetails({ details }: { details: CompetitorsDocumentationDetails }) {
  const competitors = details.items ?? [];

  return (
    <>
      {details.matching_criteria?.length ? (
        <Section title="How They Were Matched">
          <BulletList items={details.matching_criteria} />
        </Section>
      ) : null}

      <Section title={`Competitors${details.count != null ? ` (${details.count})` : ""}`}>
        {competitors.length ? (
          <div className="space-y-2.5">
            {competitors.map((competitor) => {
              const links = [
                competitor.website_url ? { href: competitor.website_url, label: "Website", icon: <Globe className="size-3.5" /> } : null,
                competitor.instagram_url
                  ? { href: competitor.instagram_url, label: "Instagram", icon: <InstagramIcon className="size-3.5" /> }
                  : null,
                competitor.linkedin_url
                  ? { href: competitor.linkedin_url, label: "LinkedIn", icon: <LinkedInIcon className="size-3.5" /> }
                  : null,
              ].filter((link): link is NonNullable<typeof link> => Boolean(link));

              return (
                <div key={competitor.id} className="rounded-xl border border-[#ECEDF5] p-3">
                  <div className="flex items-center gap-3">
                    {competitor.logo_url ? (
                      <AssetImage
                        src={competitor.logo_url}
                        alt=""
                        width={36}
                        height={36}
                        className="size-9 shrink-0 rounded-lg border border-[#ECEDF5] object-contain"
                      />
                    ) : (
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#EEF0FF] text-sm font-semibold text-[#5452F6]">
                        {competitor.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">{competitor.name}</p>
                    <div className="flex gap-1">
                      {links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${competitor.name} ${link.label}`}
                          className={`grid size-7 place-items-center rounded-full bg-[#EEF0FF] text-[#5452F6] hover:bg-[#E2E5FF] ${FOCUS_RING}`}
                        >
                          {link.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                  {competitor.why_competitor ? (
                    <p className="mt-2 text-xs leading-relaxed text-neutral-600">{competitor.why_competitor}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No competitors identified yet.</p>
        )}
      </Section>
    </>
  );
}

/* ---------- Building blocks ---------- */

function Section({ title, small, children }: { title: string; small?: boolean; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className={`font-semibold text-neutral-900 ${small ? "text-[13px]" : "text-sm"}`}>{title}</h3>
      {children}
    </section>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="text-[13px] leading-relaxed text-neutral-600">{children}</p>;
}

function Tags({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((tag) => (
        <li key={tag} className="rounded-full bg-[#EEF0FF] px-2.5 py-1 text-xs text-[#4544C9]">
          {tag}
        </li>
      ))}
    </ul>
  );
}

function TagSection({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <Section title={title}>
      <Tags items={items} />
    </Section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((text) => (
        <li key={text} className="flex gap-2 text-[13px] leading-snug text-neutral-600">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#5452F6]" aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  );
}

function Fields({ fields }: { fields: [string, string | null | undefined][] }) {
  const visible = fields.filter((field): field is [string, string] => Boolean(field[1]));
  if (!visible.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-3">
      {visible.map(([label, value]) => (
        <div key={label} className="rounded-xl bg-[#F1F4FF] px-3 py-2.5">
          <dt className="text-xs text-neutral-600">{label}</dt>
          <dd className="mt-1 text-sm font-semibold text-neutral-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SheetSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true">
      <div className="h-4 w-1/3 rounded bg-neutral-200" />
      <div className="space-y-2">
        <div className="h-3 rounded bg-neutral-100" />
        <div className="h-3 rounded bg-neutral-100" />
        <div className="h-3 w-2/3 rounded bg-neutral-100" />
      </div>
      <div className="h-4 w-1/4 rounded bg-neutral-200" />
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-neutral-100" />
        <div className="h-6 w-24 rounded-full bg-neutral-100" />
        <div className="h-6 w-16 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function pathLabel(url: string, fallback: string): string {
  const slug = url.replace(/\/+$/, "").split("/").pop();
  return slug && !slug.includes(".com") ? slug : fallback;
}
