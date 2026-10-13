import type { PlatformPlan } from "@/types/bussiness/content-recommendation-type";
import {
  PlatformStrategyCard,
  platformPlanToCardProps,
} from "./PlatformStrategyCard";

export default function PlatformStrategySection({
  platforms,
}: {
  platforms: PlatformPlan[];
}) {
  if (!platforms.length) return null;

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {platforms.map((plan, index) => {
        const props = platformPlanToCardProps(plan);
        return (
          <li key={`${plan.platform || "platform"}-${index}`}>
            <PlatformStrategyCard {...props} />
          </li>
        );
      })}
    </ul>
  );
}
