export type TeamId =
  | "intake"
  | "dna"
  | "seo"
  | "media"
  | "competitor"
  | "analytics";

export interface TeamMember {
  id: string;
  role: string;
  desk: [number, number]; // local x, z on floor
}

export interface OfficeTeam {
  id: TeamId;
  name: string;
  leadName: string;
  leadTitle: string;
  leadImage: string;
  color: string;
  floorColor: string;
  accent: string;
  position: [number, number, number];
  size: [number, number];
  members: TeamMember[];
  stats: { label: string; value: string }[];
  /** One-line pitch for a CMO / founder */
  pitch: string;
  /** What this team hands off next */
  handoff: string;
  /** Deep link into /agents */
  agentHref: string;
}

/** CMO tour order through the live pipeline */
export const TOUR_ORDER: TeamId[] = [
  "intake",
  "competitor",
  "dna",
  "seo",
  "media",
  "analytics",
];

export const TOUR_LINES: Record<TeamId, string> = {
  intake: "Rayyan researches your site and drafts verified Q&A.",
  competitor: "Ilsa maps rivals so strategy isn’t built in a vacuum.",
  dna: "Masrur locks Company DNA — your single source of truth.",
  seo: "Talha turns DNA into topical maps and keyword plans.",
  media: "Sayyam ships creative: scripts, carousels, and reels.",
  analytics: "Arslan proves what worked and feeds the next loop.",
};

/** Teams arranged in a ring around the Fluenca hub */
export const OFFICE_TEAMS: OfficeTeam[] = [
  {
    id: "intake",
    name: "Intake & Research",
    leadName: "Rayyan",
    leadTitle: "Intake Lead",
    leadImage: "/assets/Avatars/Hasnain-mascot.jpeg",
    color: "#5452F6",
    floorColor: "#4338CA",
    accent: "#818CF8",
    position: [-13.5, 0, -7.5],
    size: [7.6, 5.8],
    members: [
      { id: "crawler", role: "Crawler", desk: [-2.0, -1.0] },
      { id: "citations", role: "Citations", desk: [0.2, -1.0] },
      { id: "podcast", role: "Podcast", desk: [2.0, 0.8] },
    ],
    stats: [
      { label: "URLs crawled", value: "28" },
      { label: "Doing / Done", value: "5 · 139" },
    ],
    pitch:
      "First contact for every company — crawls your site and drafts verified questions so founders never start from a blank form.",
    handoff: "Confirmed findings & Q&A pack → Competitor Analysis",
    agentHref: "/agents#agent-2",
  },
  {
    id: "dna",
    name: "DNA & Strategy",
    leadName: "Masrur",
    leadTitle: "DNA Lead",
    leadImage: "/assets/Avatars/raheel-mascot.png",
    color: "#F59E0B",
    floorColor: "#B45309",
    accent: "#FBBF24",
    position: [0, 0, -14.5],
    size: [7.2, 5.6],
    members: [
      { id: "research", role: "Research", desk: [-1.8, -0.9] },
      { id: "newsletter", role: "Newsletter", desk: [0.4, -0.9] },
      { id: "strategy", role: "Strategy", desk: [1.8, 0.8] },
    ],
    stats: [
      { label: "Truth nodes", value: "297" },
      { label: "Cost / turn", value: "$0.38" },
    ],
    pitch:
      "Locks your Company DNA as the immutable source of truth every later agent must follow — no hallucinated brand stories.",
    handoff: "Immutable DNA profile → Topical SEO",
    agentHref: "/agents#agent-1",
  },
  {
    id: "seo",
    name: "Topical SEO Engine",
    leadName: "Talha",
    leadTitle: "SEO Lead",
    leadImage: "/assets/Avatars/Talha_mascot.jpeg",
    color: "#10B981",
    floorColor: "#047857",
    accent: "#34D399",
    position: [13.5, 0, -7.5],
    size: [7.6, 5.8],
    members: [
      { id: "graph", role: "Graph Arch", desk: [-2.0, -1.0] },
      { id: "briefs", role: "Briefs", desk: [0.2, -1.0] },
      { id: "cannibal", role: "Cannibal", desk: [2.0, 0.8] },
    ],
    stats: [
      { label: "Clusters", value: "12 Tier-2" },
      { label: "Doing / Done", value: "6 · 190" },
    ],
    pitch:
      "Turns DNA into a hierarchical SEO pyramid with live SERP stats so spend never hits cannibalized queries.",
    handoff: "Pillars + SERP brief → Media & Creative",
    agentHref: "/agents#agent-3",
  },
  {
    id: "media",
    name: "Media & Creative",
    leadName: "Sayyam",
    leadTitle: "Media Lead",
    leadImage: "/assets/Avatars/sayyam-mascot.png",
    color: "#8B5CF6",
    floorColor: "#6D28D9",
    accent: "#A78BFA",
    position: [0, 0, 14.5],
    size: [8.2, 5.8],
    members: [
      { id: "carousel", role: "Carousel", desk: [-2.4, -1.0] },
      { id: "art", role: "Art Prompt", desk: [0, -1.0] },
      { id: "hook", role: "Hook Reel", desk: [2.4, 0.8] },
    ],
    stats: [
      { label: "Renders", value: "807" },
      { label: "Doing / Done", value: "6 · 164" },
    ],
    pitch:
      "Converts keyword briefs into high-conversion creative — LinkedIn posts, Instagram carousels, and multi-scene video scripts.",
    handoff: "Campaign assets shipped → Analytics",
    agentHref: "/agents#agent-4",
  },
  {
    id: "competitor",
    name: "Competitor Analysis",
    leadName: "Ilsa",
    leadTitle: "Competitor Lead",
    leadImage: "/assets/Avatars/ilsa-mascot.svg",
    color: "#0D9488",
    floorColor: "#0F766E",
    accent: "#5EEAD4",
    position: [-13.5, 0, 7.5],
    size: [7.6, 5.8],
    members: [
      { id: "scout", role: "Scout", desk: [-2.0, -1.0] },
      { id: "gap", role: "Gap Map", desk: [0.2, -1.0] },
      { id: "benchmark", role: "Benchmark", desk: [2.0, 0.8] },
    ],
    stats: [
      { label: "Rivals tracked", value: "14" },
      { label: "Doing / Done", value: "4 · 86" },
    ],
    pitch:
      "Scouts rivals, maps content gaps, and benchmarks messaging so your plan reacts to the real market.",
    handoff: "Competitor gap report → DNA & Strategy",
    agentHref: "/agents",
  },
  {
    id: "analytics",
    name: "Analytics Hub",
    leadName: "Arslan",
    leadTitle: "Analytics Lead",
    leadImage: "/assets/Avatars/arslan-mascot.svg",
    color: "#2563EB",
    floorColor: "#1D4ED8",
    accent: "#93C5FD",
    position: [13.5, 0, 7.5],
    size: [7.6, 5.8],
    members: [
      { id: "metrics", role: "Metrics", desk: [-1.8, -0.9] },
      { id: "attribution", role: "Attribution", desk: [0.2, -0.9] },
      { id: "reports", role: "Reports", desk: [1.8, 0.6] },
    ],
    stats: [
      { label: "Dashboards", value: "22" },
      { label: "Doing / Done", value: "3 · 118" },
    ],
    pitch:
      "Closes the loop — attribution, dashboards, and performance packs that tell the next crawl what to improve.",
    handoff: "Performance report pack → Intake (next loop)",
    agentHref: "/agents",
  },
];

