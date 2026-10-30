import { PainPointsDocumentationDetails } from "@/types/bussiness/dashboard-documentation-type";
import { ListHeading } from "./utils";
import { Check, UserRound } from "lucide-react";



export default function PainPointsDetails({ details }: { details: PainPointsDocumentationDetails }) {
  const problems = details.pain_points ?? [];
  const people = details.who_feels_it ?? [];
  const solutions = details.how_you_solve_it ?? [];

  if (!problems.length && !people.length && !solutions.length) {
    return <p className="text-sm text-neutral-500">No pain points identified yet.</p>;
  }

  return (
    <div className="space-y-7">
      {problems.length ? (
        <section className="space-y-1">
          <ListHeading title="The problem" count={problems.length} />
          <ol className="divide-y divide-[#EEF0F6]">
            {problems.map((point, index) => (
              <li key={point} className="flex gap-3 py-3 text-sm leading-6 text-neutral-800">
                <span className="w-5 shrink-0 pt-px text-xs font-medium tabular-nums text-neutral-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {point}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {people.length ? (
        <section className="space-y-1">
          <ListHeading title="Who feels it" count={people.length} />
          <ul className="divide-y divide-[#EEF0F6]">
            {people.map((person) => (
              <li key={person} className="flex items-start gap-3 py-2.5 text-sm leading-6 text-neutral-800">
                <UserRound className="mt-1 size-4 shrink-0 text-neutral-400" aria-hidden="true" />
                {person}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {solutions.length ? (
        <section className="space-y-2">
          <ListHeading title="How you solve it" count={solutions.length} />
          <ul className="space-y-3 rounded-2xl bg-[#F6F7FB] p-4">
            {solutions.map((solution) => (
              <li key={solution} className="flex items-start gap-3 text-sm leading-6 text-neutral-800">
                <Check className="mt-1 size-4 shrink-0 text-[#5452F6]" strokeWidth={2.5} aria-hidden="true" />
                {solution}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}