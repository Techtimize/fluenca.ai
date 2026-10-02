"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function ForgotPassword() {
  const t = useTranslations("auth.forgot");

  return (
    <div className="relative grid h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-2">
      <div className="absolute end-4 top-4 z-20 sm:end-6 sm:top-6">
        <LanguageSwitcher variant="muted" />
      </div>
      <div className="flex h-full w-full items-start justify-center px-4 pb-4 pt-4 sm:px-6 sm:pt-6 md:px-10 lg:px-12 lg:pt-8">
        <div className="w-full max-w-md space-y-3 sm:space-y-4">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-neutral-500">{t("subtitle")}</p>
        </div>
      </div>
    </div>
  );
}
