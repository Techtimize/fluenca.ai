export type BlogPostStatus = 'queued' | 'writing' | 'ready' | 'failed';
export type KeywordRunStatus = 'not_started' | 'researching' | 'ready' | 'failed';

export type KeywordRunStep =
  | 'queued'
  | 'finding_keywords'
  | 'grouping_topics'
  | 'checking_overlap'
  | 'writing_briefs'
  | 'done';

export interface KeywordsStatusResponse {
  status: KeywordRunStatus;
  step: KeywordRunStep | null;
  error: string | null;
}

export interface BriefListItem {
  brief_id: string;
  topic_id: string;
  rank: number;
  title: string;
  format: 'blog' | 'social';
  primary_keyword: string;
  total_volume: number;
  created_at: string;
}

export interface BriefListResponse {
  briefs: BriefListItem[];
}

export interface BlogPostListItem {
  id: string;
  brief_id: string;
  status: BlogPostStatus;
  title: string;
  slug: string;
  meta_description: string;
  word_count: number;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  quality_score: number | null;
  error: string | null;
  created_at: string;
  finished_at: string | null;
}

export interface BlogPostListResponse {
  blog_posts: BlogPostListItem[];
}

export interface BlogPostFaq {
  question: string;
  answer: string;
}

export interface BlogQualityCheck {
  name: string;
  status: 'pass' | 'fail' | 'skipped';
  detail: string;
}

export interface BlogPost extends BlogPostListItem {
  content_markdown: string;
  key_takeaways: string[];
  faq: BlogPostFaq[];
  quality_checks: BlogQualityCheck[];
}
