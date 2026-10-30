import { ReactNode } from "react";

export function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

export function pathLabel(url: string, fallback: string): string {
  const slug = url.replace(/\/+$/, "").split("/").pop();
  return slug && !slug.includes(".com") ? slug : fallback;
}

export function Fields({ fields }: { fields: [string, string | null | undefined][] }) {
  const visible = fields.filter((field): field is [string, string] => Boolean(field[1]));
  if (!visible.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-3">
      {visible.map(([label, value]) => (
        <div key={label} className="rounded-xl bg-[#F1F4FF] px-3 py-2.5">
          <dt className="text-xs text-neutral-600">{label}</dt>
          <dd className="mt-1 text-sm font-semibold text-neutral-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ListHeading({ title, count, small }: { title: string; count: number; small?: boolean }) {
  const Heading = small ? "h4" : "h3";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <Heading className={small ? "text-xs font-medium text-neutral-500" : "text-sm font-semibold text-neutral-900"}>
        {title}
      </Heading>
      <span className="text-xs tabular-nums text-neutral-400">{count}</span>
    </div>
  );
}

export function SheetSection({ title, small, children }: { title: string; small?: boolean; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className={`font-semibold text-neutral-900 ${small ? "text-[13px]" : "text-sm"}`}>{title}</h3>
      {children}
    </section>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return <p className="text-[13px] leading-relaxed text-neutral-600">{children}</p>;
}


export function Tags({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((tag) => (
        <li key={tag} className="rounded-full bg-[#EEF0FF] px-2.5 py-1 text-xs text-[#4544C9]">
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function TagSection({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <SheetSection title={title}>
      <Tags items={items} />
    </SheetSection>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((text) => (
        <li key={text} className="flex gap-2 text-[13px] leading-snug text-neutral-600">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#5452F6]" aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  );
}