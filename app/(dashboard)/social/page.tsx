"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { FacebookIcon } from "@/components/shared/brandIcons";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { SocialAccountsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import {
  findSocialAccount,
  isSocialAccountConnected,
  normalizeSocialAccounts,
} from "@/types/bussiness/social-accounts-type";
import { accountHandle } from "@/components/dashboard/social/socialUtils";
import { FOCUS_RING } from "@/utils/ui-classes";

const PLATFORMS = [
  {
    id: "instagram" as const,
    title: "Instagram",
    href: PAGE_ROUTES.SOCIAL_INSTAGRAM,
    description: "Profile grid, bio, and generated posts in Instagram style.",
    accent: "from-[#F58529] via-[#E1306C] to-[#C13584]",
  },
  {
    id: "facebook" as const,
    title: "Facebook",
    href: PAGE_ROUTES.SOCIAL_FACEBOOK,
    description: "Cover, page header, and timeline feed like Facebook.",
    accent: "from-[#1877F2] to-[#4B92F7]",
  },
  {
    id: "linkedin" as const,
    title: "LinkedIn",
    href: PAGE_ROUTES.SOCIAL_LINKEDIN,
    description: "Profile card and professional feed in LinkedIn style.",
    accent: "from-[#0A66C2] to-[#378FE9]",
  },
];

export default function SocialHubPage() {
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading } = SocialAccountsQuery();
  const accounts = normalizeSocialAccounts(data);

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search social profiles..."
      />

      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6]">
          Connected accounts
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
          Social profiles
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
          Open each connected platform to see its content in a native-looking
          Instagram, Facebook, or LinkedIn layout.
        </p>
      </section>

      {isLoading ? (
        <Card className="flex items-center justify-center gap-2 p-10 text-sm text-neutral-500">
          <Loader2 className="size-5 animate-spin text-[#5B57E6]" />
          Checking connected accounts…
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {PLATFORMS.map((platform) => {
            const account = findSocialAccount(accounts, platform.id);
            const connected = isSocialAccountConnected(account);
            const handle = accountHandle(account);

            return (
              <Card key={platform.id} className="overflow-hidden p-0">
                <div className={`h-2 bg-gradient-to-r ${platform.accent}`} />
                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#F6F7FD] ring-1 ring-[#E6E8F5]">
                      {platform.id === "facebook" ? (
                        <FacebookIcon className="size-6 text-[#1877F2]" />
                      ) : (
                        <Image
                          src={
                            platform.id === "instagram"
                              ? "/assets/insta.png"
                              : "/assets/linkedin.png"
                          }
                          alt=""
                          width={24}
                          height={24}
                          className="size-6 object-contain"
                        />
                      )}
                    </span>
                    <div>
                      <h2 className="text-[16px] font-semibold text-neutral-900">
                        {platform.title}
                      </h2>
                      <p className="text-[12px] text-neutral-500">
                        {connected
                          ? handle
                            ? `@${handle}`
                            : "Connected"
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-5 text-neutral-600">
                    {platform.description}
                  </p>
                  <Link
                    href={connected ? platform.href : PAGE_ROUTES.INTEGRATIONS}
                    className={`inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold ${FOCUS_RING} ${
                      connected
                        ? "bg-[#5B57E6] text-white hover:bg-[#4A46D0]"
                        : "border border-[#E6E8F5] bg-white text-neutral-700 hover:bg-[#F6F7FD]"
                    }`}
                  >
                    {connected ? "Open profile" : "Connect account"}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
