import type { ComponentType } from "react";
import { ExternalLink, Globe, Pencil } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import Card from "@/components/shared/card";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import type { Company, CompanyProfile } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  company: Company;
  // Company details from the analysis; shows positioning and social links.
  profile?: CompanyProfile | null;
  onEdit?: () => void;
};

const PLATFORMS: Record<string, { icon: ComponentType<{ className?: string }>; className: string }> = {
  web: { icon: Globe, className: "text-neutral-700" },
  linkedin: { icon: LinkedInIcon, className: "text-[#0A66C2]" },
  instagram: { icon: InstagramIcon, className: "text-[#E1306C]" },
  facebook: { icon: FacebookIcon, className: "text-[#1877F2]" },
};

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
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-neutral-100 text-base font-semibold text-neutral-700">
            {initials(company.name)}
          </span>
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
              {company.name}
              {website?.href ? (
                <a href={website.href} target="_blank" rel="noreferrer" aria-label="Open website" className="text-neutral-500 hover:text-neutral-800">
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </h2>
            {company.tagline ? <p className="text-[12px] text-neutral-500">{company.tagline}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit company details"
          className={`rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 ${FOCUS_RING}`}
        >
          <Pencil className="size-4" />
        </button>
      </div>

      {company.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-3 py-1 text-[11px] text-neutral-700">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 line-clamp-6 text-[13px] leading-6 text-neutral-700">{company.description}</p>

      {profile ? (
        <div className="mt-4 space-y-3">
          {profile.positioning ? <p className="text-[13px] text-neutral-600">{profile.positioning}</p> : null}
          <div className="flex items-center gap-2">
            {profile.linkedin_url ? (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full border border-[#E6E8F5] text-[#0A66C2] hover:bg-neutral-50">
                <LinkedInIcon />
              </a>
            ) : null}
            {profile.instagram_url ? (
              <a href={profile.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-full border border-[#E6E8F5] text-[#E1306C] hover:bg-neutral-50">
                <InstagramIcon />
              </a>
            ) : null}
            {profile.instagram_username ? (
              <span className="text-[12px] text-neutral-500">@{profile.instagram_username.replace(/^@/, "")}</span>
            ) : null}
          </div>
        </div>
      ) : null}

      {!profile && company.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-neutral-700">
          {company.links.map((link) => {
            const platform = PLATFORMS[link.id] ?? PLATFORMS.web;
            const Icon = platform.icon;
            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-neutral-950"
                >
                  <span className={`grid size-9 place-items-center rounded-full border border-[#E6E8F5] ${platform.className}`}>
                    <Icon className="size-4" />
                  </span>
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {company.competitors.length > 0 && (
        <>
          <h3 className="mb-2 mt-5 text-[13px] font-semibold text-neutral-900">Competitors</h3>
          <ul className="flex flex-wrap gap-3">
            {company.competitors.map((c) => {
              const content = (
                <>
                  {c.logoSrc ? (
                    <AssetImage src={c.logoSrc} alt="" width={24} height={24} className="size-6 rounded-md object-contain" />
                  ) : (
                    <span className="grid size-6 place-items-center rounded-md bg-[#EEF0FF] text-[11px] font-semibold text-[#5452F6]">
                      {initials(c.name)}
                    </span>
                  )}
                  {c.name}
                </>
              );
              return (
                <li key={c.id}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-2 rounded-xl border border-[#E6E8F5] bg-white px-3 py-2 text-[13px] text-neutral-800 hover:bg-neutral-50 ${FOCUS_RING}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 rounded-xl border border-[#E6E8F5] bg-white px-3 py-2 text-[13px] text-neutral-800">
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Card>
  );
}