import type { ScriptGenerationResponse } from "@/types/bussiness/script-type";
import { ScriptResultCard } from "./scriptresultcard";

export default function ScriptResults({ items }: { items: ScriptGenerationResponse[] }) {
  if (!items.length) return null;

  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <ScriptResultCard
          key={item.project?.id || item.script?.id || item.meta?.prompt_id || index}
          item={item}
          index={index}
          total={items.length}
        />
      ))}
    </div>
  );
}
