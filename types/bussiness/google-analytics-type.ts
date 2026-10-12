export type GoogleAnalyticsStatus = "active" | "revoked";

export interface GoogleAnalyticsConnection {
  connected: boolean;
  status: GoogleAnalyticsStatus | null;
  google_email: string | null;
  property_id: string | null;
  property_name: string | null;
  connected_at: string | null;
}

export interface GoogleAnalyticsProperty {
  property_id: string;
  display_name: string;
  account_name: string;
}

export interface GoogleAnalyticsPropertyList {
  items: GoogleAnalyticsProperty[];
}

export interface GoogleAnalyticsOverview {
  property_id: string;
  property_name: string | null;
  days: number;
  totals: {
    sessions: number;
    users: number;
    new_users: number;
    page_views: number;
    engagement_rate: number;
    average_session_seconds: number;
  };
  daily: { day: string; sessions: number; users: number }[];
  top_pages: { path: string; page_views: number; users: number }[];
  channels: { channel: string; sessions: number }[];
}
