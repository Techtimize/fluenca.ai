import type { ReactNode } from "react";
import AiVisibilityShell from "@/components/dashboard/ai-visibility/AiVisibilityShell";

export default function AiVisibilityLayout({ children }: { children: ReactNode }) {
  return <AiVisibilityShell>{children}</AiVisibilityShell>;
}
