import Image from "next/image";
import SharedCard from "@/components/shared/card";
import type { PlatformPlan } from "@/types/bussiness/content-recommendation-type";
import { Chip } from "./chipsandsection";
import SectionHeader from "./sectionHeader";

function platformIcon(platform?: string) {
  const lower = (platform || "").toLowerCase();
  if (lower.includes("instagram") || lower === "ig") return "/assets/insta.png";
  if (lower.includes("linkedin")) return "/assets/linkedin.png";
  return "/assets/globe.png";
}

export default function PlatformStrategySection({
  platforms,
}: {
  platforms: PlatformPlan[];
}) {
  if (!platforms.length) return null;

  return (
    <SharedCard className="p-4">
      <SectionHeader label="platform_strategy" count={platforms.length} />
      <ul className="grid gap-2.5 md:grid-cols-2">
        {platforms.map((plan, index) => {
          const ratioEntries = Object.entries(plan.content_ratio || {}).filter(
            ([, value]) => typeof value === "number",
          );

          return (
            <li
              key={`${plan.platform || "platform"}-${index}`}
              className="rounded-xl border border-[#E6E8F5] bg-white p-3.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#F6F7FD]">
                  <Image
                    src={platformIcon(plan.platform)}
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold capitalize text-neutral-900">
                    {plan.platform || "Platform"}
                  </p>
                  {plan.role ? (
                    <p className="mt-0.5 text-[12px] text-neutral-600">{plan.role}</p>
                  ) : null}
                </div>
              </div>

              {plan.goal_alignment ? (
                <p className="mt-3 text-[12px] text-neutral-600">
                  <span className="font-medium text-neutral-800">Goal: </span>
                  {plan.goal_alignment}
                </p>
              ) : null}

              {plan.formats?.length ? (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {plan.formats.map((format) => (
                    <li key={format}>
                      <Chip>{format}</Chip>
                    </li>
                  ))}
                </ul>
              ) : null}

              {ratioEntries.length ? (
                <ul className="mt-3 grid grid-cols-2 gap-1.5">
                  {ratioEntries.map(([label, value]) => (
                    <li
                      key={label}
                      className="rounded-lg bg-[#F6F7FD] px-2.5 py-1.5 text-[11px] text-neutral-600"
                    >
                      <span className="capitalize">{label.replace(/_/g, " ")}</span>
                      <span className="ml-1 font-semibold text-neutral-900">{value}%</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SharedCard>
  );
}
