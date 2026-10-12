export type TeamId =
  | "intake"
  | "competitor"
  | "dna"
  | "seo"
  | "media"
  | "analytics"
  | "goals";

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

/** Four desk slots in a 2×2 grid on every floor */
const DESKS: [number, number][] = [
  [-2.4, -1.2],
  [2.4, -1.2],
  [-2.4, 1.2],
  [2.4, 1.2],
];

function fourMembers(
  roles: [string, string, string, string],
): TeamMember[] {
  return roles.map((role, i) => ({
    id: role.toLowerCase().replace(/\s+/g, "-"),
    role,
    desk: DESKS[i],
  }));
}

/**
 * Screen layout (camera looks from +Z toward the hub):
 * - Back-center: Intake (hassnain) — clear of the hub goal animation
 * - Center: DNA + SEO flanking the hub
 * - Left corner: Competitor + Goals
 * - Right corner: Media + Analytics
 */
const LAYOUT: Record<TeamId, [number, number, number]> = {
  // Back-center — clear of the hub goal animation
  intake: [0, 0, -14.5],
  // Center — beside the hub
  dna: [-8.5, 0, 1.5],
  // Talha (SEO) ↔ Sayyam (Media) swapped
  seo: [18.5, 0, 10],
  media: [8.5, 0, 1.5],
  // Left corner
  competitor: [-18.5, 0, 10],
  goals: [-17.5, 0, -11],
  // Right corner
  analytics: [17.5, 0, -11],
};

/** CMO tour order through the live pipeline */
export const TOUR_ORDER: TeamId[] = [
  "intake",
  "competitor",
  "dna",
  "seo",
  "media",
  "analytics",
  "goals",
];

export const TOUR_LINES: Record<TeamId, string> = {
  intake: "hassnain researches your site and drafts verified Q&A.",
  competitor: "Ilsa maps rivals so strategy isn’t built in a vacuum.",
  dna: "Raheel locks Company DNA — your single source of truth.",
  seo: "Talha turns DNA into topical maps and keyword plans.",
  media: "Sayyam ships creative: scripts, carousels, and reels.",
  analytics: "Arslan proves what worked and feeds the next loop.",
  goals: "Hira tracks the goal and keeps the plan on target.",
};

const FLOOR_SIZE: [number, number] = [9.6, 7.4];
/** Slightly larger floor so hassnain’s team reads clearly */
const FRONT_FLOOR_SIZE: [number, number] = [10.4, 8.0];

/** Teams arranged to fill corners + front/back of the viewport */
export const OFFICE_TEAMS: OfficeTeam[] = [
  {
    id: "intake",
    name: "Intake & Research",
    leadName: "hassnain",
    leadTitle: "Intake Lead",
    leadImage: "/assets/Avatars/Hasnain-mascot.jpeg",
    color: "#5B57E6",
    floorColor: "#C7C5FF",
    accent: "#818CF8",
    position: LAYOUT.intake,
    size: FRONT_FLOOR_SIZE,
    members: fourMembers(["Crawler", "Citations", "Podcast", "Verifier"]),
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
    id: "competitor",
    name: "Competitor Analysis",
    leadName: "Ilsa",
    leadTitle: "Competitor Lead",
    leadImage: "/assets/Avatars/ilsa-mascot.svg",
    color: "#0D9488",
    floorColor: "#99F6E4",
    accent: "#5EEAD4",
    position: LAYOUT.competitor,
    size: FLOOR_SIZE,
    members: fourMembers(["Scout", "Gap Map", "Benchmark", "Watchlist"]),
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
    id: "dna",
    name: "DNA & Strategy",
    leadName: "Raheel",
    leadTitle: "DNA Lead",
    leadImage: "/assets/Avatars/raheel-mascot.png",
    color: "#D97706",
    floorColor: "#FDE68A",
    accent: "#FBBF24",
    position: LAYOUT.dna,
    size: FLOOR_SIZE,
    members: fourMembers(["Research", "Newsletter", "Strategy", "Voice"]),
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
    color: "#059669",
    floorColor: "#A7F3D0",
    accent: "#34D399",
    position: LAYOUT.seo,
    size: FLOOR_SIZE,
    members: fourMembers(["Graph Arch", "Briefs", "Cannibal", "SERP"]),
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
    color: "#7C3AED",
    floorColor: "#DDD6FE",
    accent: "#A78BFA",
    position: LAYOUT.media,
    size: FLOOR_SIZE,
    members: fourMembers(["Carousel", "Art Prompt", "Hook Reel", "Copy"]),
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
    id: "analytics",
    name: "Analytics Hub",
    leadName: "Arslan",
    leadTitle: "Analytics Lead",
    leadImage: "/assets/Avatars/arslan-mascot.svg",
    color: "#2563EB",
    floorColor: "#BFDBFE",
    accent: "#93C5FD",
    position: LAYOUT.analytics,
    size: FLOOR_SIZE,
    members: fourMembers(["Metrics", "Attribution", "Reports", "Alerts"]),
    stats: [
      { label: "Dashboards", value: "22" },
      { label: "Doing / Done", value: "3 · 118" },
    ],
    pitch:
      "Closes the loop — attribution, dashboards, and performance packs that tell the next crawl what to improve.",
    handoff: "Performance report pack → Goal Achiever",
    agentHref: "/agents",
  },
  {
    id: "goals",
    name: "Goal Achiever",
    leadName: "Hira",
    leadTitle: "Goals Lead",
    leadImage: "/assets/Avatars/hira-mascot.svg",
    color: "#EA580C",
    floorColor: "#FED7AA",
    accent: "#FB923C",
    position: LAYOUT.goals,
    size: FLOOR_SIZE,
    members: fourMembers(["Targets", "Milestones", "Coach", "Optimize"]),
    stats: [
      { label: "Goals on track", value: "9" },
      { label: "Doing / Done", value: "5 · 74" },
    ],
    pitch:
      "Owns the account goal — weekly targets, progress checks, and course-corrections so the office always knows what winning looks like.",
    handoff: "Goal status & next targets → Intake (next loop)",
    agentHref: "/goals",
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
    to: "goals",
    label: "Insights → Goals",
    task: "Performance report pack",
  },
  {
    id: "t7",
    from: "goals",
    to: "intake",
    label: "Goal targets → Next crawl",
    task: "Updated goal priorities",
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
    { teamId: "intake" as TeamId, label: "1 Intake", status: "done" as const },
    { teamId: "competitor" as TeamId, label: "2 Rivals", status: "done" as const },
    { teamId: "dna" as TeamId, label: "3 DNA", status: "done" as const },
    { teamId: "seo" as TeamId, label: "4 Plan", status: "active" as const },
    { teamId: "media" as TeamId, label: "5 Create", status: "next" as const },
    { teamId: "analytics" as TeamId, label: "6 Prove", status: "next" as const },
    { teamId: "goals" as TeamId, label: "7 Goal", status: "next" as const },
  ],
};
