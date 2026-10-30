"use client";

import type { ReactNode } from "react";
import { Check, CheckCircle2, Eye, GitCompareArrows, Globe, Info, Loader2, X } from "lucide-react";
import { competitorInputs } from "@/components/dashboard/competitors/CompetitorCompareDialog";
import AssetImage from "@/components/shared/assetImage";
import { InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmCompetitorMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { Competitor } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

const COMPETITOR_SWATCHES = [
  "#4F6BF6",
  "#3E9E1C",
  "#F5A70B",
  "#0E8F9B",
  "#E0457B",
  "#7C4FF0",
];

export const COMPARE_BUTTON = `inline-flex items-center gap-1.5 rounded-full border border-[#D9DCF7] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5B57E6] transition-colors hover:bg-[#F0F1FF] disabled:pointer-events-none disabled:opacity-50 ${FOCUS_RING}`;

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

function SocialThumb({
  imageUrl,
  fallback,
}: {
  imageUrl?: string | null;
  fallback: ReactNode;
}) {
  if (imageUrl) {
    return (
      <AssetImage
        src={imageUrl}
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-full object-cover"
      />
    );
  }
  return fallback;
}

export default function CompetitorRow({
  competitor,
  index,
  onCompare,
  compareDisabled,
  isComparing,
  confirmable = false,
  onView,
  isViewing = false,
}: {
  competitor: Competitor;
  index: number;
  onCompare: () => void;
  compareDisabled: boolean;
  isComparing: boolean;
  confirmable?: boolean;
  /** Opens the saved comparison; shown instead of Compare once the competitor was compared. */
  onView?: () => void;
  isViewing?: boolean;
}) {
  const canCompare = competitorInputs(competitor).length > 0;
  const canView = Boolean(
    onView && competitor.compared && competitor.comparisonMode && competitor.comparisonVersion != null,
  );
  const logo = competitor.logoSrc;
  const website = competitor.websiteUrl || competitor.href;
  const links = [
    website
      ? {
          id: "web",
          href: website,
          label: "Website",
          imageUrl: logo,
          Icon: Globe,
        }
      : null,
    competitor.linkedinUrl
      ? {
          id: "linkedin",
          href: competitor.linkedinUrl,
          label: "LinkedIn",
          imageUrl: competitor.linkedinImageUrl,
          Icon: LinkedInIcon,
        }
      : null,
    competitor.instagramUrl
      ? {
          id: "instagram",
          href: competitor.instagramUrl,
          label: "Instagram",
          imageUrl: competitor.instagramImageUrl,
          Icon: InstagramIcon,
        }
      : null,
  ].filter((link): link is NonNullable<typeof link> => Boolean(link));

  return (
    <li className="rounded-2xl border border-[#E6E8F5] bg-white p-3">
      <div className="flex items-center gap-2.5">
        {logo ? (
          <AssetImage
            src={logo}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-lg object-contain bg-neutral-50"
          />
        ) : (
          <span
            className="grid size-8 place-items-center rounded-lg text-[11px] font-semibold text-white"
            style={{
              backgroundColor:
                COMPETITOR_SWATCHES[index % COMPETITOR_SWATCHES.length],
            }}
            aria-hidden="true"
          >
            {initials(competitor.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {competitor.name}
          </p>
          {competitor.compared ? (
            <p
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16803C]"
              title={competitor.comparedAt ? `Compared on ${new Date(competitor.comparedAt).toLocaleString()}` : undefined}
            >
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Compared
              {competitor.comparedAt ? (
                <span className="font-normal text-neutral-400">
                  · {new Date(competitor.comparedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {canView ? (
            <button
              type="button"
              onClick={onView}
              disabled={compareDisabled}
              aria-label={`View comparison with ${competitor.name}`}
              className={COMPARE_BUTTON}
            >
              {isViewing ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Eye className="size-3.5" aria-hidden="true" />
              )}
              {isViewing ? "Opening…" : "View"}
            </button>
          ) : canCompare ? (
            <button type="button" onClick={onCompare} disabled={compareDisabled} className={COMPARE_BUTTON}>
              {isComparing ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <GitCompareArrows className="size-3.5" aria-hidden="true" />
              )}
              {isComparing ? "Comparing…" : "Compare"}
            </button>
          ) : null}
          {competitor.whyCompetitor ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    aria-label={`Why ${competitor.name} is a competitor`}
                    className={`shrink-0 cursor-pointer rounded-full text-neutral-400 hover:text-[#5452F6] ${FOCUS_RING}`}
                  >
                    <Info className="size-4" />
                  </button>
                }
              />
              <TooltipContent className="max-w-64 text-xs leading-5">
                {competitor.whyCompetitor}
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </div>

      {links.length ? (
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-full border border-[#E6E8F5] bg-[#F6F7FD] py-1 pl-1 pr-2.5 text-[11px] font-medium text-neutral-700 hover:bg-[#ECEBFF] ${FOCUS_RING}`}
              >
                <span className="grid size-6 place-items-center overflow-hidden rounded-full bg-white text-neutral-700">
                  <SocialThumb
                    imageUrl={link.imageUrl}
                    fallback={<link.Icon className="size-3.5" />}
                  />
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {confirmable && !competitor.confirmed ? <ConfirmCompetitor competitorId={competitor.id} /> : null}
    </li>
  );
}

function ConfirmCompetitor({ competitorId }: { competitorId: string }) {
  const { mutate: confirm, isPending, variables } = ConfirmCompetitorMutation();
  const choose = (is_competitor: boolean) => confirm({ competitor_id: competitorId, is_competitor });
  const busy = (answer: boolean) => isPending && variables?.is_competitor === answer;
  const choiceClass = `inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 ${FOCUS_RING}`;

  return (
    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#EEF0F6] pt-2.5">
      <p className="text-[11px] text-neutral-500">Is this a competitor?</p>
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => choose(true)}
          disabled={isPending}
          className={`${choiceClass} border-[#CDEFD9] bg-[#F1FBF4] text-[#16803C] hover:bg-[#E2F6E9]`}
        >
          {busy(true) ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : <Check className="size-3" aria-hidden="true" />}
          Yes
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          disabled={isPending}
          className={`${choiceClass} border-[#F7D4DC] bg-[#FFF4F6] text-[#C02650] hover:bg-[#FDE7EC]`}
        >
          {busy(false) ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : <X className="size-3" aria-hidden="true" />}
          No
        </button>
      </div>
    </div>
  );
}
