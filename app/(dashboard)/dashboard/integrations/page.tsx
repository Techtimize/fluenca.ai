"use client";

import { Suspense, useEffect, useMemo, useRef, type ComponentType } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Clock3, Loader2, Plug, Unplug } from "lucide-react";
import { toast } from "sonner";
import TopBar from "@/components/dashboard/topBar";
import { FacebookIcon } from "@/components/shared/brandIcons";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  FacebookConnectMutation,
  InstagramConnectMutation,
  SocialAccountDisconnectMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import { SocialAccountsQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import {
  findSocialAccount,
  isSocialAccountConnected,
  normalizeSocialAccounts,
  type SocialAccount,
} from "@/types/bussiness/social-accounts-type";

type PlatformId = "instagram" | "facebook" | "linkedin" | "x";

type PlatformCardConfig = {
  id: PlatformId;
  title: string;
  description: string;
  iconSrc?: string;
  Icon?: ComponentType<{ className?: string }>;
  ready: boolean;
};

const PLATFORMS: PlatformCardConfig[] = [
  {
    id: "instagram",
    title: "Instagram",
    description:
      "Authorize Instagram via Meta OAuth. After you approve, you’ll return here with your account linked.",
    iconSrc: "/assets/insta.png",
    ready: true,
  },
  {
    id: "facebook",
    title: "Facebook",
    description:
      "Connect Facebook via Meta OAuth to sync Pages and account insights into Fluenca.",
    Icon: FacebookIcon,
    ready: true,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    description:
      "Connect your company page to sync hiring signals, posts, and audience insights.",
    iconSrc: "/assets/linkedin.png",
    ready: false,
  },
  {
    id: "x",
    title: "X",
    description:
      "Link your X account to pull post performance and brand mentions into Fluenca.",
    iconSrc: "/assets/x.png",
    ready: false,
  },
];

function decodeConnectError(value: string | null) {
  if (!value) return null;
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function accountHandle(account?: SocialAccount | null) {
  const value =
    account?.username || account?.account_name || account?.display_name || null;
  if (!value) return null;
  return String(value).replace(/^@/, "");
}

function PlatformGlyph({
  platform,
  className,
}: {
  platform: PlatformCardConfig;
  className: string;
}) {
  if (platform.Icon) {
    const Icon = platform.Icon;
    return <Icon className={className} />;
  }
  if (platform.iconSrc) {
    const size = className.includes("size-7") ? 28 : 16;
    return (
      <Image
        src={platform.iconSrc}
        alt=""
        width={size}
        height={size}
        className={`${className} object-contain`}
      />
    );
  }
  return null;
}

function PlatformCard({
  platform,
  account,
  isLoading,
  isConnecting,
  isDisconnecting,
  onConnect,
  onDisconnect,
}: {
  platform: PlatformCardConfig;
  account?: SocialAccount | null;
  isLoading?: boolean;
  isConnecting?: boolean;
  isDisconnecting?: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
}) {
  const connected = platform.ready && isSocialAccountConnected(account);
  const handle = accountHandle(account);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F6F7FD] text-[#1877F2] ring-1 ring-[#E6E8F5]">
            <PlatformGlyph platform={platform} className="size-7" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-semibold text-neutral-900">
                {platform.title}
              </h2>
              {!platform.ready ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F0F1F8] px-2.5 py-0.5 text-[11px] font-medium text-neutral-500">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  Coming soon
                </span>
              ) : isLoading ? (
                <span className="rounded-full bg-[#F0F1F8] px-2.5 py-0.5 text-[11px] font-medium text-neutral-500">
                  Checking…
                </span>
              ) : connected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F7F4] px-2.5 py-0.5 text-[11px] font-medium text-[#0F766E]">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Connected
                </span>
              ) : (
                <span className="rounded-full bg-[#F6F7FD] px-2.5 py-0.5 text-[11px] font-medium text-neutral-500">
                  Not connected
                </span>
              )}
            </div>
            <p className="mt-1 text-[13px] leading-5 text-neutral-500">
              {platform.description}
            </p>
            {connected && handle ? (
              <p className="mt-2 text-[13px] font-medium text-neutral-800">
                @{handle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {connected && onDisconnect ? (
            <Button
              type="button"
              variant="outline"
              disabled={isDisconnecting}
              onClick={onDisconnect}
              className="h-11 gap-2 rounded-full px-4"
            >
              {isDisconnecting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Unplug className="size-4" />
              )}
              Disconnect
            </Button>
          ) : null}
          <Button
            type="button"
            disabled={!platform.ready || isConnecting || isLoading}
            onClick={onConnect}
            className={`h-11 gap-2 rounded-full px-5 ${
              platform.ready
                ? "bg-[#5B57E6] text-white hover:bg-[#4A46D0]"
                : "bg-[#EEF0F8] text-neutral-500"
            }`}
          >
            {isConnecting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <PlatformGlyph platform={platform} className="size-4" />
            )}
            {!platform.ready
              ? "Soon"
              : connected
                ? `Reconnect ${platform.title}`
                : `Connect ${platform.title}`}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function IntegrationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyName = useAuthStore((s) => s.company_name);
  const handledReturn = useRef(false);

  const {
    data: accountsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = SocialAccountsQuery();

  const { mutate: connectInstagram, isPending: isConnectingInstagram } =
    InstagramConnectMutation();
  const { mutate: connectFacebook, isPending: isConnectingFacebook } =
    FacebookConnectMutation();
  const { mutate: disconnectAccount, isPending: isDisconnecting } =
    SocialAccountDisconnectMutation();

  const accounts = useMemo(
    () => normalizeSocialAccounts(accountsData),
    [accountsData],
  );
  const instagramAccount = findSocialAccount(accounts, "instagram");
  const facebookAccount = findSocialAccount(accounts, "facebook");

  useEffect(() => {
    if (handledReturn.current) return;

    const connected = searchParams.get("connected");
    const connectError = decodeConnectError(searchParams.get("connect_error"));

    if (!connected && !connectError) return;
    handledReturn.current = true;

    if (connectError) {
      toast.error(connectError);
    } else if (connected === "instagram") {
      toast.success("Instagram connected");
      void refetch();
    } else if (connected === "facebook") {
      toast.success("Facebook connected");
      void refetch();
    } else if (connected) {
      toast.success(`${connected} connected`);
      void refetch();
    }

    router.replace(PAGE_ROUTES.INTEGRATIONS);
  }, [refetch, router, searchParams]);

  return (
    <main className="min-w-0 space-y-4 pb-6">
      <TopBar
        user={{ name: companyName || "User" }}
        placeholder="Search integrations..."
      />

      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
              <Plug className="size-3.5" aria-hidden="true" />
              Integrations
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
              Connect your social accounts
            </h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
              Link Instagram and Facebook now. LinkedIn and X will open for
              connection soon.
            </p>
          </div>
          {isFetching && !isLoading ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] text-neutral-500 ring-1 ring-[#E6E8F5]">
              <Loader2 className="size-3.5 animate-spin text-[#5B57E6]" />
              Updating…
            </span>
          ) : null}
        </div>
      </section>

      {isError ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-800">
            {getApiErrorMessage(error, "Failed to load social accounts")}
          </p>
        </Card>
      ) : null}

      <div className="space-y-3">
        {PLATFORMS.map((platform) => {
          const account =
            platform.id === "instagram"
              ? instagramAccount
              : platform.id === "facebook"
                ? facebookAccount
                : null;
          const isConnecting =
            platform.id === "instagram"
              ? isConnectingInstagram
              : platform.id === "facebook"
                ? isConnectingFacebook
                : false;

          return (
            <PlatformCard
              key={platform.id}
              platform={platform}
              account={account}
              isLoading={platform.ready ? isLoading : false}
              isConnecting={isConnecting}
              isDisconnecting={
                platform.id === "instagram" || platform.id === "facebook"
                  ? isDisconnecting
                  : false
              }
              onConnect={() => {
                if (platform.id === "instagram") {
                  connectInstagram();
                  return;
                }
                if (platform.id === "facebook") {
                  connectFacebook();
                  return;
                }
                toast.message(`${platform.title} connection is coming soon`);
              }}
              onDisconnect={
                platform.id === "instagram" || platform.id === "facebook"
                  ? () => disconnectAccount(platform.id)
                  : undefined
              }
            />
          );
        })}
      </div>
    </main>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={null}>
      <IntegrationsPageContent />
    </Suspense>
  );
}
