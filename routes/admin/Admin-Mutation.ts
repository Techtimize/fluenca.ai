import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteUserApi, UpdateUserStatusApi } from "./admin.routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import type { UpdateUserStatusRequest } from "@/types/admin/users-type";

export function UpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UpdateUserStatusRequest["status"] }) =>
      UpdateUserStatusApi(userId, { status }),
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not update the user's status"));
    },
  });
}

export function DeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => DeleteUserApi(userId),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not delete the user"));
    },
  });
}
