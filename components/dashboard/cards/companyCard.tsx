import type { ComponentType, ReactNode } from "react";
import { ExternalLink, Globe, RefreshCcw } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import Card from "@/components/shared/card";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import type { Company, CompanyProfile, Competitor } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  company: Company;
  profile?: CompanyProfile | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
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

const COMPETITOR_SWATCHES = ["#4F6BF6", "#3E9E1C", "#F5A70B", "#0E8F9B", "#E0457B", "#7C4FF0"];

const initials = (name: string) =>
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

function CompetitorRow({
  competitor,
  index,
}: {
  competitor: Competitor;
  index: number;
}) {
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
              backgroundColor: COMPETITOR_SWATCHES[index % COMPETITOR_SWATCHES.length],
            }}
            aria-hidden="true"
          >
            {initials(competitor.name)}
          </span>
        )}
        <p className="min-w-0 truncate text-sm font-semibold text-neutral-900">
          {competitor.name}
        </p>
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
    </li>
  );
}

export default function CompanyCard({
  company,
  profile,
  onRefresh,
  isRefreshing = false,
}: Props) {
  const website = company.links.find((link) => link.id === "web");
  const logoUrl = company.logoUrl || company.logoSrc;
  const coreOffering = company.coreOffering || profile?.core_offering;

  return (
    <Card className="flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-linear-to-br from-[#4F46E5] to-[#8B5CF6] text-base font-semibold text-white">
            {logoUrl ? (
              <AssetImage
                src={logoUrl}
                alt={company.name}
                width={44}
                height={44}
                className="size-11 object-cover"
              />
            ) : (
              initials(company.name)
            )}
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
            {company.tagline ? (
              <p className="text-xs text-neutral-500">{company.tagline}</p>
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
        <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          {company.links.map((link) => {
            const Icon = PLATFORM_ICONS[link.id] ?? Globe;
            const assetIcon = PLATFORM_ASSET_ICONS[link.id];
            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center gap-2.5 rounded-full text-sm text-neutral-800 ${FOCUS_RING}`}
                >
                  <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-[#F1F3FB] text-neutral-800 transition-colors group-hover:bg-[#E3E6FF]">
                    {assetIcon ? (
                      <AssetImage
                        src={assetIcon}
                        alt=""
                        width={18}
                        height={18}
                        className="size-4.5 object-contain"
                      />
                    ) : (
                      <Icon className="size-4" />
                    )}
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
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {company.competitors.map((competitor, index) => (
              <CompetitorRow
                key={competitor.id}
                competitor={competitor}
                index={index}
              />
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
