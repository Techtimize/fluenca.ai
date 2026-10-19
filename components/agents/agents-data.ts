export type AgentAccent = "amber" | "indigo" | "emerald" | "violet";

export interface AgentStory {
  id: string;
  name: string;
  role: string;
  accent: AgentAccent;
  image: string;
  // Card content
  label: string; // e.g. "01. Intake Agent"
  title: string; // text after the dash
  chapter: string;
  headline: string;
  summary: string;
  mission: string;
  // Used only by the fallback sim card (when no video is set)
  clipLabel: string;
  statusLabel: string;
  sim: {
    headline: string;
    metric: string;
    rows: string[];
  };
  video?: { src: string; poster?: string };
}

export const AGENTS: AgentStory[] = [
  {
    id: "agent-1",
    name: "Intake",
    role: "Intake & Crawl",
    accent: "indigo",
    image: "/assets/Avatars/sayyam-mascot.png",
    label: "01. Intake Agent",
    title: "The One Who Asks What Others Miss",
    chapter: "CHAPTER 01 · THE INVESTIGATOR",
    headline: "Every great business has a story. We start by uncovering it.",
    summary:
      "Before we create a single strategy, someone needs to ask the right questions. Meet the curious mind of our AI team. He explores websites, follows evidence, and uncovers the details that make each business different. No blind assumptions. No starting from scratch. Just the right questions leading to better decisions.",
    mission: "Discover the story behind the business.",
    clipLabel: "CLIP: #INTAKE_CRAWL_01",
    statusLabel: "Intake Agent",
    sim: {
      headline: "Reading company pages",
      metric: "8/8 Pages Read",
      rows: ["Crawl", "Verify", "Ask", "Done"],
    },
    video: { src: "/videos/agents/Sayyam.mp4" },
  },
  {
    id: "agent-2",
    name: "Competitor",
    role: "Competitor Analysis",
    accent: "indigo",
    image: "/assets/Avatars/Talha-mascot.png",
    label: "02. Competitor Agent",
    title: "The One Who Finds the Gaps",
    chapter: "CHAPTER 02 · THE STRATEGIC OBSERVER",
    headline: "Your competitors are making moves. What are they missing?",
    summary:
      "While others watch the competition, our AI investigates it. From their messaging and content to their online presence, this agent looks for patterns, overlooked opportunities, and gaps your business could explore. It doesn't just help you see who you're competing with. It helps you see where you could stand apart.",
    mission: "Turn competitive insight into opportunity.",
    clipLabel: "CLIP: #COMPETITOR_02",
    statusLabel: "Competitor Agent",
    sim: {
      headline: "Scanning competitors",
      metric: "12 Gaps Found",
      rows: ["Websites", "Messaging", "Social", "Gaps"],
    },
    video: { src: "/videos/agents/Talha.mp4" },
  },
  {
    id: "agent-3",
    name: "Content",
    role: "Content & Blog",
    accent: "violet",
    image: "/assets/Avatars/raheel-mascot.png",
    label: "03. Content Agent",
    title: "The Storyteller",
    chapter: "CHAPTER 03 · THE CREATIVE MIND",
    headline: "Ideas are everywhere. Stories that matter are different.",
    summary:
      "Meet the storyteller who turns research and strategy into meaningful content. From complete blog posts to useful insights backed by sources, this agent brings your brand's expertise to life in a voice that feels true to you. Every piece has a purpose: to answer a question, share knowledge, and give your audience a reason to care.",
    mission: "Turn knowledge into stories worth reading.",
    clipLabel: "CLIP: #BLOG_WRITER_03",
    statusLabel: "Content Agent",
    sim: {
      headline: "Drafting blog post",
      metric: "1,500 Words",
      rows: ["Outline", "Draft", "Edit", "Publish"],
    },
    video: { src: "/videos/agents/Raheel.mp4" },
  },
  {
    id: "agent-4",
    name: "DNA",
    role: "DNA & Strategy",
    accent: "amber",
    image: "/assets/Avatars/Hasnain-mascot.jpeg",
    label: "04. DNA Agent",
    title: "The Guardian of Identity",
    chapter: "CHAPTER 04 · THE IDENTITY KEEPER",
    headline: "Before AI speaks for your brand, it needs to know who you are.",
    summary:
      "Meet the identity keeper. He takes everything the business has confirmed and turns it into one clear identity—its voice, values, services, and unique strengths. Every content idea and every message has a foundation to build on. Because the smartest AI isn't the one that says the most. It's the one that understands your brand.",
    mission: "Make every word feel like your brand.",
    clipLabel: "CLIP: #DNA_SYNTHESIS_04",
    statusLabel: "DNA Agent",
    sim: {
      headline: "Synthesizing DNA Profile",
      metric: "1,800 Words",
      rows: ["Voice", "Values", "Services", "Strengths"],
    },
    video: { src: "/videos/agents/Hasnain.mp4" },
  },
  {
    id: "agent-5",
    name: "Script",
    role: "Script Generation",
    accent: "violet",
    image: "/assets/Avatars/ilsa-mascot.png",
    label: "05. Script Agent",
    title: "The Creative Director",
    chapter: "CHAPTER 05 · THE CREATIVE DIRECTOR",
    headline: "Every scroll-stopping video begins with a story worth telling.",
    summary:
      "Meet the creative mind that turns an idea into a scene-by-scene experience. From the opening hook that captures attention to the final call to action, our Script Generator Agent builds the story, shapes the dialogue, and plans every scene. Whether it's a video or a carousel, it transforms a simple concept into a creative blueprint ready to come to life.\n\nBecause great content doesn't happen by accident. Every frame needs a purpose, and every second needs a reason to keep watching.",
    mission: "Turn ideas into stories people want to see.",
    clipLabel: "CLIP: #SCRIPT_GEN_05",
    statusLabel: "Script Agent",
    sim: {
      headline: "Writing video script",
      metric: "8 Scenes",
      rows: ["Hook", "Story", "Dialogue", "CTA"],
    },
    video: { src: "/videos/agents/Ilsa.mp4" },
  },
  {
    id: "agent-6",
    name: "Chatbot",
    role: "Chatbot",
    accent: "emerald",
    image: "/assets/Avatars/arslan-mascot.png",
    label: "06. Chatbot Agent",
    title: "The Team's Front Door",
    chapter: "CHAPTER 06 · THE CONNECTOR",
    headline: "What if your entire AI team was just one conversation away?",
    summary:
      "Meet the assistant that brings the experience together. Ask a question, explore an idea, or request an action—and Fluenca can respond, connect you with the right specialist, or trigger a supported workflow. You don't need to figure out which agent does what. Just tell it what you need, and let the right capabilities come into play.",
    mission: "Make the power of AI feel effortless.",
    clipLabel: "CLIP: #CHATBOT_06",
    statusLabel: "Chatbot Agent",
    sim: {
      headline: "Routing your request",
      metric: "1 Conversation",
      rows: ["Ask", "Route", "Act", "Reply"],
    },
    video: { src: "/videos/agents/Muaz.mp4" },
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