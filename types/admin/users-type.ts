export interface AdminUser {
  user_id: string;
  email: string;
  contact_person: string | null;
  phone: string | null;
  company_name: string | null;
  industry: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUsersResponse {
  success?: boolean;
  message?: string;
  total?: number;
  count?: number;
  users?: AdminUser[];
  data?: AdminUser[];
  results?: AdminUser[];
}
