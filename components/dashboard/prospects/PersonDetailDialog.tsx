"use client";

import { useEffect } from "react";
import { Briefcase, GraduationCap, Loader2, Mail, MapPin, UserX } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import { LinkedInIcon } from "@/components/shared/brandIcons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/errors/error-utils";
import { PersonDetailMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type {
  PartialDate,
  PersonDetail,
  PersonDetailRequest,
  PersonRole,
} from "@/types/bussiness/linkedin-people-type";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  /** Who to look up; the dialog is open while this is set. */
  lookup: PersonDetailRequest | null;
  onClose: () => void;
};

export default function PersonDetailDialog({ lookup, onClose }: Props) {
  return (
    <Dialog open={Boolean(lookup)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-5 sm:max-w-2xl sm:p-6">
        {lookup ? <PersonDetailBody lookup={lookup} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function PersonDetailBody({ lookup }: { lookup: PersonDetailRequest }) {
  const { mutate, data, error, isError, isPending } = PersonDetailMutation();

  // Look the person up when the dialog opens for them.
  useEffect(() => {
    mutate(lookup);
  }, [lookup, mutate]);

  if (isPending || (!data && !isError)) {
    return (
      <>
        <DialogTitle className="sr-only">Person details</DialogTitle>
        <div className="flex items-center justify-center py-16" aria-busy="true">
          <Loader2 className="size-6 animate-spin text-[#5B57E6]" aria-label="Loading person" />
        </div>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <DialogTitle className="sr-only">Person details</DialogTitle>
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
          {getApiErrorMessage(error, "Could not load this person's details")}
        </p>
      </>
    );
  }

  if (data.match.status !== "candidate") {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <UserX className="size-7 text-[#A5A8F5]" aria-hidden="true" />
        <DialogTitle className="mt-3 text-[15px] font-semibold text-neutral-900">No match found</DialogTitle>
        <DialogDescription className="mt-1 text-[13px] text-neutral-500">
          Try a LinkedIn URL or a work email for a better match.
        </DialogDescription>
      </div>
    );
  }

  return <PersonProfile person={data.match.person} score={data.match.score} />;
}

const formatDate = (date?: PartialDate | null) =>
  date
    ? new Date(date.year, (date.month ?? 1) - 1).toLocaleDateString(undefined, {
        year: "numeric",
        ...(date.month ? { month: "short" } : {}),
      })
    : "";

const dateRange = (start?: PartialDate | null, end?: PartialDate | null, current?: boolean | null) => {
  const from = formatDate(start);
  const to = current ? "Present" : formatDate(end);
  return [from, to].filter(Boolean).join(" – ");
};

function PersonProfile({ person, score }: { person: PersonDetail; score: number }) {
  const name = person.name?.full || [person.name?.first, person.name?.last].filter(Boolean).join(" ") || "Unknown";
  const role = person.current_role;
  const linkedin = person.social_urls.find((url) => url.includes("linkedin.com"));
  const otherLinks = [...person.social_urls.filter((url) => url !== linkedin), ...person.website_urls];

  return (
    <div className="space-y-5">
      <DialogHeader className="flex-row items-start gap-3 space-y-0 text-left">
        {person.avatar_url ? (
          <AssetImage
            src={person.avatar_url}
            alt=""
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-lg font-semibold text-[#5B57E6]">
            {name.charAt(0)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <DialogTitle className="text-lg font-semibold text-neutral-900">{name}</DialogTitle>
          <DialogDescription className="mt-0.5 text-[13px] text-neutral-500">
            {role ? `${role.title} at ${role.organization.name}` : "No current role found"}
          </DialogDescription>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-neutral-500">
            {person.location?.display ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" aria-hidden="true" />
                {person.location.display}
              </span>
            ) : null}
            {person.email ? (
              <a href={`mailto:${person.email}`} className={`inline-flex items-center gap-1 rounded text-[#5B57E6] hover:underline ${FOCUS_RING}`}>
                <Mail className="size-3" aria-hidden="true" />
                {person.email}
              </a>
            ) : null}
            {linkedin ? (
              <a href={linkedin} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 rounded text-[#5B57E6] hover:underline ${FOCUS_RING}`}>
                <LinkedInIcon className="size-3" />
                LinkedIn
              </a>
            ) : null}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#F1F2FB] px-2.5 py-1 text-[12px] font-semibold text-neutral-700">
          Match {score}%
        </span>
      </DialogHeader>

      {person.bio ? <p className="text-[13px] leading-6 text-neutral-700">{person.bio}</p> : null}

      {person.experience.length ? (
        <Timeline title="Experience" icon={Briefcase}>
          {person.experience.map((item, index) => (
            <RoleItem key={`${item.title}-${item.organization.name}-${index}`} role={item} />
          ))}
        </Timeline>
      ) : null}

      {person.education.length ? (
        <Timeline title="Education" icon={GraduationCap}>
          {person.education.map((item, index) => (
            <li key={`${item.institution?.name}-${index}`}>
              <p className="text-[13px] font-medium text-neutral-900">{item.institution?.name ?? "School"}</p>
              <p className="text-[12px] text-neutral-500">
                {[item.degree, item.field_of_study].filter(Boolean).join(", ")}
                {item.start_date || item.end_date ? ` · ${dateRange(item.start_date, item.end_date)}` : ""}
              </p>
            </li>
          ))}
        </Timeline>
      ) : null}

      {person.skills.length ? (
        <section>
          <SectionTitle>Skills</SectionTitle>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {person.skills.map((skill) => (
              <li key={skill} className="rounded-full bg-[#F6F7FD] px-2.5 py-1 text-[12px] text-neutral-700">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {otherLinks.length ? (
        <section>
          <SectionTitle>Links</SectionTitle>
          <ul className="mt-2 space-y-1">
            {otherLinks.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer" className={`break-all rounded text-[13px] text-[#5B57E6] hover:underline ${FOCUS_RING}`}>
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h3 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-400">{children}</h3>;
}

function Timeline({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Briefcase;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-neutral-400">
        <Icon className="size-3.5" aria-hidden="true" />
        {title}
      </h3>
      <ul className="mt-2 space-y-2.5 border-s-2 border-[#EEF0FA] ps-3">{children}</ul>
    </section>
  );
}

function RoleItem({ role }: { role: PersonRole }) {
  return (
    <li>
      <p className="text-[13px] font-medium text-neutral-900">
        {role.title} <span className="font-normal text-neutral-500">at {role.organization.name}</span>
      </p>
      <p className="text-[12px] text-neutral-500">
        {[dateRange(role.start_date, role.end_date, role.is_current), role.location].filter(Boolean).join(" · ")}
      </p>
    </li>
  );
}
