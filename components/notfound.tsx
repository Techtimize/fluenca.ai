"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  Dna,
  FileSearch,
  FileText,
  ImageIcon,
  Lightbulb,
  Loader2,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import Card from "@/components/shared/card";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { FOCUS_RING } from "@/utils/ui-classes";

export type NotFoundResource =
  | "generic"
  | "scripts"
  | "content"
  | "recommendations"
  | "competitors"
  | "dna"
  | "calendar"
  | "overview"
  | "trends";

type ResourceConfig = {
  icon: LucideIcon;
  title: string;
  description: string;
  guidance: string[];
  actionLabel?: string;
  actionHref?: string;
};

const RESOURCE_CONFIG: Record<NotFoundResource, ResourceConfig> = {
  generic: {
    icon: FileSearch,
    title: "Nothing found here",
    description:
      "We couldn’t find what you were looking for. It may not exist yet, or it may have been removed.",
    guidance: [
      "Confirm you completed the earlier setup steps",
      "Try generating or refreshing this data",
      "Return to the dashboard and open this page again",
    ],
    actionLabel: "Go to dashboard",
    actionHref: PAGE_ROUTES.DASHBOARD,
  },
  scripts: {
    icon: FileText,
    title: "No scripts found",
    description:
      "There are no generated scripts for this company yet. Create one from a content idea first.",
    guidance: [
      "Open Content recommendations and pick an idea",
      "Press Generate script on that idea",
      "Come back here once generation finishes",
    ],
    actionLabel: "Open content recommendations",
    actionHref: PAGE_ROUTES.CONTENT_RECOMMENDATION,
  },
  content: {
    icon: ImageIcon,
    title: "No content images found",
    description:
      "We couldn’t find generated images for this company. Images appear after script-based generation.",
    guidance: [
      "Generate a script from a content idea",
      "Run image generation from that script",
      "Refresh this page to load the latest assets",
    ],
    actionLabel: "Open scripts",
    actionHref: PAGE_ROUTES.SCRIPT,
  },
  recommendations: {
    icon: Lightbulb,
    title: "No recommendations found",
    description:
      "Content recommendations are missing for this company. Generate a fresh set to get started.",
    guidance: [
      "Make sure company DNA and analysis are complete",
      "Press Generate to create recommendations",
      "Wait for the job to finish, then refresh",
    ],
    actionLabel: "Go to dashboard",
    actionHref: PAGE_ROUTES.DASHBOARD,
  },
  competitors: {
    icon: Users,
    title: "No competitor analysis found",
    description:
      "Competitor results aren’t available yet. Run AI discovery or add competitors manually.",
    guidance: [
      "Choose AI mode to auto-discover competitors",
      "Or use Manual mode to add Instagram/LinkedIn profiles",
      "Run analysis and wait for the job to complete",
    ],
    actionLabel: "Open competitor analysis",
    actionHref: PAGE_ROUTES.COMPETITOR_ANALYSIS,
  },
  dna: {
    icon: Dna,
    title: "Company DNA not found",
    description:
      "We couldn’t load your company DNA. Finish onboarding or regenerate DNA to continue.",
    guidance: [
      "Complete onboarding if you haven’t already",
      "Open Verify DNA and wait for generation",
      "Retry DNA if the previous run failed",
    ],
    actionLabel: "Verify DNA",
    actionHref: PAGE_ROUTES.VERIFY_DNA,
  },
  calendar: {
    icon: CalendarDays,
    title: "No calendar content found",
    description:
      "There’s no calendar content available yet. Generate recommendations or scripts first.",
    guidance: [
      "Create content recommendations for your brand",
      "Generate scripts from those ideas",
      "Return here after content is ready",
    ],
    actionLabel: "Open recommendations",
    actionHref: PAGE_ROUTES.CONTENT_RECOMMENDATION,
  },
  overview: {
    icon: ClipboardList,
    title: "Company overview not found",
    description:
      "Overview details aren’t available for this company yet. Complete analysis to populate this page.",
    guidance: [
      "Finish company analysis during onboarding",
      "Confirm your company ID is set after login",
      "Refresh this page once analysis completes",
    ],
    actionLabel: "Go to dashboard",
    actionHref: PAGE_ROUTES.DASHBOARD,
  },
  trends: {
    icon: Sparkles,
    title: "No trends found",
    description:
      "Trend data isn’t available right now. Try another filter or check back shortly.",
    guidance: [
      "Adjust search or filter settings",
      "Retry loading trends",
      "Return to the dashboard if the issue continues",
    ],
    actionLabel: "Go to dashboard",
    actionHref: PAGE_ROUTES.DASHBOARD,
  },
};

