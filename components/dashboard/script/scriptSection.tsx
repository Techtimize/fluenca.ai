import Card from "@/components/shared/card";
import type { Script } from "@/types/bussiness/script-type";
import { Field } from "./primitives";

export function ScriptSection({ script }: { script: Script }) {
  return (
    <Card className="p-4">
      <h3 className="text-[15px] font-semibold text-neutral-900">
        {script.title || "Untitled script"}
      </h3>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Logline">
          {script.logline ? <p className="whitespace-pre-line">{script.logline}</p> : null}
        </Field>
        <Field label="Hook">
          {script.hook ? <p className="whitespace-pre-line">{script.hook}</p> : null}
        </Field>
        <Field label="Caption">
          {script.caption ? <p className="whitespace-pre-line">{script.caption}</p> : null}
        </Field>
        <Field label="CTA">{script.cta ? <p>{script.cta}</p> : null}</Field>
      </div>

      {script.body ? (
        <div className="mt-3 rounded-xl border border-[#E6E8F5] bg-[#FAFBFF] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-neutral-400">
            Body
          </p>
          <p className="mt-1 whitespace-pre-line text-[13px] leading-6 text-neutral-700">
            {script.body}
          </p>
        </div>
      ) : null}
    </Card>
  );
}
