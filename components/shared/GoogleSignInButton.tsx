"use client";

import { useTranslations } from "next-intl";
import { GoogleIcon } from "@/components/shared/brandIcons";
import { googleLoginUrl } from "@/routes/auth/auth.routes";

export default function GoogleSignInButton() {
  const t = useTranslations("auth.google");

  return (
    <a
      href={googleLoginUrl()}
      className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 sm:h-11 sm:text-base"
    >
      <GoogleIcon className="size-5" />
      {t("continue")}
    </a>
  );
}
