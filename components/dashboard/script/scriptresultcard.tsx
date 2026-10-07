import type { ReactNode } from "react";
import {
  Clapperboard,
  Film,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import Card from "@/components/shared/card";
import type { ScriptGenerationResponse } from "@/types/bussiness/script-type";
import { CharactersSection } from "./charactersection";
import { Field, MetaChip } from "./primitives";
import { ProjectSection } from "./projectsection";
import { ScenesSection } from "./scenesection";
import { ScriptSection } from "./scriptSection";
import { getScriptFromResult } from "./utils";

function ResultBlock({
  step,
  title,
  description,
  icon: Icon,
  children,
}: {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 px-1">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ECEBFF] text-[#5B57E6]">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            Part {step}
          </p>
          <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
          <p className="mt-0.5 text-[12px] text-neutral-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function ScriptResultCard({
  item,
  index,
  total,
}: {
  item: ScriptGenerationResponse;
  index: number;
  total: number;
}) {
  const script = getScriptFromResult(item);
  const project = item.project;
  const characters = item.characters ?? [];
  const scenes = item.scenes ?? [];
  const title = project?.name || script?.title || `Script ${index + 1}`;

  let part = 0;
  const nextPart = () => {
    part += 1;
    return part;
  };

  return (
    <article className="overflow-hidden rounded-[28px] border border-[#E6E8F5] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <div className="border-b border-[#EEF0F8] bg-[linear-gradient(135deg,#F8F7FF_0%,#FFFFFF_60%)] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#5B57E6] text-[13px] font-bold text-white">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B57E6]">
                {total > 1 ? `Script ${index + 1} of ${total}` : "Your script"}
              </p>
              <h2 className="mt-1 truncate text-[17px] font-semibold tracking-tight text-neutral-900">
                {title}
              </h2>
              {script?.logline ? (
                <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-neutral-600">
                  {script.logline}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <MetaChip label="Status" value={item.meta?.status || "ready"} />
            <MetaChip label="Platform" value={project?.platform} />
            <MetaChip label="Format" value={project?.format} />
            <MetaChip
              label="Scenes"
              value={scenes.length ? String(scenes.length) : null}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {project ? (
          <ResultBlock
            step={nextPart()}
            title="Project brief"
            description="Audience, tone, and format for this piece."
            icon={Clapperboard}
          >
            <ProjectSection project={project} />
          </ResultBlock>
        ) : null}

        {script ? (
          <ResultBlock
            step={nextPart()}
            title="Script copy"
            description="Hook, body, caption, and call to action."
            icon={Sparkles}
          >
            <ScriptSection script={script} />
          </ResultBlock>
        ) : null}

        {item.visual_prompt ? (
          <ResultBlock
            step={nextPart()}
            title="Visual direction"
            description="Overall look-and-feel prompt for generation."
            icon={Film}
          >
            <Card className="p-4">
              <Field label="Visual prompt">
                <p className="whitespace-pre-line">{item.visual_prompt}</p>
              </Field>
            </Card>
          </ResultBlock>
        ) : null}

        {characters.length ? (
          <ResultBlock
            step={nextPart()}
            title="Characters"
            description="Who appears on screen and how they should feel."
            icon={Users}
          >
            <CharactersSection characters={characters} />
          </ResultBlock>
        ) : null}

        {scenes.length ? (
          <ResultBlock
            step={nextPart()}
            title="Scene breakdown"
            description="Shot-by-shot direction you can hand to design or production."
            icon={Film}
          >
            <ScenesSection scenes={scenes} />
          </ResultBlock>
        ) : null}
      </div>
    </article>
  );
}
