import { Pencil } from "lucide-react";
import AssetImage from "@/components/shared/assetImage";
import Card from "@/components/shared/card";
import type { Company } from "@/types/dashboard";
import { FOCUS_RING } from "@/utils/ui-classes";

type Props = {
  company: Company;
  onEdit?: () => void;
};

export default function CompanyCard({ company, onEdit }: Props) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <AssetImage src={company.logoSrc} alt={`${company.name} logo`} width={120} height={40} className="h-10 w-auto" />
          <p className="sr-only">{company.name}. {company.tagline}</p>
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

      <p className="mt-4 text-[13px] leading-6 text-neutral-700">{company.description}</p>

      {company.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-neutral-700">
          {company.links.map((link) => (
            <li key={link.id} className="flex items-center gap-2">
              <AssetImage src={link.iconSrc} alt="" width={16} height={16} className="size-4" />
              {link.href ? (
                <a href={link.href} target="_blank" rel="noreferrer" className="hover:underline">
                  {link.label}
                </a>
              ) : (
                link.label
              )}
            </li>
          ))}
        </ul>
      )}

      {company.competitors.length > 0 && (
        <>
          <h3 className="mb-2 mt-5 text-[13px] font-semibold text-neutral-900">Competitors</h3>
          <ul className="flex flex-wrap gap-3">
            {company.competitors.map((c) => (
              <li key={c.id} className="flex items-center gap-2 rounded-xl border border-[#E6E8F5] bg-white px-3 py-2 text-[13px] text-neutral-800">
                <AssetImage src={c.logoSrc} alt="" width={24} height={24} className="size-6 rounded-md object-contain" />
                {c.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}