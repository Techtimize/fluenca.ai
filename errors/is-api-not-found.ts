import { AxiosError } from "axios";
import { NotFoundErrorType } from "./ErrorBoundary";

export const isApiNotFoundError = (error: unknown): boolean => {
  if (!error) return false;

  if (error instanceof NotFoundErrorType) return true;

  const axiosError = error as AxiosError<{
    message?: string;
    detail?: unknown;
    error?: string;
    status?: string | number;
  }>;

  if (axiosError?.response?.status === 404) return true;
  if (axiosError?.status === 404) return true;

  const data = axiosError?.response?.data;
  const detail = data?.detail;
  const apiMessage = [
    data?.message,
    typeof detail === "string" ? detail : undefined,
    data?.error,
    error instanceof Error ? error.message : undefined,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    apiMessage.includes("not found") ||
    apiMessage.includes("does not exist") ||
    apiMessage.includes("no results") ||
    apiMessage.includes("404")
  );
};
