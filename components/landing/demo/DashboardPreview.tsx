import Image from "next/image";
import {
  BarChart3,
  CalendarDays,
  Globe,
  LayoutDashboard,
  PenLine,
  Settings,
  Target,
  Users,
} from "lucide-react";

// Static, decorative product preview for the demo page
const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Content Calendar", icon: CalendarDays },
  { label: "Generate Content", icon: PenLine },
  { label: "Analytics", icon: BarChart3 },
  { label: "Competitors", icon: Users },
  { label: "Website Insights", icon: Globe },
  { label: "Goals", icon: Target },
  { label: "Settings", icon: Settings },
];

const STATS = [
  { value: "84", label: "Overall Performance", delta: "+12%" },
  { value: "75", label: "Audience Growth", delta: "+18%" },
  { value: "68", label: "Engagement Rate", delta: "+9%" },
  { value: "24", label: "Qualified Leads", delta: "+32%" },
];

const ACTIONS = [
  {
    title: "Publish a LinkedIn post on product updates",
    note: "Based on your audience's high engagement with product content.",
  },
  {
    title: "Optimize your website's meta descriptions",
    note: "Your site is missing key SEO elements that can improve visibility.",
  },
  {
    title: "Create a case study blog post",
    note: "Competitors are getting strong engagement with case studies.",
  },
];

const UPCOMING = [
  { day: "Mon, Apr 21", title: "LinkedIn post · Product update", dot: "bg-[#5B57E6]" },
  { day: "Wed, Apr 23", title: "Blog draft · Customer success", dot: "bg-amber-500" },
  { day: "Fri, Apr 25", title: "Instagram carousel · Tips & Guide", dot: "bg-rose-500" },
];

export default function DashboardPreview() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white shadow-[0_30px_70px_-36px_rgba(79,70,229,0.45)]"
    >
      <div className="flex text-[10px]">
        <aside className="hidden w-36 shrink-0 border-r border-[#EEF0F8] p-3 sm:block">
          <div className="mb-4 flex items-center gap-1.5">
            <Image src="/assets/Logo.svg" alt="" width={16} height={16} className="size-4" />
            <span className="text-[11px] font-semibold text-neutral-900">fluenca.ai</span>
          </div>
          <ul className="space-y-1">
            {NAV.map(({ label, icon: Icon, active }) => (
              <li
                key={label}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                  active ? "bg-[#F1F0FF] font-medium text-[#5B57E6]" : "text-neutral-500"
                }`}
              >
                <Icon className="size-3" />
                {label}
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 bg-[#FAFBFF] p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[12px] font-semibold text-neutral-900">Good morning, Sarah 👋</p>
              <p className="text-[9px] text-neutral-400">Here&apos;s what&apos;s happening with your brand today.</p>
            </div>
            <span className="rounded-md bg-[#5B57E6] px-2 py-1 text-[9px] font-semibold text-white">
              + Create
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-[#EEF0F8] bg-white p-2">
                <div className="flex items-start justify-between">
                  <span className="text-[13px] font-semibold text-neutral-900">{stat.value}</span>
                  <span className="text-[8px] font-medium text-emerald-600">{stat.delta}</span>
                </div>
                <p className="mt-0.5 text-[8px] text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-[1.4fr_1fr]">
            <div className="rounded-lg border border-[#EEF0F8] bg-white p-2.5">
              <p className="mb-2 text-[10px] font-semibold text-neutral-800">Recommended Actions</p>
              <ul className="space-y-2">
                {ACTIONS.map((action) => (
                  <li key={action.title} className="flex items-center gap-2">
                    <span className="grid size-5 shrink-0 place-items-center rounded-md bg-[#F1F0FF] text-[#5B57E6]">
                      <Target className="size-2.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[9px] font-medium text-neutral-800">
                        {action.title}
                      </span>
                      <span className="block truncate text-[8px] text-neutral-400">{action.note}</span>
                    </span>
                    <span className="rounded border border-[#D9DCF7] px-1.5 py-0.5 text-[8px] font-medium text-[#5B57E6]">
                      Review
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[#EEF0F8] bg-white p-2.5">
              <p className="mb-2 text-[10px] font-semibold text-neutral-800">Upcoming This Week</p>
              <ul className="space-y-2">
                {UPCOMING.map((item) => (
                  <li key={item.day} className="flex items-start gap-2">
                    <span className={`mt-1 size-1.5 shrink-0 rounded-full ${item.dot}`} />
                    <span className="min-w-0">
                      <span className="block text-[8px] text-neutral-400">{item.day}</span>
                      <span className="block truncate text-[9px] font-medium text-neutral-800">
                        {item.title}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
