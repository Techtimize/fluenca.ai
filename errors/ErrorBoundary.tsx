"use client";

import React, { Component, ReactNode } from "react";
import InternalError from "./InternalError";
import NetworkError from "./NetworkError";
import ForbiddenError from "./Forbidden";
import NotFoundError from "./NotFound";
import MaintenanceError from "./Maintenance";
import { toast } from "sonner";

export class NetworkErrorType extends Error {
  constructor(message?: string) {
    super(message || "Network connection error");
    this.name = "NetworkError";
  }
}

export class ForbiddenErrorType extends Error {
  constructor(message?: string) {
    super(message || "Access forbidden");
    this.name = "ForbiddenError";
  }
}

export class NotFoundErrorType extends Error {
  constructor(message?: string) {
    super(message || "Resource not found");
    this.name = "NotFoundError";
  }
}

export class MaintenanceErrorType extends Error {
  constructor(message?: string) {
    super(message || "Service under maintenance");
    this.name = "MaintenanceError";
  }
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Stale tab after a redeploy: its JS chunks are gone, so load the new build
    if (
      error.name === "ChunkLoadError" ||
      /loading chunk/i.test(error.message)
    ) {
      window.location.reload();
      return;
    }

    toast.error("ErrorBoundary caught an error. Please try again.", {
      description: error.message + " " + errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  renderErrorComponent() {
    const { error } = this.state;

    if (!error) {
      return <InternalError />;
    }

    switch (error.name) {
      case "NetworkError":
      case "TypeError":
        if (
          error.message.includes("fetch") ||
          error.message.includes("network") ||
          error.message.includes("connection") ||
          error.message.includes("Failed to fetch")
        ) {
          return (
            <NetworkError
              message={error.message}
              onRetry={this.handleReset}
              showBackButton={false}
            />
          );
        }
        break;

      case "ForbiddenError":
        return <ForbiddenError />;

      case "NotFoundError":
        return <NotFoundError />;

      case "MaintenanceError":
        return <MaintenanceError />;
    }

    const errorMessage = error.message.toLowerCase();
    const errorString = error.toString().toLowerCase();

    if (
      errorMessage.includes("403") ||
      errorString.includes("forbidden") ||
      errorString.includes("access denied")
    ) {
      return <ForbiddenError />;
    }

    if (
      errorMessage.includes("404") ||
      errorString.includes("not found") ||
      errorString.includes("page not found")
    ) {
      return <NotFoundError />;
    }

    if (
      errorMessage.includes("503") ||
      errorString.includes("maintenance") ||
      errorString.includes("service unavailable")
    ) {
      return <MaintenanceError />;
    }

    if (
      errorMessage.includes("network") ||
      errorMessage.includes("fetch") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("failed to fetch") ||
      errorMessage.includes("networkerror") ||
      errorString.includes("networkerror")
    ) {
      return (
        <NetworkError
          message={error.message}
          onRetry={this.handleReset}
          showBackButton={false}
        />
      );
    }

    return <InternalError message={error.message} />;
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return this.renderErrorComponent();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;