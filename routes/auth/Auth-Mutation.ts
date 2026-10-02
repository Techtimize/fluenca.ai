import { LoginApi, SignupApi, VerifyOtpApi, ResendOtpApi } from "./auth.routes";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/errors/error-utils";
import { LoginRequestProps, LoginResponseProps } from "@/types/Auth/login-type";
import { setAuthTokenProvider } from "@/provider/auth-provider";
import {
  SignUpRequestProps,
  SignUpResponseProps,
  VerifyOtpRequestProps,
  ResendOtpRequestProps,
  ResendOtpResponseProps,
} from "@/types/Auth/signup-type";

export function LoginMutation() {
  return useMutation({
    mutationFn: (data: LoginRequestProps) => LoginApi(data),
    onSuccess: (response: LoginResponseProps) => {
      const onboardingCompleted =
        response.user.onboarded_complete === true ||
        response.user.onboarding_completed === true;

      setAuthTokenProvider(
        response.access_token,
        response.user.role,
        response.user.user_id,
        response.user.status,
        response.user.company_name ?? undefined,
        onboardingCompleted,
        response.user.company_id ?? undefined,
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

export function VerifyOtpMutation() {
  return useMutation({
    mutationFn: (data: VerifyOtpRequestProps) => VerifyOtpApi(data),
    onSuccess: (response: LoginResponseProps) => {
      const onboardingCompleted =
        response.user.onboarded_complete === true ||
        response.user.onboarding_completed === true;

      setAuthTokenProvider(
        response.access_token,
        response.user.role,
        response.user.user_id,
        response.user.status,
        response.user.company_name ?? undefined,
        onboardingCompleted,
        response.user.company_id ?? undefined,
      );
      toast.success(response.message || "Email verified");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Invalid or expired code"));
    },
  });
}

export function ResendOtpMutation() {
  return useMutation({
    mutationFn: (data: ResendOtpRequestProps) => ResendOtpApi(data),
    onSuccess: (response: ResendOtpResponseProps) => {
      toast.success(response?.message || "A new code has been sent");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not resend the code"));
    },
  });
}
