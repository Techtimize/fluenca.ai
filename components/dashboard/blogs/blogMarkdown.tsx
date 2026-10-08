"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Block =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] };

type Props = {
  markdown: string;
  resolveHref?: (href: string) => string | null;
};

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
const BULLET = /^[-*]\s+/;
const NUMBERED = /^\d+\.\s+/;
const LINK_CLASS = "font-medium text-[#5B57E6] underline underline-offset-2 hover:text-[#4642c9]";

function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (paragraph.length) blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    if (list) blocks.push({ kind: "list", ...list });
    paragraph = [];
    list = null;
  };

  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      blocks.push({ kind: "heading", level: heading[1].length === 3 ? 3 : 2, text: heading[2] });
      continue;
    }
    const ordered = NUMBERED.test(line);
    if (ordered || BULLET.test(line)) {
      if (paragraph.length || (list && list.ordered !== ordered)) flush();
      list = list ?? { ordered, items: [] };
      list.items.push(line.replace(ordered ? NUMBERED : BULLET, ""));
      continue;
    }
    if (list) flush();
    paragraph.push(line);
  }
  flush();
  return blocks;
}

function safeHref(href: string): string | null {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  return /^https?:\/\//i.test(href) ? href : null;
}

function renderInline(text: string, resolveHref: Props["resolveHref"], keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let index = 0;
  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const key = `${keyPrefix}-${index++}`;
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-neutral-900">
          {match[1]}
        </strong>,
      );
    } else {
      const resolved = resolveHref ? resolveHref(match[3]) : match[3];
      const href = resolved ? safeHref(resolved) : null;
      if (!href) {
        nodes.push(match[2]);
      } else if (href.startsWith("/")) {
        nodes.push(
          <Link key={key} href={href} className={LINK_CLASS}>
            {match[2]}
          </Link>,
        );
      } else {
        nodes.push(
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {match[2]}
          </a>,
        );
      }
    }
    last = start + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function BlogMarkdown({ markdown, resolveHref }: Props) {
  return (
    <div className="space-y-4 text-[15px] leading-7 text-neutral-700">
      {parseBlocks(markdown).map((block, index) => {
        const key = `block-${index}`;
        if (block.kind === "heading") {
          const Tag = block.level === 3 ? "h4" : "h3";
          return (
            <Tag
              key={key}
              className={`pt-2 font-semibold text-neutral-900 ${block.level === 3 ? "text-base" : "text-lg"}`}
            >
              {renderInline(block.text, resolveHref, key)}
            </Tag>
          );
        }
        if (block.kind === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={key} className={`space-y-1.5 ps-5 ${block.ordered ? "list-decimal" : "list-disc"}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, resolveHref, `${key}-${itemIndex}`)}</li>
              ))}
            </Tag>
          );
        }
        return <p key={key}>{renderInline(block.text, resolveHref, key)}</p>;
      })}
    </div>
  );
}
