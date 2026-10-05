import Card from "@/components/shared/card";
import type { Character } from "@/types/bussiness/script-type";
import { Field } from "./primitives";

export function CharactersSection({ characters }: { characters: Character[] }) {
  if (!characters.length) return null;
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-baseline gap-2">
        <h3 className="text-[14px] font-semibold text-neutral-900">Characters</h3>
        <span className="text-[12px] text-neutral-400">· {characters.length}</span>
      </div>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {characters.map((character, index) => (
          <li
            key={character.id || character.name || index}
            className="rounded-xl border border-[#E6E8F5] bg-white p-3"
          >
            <p className="text-[13px] font-semibold text-neutral-900">
              {character.name || `Character ${index + 1}`}
            </p>
            {character.description ? (
              <p className="mt-1 text-[12px] leading-5 text-neutral-600">{character.description}</p>
            ) : null}
            <div className="mt-2 space-y-1.5">
              <Field label="Appearance">
                {character.appearance ? <p>{character.appearance}</p> : null}
              </Field>
              <Field label="Personality">
                {character.personality ? <p>{character.personality}</p> : null}
              </Field>
              <Field label="Voice">{character.voice ? <p>{character.voice}</p> : null}</Field>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
