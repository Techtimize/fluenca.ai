import AuthLayoutClient from "@/components/shared/AuthLayoutClient";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}