import {
    NetworkErrorType,
    ForbiddenErrorType,
    NotFoundErrorType,
    MaintenanceErrorType,
} from "./ErrorBoundary";
import { AxiosError } from "axios";

export const throwNetworkError = (message?: string): never => {
    throw new NetworkErrorType(message);
};

export const throwForbiddenError = (message?: string): never => {
    throw new ForbiddenErrorType(message);
};

export const throwNotFoundError = (message?: string): never => {
    throw new NotFoundErrorType(message);
};

export const throwMaintenanceError = (message?: string): never => {
    throw new MaintenanceErrorType(message);
};

export const throwErrorByStatus = (status: number, message?: string): never => {
    switch (status) {
        case 403:
            throw new ForbiddenErrorType(message);
        case 404:
            throw new NotFoundErrorType(message);
        case 503:
            throw new MaintenanceErrorType(message);
        case 500:
        case 502:
        case 504:
            throw new Error(message || `Server error: ${status}`);
        default:
            if (status >= 400 && status < 500) {
                throw new Error(message || `Client error: ${status}`);
            }
            throw new Error(message || `Error: ${status}`);
    }
};

export const isNetworkError = (error: unknown): boolean => {
    if (error instanceof NetworkErrorType) return true;
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        return (
            message.includes("fetch") ||
            message.includes("network") ||
            message.includes("connection") ||
            message.includes("failed to fetch") ||
            error.name === "NetworkError" ||
            error.name === "TypeError"
        );
    }
    return false;
};

export const getApiErrorMessage = (error: unknown, fallback = "Something went wrong"): string => {
    if (error == null) return fallback;

    const axiosError = error as AxiosError<{
        message?: string;
        detail?: unknown;
        error?: string;
    }>;
    const data = axiosError?.response?.data;
    const detail = data?.detail;
    const apiMessage =
        data?.message ||
        (typeof detail === "string" ? detail : undefined) ||
        data?.error;

    if (apiMessage) return apiMessage;

    if (
        error instanceof Error &&
        !/^Request failed with status code \d+$/i.test(error.message)
    ) {
        return error.message;
    }

    return fallback;
};

export { isApiNotFoundError } from "./is-api-not-found";
