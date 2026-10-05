export type TopicalMapStatus = "not_started" | "generating" | "review" | "approved" | "failed";

export interface SpecificTopic {
  topic_id: string;
  name: string;
  added_by_customer: boolean;
}

export interface Subcategory {
  topic_id: string;
  name: string;
  seed_keyword: string | null;
  added_by_customer: boolean;
  specifics: SpecificTopic[];
}

export interface Pillar {
  topic_id: string;
  name: string;
  services: string[];
  added_by_customer: boolean;
  subcategories: Subcategory[];
}

export interface TopicalMapCounts {
  pillars: number;
  subcategories: number;
  specifics: number;
}

export interface TopicalMapLimits {
  max_pillars: number;
  max_subcategories_per_pillar: number;
  max_specifics_per_subcategory: number;
  max_subcategories: number;
}

export interface TopicalMapResponseProps {
  status: TopicalMapStatus;
  version: number | null;
  pillars: Pillar[];
  counts: TopicalMapCounts;
  limits: TopicalMapLimits;
  error: string | null;
  created_at: string | null;
  ready_at: string | null;
  approved_at: string | null;
}

export interface AddTopicRequest {
  parent_id?: string | null;
  name: string;
  seed_keyword?: string | null;
}

export interface UpdateTopicRequest {
  name?: string;
  seed_keyword?: string;
}
