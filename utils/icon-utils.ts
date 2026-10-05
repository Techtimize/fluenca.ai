import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  Activity,
  BadgeCheck,
  BarChart,
  BarChart2,
  BarChart3,
  BarChart4,
  CalendarDays,
  Lightbulb,
  ClipboardList,
  CreditCard,
  Dna,
  FileText,
  Gauge,
  Home,
  Layers,
  LayoutGrid,
  Megaphone,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";

// The API sends icon names as strings. Add new names here when you need them.
const ICONS: Record<string, LucideIcon> = {
  accessibility: Accessibility,
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
};

export function getIcon(name?: string): LucideIcon {
  if (!name) return FileText;
  const normalized = name.toLowerCase().trim();
  return ICONS[normalized] || FileText;
}