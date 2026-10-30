"use client";

import { useState } from "react";
import { AlertTriangle, GalleryHorizontal, Loader2, Send, Sparkles } from "lucide-react";
import { GHOST_BUTTON, GrowthSection, LABEL, PRIMARY_BUTTON } from "@/components/dashboard/linkedin-growth/ui";
import { CarouselMutation, PublishCarouselMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { BlogPostsQuery } from "@/routes/bussiness/Bussiness-Query";
import type { Carousel, CarouselSource } from "@/types/bussiness/linkedin-coach-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const SOURCES: { value: CarouselSource; label: string }[] = [
  { value: "best_post", label: "My best post" },
  { value: "blog_post", label: "A blog post" },
  { value: "text", label: "Pasted text" },
];

const INPUT =
  "w-full rounded-xl border border-[#E6E8F5] bg-white px-3 text-[13px] outline-none placeholder:text-neutral-400 focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20";

/** Slides in your voice from your best post, a blog post or pasted text, then publish to LinkedIn. */
export default function CarouselCard() {
  const [source, setSource] = useState<CarouselSource>("best_post");
  const [blogPostId, setBlogPostId] = useState("");
  const [text, setText] = useState("");
  const makeCarousel = CarouselMutation();

  const canMake = source === "best_post" || (source === "blog_post" ? blogPostId.trim() : text.trim());

  const make = () =>
    makeCarousel.mutate({
      source,
      ...(source === "blog_post" ? { blog_post_id: blogPostId.trim() } : {}),
      ...(source === "text" ? { text: text.trim() } : {}),
    });

  return (
    <GrowthSection
      icon={GalleryHorizontal}
      title="Carousel"
      description="Slides written in your voice, checked one by one and rendered as images, ready to publish."
    >
      {makeCarousel.data ? (
        <CarouselPreview carousel={makeCarousel.data} onReset={() => makeCarousel.reset()} />
      ) : (
        <div className="space-y-3">
          <div className="inline-flex flex-wrap rounded-full bg-[#F1F4F9] p-1" role="radiogroup" aria-label="Make it from">
            {SOURCES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={source === value}
                onClick={() => setSource(value)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${FOCUS_RING} ${
                  source === value ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {source === "blog_post" ? <BlogPostSelect value={blogPostId} onChange={setBlogPostId} /> : null}
          {source === "text" ? (
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Paste the text to turn into slides" className={`${INPUT} py-2`} />
          ) : null}
          <button type="button" onClick={make} disabled={makeCarousel.isPending || !canMake} className={PRIMARY_BUTTON}>
            {makeCarousel.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {makeCarousel.isPending ? "Writing and rendering slides…" : "Make carousel"}
          </button>
        </div>
      )}
    </GrowthSection>
  );
}

/** Picks one of the company's finished blog posts. */
function BlogPostSelect({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const blogPosts = BlogPostsQuery();
  const ready = (blogPosts.data?.blog_posts ?? []).filter((post) => post.status === "ready");

  if (blogPosts.isLoading) return <div className="h-10 animate-pulse rounded-xl bg-[#F6F8FC]" />;
  if (!ready.length) return <p className="text-[12px] text-neutral-500">No finished blog posts yet.</p>;

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Blog post" className={`${INPUT} h-10`}>
      <option value="" disabled>
        Choose a blog post
      </option>
      {ready.map((post) => (
        <option key={post.id} value={post.id}>
          {post.title}
        </option>
      ))}
    </select>
  );
}

function CarouselPreview({ carousel, onReset }: { carousel: Carousel; onReset: () => void }) {
  const [caption, setCaption] = useState(carousel.caption ?? "");
  const publish = PublishCarouselMutation();
  const slides = [...carousel.slides].sort((a, b) => a.index - b.index);

  return (
    <div className="space-y-3">
      {carousel.title ? <p className="text-[14px] font-semibold text-neutral-900">{carousel.title}</p> : null}
      <ol className="flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Slides">
        {slides.map((slide, position) => (
          <li key={slide.index} className="w-44 shrink-0 snap-start">
            {/* eslint-disable-next-line @next/next/no-img-element -- rendered slide images come from the backend */}
            <img src={slide.image_url} alt={slide.title || slide.text} className="aspect-[4/5] w-full rounded-lg border border-[#EEF0FA] object-cover" />
            <p className="mt-1 text-[11px] text-neutral-500">Slide {position + 1}</p>
            {slide.issues?.length ? (
              <p className="flex gap-1 text-[11px] text-amber-700">
                <AlertTriangle className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                {slide.issues.join(", ")}
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      <label className="block">
        <span className={LABEL}>Caption</span>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-[#E6E8F5] bg-white p-2.5 text-[13px] outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20"
        />
      </label>

      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onReset} className={GHOST_BUTTON}>
          Start over
        </button>
        <button
          type="button"
          onClick={() =>
            publish.mutate({
              ...(carousel.id ? { carousel_id: carousel.id } : {}),
              image_urls: slides.map((slide) => slide.image_url),
              caption: caption.trim(),
            })
          }
          disabled={publish.isPending || publish.isSuccess}
          className={PRIMARY_BUTTON}
        >
          {publish.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {publish.isSuccess ? "Published" : "Publish to LinkedIn"}
        </button>
      </div>
    </div>
  );
}