export interface TaskTransfer {
  id: string;
  from: TeamId;
  to: TeamId;
  label: string;
  task: string;
}

/** Hand-offs matching Fluenca agent pipeline */
export const TASK_TRANSFERS: TaskTransfer[] = [
  {
    id: "t1",
    from: "intake",
    to: "competitor",
    label: "Verified intake → Competitor scan",
    task: "Confirmed findings & Q&A pack",
  },
  {
    id: "t2",
    from: "competitor",
    to: "dna",
    label: "Rival intel → DNA",
    task: "Competitor gap report",
  },
  {
    id: "t3",
    from: "dna",
    to: "seo",
    label: "Company DNA → Topical map",
    task: "Immutable DNA profile",
  },
  {
    id: "t4",
    from: "seo",
    to: "media",
    label: "Keyword briefs → Creative",
    task: "Pillars + SERP brief",
  },
  {
    id: "t5",
    from: "media",
    to: "analytics",
    label: "Creative → Analytics",
    task: "Campaign assets shipped",
  },
  {
    id: "t6",
    from: "analytics",
    to: "intake",
    label: "Insights → Next crawl",
    task: "Performance report pack",
  },
];

export function getTeam(id: TeamId): OfficeTeam {
  return OFFICE_TEAMS.find((t) => t.id === id)!;
}

/** Center hub — the account goal Fluenca’s teams are executing */
export const CENTER_GOAL = {
  label: "GOAL",
  title: "Grow pipeline +40%",
  detail: "Qualified leads this quarter",
  subtitle: "How Fluenca gets there",
  progress: 68,
  steps: [
    { teamId: "intake" as TeamId, label: "1 Research", status: "done" as const },
    { teamId: "competitor" as TeamId, label: "2 Rivals", status: "done" as const },
    { teamId: "dna" as TeamId, label: "3 DNA", status: "done" as const },
    { teamId: "seo" as TeamId, label: "4 Plan", status: "active" as const },
    { teamId: "media" as TeamId, label: "5 Create", status: "next" as const },
    { teamId: "analytics" as TeamId, label: "6 Prove", status: "next" as const },
  ],
};
