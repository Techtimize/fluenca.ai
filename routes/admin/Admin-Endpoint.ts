export const ADMINENDPOINT = {
  USERS: "/admin/users",
  userStatus: (userId: string) => `/admin/users/${userId}/status`,
  user: (userId: string) => `/admin/users/${userId}`,
} as const;
