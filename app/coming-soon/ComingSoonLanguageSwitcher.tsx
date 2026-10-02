"use client";

import type { ReactElement } from "react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

/** @deprecated Prefer shared LanguageSwitcher — kept for coming-soon imports. */
export function ComingSoonLanguageSwitcher(): ReactElement {
  return (
    <>
      <LanguageSwitcher variant="dark" compact className="sm:hidden" />
      <LanguageSwitcher variant="dark" className="hidden sm:inline-flex" />
    </>
  );
}
