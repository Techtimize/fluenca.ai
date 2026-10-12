"use client";

import type { ReactElement } from "react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export function ComingSoonLanguageSwitcher(): ReactElement {
  return (
    <>
      <LanguageSwitcher variant="dark" compact className="sm:hidden" />
      <LanguageSwitcher variant="dark" className="hidden sm:inline-flex" />
    </>
  );
}
