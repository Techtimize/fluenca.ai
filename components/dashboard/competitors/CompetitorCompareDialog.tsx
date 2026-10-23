"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe2 } from "lucide-react";
import { toast } from "sonner";
import {
  InstagramProfileCard,
  isBriefCompetitor,
  LinkedInIntel,
  Section,
  WebsiteIntelCards,
} from "@/components/dashboard/competitors/CompetitiveBriefResults";
import { asCompetitorsListResponse } from "@/components/dashboard/competitors/versionUtils";
import { InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import { CompetitorAnalysisManualMutation } from "@/routes/bussiness/Bussiness-Mutation";
import {
  CompetitorAnalysisJobQuery,
  CompetitorAnalysisManualLatestResponseQuery,
} from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type { CompetitorsListResponse } from "@/types/bussiness/competitoranalysis-type";
import type { Competitor } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

const JOB_FAILED = new Set(["failed", "error", "cancelled", "canceled"]);
const JOB_DONE = new Set([...JOB_FAILED, "completed", "succeeded", "success", "ready"]);

/** Id passed to `start()` for the "Compare all" action, as opposed to one competitor's own id. */
export const COMPARE_ALL_ID = "__all__";

/** Instagram handle from a profile URL ("https://instagram.com/acme/" → "@acme"). */
function instagramHandle(url: string) {
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  const handle = (match ? match[1] : url).trim().replace(/^@+/, "");
  return handle ? `@${handle}` : "";
}

function websiteUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** The values the manual analysis accepts for one competitor: @handle, LinkedIn URL, website. */
export function competitorInputs(competitor: Competitor) {
  return [
    competitor.instagramUrl ? instagramHandle(competitor.instagramUrl) : "",
    competitor.linkedinUrl?.trim() ?? "",
    websiteUrl(competitor.websiteUrl || competitor.href || ""),
  ].filter(Boolean);
}

type CompareRun = { id: string; names: string[]; jobId: string | null; failed: boolean };

/**
 * Starts a manual analysis for some competitors and only opens the dialog once the API has
 * returned the finished comparison (the triggering button shows "Comparing…" in the meantime).
 */
export function useCompetitorCompare() {
  const companyId = useAuthStore((s) => s.company_id);
  const mutation = CompetitorAnalysisManualMutation();
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState<CompareRun | null>(null);
  const [result, setResult] = useState<CompetitorsListResponse | null>(null);

  const job = CompetitorAnalysisJobQuery(run?.jobId ?? "");
  const jobStatus = String(job.data?.status ?? "").toLowerCase();
  const waitingForJob = Boolean(run?.jobId) && !JOB_DONE.has(jobStatus) && !job.isError;
  const runFailed = Boolean(run?.failed) || JOB_FAILED.has(jobStatus);
  const waitingForMutation = mutation.isPending;

  const shouldFetchLatest =
    Boolean(run) && !open && !runFailed && !waitingForMutation && !waitingForJob && Boolean(companyId);
  const latest = CompetitorAnalysisManualLatestResponseQuery(shouldFetchLatest ? companyId : "");

  useEffect(() => {
    if (!run || open) return;

    if (runFailed) {
      const message =
        String(job.data?.error || job.data?.message || "") ||
        "The comparison did not finish. Try again in a moment.";
      toast.error(message);
      setRun(null);
      return;
    }

    if (!shouldFetchLatest) return;

    if (latest.isSuccess) {
      const parsed = asCompetitorsListResponse(latest.data);
      if (parsed) {
        setResult(parsed);
        setOpen(true);
      } else {
        toast.error("The comparison did not return any data. Try again in a moment.");
        setRun(null);
      }
      return;
    }

    if (latest.isError) {
      toast.error(getApiErrorMessage(latest.error, "Failed to load the comparison"));
      setRun(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, open, runFailed, shouldFetchLatest, latest.isSuccess, latest.isError, latest.data, latest.error]);

  const start = (competitors: Competitor[], id: string) => {
    const values = [...new Set(competitors.flatMap(competitorInputs))];
    if (!companyId) {
      toast.error("Complete your company analysis first.");
      return;
    }
    if (!values.length) {
      toast.error("These competitors have no Instagram, LinkedIn or website to compare.");
      return;
    }
    setResult(null);
    setRun({ id, names: competitors.map((c) => c.name), jobId: null, failed: false });
    mutation.mutate(
      { company_id: companyId, competitors: values },
      {
        onSuccess: (response) =>
          setRun((prev) =>
            prev && {
              ...prev,
              jobId: response?.job_id ?? null,
              failed: response?.success === false,
            },
          ),
        onError: () => setRun((prev) => prev && { ...prev, failed: true }),
      },
    );
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setRun(null);
      setResult(null);
    }
  };

  return {
    start,
    isBusy: Boolean(run) && !open,
    isComparing: (id: string) => Boolean(run && run.id === id && !open),
    dialogProps: { open, onOpenChange: handleOpenChange, run, result },
  };
}

type CompetitorsField = NonNullable<CompetitorsListResponse["competitors"]>[number];

function CompareCards({
  data,
  competitorNames,
}: {
  data: CompetitorsListResponse;
  competitorNames: string[];
}) {
  const brief = data.result ?? data;
  const nameSet = new Set(competitorNames.map((n) => n.toLowerCase()));
  const allCompetitors = ((brief.competitors ?? []) as CompetitorsField[]).filter(isBriefCompetitor);
  const matched = allCompetitors.filter((c) => c.name && nameSet.has(c.name.toLowerCase()));
  const competitorsToShow = matched.length ? matched : allCompetitors;

  const yourWebsite = brief.website_comparison?.your_company ?? brief.company?.website_profile;
  const websiteByName = new Map(
    (brief.website_comparison?.competitors ?? []).map((c) => [(c.name ?? "").toLowerCase(), c]),
  );
  const websiteProfiles = [
    yourWebsite ? { ...yourWebsite, name: "You" } : null,
    ...competitorsToShow.map((c) => {
      const profile = (c.name ? websiteByName.get(c.name.toLowerCase()) : undefined) ?? c.website;
      return profile ? { ...profile, name: c.name } : null;
    }),
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  const yourLinkedin = brief.linkedin_comparison?.your_company;
  const linkedinByName = new Map(
    (brief.linkedin_comparison?.competitors ?? []).map((c) => [(c.name ?? "").toLowerCase(), c]),
  );
  const linkedinSides = [
    yourLinkedin ? { ...yourLinkedin, name: "You" } : null,
    ...competitorsToShow.map((c) => {
      const fromComparison = c.name ? linkedinByName.get(c.name.toLowerCase()) : undefined;
      if (fromComparison) return fromComparison;
      if (!c.linkedin_url && !c.links?.linkedin) return null;
      return {
        name: c.name,
        linkedin_url: c.linkedin_url ?? c.links?.linkedin?.url ?? null,
        linkedin_followers: c.links?.linkedin?.followers ?? null,
        linkedin_company_size: c.linkedin_company_size ?? c.links?.linkedin?.company_size ?? null,
        linkedin_total_employees: c.linkedin_total_employees ?? c.links?.linkedin?.total_employees ?? null,
        linkedin_profiles_sampled: c.linkedin_profiles_sampled ?? c.links?.linkedin?.profiles_sampled ?? null,
        employees: c.employees,
        is_hiring: c.is_hiring ?? c.links?.linkedin?.is_hiring ?? null,
      };
    }),
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  const yourInstagram = brief.user_instagram ?? brief.company?.instagram;
  const instagramByName = new Map(
    (brief.competitors_instagram ?? []).map((p) => [(p.name ?? "").toLowerCase(), p]),
  );
  const instagramProfiles = [
    yourInstagram ? { ...yourInstagram, name: "You" } : null,
    ...competitorsToShow.map((c) => {
      const fromList = c.name ? instagramByName.get(c.name.toLowerCase()) : undefined;
      if (fromList) return { ...fromList, name: c.name };
      const link = c.links?.instagram;
      if (link) {
        return {
          name: c.name,
          username: link.username ?? c.username,
          followers: link.followers ?? c.followers,
          following: link.following ?? c.following,
          media_count: link.media_count ?? c.media_count,
          posts_count: c.posts_count,
          profile_url: link.url ?? c.profile_url,
          profile_picture_url: link.profile_picture_url ?? c.profile_picture_url ?? c.image_url,
        };
      }
      if (c.username || c.followers) {
        return {
          name: c.name,
          username: c.username,
          followers: c.followers,
          following: c.following,
          media_count: c.media_count,
          posts_count: c.posts_count,
          profile_url: c.profile_url,
          profile_picture_url: c.profile_picture_url ?? c.image_url,
        };
      }
      return null;
    }),
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  const hasAny = websiteProfiles.length > 0 || instagramProfiles.length > 0 || linkedinSides.length > 0;
  if (!hasAny) {
    return (
      <p className="rounded-2xl border border-dashed border-[#E6E8F5] bg-[#FBFBFF] px-4 py-10 text-center text-[13px] text-neutral-500">
        We could not find website, Instagram or LinkedIn details for this comparison yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Section title="Website" description="Positioning, services and offers, side by side." icon={Globe2}>
        {websiteProfiles.length ? (
          <WebsiteIntelCards profiles={websiteProfiles} />
        ) : (
          <p className="text-[12px] text-neutral-400">No website details found.</p>
        )}
      </Section>

      <Section title="Instagram" description="Audience size and posting activity, side by side." icon={InstagramIcon}>
        {instagramProfiles.length ? (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {instagramProfiles.map((profile, index) => (
              <li key={`${profile.name || "instagram"}-${index}`}>
                <InstagramProfileCard title={profile.name || "Instagram"} profile={profile} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-neutral-400">No Instagram details found.</p>
        )}
      </Section>

      <Section title="LinkedIn" description="Company size, hiring signals and leadership, side by side." icon={LinkedInIcon}>
        {linkedinSides.length ? (
          <LinkedInIntel comparison={{ competitors: linkedinSides }} />
        ) : (
          <p className="text-[12px] text-neutral-400">No LinkedIn details found.</p>
        )}
      </Section>
    </div>
  );
}

export default function CompetitorCompareDialog({
  open,
  onOpenChange,
  run,
  result,
}: ReturnType<typeof useCompetitorCompare>["dialogProps"]) {
  const title = run?.names.length === 1 ? `You vs ${run.names[0]}` : "You vs your competitors";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,960px)] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-5xl sm:rounded-3xl"
      >
        <DialogHeader className="shrink-0 border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4 pe-12 sm:px-6 sm:py-5">
          <DialogTitle className="text-[18px] font-semibold tracking-tight text-neutral-900">{title}</DialogTitle>
          <DialogDescription className="mt-1 text-[13px] leading-5 text-neutral-500">
            Manual competitor analysis across Instagram, LinkedIn and website. It is also saved under{" "}
            <Link
              href={PAGE_ROUTES.COMPETITOR_ANALYSIS_MANUAL}
              className={`rounded font-medium text-[#5B57E6] hover:underline ${FOCUS_RING}`}
            >
              Competitor analysis → Manual
            </Link>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {open && run && result ? <CompareCards data={result} competitorNames={run.names} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
