"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { setAuthTokenProvider } from "@/provider/auth-provider";
import { MeApi } from "@/routes/auth/auth.routes";

const KNOWN_ERRORS = new Set([
  "google_login_cancelled",
  "invalid_google_login_state",
  "google_email_not_verified",
  "google_account_already_linked",
  "google_login_not_configured",
  "account_suspended",
]);
const ADMIN_ROLES = new Set(["super_admin", "superadmin", "admin"]);

export default function GoogleCallbackPage() {
  const t = useTranslations("auth.google");
  const router = useRouter();
  const handled = useRef(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const finish = async () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      window.history.replaceState(null, "", window.location.pathname);
      const token = params.get("access_token");
      if (!token) {
        setErrorCode(params.get("error") ?? "default");
        return;
      }
      try {
        const user = await MeApi(token);
        const onboardingCompleted = user.onboarding_completed === true;
        setAuthTokenProvider(
          token,
          user.role,
          user.user_id,
          user.status,
          user.company_name ?? undefined,
          onboardingCompleted,
          user.company_id ?? undefined,
        );
        const role = String(user.role ?? "").toLowerCase();
        router.replace(
          ADMIN_ROLES.has(role)
            ? PAGE_ROUTES.SUPERADMIN
            : onboardingCompleted
              ? PAGE_ROUTES.DASHBOARD
              : PAGE_ROUTES.ONBOARDING,
        );
      } catch {
        setErrorCode("default");
      }
    };
    void finish();
  }, [router]);

  if (!errorCode) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <Loader2 className="size-6 animate-spin text-[#5B5BD6]" aria-hidden="true" />
        <p className="text-sm text-gray-600">{t("signingIn")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-lg font-semibold text-gray-900">{t("failedTitle")}</h1>
      <p className="text-sm text-gray-600">
        {t(`errors.${KNOWN_ERRORS.has(errorCode) ? errorCode : "default"}`)}
      </p>
      <Link
        href={PAGE_ROUTES.LOGIN}
        className="inline-flex h-10 items-center justify-center rounded-full bg-[#5B5BD6] px-6 text-sm font-semibold text-white hover:bg-[#4a4ac5]"
      >
        {t("backToLogin")}
      </Link>
    </div>
  );
}
