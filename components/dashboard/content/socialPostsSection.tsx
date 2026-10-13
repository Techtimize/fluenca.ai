"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, Loader2 } from "lucide-react";
import Card from "@/components/shared/card";
import api from "@/routes/apiClient";
import { BUSSINESSENDPOINT } from "@/routes/bussiness/Bussiness-Endpoint";

type SocialPost = {
  id: string;
  platform: "linkedin" | "facebook" | "instagram";
  status: "queued" | "writing" | "ready" | "failed";
  caption: string;
  hashtags: string[];
  quality_score: number | null;
  error: string | null;
  created_at: string;
};

const PLATFORM_NAMES: Record<SocialPost["platform"], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

const isWorking = (post: SocialPost) => post.status === "queued" || post.status === "writing";

export const SOCIAL_POSTS_KEY = ["social-posts"];

export default function SocialPostsSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: SOCIAL_POSTS_KEY,
    queryFn: async () => (await api.get<SocialPost[]>(BUSSINESSENDPOINT.SOCIAL_POSTS)).data,
    refetchInterval: (query) => ((query.state.data ?? []).some(isWorking) ? 4000 : false),
  });

  if (isLoading || data.length === 0) return null;

  const copy = async (post: SocialPost) => {
    const text = [post.caption, post.hashtags.map((tag) => `#${tag.replace(/^#/, "")}`).join(" ")]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-neutral-900">Social posts</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((post) => (
          <Card key={post.id} className="flex flex-col gap-2 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-800">{PLATFORM_NAMES[post.platform]}</span>
              <span className="text-neutral-500">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            {isWorking(post) ? (
              <p className="flex items-center gap-2 text-[13px] text-neutral-500">
                <Loader2 className="size-4 animate-spin text-[#5B57E6]" />
                Writing this post…
              </p>
            ) : post.status === "failed" ? (
              <p className="text-[13px] text-rose-600">{post.error || "This post could not be written."}</p>
            ) : (
              <>
                <p className="whitespace-pre-wrap text-[13px] leading-5 text-neutral-800">{post.caption}</p>
                {post.hashtags.length ? (
                  <p className="text-xs text-[#5B57E6]">
                    {post.hashtags.map((tag) => `#${tag.replace(/^#/, "")}`).join(" ")}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void copy(post)}
                  className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-[#E6E8F5] bg-white px-3 py-1 text-xs text-neutral-700 hover:bg-[#F6F7FD]"
                >
                  <Copy className="size-3.5" />
                  {copiedId === post.id ? "Copied" : "Copy"}
                </button>
              </>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
