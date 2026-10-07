import type {
  IntelligenceJobResponse,
  IntelligenceJobStep,
} from "@/types/bussiness/intelligence-type";

// Turns intelligence job polls into a stream of small, visual feed items.
// Ids are stable between polls, so the page can reveal only the new ones.

export type Tone = "neutral" | "good" | "bad";

export type FeedItem =
  | { id: string; kind: "section"; step: string; title: string; note: string }
  | { id: string; kind: "text"; label: string; value: string }
  | { id: string; kind: "stats"; items: { label: string; value: string }[] }
  | { id: string; kind: "chips"; label: string; items: string[]; tone?: Tone }
  | {
      id: string;
      kind: "links";
      items: {
        type: "web" | "instagram" | "linkedin";
        label: string;
        href: string;
      }[];
    }
  | { id: string; kind: "score"; label: string; score: number; note?: string }
  | { id: string; kind: "competitor"; name: string; website?: string }
  | {
      id: string;
      kind: "action";
      when: string;
      platform: string;
      text: string;
      priority?: string;
      format?: string;
    }
  | { id: string; kind: "insight"; text: string; priority?: string };

// A feed item before buildFeed assigns its id (Omit that works per union member).
type WithoutId<T> = T extends unknown ? Omit<T, "id"> : never;
type NewItem = WithoutId<FeedItem>;

export const STEP_LABELS: Record<string, string> = {
  generate_dna: "Company DNA",
  analyze_company: "Company analysis",
  discover_competitors: "Competitor discovery",
  competitor_analysis: "Competitor analysis",
  planner: "30-day content plan",
  content_recommendation: "Content recommendation",
  script_generation: "Scripts",
};

export const humanize = (name: string) =>
  STEP_LABELS[name] ??
  name.replace(/[_-]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());

type Rec = Record<string, unknown>;
const rec = (v: unknown): Rec | null =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Rec) : null;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const strs = (v: unknown) =>
  Array.isArray(v) ? v.map(str).filter(Boolean) : [];
const host = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// DNA result: { sections: [{ key, title, text }], document } — one short card per section.
const DNA_SNIPPET_CHARS = 220;

