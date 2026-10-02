export const ADMINENDPOINT = {
  USERS: "/admin/users",
  userStatus: (userId: string) => `/admin/users/${userId}/status`,
} as const;
