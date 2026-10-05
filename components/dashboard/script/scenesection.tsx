import Card from "@/components/shared/card";
import type { Scene } from "@/types/bussiness/script-type";
import { Field, MetaChip } from "./primitives";

export function ScenesSection({ scenes }: { scenes: Scene[] }) {
  if (!scenes.length) return null;
  const sorted = [...scenes].sort(
    (a, b) => (a.scene_number ?? 0) - (b.scene_number ?? 0),
  );

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-baseline gap-2">
        <h3 className="text-[14px] font-semibold text-neutral-900">Scenes</h3>
        <span className="text-[12px] text-neutral-400">· {sorted.length}</span>
      </div>
      <ol className="space-y-2.5">
        {sorted.map((scene, index) => (
          <li
            key={scene.id || scene.scene_number || index}
            className="rounded-xl border border-[#E6E8F5] bg-[#FAFBFF] p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-neutral-900">
                Scene {scene.scene_number || index + 1}
                {scene.headline ? ` · ${scene.headline}` : ""}
              </p>
              <div className="flex flex-wrap gap-1">
                <MetaChip label="Duration" value={scene.duration ? `${scene.duration}s` : null} />
                <MetaChip label="Location" value={scene.location} />
                <MetaChip label="Time" value={scene.time_of_day} />
                <MetaChip label="Media" value={scene.media_type} />
              </div>
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Field label="Narration">
                {scene.narration ? <p className="whitespace-pre-line">{scene.narration}</p> : null}
              </Field>
              <Field label="Action">
                {scene.action ? <p className="whitespace-pre-line">{scene.action}</p> : null}
              </Field>
              <Field label="Camera">{scene.camera ? <p>{scene.camera}</p> : null}</Field>
              <Field label="Visual style">
                {scene.visual_style ? <p>{scene.visual_style}</p> : null}
              </Field>
              <Field label="Body">
                {scene.body_text ? <p className="whitespace-pre-line">{scene.body_text}</p> : null}
              </Field>
              <Field label="Visual prompt">
                {scene.visual_prompt ? (
                  <p className="whitespace-pre-line">{scene.visual_prompt}</p>
                ) : null}
              </Field>
            </div>

            {scene.dialogue?.length ? (
              <div className="mt-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-neutral-400">
                  Dialogue
                </p>
                <ul className="mt-1 space-y-1">
                  {scene.dialogue.map((line, lineIndex) => (
                    <li
                      key={`${scene.id}-dialogue-${lineIndex}`}
                      className="text-[12px] leading-5 text-neutral-700"
                    >
                      “{line}”
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {scene.characters?.length ? (
              <p className="mt-2 text-[11px] text-neutral-500">
                Cast: {scene.characters.join(", ")}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </Card>
  );
}
