import api from "../apiClient";
import { ADMINENDPOINT } from "./api/Admin-Endpoint";
import type { AdminUser, AdminUsersResponse } from "@/types/admin/users-type";

function normalizeUsers(payload: AdminUsersResponse | AdminUser[]): AdminUser[] {
  if (Array.isArray(payload)) return payload;
  return payload.users ?? payload.data ?? payload.results ?? [];
}

export const AdminUsersApi = async (): Promise<AdminUser[]> => {
  const response = await api.get<AdminUsersResponse | AdminUser[]>(ADMINENDPOINT.USERS);
  return normalizeUsers(response.data);
};
