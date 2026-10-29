import { MarketingDocumentationDetails } from "@/types/bussiness/dashboard-documentation-type";
import { BulletList, Fields, Paragraph, SheetSection, Tags, TagSection } from "./utils";



export default function MarketingDetails({ details }: { details: MarketingDocumentationDetails }) {
  const scores = [
    { label: "Positioning Clarity", value: details.scores?.positioning_clarity },
    { label: "Differentiation", value: details.scores?.differentiation_strength },
  ].filter((score): score is { label: string; value: number } => typeof score.value === "number");

  return (
    <>
      {details.positioning ? (
        <SheetSection title="Positioning">
          <Paragraph>{details.positioning}</Paragraph>
          {details.assessment ? <p className="text-xs font-medium text-[#5452F6]">{details.assessment}</p> : null}
        </SheetSection>
      ) : null}

      {scores.length ? (
        <div className="grid grid-cols-2 gap-3">
          {scores.map((score) => (
            <div key={score.label} className="rounded-xl bg-[#F1F4FF] px-3 py-2.5">
              <p className="text-xs text-neutral-600">{score.label}</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">{score.value}/100</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[#5452F6]" style={{ width: `${Math.min(100, Math.max(0, score.value))}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {details.value_proposition ? (
        <SheetSection title="Value Proposition">
          <Paragraph>{details.value_proposition}</Paragraph>
        </SheetSection>
      ) : null}
    
      <Fields
        fields={[
          ["Specialization", details.attributes?.specialization],
          ["Service Breadth", details.attributes?.service_breadth],
          ["Enterprise Focus", details.attributes?.enterprise_focus],
          ["Geographic Focus", details.attributes?.geographic_focus],
        ]}
      />

      <TagSection title="Known For" items={details.known_for} />

      {details.what_is_unclear?.length ? (
        <SheetSection title="What Is Unclear">
          <BulletList items={details.what_is_unclear} />
        </SheetSection>
      ) : null}

      <TagSection title="Keywords" items={details.keywords} />

      {details.content_pillars?.length ? (
        <SheetSection title="Content Pillars">
          <div className="space-y-2.5">
            {details.content_pillars.map((pillar) => (
              <div key={pillar.name} className="rounded-xl border border-[#ECEDF5] p-3">
                <p className="text-sm font-medium text-neutral-900">{pillar.name}</p>
                {pillar.topics?.length ? (
                  <div className="mt-2">
                    <BulletList items={pillar.topics} />
                  </div>
                ) : null}
                {pillar.services?.length ? (
                  <div className="mt-2.5">
                    <Tags items={pillar.services} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </SheetSection>
      ) : null}
    </>
  );
}