import { LoginApi, SignupApi } from "./auth.routes";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/errors/error-utils";
import { LoginRequestProps, LoginResponseProps } from "@/types/Auth/login-type";
import { setAuthTokenProvider } from "@/provider/auth-provider";
import { SignUpRequestProps, SignUpResponseProps } from "@/types/Auth/signup-type";

export function LoginMutation() {
  return useMutation({
    mutationFn: (data: LoginRequestProps) => LoginApi(data),
    onSuccess: (response: LoginResponseProps) => {
      setAuthTokenProvider(
        response.access_token,
        response.user.role,
        response.user.user_id,
        response.user.status,
        response.user.company_name ?? undefined,
      );
      toast.success(response.message || "Logged in successfully");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to login"));
    },
  });
}

export function SignupMutation() {
  return useMutation({
    mutationFn: (data: SignUpRequestProps) => SignupApi(data),
    onSuccess: (response: SignUpResponseProps) => {
      toast.success(response?.message || "Account created successfully");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to signup"));
    },
  });
}
