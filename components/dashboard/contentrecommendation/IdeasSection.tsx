import type { ContentIdea } from "@/types/bussiness/content-recommendation-type";
import IdeaCard from "./ideacard";

export default function IdeasSection({
  ideas,
  companyId,
}: {
  ideas: ContentIdea[];
  companyId: string;
}) {
  if (!ideas.length) return null;

  return (
    <section className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[18px] font-semibold tracking-tight text-neutral-900 sm:text-[20px]">
            Content ideas
          </h2>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#ECEBFF] px-2 text-[12px] font-semibold tabular-nums text-[#5B57E6]">
            {ideas.length}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-neutral-500">
          Recommended topics based on your goals and platform strategy.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ideas.map((idea, index) => (
          <IdeaCard
            key={`${idea.title || idea.topic || "idea"}-${index}`}
            item={idea}
            index={index}
            companyId={companyId}
          />
        ))}
      </ul>
    </section>
  );
}
