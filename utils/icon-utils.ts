import { createElement } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  BarChart,
  BarChart2,
  BarChart3,
  BarChart4,
  CalendarDays,
  Lightbulb,
  PersonStanding,
  ClipboardList,
  CreditCard,
  Dna,
  FileText,
  Gauge,
  Home,
  Layers,
  LayoutGrid,
  Megaphone,
  Plug,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";

// The API sends icon names as strings. Add new names here when you need them.
const ICONS: Record<string, LucideIcon> = {
  accessibility: PersonStanding,
  performance: Gauge,
  "best-practices": BadgeCheck,
  "best_practices": BadgeCheck,
  bestpractices: BadgeCheck,
  seo: Search,
  file: FileText,
  megaphone: Megaphone,
  layers: Layers,
  chart: BarChart3,
  "bar-chart": BarChart3,
  "bar_chart": BarChart3,
  home: Home,
  dashboard: LayoutGrid,
  clipboard: ClipboardList,
  billing: CreditCard,
  trending: TrendingUp,
  activity: Activity,
  zap: Zap,
  dna: Dna,
  calendar: CalendarDays,
  lightbulb: Lightbulb,
  plug: Plug,
  integrations: Plug,
};

export function getIcon(name?: string): LucideIcon {
  if (!name) return FileText;
  const normalized = name.toLowerCase().trim();
  return ICONS[normalized] || FileText;
}

// Renders an icon by name. Use this instead of `const Icon = getIcon(name)` inside a component,
// which React Compiler rejects as "creating a component during render".
export function DynamicIcon({ name, ...props }: LucideProps & { name?: string }) {
  return createElement(getIcon(name), props);
}
