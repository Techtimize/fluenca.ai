import type { ComponentType } from "react";
import { ExternalLink, Globe, Pencil } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import Card from "@/components/shared/card";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import type { Company, CompanyProfile } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  company: Company;
  // Extra details from the analysis; currently the positioning line.
  profile?: CompanyProfile | null;
  onEdit?: () => void;
};

const PLATFORM_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  web: Globe,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

// Placeholder swatches for competitors without a logo, picked by position.
const COMPETITOR_SWATCHES = ["#4F6BF6", "#3E9E1C", "#F5A70B", "#0E8F9B", "#E0457B", "#7C4FF0"];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

export default function CompanyCard({ company, profile, onEdit }: Props) {
  const website = company.links.find((link) => link.id === "web");

  return (
    <Card className="flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-[#4F46E5] to-[#8B5CF6] text-base font-semibold text-white">
            {initials(company.name)}
          </span>
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900">
              <span className="truncate">{company.name}</span>
              {website?.href ? (
                <a
                  href={website.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open website"
                  className={`rounded text-neutral-400 hover:text-neutral-800 ${FOCUS_RING}`}
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </h2>
            {company.tagline ? <p className="text-xs text-neutral-500">{company.tagline}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit company details"
          className={`rounded-lg p-1.5 text-neutral-700 hover:bg-neutral-100 ${FOCUS_RING}`}
        >
          <Pencil className="size-4.5" />
        </button>
      </div>

      {company.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <li key={tag} className="rounded-lg bg-[#EEF0FF] px-3 py-1.5 text-xs text-neutral-700">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {company.description ? (
        <p className="mt-4 line-clamp-4 text-sm leading-6 text-neutral-800">{company.description}</p>
      ) : null}

      {profile?.positioning ? (
        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-neutral-500">{profile.positioning}</p>
      ) : null}

      {company.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          {company.links.map((link) => {
            const Icon = PLATFORM_ICONS[link.id] ?? Globe;
            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center gap-2.5 rounded-full text-sm text-neutral-800 ${FOCUS_RING}`}
                >
                  <span className="grid size-9 place-items-center rounded-full bg-[#F1F3FB] text-neutral-800 transition-colors group-hover:bg-[#E3E6FF]">
                    <Icon className="size-4" />
                  </span>
                  <span className="group-hover:text-neutral-950">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {company.competitors.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2.5 text-sm font-semibold text-neutral-900">Competitors</h3>
          <ul className="flex flex-wrap gap-3">
            {company.competitors.map((c, index) => {
              const content = (
                <>
                  {c.logoSrc ? (
                    <AssetImage src={c.logoSrc} alt="" width={28} height={28} className="size-7 rounded-lg object-contain" />
                  ) : (
                    <span
                      className="grid size-7 place-items-center rounded-lg text-[11px] font-semibold text-white"
                      style={{ backgroundColor: COMPETITOR_SWATCHES[index % COMPETITOR_SWATCHES.length] }}
                      aria-hidden="true"
                    >
                      {initials(c.name)}
                    </span>
                  )}
                  {c.name}
                </>
              );
              const chip = "flex items-center gap-2.5 rounded-xl border border-[#E6E8F5] bg-white py-1.5 pl-1.5 pr-4 text-sm text-neutral-800";
              return (
                <li key={c.id}>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className={`${chip} hover:bg-[#F6F7FD] ${FOCUS_RING}`}>
                      {content}
                    </a>
                  ) : (
                    <span className={chip}>{content}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}
