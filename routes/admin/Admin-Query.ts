import { useQuery } from "@tanstack/react-query";
import { AdminUsersApi } from "./admin.routes";

export const AdminUsersQuery = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => AdminUsersApi(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