export type ApiNotFoundCardProps = {
  resource?: NotFoundResource;
  title?: string;
  description?: string;
  guidance?: string[];
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  onSecondary?: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
};

export default function ApiNotFoundCard({
  resource = "generic",
  title,
  description,
  guidance,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
  onSecondary,
  onRetry,
  isRetrying = false,
  className = "",
}: ApiNotFoundCardProps) {
  const config = RESOURCE_CONFIG[resource] ?? RESOURCE_CONFIG.generic;
  const Icon = config.icon;
  const resolvedTitle = title ?? config.title;
  const resolvedDescription = description ?? config.description;
  const resolvedGuidance = guidance?.length ? guidance : config.guidance;
  const resolvedActionLabel = actionLabel ?? config.actionLabel;
  const resolvedActionHref = actionHref ?? config.actionHref;

  const primaryIsButton = Boolean(onAction);
  const secondaryIsButton = Boolean(onSecondary);

  return (
    <Card className={`relative overflow-hidden p-0 ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ECEBFF_0%,transparent_58%)]"
      />
      <div className="relative flex flex-col items-center px-5 py-9 text-center sm:px-8 sm:py-11">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6] shadow-[0_8px_20px_rgba(91,87,230,0.12)]">
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B57E6]">
          Not found
        </p>
        <h2 className="mt-1.5 text-[16px] font-semibold text-neutral-900 sm:text-lg">
          {resolvedTitle}
        </h2>
        <p className="mt-2 max-w-md text-[13px] leading-5 text-neutral-500">
          {resolvedDescription}
        </p>

        {resolvedGuidance.length ? (
          <div className="mt-5 w-full max-w-md rounded-2xl border border-[#E6E8F5] bg-white/80 p-4 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
              What you can do
            </p>
            <ol className="mt-2 space-y-2">
              {resolvedGuidance.map((step, index) => (
                <li key={step} className="flex gap-2.5 text-[13px] leading-5 text-neutral-700">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#ECEBFF] text-[10px] font-semibold text-[#5B57E6]">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className={`inline-flex h-9 items-center gap-2 rounded-full border border-[#E6E8F5] bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
            >
              {isRetrying ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="size-4" aria-hidden="true" />
              )}
              {isRetrying ? "Retrying…" : "Try again"}
            </button>
          ) : null}

          {resolvedActionLabel && primaryIsButton ? (
            <button
              type="button"
              onClick={onAction}
              className={`inline-flex h-9 items-center gap-2 rounded-full bg-[#5B57E6] px-4 text-sm font-medium text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              {resolvedActionLabel}
            </button>
          ) : null}

          {resolvedActionLabel && resolvedActionHref && !primaryIsButton ? (
            <Link
              href={resolvedActionHref}
              className={`inline-flex h-9 items-center gap-2 rounded-full bg-[#5B57E6] px-4 text-sm font-medium text-white hover:bg-[#4A46D0] ${FOCUS_RING}`}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              {resolvedActionLabel}
            </Link>
          ) : null}

          {secondaryLabel && secondaryIsButton ? (
            <button
              type="button"
              onClick={onSecondary}
              className={`inline-flex h-9 items-center gap-2 rounded-full border border-[#E6E8F5] bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
            >
              {secondaryLabel}
            </button>
          ) : null}

          {secondaryLabel && secondaryHref && !secondaryIsButton ? (
            <Link
              href={secondaryHref}
              className={`inline-flex h-9 items-center gap-2 rounded-full border border-[#E6E8F5] bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
