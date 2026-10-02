import Card from "@/components/shared/card";
import type { ScriptGenerationResponse } from "@/types/bussiness/script-type";
import { CharactersSection } from "./charactersection";
import { Field } from "./primitives";
import { ProjectSection } from "./projectsection";
import { ScenesSection } from "./scenesection";
import { ScriptSection } from "./scriptSection";
import { getScriptFromResult } from "./utils";

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

  return (
    <article className="space-y-3">
      {total > 1 ? (
        <div className="flex items-center gap-2 px-1">
          <span className="grid size-6 place-items-center rounded-full bg-[#ECEBFF] text-[11px] font-semibold text-[#5B57E6]">
            {index + 1}
          </span>
          <p className="text-[13px] font-semibold text-neutral-800">
            {project?.name || script?.title || `Script ${index + 1}`}
          </p>
          {item.meta?.status ? (
            <span className="rounded-full bg-[#F6F7FD] px-2 py-0.5 text-[10px] font-medium text-neutral-600">
              {item.meta.status}
            </span>
          ) : null}
        </div>
      ) : null}

      {project ? <ProjectSection project={project} /> : null}
      {script ? <ScriptSection script={script} /> : null}

      {item.visual_prompt ? (
        <Card className="p-4">
          <Field label="Visual prompt">
            <p className="whitespace-pre-line">{item.visual_prompt}</p>
          </Field>
        </Card>
      ) : null}

      <CharactersSection characters={characters} />
      <ScenesSection scenes={scenes} />
    </article>
  );
}
