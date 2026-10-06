import Card from "@/components/shared/card";
import type { ScriptProject } from "@/types/bussiness/script-type";
import { MetaChip } from "./primitives";

export function ProjectSection({ project }: { project: ScriptProject }) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-900">
            {project.name || "Untitled project"}
          </h2>
          {project.description ? (
            <p className="mt-1 text-[13px] leading-5 text-neutral-600">{project.description}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <MetaChip label="Platform" value={project.platform} />
        <MetaChip label="Format" value={project.format} />
        <MetaChip label="Tone" value={project.tone} />
        <MetaChip label="Audience" value={project.audience} />
        <MetaChip label="Type" value={project.content_type} />
        <MetaChip
          label="Duration"
          value={project.duration_seconds ? `${project.duration_seconds}s` : null}
        />
        <MetaChip label="Ratio" value={project.aspect_ratio} />
      </div>
    </Card>
  );
}
