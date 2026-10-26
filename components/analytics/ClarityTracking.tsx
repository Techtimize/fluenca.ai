"use client";

import { useEffect } from "react";
import Script from "next/script";
import { CLARITY_TAG, clarity } from "@/lib/analytics/clarity";
import useAuthStore from "@/store/AuthsStore";

export default function ClarityTracking() {
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);

  useEffect(() => {
    if (!companyId) return;
    // identify(customId, customSessionId, customPageId, friendlyName)
    clarity("identify", companyId, undefined, undefined, companyName || companyId);
    clarity("set", "company_id", companyId);
    if (companyName) clarity("set", "company", companyName);
  }, [companyId, companyName]);

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {CLARITY_TAG}
    </Script>
  );
}