function dnaItems(result: Rec, add: (item: NewItem) => void) {
  const snippet = (text: string) =>
    text.length > DNA_SNIPPET_CHARS
      ? `${text.slice(0, DNA_SNIPPET_CHARS).trimEnd()}…`
      : text;
  const sections = Array.isArray(result.sections)
    ? result.sections.map(rec).filter(Boolean)
    : [];
  if (sections.length) {
    sections.forEach((section) => {
      const title = str(section!.title).replace(/^#+\s*/, "");
      const text = str(section!.text).replace(/\s+/g, " ");
      if (title && text)
        add({ kind: "text", label: title, value: snippet(text) });
    });
    return;
  }
  // No sections: fall back to the first paragraphs of the document.
  str(result.document)
    .split(/\n{2,}/)
    .map((p) => p.replace(/^#+\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 6)
    .forEach((p) => add({ kind: "insight", text: snippet(p) }));
}

function companyItems(result: Rec, add: (item: NewItem) => void) {
  const c = rec(result.company);
  if (c) {
    const links: Extract<FeedItem, { kind: "links" }>["items"] = [];
    if (str(c.website))
      links.push({
        type: "web",
        label: host(str(c.website)),
        href: str(c.website),
      });
    if (str(c.instagram_url) || str(c.instagram_username))
      links.push({
        type: "instagram",
        label: `@${str(c.instagram_username) || host(str(c.instagram_url))}`,
        href:
          str(c.instagram_url) ||
          `https://instagram.com/${str(c.instagram_username)}`,
      });
    if (str(c.linkedin_url))
      links.push({
        type: "linkedin",
        label: host(str(c.linkedin_url)),
        href: str(c.linkedin_url),
      });
    if (links.length) add({ kind: "links", items: links });

    const stats = [
      ["Industry", str(c.industry)],
      ["Market", str(c.region)],
      ["Model", str(c.business_model)],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => ({ label, value }));
    if (stats.length) add({ kind: "stats", items: stats });

    if (strs(c.services).length)
      add({ kind: "chips", label: "Services", items: strs(c.services) });
    if (strs(c.target_audience).length)
      add({
        kind: "chips",
        label: "Target audience",
        items: strs(c.target_audience),
      });
    if (str(c.positioning))
      add({ kind: "text", label: "Positioning", value: str(c.positioning) });
    strs(c.pain_points).forEach((p) =>
      add({ kind: "insight", text: `Pain point: ${p}` }),
    );
    if (strs(c.keywords).length)
      add({ kind: "chips", label: "Keywords", items: strs(c.keywords) });
    if (strs(c.technologies).length)
      add({
        kind: "chips",
        label: "Technologies",
        items: strs(c.technologies),
      });
    if (str(c.value_proposition))
      add({
        kind: "text",
        label: "Value proposition",
        value: str(c.value_proposition),
      });
  }

  const presence = rec(result.digital_presence);
  const website = rec(presence?.website);
  if (typeof presence?.overall_score === "number")
    add({
      kind: "score",
      label: "Digital presence",
      score: presence.overall_score,
    });
  if (strs(website?.strengths).length)
    add({
      kind: "chips",
      label: "Strengths",
      items: strs(website?.strengths),
      tone: "good",
    });
  if (strs(website?.weaknesses).length)
    add({
      kind: "chips",
      label: "Weaknesses",
      items: strs(website?.weaknesses),
      tone: "bad",
    });
}

function competitorItems(result: Rec, add: (item: NewItem) => void) {
  const list = Array.isArray(result.competitors)
    ? result.competitors.map(rec).filter(Boolean)
    : [];
  list.forEach((c) =>
    add({
      kind: "competitor",
      name: str(c!.name),
      website: str(c!.website) || undefined,
    }),
  );
}

// "…Recommendation (high): Clarify differentiation — …" → one insight per sentence.
// Sentences that only repeat what the company step already showed.
const BOILERPLATE = /^(Competitor analysis for|Industry:|Region focus:)/;
const MAX_OBSERVATIONS = 4;

function summaryItems(summary: string, add: (item: NewItem) => void) {
  let observations = 0;
  summary
    .split(/(?=Recommendation \()|(?<=\.)\s+(?=[A-Z@])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12 && !BOILERPLATE.test(s))
    .forEach((s) => {
      const match = s.match(/^Recommendation \((\w+)\):\s*(.*)$/);
      // Recommendations always show; other observations are capped.
      if (match) add({ kind: "insight", priority: match[1], text: match[2] });
      else if (observations++ < MAX_OBSERVATIONS)
        add({ kind: "insight", text: s });
    });
}

function plannerItems(result: Rec, add: (item: NewItem) => void) {
  const plan = rec(result.thirty_day_action_plan);
  if (!plan) return;
  if (str(plan.summary))
    add({ kind: "text", label: "Strategy", value: str(plan.summary) });
  const actions = Array.isArray(plan.actions)
    ? plan.actions.map(rec).filter(Boolean)
    : [];
  actions.forEach((a) =>
    add({
      kind: "action",
      when: `Week ${a!.week ?? "?"} · Day ${a!.day ?? "?"}`,
      platform: str(a!.platform),
      text: str(a!.what_to_do),
      priority: str(a!.priority) || undefined,
      format: str(a!.format) || undefined,
    }),
  );
}

// Unknown shapes (content ideas, scripts): pick titled objects out of any array.
function genericItems(result: Rec, add: (item: NewItem) => void, depth = 0) {
  if (str(result.summary))
    add({ kind: "text", label: "Summary", value: str(result.summary) });
  for (const value of Object.values(result)) {
    if (Array.isArray(value)) {
      value
        .map(rec)
        .filter(Boolean)
        .slice(0, 8)
        .forEach((o) => {
          const title = str(
            o!.title ??
              o!.idea ??
              o!.hook ??
              o!.topic ??
              o!.headline ??
              o!.name,
          );
          const detail = str(
            o!.description ?? o!.why ?? o!.angle ?? o!.caption,
          );
          if (title) add({ kind: "text", label: title, value: detail });
        });
    } else if (depth < 2 && rec(value)) {
      genericItems(rec(value)!, add, depth + 1);
    }
  }
}

export function orderedSteps(
  job?: IntelligenceJobResponse,
): IntelligenceJobStep[] {
  const steps = job?.steps ?? {};
  return Object.keys(steps).map((name) => ({ ...steps[name], name }));
}

export function buildFeed(job?: IntelligenceJobResponse): FeedItem[] {
  const feed: FeedItem[] = [];
  for (const step of orderedSteps(job)) {
    if (step.status === "pending") continue;
    let n = 0;
    const add = (item: NewItem) =>
      feed.push({ ...item, id: `${step.name}:${n++}` } as FeedItem);

    const note =
      step.status === "completed"
        ? typeof step.duration_sec === "number"
          ? `Done in ${Math.round(step.duration_sec)}s`
          : "Done"
        : step.status === "failed"
          ? "Ran into a problem"
          : "Working…";
    // Section header id stays fixed so its note can update in place.
    feed.push({
      id: `${step.name}:section`,
      kind: "section",
      step: step.name,
      title: humanize(step.name),
      note,
    });

    const result = rec(step.result);
    if (!result) continue;
    if (step.name === "generate_dna") dnaItems(result, add);
    else if (step.name === "analyze_company") companyItems(result, add);
    else if (step.name === "discover_competitors") competitorItems(result, add);
    else if (step.name === "competitor_analysis")
      summaryItems(str(result.summary), add);
    else if (step.name === "planner") plannerItems(result, add);
    else genericItems(result, add);
  }
  return feed;
}
