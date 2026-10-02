import type { ReactNode } from "react";

type Props = {
  as?: "section" | "aside" | "div";
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function Card({ as: Tag = "section", id, className = "", children }: Props) {
  return (
    <Tag id={id} className={`rounded-3xl border border-[#E6E8F5] bg-white/90 backdrop-blur ${className}`}>
      {children}
    </Tag>
  );
}