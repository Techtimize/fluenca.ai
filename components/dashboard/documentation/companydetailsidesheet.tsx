
"use client";
import { Building2, Check, Globe, UserRound, X } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/shared/brandIcons";
import type {
  CompanyDocumentationDetails,
} from "@/types/bussiness/dashboard-documentation-type";
import { Fields, hostLabel, ListHeading, pathLabel } from "./utils";


export default function  CompanyDetails({ details }: { details: CompanyDocumentationDetails }) {
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
          <Fields
        fields={[
          ["Industry", details.industry],
          ["Region", details.region],
          ["Business Model", details.business_model],
          ["Maturity", details.business_maturity],
        ]}
      />
      {details.industries_targeted?.length ? (
        <section className="space-y-2">
          <ListHeading title="Industries targeted" count={details.industries_targeted.length} />
          <ul className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            {details.industries_targeted.map((industry) => (
              <li
                key={industry}
                className="flex items-start gap-2.5 border-b border-[#EEF0F6] py-2.5 text-sm leading-6 text-neutral-800"
              >
                <Building2 className="mt-1 size-4 shrink-0 text-neutral-400" aria-hidden="true" />
                {industry}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {details.core_offering || details.services?.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900">What it does</h3>
          {details.core_offering ? (
            <p className="border-l-2 border-[#5452F6] pl-3 text-sm leading-6 text-neutral-800">
              {details.core_offering}
            </p>
          ) : null}
          {details.services?.length ? (
            <div className="space-y-1 pt-1">
              <ListHeading title="Services" count={details.services.length} small />
              <ul className="divide-y divide-[#EEF0F6]">
                {details.services.map((service) => (
                  <li key={service} className="flex items-start gap-3 py-2.5 text-sm leading-6 text-neutral-800">
                    <Check className="mt-1 size-4 shrink-0 text-[#5452F6]" strokeWidth={2.5} aria-hidden="true" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {details.target_audience?.length ? (
        <section className="space-y-1">
          <ListHeading title="Target audience" count={details.target_audience.length} />
          <ul className="divide-y divide-[#EEF0F6]">
            {details.target_audience.map((audience) => (
              <li key={audience} className="flex items-start gap-3 py-2.5 text-sm leading-6 text-neutral-800">
                <UserRound className="mt-1 size-4 shrink-0 text-neutral-400" aria-hidden="true" />
                {audience}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
