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
  leader: string;
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
    name: "Sayyam",
    role: "Intake & Crawl",
    accent: "indigo",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFEjCBVpYcAMxK-leVpdlHox3-gkT015kxmLuktGzMXCHO4phmSXlCC_v_WyGQD0EgrqzQh8E3MODzTHRqgo6chUpkHzsmoKweLeRVtsLwy_aE7Uv6SLyswxcNAimkPxSglx16LBXXs4Cp25b5JG9ScK0FPyjIxTNjePE-e9DM2KRRWl09iWsnTb4CquBGvUAZ-xyAOAvfbZlpyoBj-KQXBsMZItyuBdgRpgoZBU0ORH6Ew2ZPmiUedMnXdVKfqOJFAw",
    label: "01. Intake Agent",
    title: "The One Who Asks What Others Miss",
    chapter: "CHAPTER 01 · THE INVESTIGATOR",
    headline: "Every great business has a story. We start by uncovering it.",
    summary:
      "Before we create a single strategy, someone needs to ask the right questions. Meet Sayyam, the curious mind of our AI team. He explores websites, follows evidence, and uncovers the details that make each business different. No blind assumptions. No starting from scratch. Just the right questions leading to better decisions.",
    mission: "Discover the story behind the business.",
    leader: "Sayyam",
    clipLabel: "CLIP: #INTAKE_CRAWL_99",
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
    name: "Masrur",
    role: "DNA & Strategy",
    accent: "amber",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDioTMTfciGARTKrMbUEQPMD1j1eY1Z5G6ziEGFTgdf-Xhy0VbkebDIVJmoic_dWQHB29P-ApCU_y7BxNEJIlOXibN_jegKlxkYpHWp55b-T12gFRfXFY8XbtgWg5jXYXQRpiO3ZePikuIum70osCFNwdy0Fdj6XQuZmuU8YwEyguReRStxaS8nBgLNMEYhOwEqIB3FJBDONIOKXmR5by15OB0E8jn23E4TGOnxeVy-v6-L7YQ1av9ndTbucN12qHwbrw",
    label: "02. DNA Agent",
    title: "The Guardian of Identity",
    chapter: "CHAPTER 02 · THE IDENTITY KEEPER",
    headline: "Before AI speaks for your brand, it needs to know who you are.",
    summary:
      "Meet Masrur. He takes everything the business has confirmed and turns it into one clear identity—its voice, values, services, and unique strengths. Every content idea and every message has a foundation to build on. Because the smartest AI isn't the one that says the most. It's the one that understands your brand.",
    mission: "Make every word feel like your brand.",
    leader: "Talha",
    clipLabel: "CLIP: #DNA_SYNTHESIS_01",
    statusLabel: "DNA Agent",
    sim: {
      headline: "Synthesizing DNA Profile",
      metric: "1,800 Words",
      rows: ["Voice", "Values", "Services", "Strengths"],
    },
    // TEMP: replace with Masrur's own video when ready
    video: { src: "/videos/agents/Sayyam.mp4" },
  },
  {
    id: "agent-3",
    name: "Storyteller", // TODO: replace with the agent's real name
    role: "Content & Blog",
    accent: "violet",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAe-AlaEPUE_WwfHeEO5bu5qnY3fDL3XV8IR2YsuFQC0xVQTcYE1vIyZG20BqNNO1q7NnZw3ZLyuRfI8PfZGgf0-F7JyxYVq1ARqlberO3nCQ_46aLViVvH-XeOjbBIGEmRVIeJj6lM7vVeJTuS39sMqwjLC__94tHwKUkb7pmcO2mrPuuEKM2cd_MmYqDbbomyFdriKAYuaM4B7WyFLEwIt9PpBaOgaX5kVD_47Q9UFd7ZzDnRN8yGKXEyWHoYcKmRIQ",
    label: "03. Content Agent",
    title: "The Storyteller",
    chapter: "CHAPTER 03 · THE CREATIVE MIND",
    headline: "Ideas are everywhere. Stories that matter are different.",
    summary:
      "Meet the storyteller who turns research and strategy into meaningful content. From complete blog posts to useful insights backed by sources, this agent brings your brand's expertise to life in a voice that feels true to you. Every piece has a purpose: to answer a question, share knowledge, and give your audience a reason to care.",
    mission: "Turn knowledge into stories worth reading.",
    leader: "Raheel",
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
    name: "Connector", // TODO: replace with the agent's real name
    role: "Chatbot",
    accent: "emerald",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtOMXvSMwB-6saowK-rehe2CvlGGK8SFCJJvR9NeItup5sRvZsbimq_22NUCcwMZJ6Cog5ZSlIoIad6e1xzJ7jExIB3cMldvPQpEoHfZkxQAm78Gsi8fTnd_0aQqE5GK2hiVkm4bb5bpl_FqjK9ny-WM7PQFqR5-kQ82L-6R6Lf0ji2nK88MFK2fItrpe8Y6OOJc4fe8nHhbr1xFlYZCRpZlupIdCzRElFJWBGcFly-hZqRcZVF7-1enA3nS8RNJiv-g",
    label: "04. Chatbot Agent",
    title: "The Team's Front Door",
    chapter: "CHAPTER 06 · THE CONNECTOR",
    headline: "What if your entire AI team was just one conversation away?",
    summary:
      "Meet the assistant that brings the experience together. Ask a question, explore an idea, or request an action, and Fluenca can respond, connect you with the right specialist, or trigger a supported workflow. You don't need to figure out which agent does what. Just tell it what you need, and let the right capabilities come into play.",
    mission: "Make the power of AI feel effortless.",
    leader: "[Team Member 6]",
    clipLabel: "CLIP: #CHATBOT_04",
    statusLabel: "Chatbot Agent",
    sim: {
      headline: "Routing your request",
      metric: "1 Conversation",
      rows: ["Ask", "Route", "Act", "Reply"],
    },
    // TEMP: replace with this agent's own video when ready
    video: { src: "/videos/agents/Raheel.mp4" },
  },
  {
    id: "agent-5",
    name: "Observer", // TODO: replace with the agent's real name
    role: "Competitor Analysis",
    accent: "indigo",
    // TEMP: replace with this agent's own image when ready
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFEjCBVpYcAMxK-leVpdlHox3-gkT015kxmLuktGzMXCHO4phmSXlCC_v_WyGQD0EgrqzQh8E3MODzTHRqgo6chUpkHzsmoKweLeRVtsLwy_aE7Uv6SLyswxcNAimkPxSglx16LBXXs4Cp25b5JG9ScK0FPyjIxTNjePE-e9DM2KRRWl09iWsnTb4CquBGvUAZ-xyAOAvfbZlpyoBj-KQXBsMZItyuBdgRpgoZBU0ORH6Ew2ZPmiUedMnXdVKfqOJFAw",
    label: "05. Competitor Agent",
    title: "The Strategic Observer",
    chapter: "CHAPTER 05 · THE STRATEGIC OBSERVER",
    headline: "Your competitors are making moves. What are they missing?",
    summary:
      "Meet the strategist who looks beyond the surface. While others see competing brands, our Competitor Agent sees clues: unnoticed gaps, missed opportunities, and strategies waiting to be discovered. It studies their websites, messaging, and social presence to uncover where your business can stand apart. Because winning isn't always about doing more than your competitors. Sometimes, it's about seeing what they don't.",
    mission: "Turn competitive insights into your next big opportunity.",
    leader: "[Team Lead Name]",
    clipLabel: "CLIP: #COMPETITOR_05",
    statusLabel: "Competitor Agent",
    sim: {
      headline: "Scanning competitors",
      metric: "12 Gaps Found",
      rows: ["Websites", "Messaging", "Social", "Gaps"],
    },
    // TEMP: replace with this agent's own video when ready
    video: { src: "/videos/agents/Sayyam.mp4" },
  },
  {
    id: "agent-6",
    name: "Director", // TODO: replace with the agent's real name
    role: "Script Generation",
    accent: "violet",
    // TEMP: replace with this agent's own image when ready
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDioTMTfciGARTKrMbUEQPMD1j1eY1Z5G6ziEGFTgdf-Xhy0VbkebDIVJmoic_dWQHB29P-ApCU_y7BxNEJIlOXibN_jegKlxkYpHWp55b-T12gFRfXFY8XbtgWg5jXYXQRpiO3ZePikuIum70osCFNwdy0Fdj6XQuZmuU8YwEyguReRStxaS8nBgLNMEYhOwEqIB3FJBDONIOKXmR5by15OB0E8jn23E4TGOnxeVy-v6-L7YQ1av9ndTbucN12qHwbrw",
    label: "06. Script Agent",
    title: "The Creative Director",
    chapter: "CHAPTER 06 · THE CREATIVE DIRECTOR",
    headline: "Every scroll-stopping video begins with a story worth telling.",
    summary:
      "Meet the creative mind that turns an idea into a scene-by-scene experience. From the opening hook that captures attention to the final call to action, our Script Generator Agent builds the story, shapes the dialogue, and plans every scene. Whether it's a video or a carousel, it transforms a simple concept into a creative blueprint ready to come to life. Because great content doesn't happen by accident. Every frame needs a purpose, and every second needs a reason to keep watching.",
    mission: "Turn ideas into stories people want to see.",
    leader: "[Team Lead Name]",
    clipLabel: "CLIP: #SCRIPT_GEN_06",
    statusLabel: "Script Agent",
    sim: {
      headline: "Writing video script",
      metric: "8 Scenes",
      rows: ["Hook", "Story", "Dialogue", "CTA"],
    },
    // TEMP: replace with this agent's own video when ready
    video: { src: "/videos/agents/Raheel.mp4" },
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