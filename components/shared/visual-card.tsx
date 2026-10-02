// components/shared/visual-card.tsx
import type { ReactNode } from "react";

type VisualCardProps = {
  children: ReactNode;
  className?: string;
};

/** Purple gradient rounded card that wraps any mockup. Reuse it anywhere. */
export default function VisualCard({ children, className = "" }: VisualCardProps) {
  return (
    <div
      className={`flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}