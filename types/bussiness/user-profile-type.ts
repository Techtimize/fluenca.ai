// Response of GET /user-profile.

export interface UserProfileUser {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  avatar_url: string | null;
  location: string | null;
  language: string | null;
  joined_at: string | null;
}

export interface UserProfileCompany {
  id: string;
  name: string | null;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  region: string | null;
  business_model: string | null;
  team_size: string | null;
}

export interface UserProfilePlanUsage {
  id: string;
  label: string;
  used: number;
  limit: number;
}

export interface UserProfilePlan {
  name: string;
  status: string;
  billing_cycle: string | null;
  renews_at: string | null;
  usage: UserProfilePlanUsage[];
}

export type UserProfilePlatform = "instagram" | "linkedin" | "x";

export interface UserProfileConnectedAccount {
  platform: UserProfilePlatform | string;
  connected: boolean;
  handle: string | null;
  profile_url: string | null;
}

export interface UserProfileData {
  user: UserProfileUser;
  company: UserProfileCompany;
  plan: UserProfilePlan | null;
  connected_accounts: UserProfileConnectedAccount[];
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfileData;
}
