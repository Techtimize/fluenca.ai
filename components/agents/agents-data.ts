export type AgentAccent = "amber" | "indigo" | "emerald" | "violet";

export interface AgentStory {
  id: string;
  name: string;
  role: string;
  badge: string;
  entry: string;
  accent: AgentAccent;
  image: string;
  title: string;
  summary: string;
  clipLabel: string;
  statusLabel: string;
  features: Array<{ title: string; body: string }>;
  meta: Array<{ label: string; value: string }>;
  sim: {
    headline: string;
    metric: string;
    rows: string[];
  };
}

export const AGENTS: AgentStory[] = [
  {
    id: "agent-1",
    name: "Masrur",
    role: "DNA & Strategy",
    badge: "Agent #02 · DNA Agent",
    entry: "agents/dna/dna_generator.py",
    accent: "amber",
    image: "/assets/Avatars/raheel-mascot.png",
    title: "Guardian of Identity & Strategic Company DNA",
    summary:
      "Masrur listens to confirmed intake findings and distills them into the immutable Company DNA — the single source of truth used by topical maps, keyword engines, content writers, and chatbots.",
    clipLabel: "CLIP: #DNA_SYNTHESIS_01",
    statusLabel: "Active Run #490",
    features: [
      {
        title: "Strict Grounding Rules",
        body: "Preserves every concrete metric verbatim. Caps each profile at 1,000–1,800 words across eight fixed company pillars.",
      },
      {
        title: "Execution Tier & Pipeline",
        body: "Runs on LlmTier.STRONG and hands off directly to the Topical Map Agent in the same worker commit.",
      },
    ],
    meta: [
      { label: "Service", value: "dna_run_service.py" },
      { label: "Max Tokens", value: "8,000" },
      { label: "Prompt", value: "dna-generate-v1" },
      { label: "Tone", value: "Exacting & Empirical" },
    ],
    sim: {
      headline: "Synthesizing DNA Profile",
      metric: "1,800 Words",
      rows: ["8 Secs", "Sonnet 5", "0 Halluc", "100% Fit"],
    },
  },
  {
    id: "agent-2",
    name: "Rayyan",
    role: "Intake & Crawl",
    badge: "Agent #01 · Intake Agent",
    entry: "agents/intake/intake_agent.py",
    accent: "indigo",
    image: "/assets/Avatars/Hasnain-mascot.jpeg",
    title: "The Curious Web Scout & Evidence Inquisitor",
    summary:
      "Rayyan is first contact for every new company. He reads up to eight corporate pages and drafts up to twenty perceptive questions with verified quotes and source links — so founders never start from a blank form.",
    clipLabel: "CLIP: #INTAKE_CRAWL_99",
    statusLabel: "Budget Enforced: $0.40/run",
    features: [
      {
        title: "Fuzzy Citation Verification",
        body: "An internal judge call requires 85% word overlap. Unbacked assertions are demoted and flagged for humans.",
      },
      {
        title: "Autonomous Search Planning",
        body: "When answers remain unknown, he plans targeted search rounds until evidence surfaces.",
      },
    ],
    meta: [
      { label: "Service", value: "intake_run_service.py" },
      { label: "Limits", value: "8 Pages · 3 Rounds" },
      { label: "Tiers", value: "Haiku & Sonnet" },
      { label: "Output", value: "IntakeResult" },
    ],
    sim: {
      headline: "Tavily & Firecrawl Sync",
      metric: "8/8 Pages Read",
      rows: [
        "> GET company.com/pricing",
        "> Match 89% quote verified",
        "> Drafted 20 questions",
      ],
    },
  },
  {
    id: "agent-3",
    name: "Talha",
    role: "SEO & Topics",
    badge: "Agents #03 & #04 · Topical Map & Keywords",
    entry: "agents/topical_map & agents/keywords",
    accent: "emerald",
    image: "/assets/Avatars/Talha_mascot.jpeg",
    title: "The Mathematical Topical Cartographer",
    summary:
      "Talha turns Company DNA into a hierarchical SEO pyramid — service pillars, subcategories, and long-tail themes — paired with live SERP stats so spend never hits cannibalized queries.",
    clipLabel: "CLIP: #DATAFORSEO_MAP",
    statusLabel: "Pillars: 12 · Subcats: 24",
    features: [
      {
        title: "Hallucination-Proof Keyword Math",
        body: "Keywords are sent as numerical indices. The model answers in integers only — invention becomes impossible.",
      },
      {
        title: "Scientific Overlap Detection",
        body: "Cohere embeddings and SERP URL overlap consolidate duplicates while weaving sibling internal links.",
      },
    ],
    meta: [
      { label: "Service", value: "keyword_run_service.py" },
      { label: "Scoring", value: "fit × chance × √volume" },
      { label: "Embeddings", value: "Cohere embed-v4.0" },
      { label: "Tiers", value: "QUICK_WIN · BUILD_TOWARD" },
    ],
    sim: {
      headline: "Keyword Clustering",
      metric: "Cohere 0.86 Sim",
      rows: ["Quick Wins: 14", "Pillar Guides: 8", "Build Toward: 22", "Overlap Drops: 0"],
    },
  },
  {
    id: "agent-4",
    name: "Sayyam",
    role: "Media & Viral",
    badge: "Agents #15, #18 & #19 · Media Engine",
    entry: "agents/ContentGeneration & Script Generator",
    accent: "violet",
    image: "/assets/Avatars/sayyam-mascot.png",
    title: "The Visionary Media Maestro & Script Virtuoso",
    summary:
      "Sayyam turns keyword briefs into high-conversion creative — LinkedIn thought leadership, Instagram carousels, and multi-scene video scripts with camera blocking and character continuity.",
    clipLabel: "CLIP: #REEL_SCENE_BEAT",
    statusLabel: "Formats: Reels, Carousels, Stories",
    features: [
      {
        title: "Multi-Scene Script Generation",
        body: "Architects video into 3–8 scenes with staging, duration cues, and lighting prompts tailored for image-to-video rendering.",
      },
      {
        title: "Image Generation Fleet",
        body: "Dispatches flash image models with cloud delivery, exponential backoff, and anti-watermark prompting.",
      },
    ],
    meta: [
      { label: "Service", value: "image_invoke · script_invoke" },
      { label: "Models", value: "GPT-4o · Gemini Flash" },
      { label: "Aspect", value: "9:16 Reel · 1:1 Post" },
      { label: "Character", value: "Presenter & Visual Lead" },
    ],
    sim: {
      headline: "Scene Planner & Beats",
      metric: "8 Scenes / 9:16",
      rows: ["Hook", "Problem Beat", "Solution", "CTA"],
    },
  },
];

