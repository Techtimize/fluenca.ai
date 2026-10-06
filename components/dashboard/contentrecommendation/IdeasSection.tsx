import SharedCard from "@/components/shared/card";
import type { ContentIdea } from "@/types/bussiness/content-recommendation-type";
import IdeaCard from "./ideacard";
import SectionHeader from "./sectionHeader";

export default function IdeasSection({
  ideas,
  companyId,
}: {
  ideas: ContentIdea[];
  companyId: string;
}) {
  if (!ideas.length) return null;

  return (
    <SharedCard className="p-4">
      <SectionHeader label="content_ideas" count={ideas.length} />
      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {ideas.map((idea, index) => (
          <IdeaCard
            key={`${idea.title || idea.topic || "idea"}-${index}`}
            item={idea}
            index={index}
            companyId={companyId}
          />
        ))}
      </ul>
    </SharedCard>
  );
}
