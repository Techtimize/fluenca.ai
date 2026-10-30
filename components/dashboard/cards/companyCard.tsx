"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Globe,
  Loader2,
  RefreshCcw,
  Search,
  Sparkles,
} from "lucide-react";
import CompetitorCompareDialog, {
  useCompetitorCompare,
} from "@/components/dashboard/competitors/CompetitorCompareDialog";
import CompetitorRow, {
  COMPARE_BUTTON,
  initials,
} from "@/components/dashboard/competitors/CompetitorRow";
import AssetImage from "@/components/shared/assetImage";
import Card from "@/components/shared/card";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/shared/brandIcons";
import { FindCompetitorMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { Company, CompanyProfile } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  company: Company;
  profile?: CompanyProfile | null;
  companyId?: string | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  /** Called after a "find competitors" run starts, so the host can refetch once it finishes. */
  onCompetitorsFound?: () => void;
  /** True while saved competitors are still being fetched, so the "find" prompt doesn't flash. */
  checkingCompetitors?: boolean;
  /** Link to the full competitor list, shown when the card only lists some of them. */
  seeAllHref?: string;
  /** Shown below the competitors, e.g. the current goal. */
  footer?: ReactNode;
};

const PLATFORM_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  web: Globe,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

const PLATFORM_ASSET_ICONS: Record<string, string> = {
  web: "/assets/globe.png",
  linkedin: "/assets/linkedin.png",
  instagram: "/assets/insta.png",
};

function FindCompetitorsPrompt({
  companyId,
  onFound,
}: {
  companyId: string;
  onFound?: () => void;
}) {
  const { mutate: findCompetitors, isPending } = FindCompetitorMutation();

  return (
    <div className="mt-5 rounded-2xl border border-dashed border-[#D9DCF7] bg-[#F8F9FF] p-4 text-center sm:p-5">
      <span className="mx-auto grid size-10 place-items-center rounded-full bg-[#ECEBFF] text-[#5B57E6]">
        <Search className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-neutral-900">
        Want Fluenca to find your competitors?
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-neutral-500">
        Let our AI agents scan your market and identify the brands you&rsquo;re actually competing with.
      </p>
      <button
        type="button"
        onClick={() => findCompetitors(companyId, { onSuccess: () => onFound?.() })}
        disabled={isPending}
        className={`mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#5B57E6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4A46D0] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="size-4" aria-hidden="true" />
        )}
        {isPending ? "Finding competitors…" : "Find my competitors"}
      </button>
    </div>
  );
}

export default function CompanyCard({
  company,
  profile,
  companyId,
  onRefresh,
  isRefreshing = false,
  onCompetitorsFound,
  checkingCompetitors = false,
  seeAllHref,
  footer,
}: Props) {
  const website = company.links.find((link) => link.id === "web");
  const logoUrl = company.logoUrl || company.logoSrc;
  const compare = useCompetitorCompare();

  return (
    <Card className="flex h-full min-w-0 flex-col p-4 sm:p-5 md:p-6">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="grid size-14 shrink-0 place-items-center overflow-hidden text-sm font-semibold text-white sm:size-16">
            {logoUrl ? (
              <AssetImage
                src={logoUrl}
                alt={company.name}
                width={64}
                height={64}
                className="size-14 object-contain sm:size-16"
              />
            ) : (
              initials(company.name)
            )}
          </span>

          <div className="min-w-0">
            <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">
              <span className="truncate">{company.name}</span>
              {website?.href ? (
                <a
                  href={website.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open website"
                  className={`shrink-0 rounded text-neutral-400 hover:text-neutral-800 ${FOCUS_RING}`}
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </h2>
            {company.tagline ? (
              <p className="line-clamp-2 text-xs text-neutral-500">
                {company.tagline}
              </p>
            ) : null}
          </div>
        </div>
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh company analysis"
            className={`rounded-lg p-1.5 text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
          >
            <RefreshCcw
              className={`size-4.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        ) : null}
      </div>

      {company.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-lg bg-[#EEF0FF] px-3 py-1.5 text-xs text-neutral-700"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {company.description ? (
        <p className="mt-4 line-clamp-4 text-sm leading-6 text-neutral-800">
          {company.description}
        </p>
      ) : null}

      {company.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
          {company.links.map((link) => {
            const Icon = PLATFORM_ICONS[link.id] ?? Globe;
            const assetIcon = PLATFORM_ASSET_ICONS[link.id];
            return (
              <li key={link.id} className="min-w-0">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex max-w-full items-center gap-2 rounded-full text-sm text-neutral-800 sm:gap-2.5 ${FOCUS_RING}`}
                >
                  <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[#F1F3FB] text-neutral-800 transition-colors group-hover:bg-[#E3E6FF] sm:size-9">
                    {assetIcon ? (
                      <AssetImage
                        src={assetIcon}
                        alt=""
                        width={18}
                        height={18}
                        className="size-4 object-contain sm:size-4.5"
                      />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </span>
                  <span className="truncate group-hover:text-neutral-950">
                    {link.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {company.competitors.length > 0 && (
        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-neutral-900">
              Competitors
            </h3>
            {seeAllHref ? (
              <Link href={seeAllHref} className={COMPARE_BUTTON}>
                See all competitors
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {company.competitors.map((competitor, index) => (
              <CompetitorRow
                key={competitor.id}
                competitor={competitor}
                index={index}
                onCompare={() => compare.start([competitor], competitor.id)}
                compareDisabled={compare.isBusy}
                isComparing={compare.isComparing(competitor.id)}
                onView={() => void compare.view(competitor)}
                isViewing={compare.isViewing(competitor.id)}
                confirmable={competitor.confirmed !== undefined}
              />
            ))}
          </ul>
        </div>
      )}
      {company.competitors.length === 0 && companyId && !checkingCompetitors ? (
        <FindCompetitorsPrompt companyId={companyId} onFound={onCompetitorsFound} />
      ) : null}
      {footer}
      <CompetitorCompareDialog {...compare.dialogProps} />
    </Card>
  );
}