export const accentStyles: Record<
  AgentAccent,
  {
    chip: string;
    ring: string;
    soft: string;
    text: string;
    bar: string;
    glow: string;
  }
> = {
  amber: {
    chip: "border-amber-200 bg-amber-50 text-amber-700",
    ring: "border-amber-300",
    soft: "from-amber-50 to-white",
    text: "text-amber-700",
    bar: "from-amber-400 to-amber-300",
    glow: "shadow-amber-200/60",
  },
  indigo: {
    chip: "border-[#D9DCF7] bg-[#EEF0FF] text-[#5452F6]",
    ring: "border-[#C7CBFF]",
    soft: "from-[#F5F6FF] to-white",
    text: "text-[#5452F6]",
    bar: "from-[#4F46E5] to-[#8B5CF6]",
    glow: "shadow-[#C7CBFF]/70",
  },
  emerald: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ring: "border-emerald-300",
    soft: "from-emerald-50 to-white",
    text: "text-emerald-700",
    bar: "from-emerald-400 to-teal-300",
    glow: "shadow-emerald-200/60",
  },
  violet: {
    chip: "border-violet-200 bg-violet-50 text-violet-700",
    ring: "border-violet-300",
    soft: "from-violet-50 to-white",
    text: "text-violet-700",
    bar: "from-violet-500 to-fuchsia-400",
    glow: "shadow-violet-200/60",
  },
};
