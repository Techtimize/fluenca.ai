import {
  CalendarDays,
  FileText,
  Hash,
  Lightbulb,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

const SECTION_ICONS: Record<string, LucideIcon> = {
  ideas: Lightbulb,
  content_ideas: Lightbulb,
  recommendations: Sparkles,
  themes: Hash,
  topics: Hash,
  hashtags: Hash,
  calendar: CalendarDays,
  content_calendar: CalendarDays,
  strategy: Target,
  pillars: Target,
  posts: FileText,
  captions: FileText,
};

export function sectionIcon(label: string): LucideIcon {
  const key = label.toLowerCase().replace(/\s+/g, "_");
  return SECTION_ICONS[key] ?? Sparkles;
}

export function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-2.5 py-1 text-[11px] font-medium text-neutral-700">
      {children}
    </span>
  );
}
