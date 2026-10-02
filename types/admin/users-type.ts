export interface AdminUser {
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  status: string;
  organization_id: string | null;
  company_name: string | null;
  last_login_at: string | null;
  created_at: string;
}

export interface AdminUsersResponse {
  items: AdminUser[];
  total: number;
  limit: number;
  offset: number;
}

export interface UpdateUserStatusRequest {
  status: "active" | "suspended";
}
