"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import ExtractingIntake from "@/components/onboarding/ExtractingIntake";
import { PAGE_ROUTES } from "@/constant/page-routes";

export default function CompanyDetail() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[720px] rounded-full bg-[#DCE1FB] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[620px] rounded-full bg-[#E6E9FB] opacity-70 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href={PAGE_ROUTES.HOME} className="flex items-center gap-2">
          <Image
            src="/assets/Logo.svg"
            alt="Fluenca.ai"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="text-base font-semibold text-[#2B2F8F]">
            fluenca<span className="text-[#5B5BD6]">.ai</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="grid size-10 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-700 hover:bg-neutral-50"
          >
            <Bell className="size-4" />
          </button>
          <div className="grid size-10 place-items-center rounded-full bg-[#5B5BD6] text-sm font-semibold text-white">
            U
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center px-4 pb-16 pt-2 sm:pt-4">
        <Image src="/assets/Logo.svg" alt="" width={48} height={48} className="h-12 w-12" />
        <div className="mt-4 w-full">
          <ExtractingIntake onReady={() => router.push(PAGE_ROUTES.DNA)} />
        </div>
      </main>
    </div>
  );
}
