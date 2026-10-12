"use client";

import { Clock, MoreVertical } from "lucide-react";

type Status = "draft" | "ready_to_publish" | "published";

type StaticBlog = {
  id: string;
  category: string;
  title: string;
  description: string;
  readMinutes: number;
  status: Status;
  tint: string;
};

// Temporary static data. Replace with your real blogs later.
const STATIC_BLOGS: StaticBlog[] = [
  {
    id: "ai-social-media-planning",
    category: "AI & Automation",
    title: "How AI Is Changing Social Media Content Planning",
    description: "Discover how AI is helping brands plan smarter, more relevant content across platforms.",
    readMinutes: 5,
    status: "draft",
    tint: "from-indigo-200 via-indigo-100 to-slate-100",
  },
  {
    id: "find-trending-topics",
    category: "Trends",
    title: "7 Ways to Find Trending Topics in Your Niche",
    description: "Learn proven strategies to discover what's trending and create content that gets noticed.",
    readMinutes: 4,
    status: "ready_to_publish",
    tint: "from-violet-200 via-violet-100 to-indigo-50",
  },
  {
    id: "competitor-content-analysis",
    category: "Competitor Insights",
    title: "A Practical Guide to Competitor Content Analysis",
    description: "Understand what your competitors are doing and find new opportunities.",
    readMinutes: 6,
    status: "draft",
    tint: "from-slate-300 via-slate-200 to-slate-100",
  },
  {
    id: "month-of-content",
    category: "Content Strategy",
    title: "How to Build a Month of Content in One Afternoon",
    description: "A simple, step-by-step process to plan and create 30 days of content quickly.",
    readMinutes: 5,
    status: "published",
    tint: "from-amber-100 via-orange-50 to-stone-100",
  },
  {
    id: "on-brand-images-ai",
    category: "AI Design",
    title: "Creating On-Brand Images with AI",
    description: "Learn how to generate stunning, on-brand visuals for your social media using AI.",
    readMinutes: 4,
    status: "draft",
    tint: "from-sky-200 via-indigo-100 to-violet-100",
  },
  {
    id: "best-times-to-post",
    category: "Social Media",
    title: "The Best Times to Post on Social Media",
    description: "Find out when your audience is most active and get better engagement.",
    readMinutes: 3,
    status: "published",
    tint: "from-fuchsia-200 via-violet-100 to-indigo-100",
  },
];

const STATUS: Record<Status, { label: string; dot: string }> = {
  draft: { label: "Draft", dot: "bg-orange-400" },
  ready_to_publish: { label: "Ready to publish", dot: "bg-emerald-500" },
  published: { label: "Published", dot: "bg-emerald-500" },
};

function BlogCard({ blog }: { blog: StaticBlog }) {
  const status = STATUS[blog.status];

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className={`relative h-36 w-full bg-gradient-to-br ${blog.tint}`}>
        <span className="absolute start-3 top-3 rounded-full bg-indigo-50/95 px-3 py-1 text-xs font-medium text-[#5B57E6]">
          {blog.category}
        </span>
        <span className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-neutral-700">
          <span className={`size-2 rounded-full ${status.dot}`} aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <div className="space-y-1.5 p-4">
        <h3 className="text-base font-semibold leading-snug text-neutral-900">{blog.title}</h3>
        <p className="text-sm leading-5 text-neutral-500">{blog.description}</p>
        <div className="flex items-center justify-between pt-3 text-xs text-neutral-600">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {blog.readMinutes} min read
          </span>
          <button
            type="button"
            aria-label={`More options for ${blog.title}`}
            className="rounded-full p-1 text-neutral-700 hover:bg-neutral-100"
          >
            <MoreVertical className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function BlogCards({ blogs = STATIC_BLOGS }: { blogs?: StaticBlog[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Blog posts">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </section>
  );
}