import api from "../apiClient";
import { ADMINENDPOINT } from "./Admin-Endpoint";
import type {
  AdminUsersResponse,
  AdminUser,
  UpdateUserStatusRequest,
} from "@/types/admin/users-type";

export const AdminUsersApi = async (): Promise<AdminUsersResponse> => {
  const response = await api.get<AdminUsersResponse>(ADMINENDPOINT.USERS, {
    params: { limit: 100 },
  });
  return response.data;
};

export const UpdateUserStatusApi = async (
  userId: string,
  data: UpdateUserStatusRequest,
): Promise<AdminUser> => {
  const response = await api.patch<AdminUser>(ADMINENDPOINT.userStatus(userId), data);
  return response.data;
};

export const DeleteUserApi = async (userId: string): Promise<void> => {
  await api.delete(ADMINENDPOINT.user(userId));
};
