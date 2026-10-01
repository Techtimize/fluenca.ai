import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function setLocaleCookie(locale: string) {
  document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`;
}

type Variant = "light" | "dark" | "muted";

type Props = {
  variant?: Variant;
  className?: string;
  compact?: boolean;
};

const VARIANT_STYLES: Record<
  Variant,
  { shell: string; active: string; idle: string }
> = {
  light: {
    shell: "border-[#E6E8F5] bg-white text-neutral-700",
    active: "bg-[#ECEBFF] text-[#5B57E6]",
    idle: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
  },
  dark: {
    shell: "border-white/25 bg-white/10 text-white backdrop-blur-md",
    active: "bg-white text-black hover:bg-white/90",
    idle: "text-white/90 hover:bg-white/10 hover:text-white",
  },
  muted: {
    shell: "border-[#E6E8F5] bg-[#F6F7FD] text-neutral-700",
    active: "bg-white text-[#5B57E6] shadow-sm",
    idle: "text-neutral-500 hover:text-neutral-800",
  },
};

export default function LanguageSwitcher({
  variant = "light",
  className,
  compact = false,
}: Props): ReactElement {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const styles = VARIANT_STYLES[variant];

  const switchTo = (nextLocale: string) => {
    if (nextLocale === locale) return;
    setLocaleCookie(nextLocale);
    router.refresh();
  };

  if (compact) {
    return (
      <button
        type="button"
        aria-label={t("languageSwitch")}
        className={cn(
          "inline-flex h-9 items-center rounded-full border px-3 text-[12px] font-medium transition",
          styles.shell,
          className,
        )}
        onClick={() => switchTo(locale === "ar" ? "en" : "ar")}
      >
        {locale === "ar" ? "En" : "عربي"}
      </button>
    );
  }

  return (
    <div
      aria-label={t("languageSwitch")}
      role="group"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-1 text-xs font-medium",
        styles.shell,
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "en" ? styles.active : styles.idle,
        )}
        onClick={() => switchTo("en")}
      >
        En
      </button>
      <button
        type="button"
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "ar" ? styles.active : styles.idle,
        )}
        onClick={() => switchTo("ar")}
      >
        عربي
      </button>
    </div>
  );
}
