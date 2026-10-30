/* SEO & AI visibility of the company website: robots.txt, sitemap, llms.txt and schema.org markup. */

export interface RobotsTxtCheck {
  found: boolean;
  url: string;
  lists_sitemap: boolean;
}

export interface SitemapCheck {
  found: boolean;
  url: string | null;
  urls_listed: number;
}

export interface LlmsTxtCheck {
  found: boolean;
  url: string;
}

export interface SearchEngineAccess {
  engine: string;
  blocked: boolean;
}

export type AiAccess = "allowed" | "partly_blocked" | "blocked";

export interface AiAssistantAccess {
  /** ChatGPT, Claude, Perplexity or Gemini. */
  assistant: string;
  access: AiAccess;
  blocked_crawlers: string[];
}

export interface SchemaMarkupCheck {
  checked: boolean;
  types: string[];
  describes_business: boolean;
  has_faq: boolean;
}

export interface VisibilityAction {
  title: string;
  impact: string;
  effort: string;
  action: string;
  rationale: string;
}

/** GET /site-visibility (no request params; checks the company website). */
export interface SiteVisibilityResponse {
  website: string;
  /** False when the website could not be read. */
  checked: boolean;
  robots_txt: RobotsTxtCheck | null;
  sitemap: SitemapCheck | null;
  llms_txt: LlmsTxtCheck | null;
  search_engines: SearchEngineAccess[];
  ai_assistants: AiAssistantAccess[];
  schema_markup: SchemaMarkupCheck | null;
  recommended_actions: VisibilityAction[];
}

/** POST /site-visibility/llms-txt query params; `download` returns the file itself. */
export interface LlmsTxtRequest {
  download?: boolean;
}

/** POST /site-visibility/llms-txt */
export interface LlmsTxtResponse {
  content: string;
  filename: "llms.txt";
  /** Where to publish it (the site root). */
  publish_at: string | null;
  generated_at: string;
}

export type SchemaBlockKind = "business" | "website" | "faq" | "article";

export interface SchemaBlock {
  kind: SchemaBlockKind;
  /** The page to paste the snippet on. */
  place_on: string;
  json_ld: Record<string, unknown>;
  /** A ready `<script type="application/ld+json">` tag. */
  snippet: string;
}

/** POST /site-visibility/schema-markup (no body). */
export interface SchemaMarkupResponse {
  blocks: SchemaBlock[];
  how_to_use: string;
  generated_at: string;
}
