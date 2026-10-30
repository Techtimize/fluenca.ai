import { CompetitorsDocumentationDetails } from "@/types/bussiness/dashboard-documentation-type";
import { BulletList, SheetSection } from "./utils";
import { InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import { Globe } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import { FOCUS_RING } from "@/utils/ui-classes";


export default function CompetitorsDetails({ details }: { details: CompetitorsDocumentationDetails }) {
  const competitors = details.items ?? [];

  return (
    <>
      {details.matching_criteria?.length ? (
        <SheetSection title="How They Were Matched">
          <BulletList items={details.matching_criteria} />
        </SheetSection>
      ) : null}

      <SheetSection title={`Competitors${details.count != null ? ` (${details.count})` : ""}`}>
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
      </SheetSection>
    </>
  );
}