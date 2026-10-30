"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Info,
  Loader2,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { clearAuthTokenProvider } from "@/provider/auth-provider";
import useOnboardingStore from "@/store/onboardingStore";
import {
  GoogleAnalyticsConnectMutation,
  InstagramConnectMutation,
  IntelligenceRunMutation,
  LinkedInConnectMutation,
  OnboardingMutation,
  SearchConsoleConnectMutation,
  XConnectMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import {
  GoogleAnalyticsConnectionQuery,
  SearchConsoleConnectionQuery,
  SocialAccountsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import {
  findSocialAccount,
  isSocialAccountConnected,
  normalizeSocialAccounts,
} from "@/types/bussiness/social-accounts-type";
import { GoogleIcon } from "@/components/shared/brandIcons";
import { BrandButton } from "@/components/ui/brand-button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import {
  SelectContent,
  SelectGroup,
  SelectValue,
  SelectItem,
  SelectTrigger,
  Select,
} from "@/components/ui/select";
import { INDUSTRY_LIST } from "@/constant/industry";
import { LANGUAGE_LIST } from "@/constant/language";
import { PAGE_ROUTES } from "@/constant/page-routes";
import {
  // IndividualOnboardingFormSchema,
  // IndividualOnboardingFormValidator,
  OnboardingFormSchema,
  OnboardingFormValidator,
} from "@/validator/Auth/onboarding-validator";
import OnboardingStepper, { OnboardingStep } from "@/components/onboarding/stepper";
import IntakeQuestions from "@/components/onboarding/IntakeQuestions";
import ExtractingIntake from "@/components/onboarding/ExtractingIntake";
import IntelligenceProgress from "@/components/onboarding/IntelligenceProgress";
// import type { OnboardingRequestProps } from "@/types/bussiness/onboarding-type";

// Individual onboarding is disabled for now; only "company" is live.
// type OnboardingMode = "individual" | "company";

const labelClass = "text-sm font-semibold tracking-[0.02em] text-neutral-900";
const messageClass = "text-xs text-red-400";
const fieldControlClass =
  "h-11 w-full rounded-full border-gray-300 text-sm text-black placeholder:text-slate-500 focus:ring-2 focus:ring-primarytext md:h-10";
const selectTriggerClass = `${fieldControlClass} data-[size=default]:h-11 md:data-[size=default]:h-10`;

/* Individual onboarding (disabled)
const GOAL_KEYS = [
  "goalAudience",
  "goalEngagement",
  "goalBrand",
  "goalLeads",
  "goalConsistency",
] as const;

function mapIndividualToRequest(
  data: IndividualOnboardingFormValidator,
): OnboardingRequestProps {
  const handle = data.instagram_username?.replace(/^@/, "").trim();
  const linkedin = data.linkedin_url?.trim();
  const website_url =
    linkedin ||
    (handle ? `instagram.com/${handle}` : "fluenca.ai/individual");

  return {
    company_name: data.full_name.trim(),
    industry: data.primary_goal,
    primary_product_or_service: `${data.profession.trim()} · ${data.platform}`,
    language: data.language,
    website_url,
    target_country: data.target_country,
    instagram_username: data.instagram_username || null,
    linkedin_url: data.linkedin_url || null,
  };
}
*/


function PlatformConnectRow({
  iconSrc,
  icon,
  iconBg,
  title,
  description,
  connected,
  isConnecting,
  connectLabel,
  connectedLabel,
  onConnect,
}: {
  iconSrc?: string;
  icon?: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  connected: boolean;
  isConnecting: boolean;
  connectLabel: string;
  connectedLabel: string;
  onConnect: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E6E8F5] bg-white px-4 py-3.5 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", iconBg)}>
          {iconSrc ? (
            <Image src={iconSrc} alt="" width={22} height={22} className="object-contain" />
          ) : (
            icon
          )}
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-neutral-900">{title}</p>
          <p className="truncate text-[12.5px] text-neutral-500">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onConnect}
        disabled={isConnecting}
        className={cn(
          "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          connected
            ? "bg-emerald-50 text-emerald-700"
            : "bg-[#ECEBFF] text-[#5B57E6] hover:bg-[#DEDBFF]",
        )}
      >
        {isConnecting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : connected ? (
          <>
            <CheckCircle2 className="size-3.5" />
            {connectedLabel}
          </>
        ) : (
          <>
            {connectLabel}
            <ArrowRight className="size-3.5" />
          </>
        )}
      </button>
    </div>
  );
}

function OnboardingContent() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledReturn = useRef(false);
  // const [mode, setMode] = useState<OnboardingMode>("individual");
  const [industryOpen, setIndustryOpen] = useState(false);
  const { mutate: onboardingMutation, isPending } = OnboardingMutation();
  const { mutate: intelligenceRun, isPending: isRunningIntelligence } = IntelligenceRunMutation();
  const setOnboardingDetails = useOnboardingStore((s) => s.setOnboardingDetails);
  const clearOnboardingDetails = useOnboardingStore((s) => s.clearOnboardingDetails);
  const step = useOnboardingStore((s) => s.step);
  const maxStepReached = useOnboardingStore((s) => s.maxStepReached);
  const setStoredStep = useOnboardingStore((s) => s.setStep);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [intelligenceJobId, setIntelligenceJobId] = useState<string | null>(null);

  const { data: socialAccountsData, refetch: refetchSocialAccounts } =
    SocialAccountsQuery();
  const { mutate: connectInstagram, isPending: isConnectingInstagram } =
    InstagramConnectMutation();
  const { mutate: connectLinkedIn, isPending: isConnectingLinkedIn } =
    LinkedInConnectMutation();
  const { mutate: connectX, isPending: isConnectingX } = XConnectMutation();
  const { data: gaConnection, isLoading: isGaLoading } = GoogleAnalyticsConnectionQuery();
  const { mutate: connectGoogleAnalytics, isPending: isConnectingGa } =
    GoogleAnalyticsConnectMutation();
  const { data: searchConsoleConnection } = SearchConsoleConnectionQuery();
  const { mutate: connectSearchConsole, isPending: isConnectingSearchConsole } =
    SearchConsoleConnectMutation();

  const socialAccounts = normalizeSocialAccounts(socialAccountsData);
  const instagramAccount = findSocialAccount(socialAccounts, "instagram");
  const linkedinAccount = findSocialAccount(socialAccounts, "linkedin");
  const xAccount = findSocialAccount(socialAccounts, "x");
  const instagramConnected = isSocialAccountConnected(instagramAccount);
  const linkedinConnected = isSocialAccountConnected(linkedinAccount);
  const xConnected = isSocialAccountConnected(xAccount);
  const googleAnalyticsConnected = Boolean(
    gaConnection?.connected && gaConnection.status === "active",
  );
  const searchConsoleConnected = Boolean(
    searchConsoleConnection?.connected && searchConsoleConnection.status === "active",
  );
  const instagramHandle =
    instagramAccount?.username ||
    instagramAccount?.external_account_name ||
    instagramAccount?.account_name ||
    null;
  const linkedinProfileUrl =
    linkedinAccount?.profile_url ||
    linkedinAccount?.external_account_name ||
    null;

  const industrySearchPlaceholder = t.has("industrySearchPlaceholder")
    ? t("industrySearchPlaceholder")
    : "Search industry...";
  const industryNotFound = t.has("industryNotFound")
    ? t("industryNotFound")
    : "No industry found.";

  const companyForm = useForm<OnboardingFormValidator>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      company_name: "",
      industry: "",
      primary_product_or_service: "",
      language: "",
      website_url: "",
      instagram_username: "",
      linkedin_url: "",
    },
  });


  useEffect(() => {
    const stored = useOnboardingStore.getState();
    companyForm.reset({
      ...companyForm.getValues(),
      company_name: stored.company_name,
      industry: stored.industry,
      primary_product_or_service: stored.primary_product_or_service,
      language: stored.language,
      website_url: stored.website_url,
      instagram_username: stored.instagram_username,
      linkedin_url: stored.linkedin_url,
    });
  }, [companyForm]);

  useEffect(() => {
    companyForm.setValue(
      "instagram_username",
      instagramConnected && instagramHandle ? `@${instagramHandle}` : "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instagramConnected, instagramHandle]);

  useEffect(() => {
    companyForm.setValue(
      "linkedin_url",
      linkedinConnected && linkedinProfileUrl ? linkedinProfileUrl : "",
    );
  }, [companyForm, linkedinConnected, linkedinProfileUrl]);

  useEffect(() => {
    if (handledReturn.current) return;

    const connected = searchParams.get("connected");
    const connectError = searchParams.get("connect_error");

    if (!connected && !connectError) return;
    handledReturn.current = true;

    const CONNECTED_LABELS: Record<string, string> = {
      instagram: "Instagram",
      linkedin: "LinkedIn",
      x: "X",
      google_analytics: "Google Analytics",
      search_console: "Google Search Console",
    };

    if (connectError) {
      toast.error(decodeURIComponent(connectError.replace(/\+/g, " ")));
    } else if (connected && CONNECTED_LABELS[connected]) {
      toast.success(`${CONNECTED_LABELS[connected]} connected`);
      if (connected === "instagram" || connected === "linkedin" || connected === "x") {
        void refetchSocialAccounts();
      }
      // Connecting only happens from the "connect platforms" step, so land back on it.
      setStoredStep(2);
    }

    router.replace(PAGE_ROUTES.ONBOARDING);
  }, [refetchSocialAccounts, router, searchParams, setStoredStep]);

  /* Individual onboarding (disabled)
  const individualForm = useForm<IndividualOnboardingFormValidator>({
    resolver: zodResolver(IndividualOnboardingFormSchema),
    defaultValues: {
      full_name: "",
      profession: "",
      primary_goal: "",
      language: "",
      platform: "" as IndividualOnboardingFormValidator["platform"],
      target_country: "",
      instagram_username: "",
      linkedin_url: "",
    },
  });

  const selectedPlatform = individualForm.watch("platform");
  const showInstagram =
    selectedPlatform === "instagram" || selectedPlatform === "both";
  const showLinkedin =
    selectedPlatform === "linkedin" || selectedPlatform === "both";

  */

  const onCompanySubmit = (data: OnboardingFormValidator) => {
    setOnboardingDetails(data);
    onboardingMutation(
      { ...data, target_country: "" },
      {
        onSuccess: (response) => {
          setCompanyId(response.company_id);
          goToStep(3);
        },
      },
    );
  };

  const handleIntakeComplete = () => {
    if (!companyId) {
      toast.error("Company ID is missing. Please complete onboarding again.");
      return;
    }
    intelligenceRun(
      { company_id: companyId, platforms: ["instagram", "linkedin"], script_count: 5 },
      {
        onSuccess: (response) => {
          if (response?.success === false) return;
          const jobId = response?.job_id?.trim();
          if (!jobId) {
            toast.error("We couldn't start building your workspace. Please try again.");
            return;
          }
          setIntelligenceJobId(jobId);
          goToStep(5);
        },
      },
    );
  };

  const handleStartNewFlow = () => {
    clearAuthTokenProvider();
    clearOnboardingDetails();
    window.location.replace(PAGE_ROUTES.SIGNUP);
  };

  const goToStep = (next: OnboardingStep) => {
    setStoredStep(next);
  };

  const handleContinueFromDetails = async () => {
    const valid = await companyForm.trigger([
      "company_name",
      "primary_product_or_service",
      "industry",
      "language",
      "website_url",
    ]);
    if (!valid) return;

    setOnboardingDetails(companyForm.getValues());
    goToStep(2);
  };

  // Individual onboarding (disabled)
  // const onIndividualSubmit = (data: IndividualOnboardingFormValidator) =>
  //   onboardingMutation(mapIndividualToRequest(data));


  const stepLabels: Record<OnboardingStep, string> = {
    1: t("stepCompanyDetails"),
    2: t("stepConnectPlatforms"),
    3: t("stepExtracting"),
    4: t("stepIntake"),
    5: t("stepBuilding"),
  };

  const stepHeading =
    step === 1
      ? { title: t("title"), subtitle: t("subtitle") }
      : step === 2
        ? { title: t("connectTitle"), subtitle: t("connectSubtitle") }
        : step === 3
          ? { title: t("extractingTitle"), subtitle: t("extractingSubtitle") }
          : step === 4
            ? { title: t("intakeTitle"), subtitle: t("intakeSubtitle") }
            : { title: t("buildingTitle"), subtitle: t("buildingSubtitle") };

  return (
    <div className="relative flex min-h-dvh w-full items-start justify-center overflow-y-auto bg-[#F4F4FC] px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10 md:items-center">
      <div className="absolute inset-e-4 top-4 z-10 flex items-center gap-2 sm:inset-e-6 sm:top-6">
        <button
          type="button"
          onClick={handleStartNewFlow}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-3.5 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-white hover:text-neutral-900"
        >
          <RotateCcw className="size-3.5" />
          Start new flow
        </button>
        <LanguageSwitcher variant="muted" />
      </div>

      <div
        className={cn(
          "w-full space-y-5 rounded-[28px] border border-[#E6E8F5] bg-white p-5 shadow-sm sm:space-y-6 sm:p-8",
          step === 3 || step === 4 || step === 5 ? "max-w-5xl" : "max-w-xl",
        )}
      >
        <OnboardingStepper
          step={step}
          maxStepReached={maxStepReached}
          stepLabels={stepLabels}
          onStepClick={goToStep}
        />

        {/* Individual / Company switch — disabled with the individual flow
        <div
          role="tablist"
          aria-label="Onboarding type"
          className="mx-auto flex w-full max-w-sm rounded-full border border-[#E6E8F5] bg-[#F6F7FD] p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "individual"}
            onClick={() => setMode("individual")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition",
              mode === "individual"
                ? "bg-brand text-white shadow-[0_3px_0_#bfc1ff]"
                : "text-neutral-500 hover:text-neutral-800",
            )}
          >
            <User className="size-4" aria-hidden />
            {t("modeIndividual")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "company"}
            onClick={() => setMode("company")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition",
              mode === "company"
                ? "bg-brand text-white shadow-[0_3px_0_#bfc1ff]"
                : "text-neutral-500 hover:text-neutral-800",
            )}
          >
            <Building2 className="size-4" aria-hidden />
            {t("modeCompany")}
          </button>
        </div> */}

        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            {stepHeading.title}
          </h1>
          <p className="mx-auto max-w-md text-sm font-light text-neutral-500 sm:text-base">
            {stepHeading.subtitle}
          </p>
        </div>

        {/* Individual onboarding — disabled for now; only the company flow is live.
          <Form {...individualForm}>
            <form
              onSubmit={individualForm.handleSubmit(onIndividualSubmit)}
              className="flex flex-col gap-3.5 sm:gap-4"
            >
              <FormField
                control={individualForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={labelClass}>{t("fullName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("fullNamePlaceholder")}
                        {...field}
                        className={fieldControlClass}
                      />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />

              <FormField
                control={individualForm.control}
                name="profession"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={labelClass}>{t("profession")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("professionPlaceholder")}
                        {...field}
                        className={fieldControlClass}
                      />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                <FormField
                  control={individualForm.control}
                  name="primary_goal"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5">
                      <FormLabel className={labelClass}>
                        {t("primaryGoal")}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue
                              placeholder={t("primaryGoalPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {GOAL_KEYS.map((key) => (
                              <SelectItem key={key} value={t(key)}>
                                {t(key)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={individualForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5">
                      <FormLabel className={labelClass}>
                        {t("language")}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder={t("languagePlaceholder")}>
                              {
                                LANGUAGE_LIST.find((l) => l.code === field.value)
                                  ?.name
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {LANGUAGE_LIST.map((item) => (
                              <SelectItem key={item.id} value={item.code}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={individualForm.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5">
                      <FormLabel className={labelClass}>
                        {t("platform")}
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Drop the handle for whichever platform is no longer selected.
                          if (value === "instagram") {
                            individualForm.setValue("linkedin_url", "");
                          } else if (value === "linkedin") {
                            individualForm.setValue("instagram_username", "");
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue
                              placeholder={t("platformPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="instagram">
                              {t("platformInstagram")}
                            </SelectItem>
                            <SelectItem value="linkedin">
                              {t("platformLinkedin")}
                            </SelectItem>
                            <SelectItem value="both">
                              {t("platformBoth")}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />

                <CountryField
                  control={individualForm.control}
                  name="target_country"
                />

                {showInstagram && (
                  <FormField
                    control={individualForm.control}
                    name="instagram_username"
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          "min-w-0 gap-1.5",
                          !showLinkedin && "sm:col-span-2",
                        )}
                      >
                        <FormLabel className={labelClass}>
                          {t("instagram")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("instagramPlaceholder")}
                            {...field}
                            className={fieldControlClass}
                          />
                        </FormControl>
                        <FormMessage className={messageClass} />
                      </FormItem>
                    )}
                  />
                )}

                {showLinkedin && (
                  <FormField
                    control={individualForm.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          "min-w-0 gap-1.5",
                          !showInstagram && "sm:col-span-2",
                        )}
                      >
                        <FormLabel className={labelClass}>
                          {t("linkedin")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            inputMode="url"
                            placeholder={t("linkedinPlaceholder")}
                            {...field}
                            className={fieldControlClass}
                          />
                        </FormControl>
                        <FormMessage className={messageClass} />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <BrandButton
                type="submit"
                size="full"
                className="mt-1"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {t("individualSubmit")}
              </BrandButton>
            </form>
          </Form>
        */}
          <Form {...companyForm}>
            <form
              onSubmit={companyForm.handleSubmit(onCompanySubmit)}
              className="flex flex-col gap-3.5 sm:gap-4"
            >
              {step === 1 ? (
                <>
                  <FormField
                    control={companyForm.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem className="gap-1.5">
                        <FormLabel className={labelClass}>
                          {t("companyName")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("companyNamePlaceholder")}
                            {...field}
                            className={fieldControlClass}
                          />
                        </FormControl>
                        <FormMessage className={messageClass} />
                      </FormItem>
                    )}
                  />
                   <FormField
                      control={companyForm.control}
                      name="website_url"
                      render={({ field }) => (
                        <FormItem className="min-w-0 gap-1.5">
                          <FormLabel className={labelClass}>{t("website")}</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="url"
                              autoComplete="url"
                              placeholder="www.example.com"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    .trim()
                                    .replace(/^https?:\/\//i, "")
                                    .replace(/\/+$/, ""),
                                )
                              }
                              className={fieldControlClass}
                            />
                          </FormControl>
                          <FormMessage className={messageClass} />
                        </FormItem>
                      )}
                    />

                  <FormField
                    control={companyForm.control}
                    name="primary_product_or_service"
                    render={({ field }) => (
                      <FormItem className="gap-1.5">
                        <FormLabel className={labelClass}>{t("services")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("servicesPlaceholder")}
                            {...field}
                            className={fieldControlClass}
                          />
                        </FormControl>
                        <FormMessage className={messageClass} />
                      </FormItem>
                    )}
                  />
                  

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                    <FormField
                      control={companyForm.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem className="min-w-0 gap-1.5">
                          <FormLabel className={labelClass}>
                            {t("industry")}
                          </FormLabel>
                          <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
                            <FormControl>
                              <PopoverTrigger
                                className={cn(
                                  fieldControlClass,
                                  "flex cursor-pointer items-center justify-between border bg-transparent px-3 text-start font-normal outline-none",
                                  !field.value && "text-slate-500",
                                )}
                              >
                                <span className="truncate">
                                  {field.value || t("industryPlaceholder")}
                                </span>
                                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                              </PopoverTrigger>
                            </FormControl>
                            <PopoverContent
                              align="start"
                              className="w-(--anchor-width) min-w-56 p-0"
                            >
                              <Command>
                                <CommandInput
                                  placeholder={industrySearchPlaceholder}
                                />
                                <CommandList>
                                  <CommandEmpty>{industryNotFound}</CommandEmpty>
                                  <CommandGroup>
                                    {INDUSTRY_LIST.map((item) => (
                                      <CommandItem
                                        key={item.id}
                                        value={item.name}
                                        onSelect={() => {
                                          field.onChange(item.name);
                                          setIndustryOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "me-2 h-4 w-4",
                                            field.value === item.name
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {item.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage className={messageClass} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem className="min-w-0 gap-1.5">
                          <FormLabel className={labelClass}>
                            {t("language")}
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder={t("languagePlaceholder")}>
                                  {
                                    LANGUAGE_LIST.find((l) => l.code === field.value)
                                      ?.name
                                  }
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {LANGUAGE_LIST.map((item) => (
                                  <SelectItem key={item.id} value={item.code}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage className={messageClass} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="instagram_username"
                      render={({ field }) => <input type="hidden" {...field} />}
                    />

                    <FormField
                      control={companyForm.control}
                      name="linkedin_url"
                      render={({ field }) => <input type="hidden" {...field} />}
                    />
                  </div>

                  <BrandButton
                    type="button"
                    size="full"
                    className="mt-1"
                    onClick={handleContinueFromDetails}
                  >
                    {t("continue")}
                  </BrandButton>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <div className="space-y-3">
                    <PlatformConnectRow
                      iconSrc="/assets/insta.png"
                      iconBg="bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
                      title="Instagram"
                      description={t("connectInstagramDesc")}
                      connected={instagramConnected}
                      isConnecting={isConnectingInstagram}
                      connectLabel={t("connectAction")}
                      connectedLabel={t("connectedLabel")}
                      onConnect={() => connectInstagram("onboarding")}
                    />
                    <PlatformConnectRow
                      iconSrc="/assets/linkedin.png"
                      iconBg="bg-[#0A66C2]"
                      title="LinkedIn"
                      description={t("connectLinkedinDesc")}
                      connected={linkedinConnected}
                      isConnecting={isConnectingLinkedIn}
                      connectLabel={t("connectAction")}
                      connectedLabel={t("connectedLabel")}
                      onConnect={() => connectLinkedIn("onboarding")}
                    />
                    <PlatformConnectRow
                      iconSrc="/assets/x.png"
                      iconBg="bg-black"
                      title="X (Twitter)"
                      description={t("connectXDesc")}
                      connected={xConnected}
                      isConnecting={isConnectingX}
                      connectLabel={t("connectAction")}
                      connectedLabel={t("connectedLabel")}
                      onConnect={() => connectX("onboarding")}
                    />
                    <PlatformConnectRow
                      icon={<BarChart3 className="size-5 text-white" aria-hidden="true" />}
                      iconBg="bg-[#E37400]"
                      title="Google Analytics"
                      description={t("connectGa4Desc")}
                      connected={googleAnalyticsConnected}
                      isConnecting={isConnectingGa || isGaLoading}
                      connectLabel={t("connectAction")}
                      connectedLabel={t("connectedLabel")}
                      onConnect={() => connectGoogleAnalytics("onboarding")}
                    />
                    <PlatformConnectRow
                      icon={<GoogleIcon className="size-5" />}
                      iconBg="bg-[#F6F7FD] ring-1 ring-[#E6E8F5]"
                      title="Google Console"
                      description={t("connectConsoleDesc")}
                      connected={searchConsoleConnected}
                      isConnecting={isConnectingSearchConsole}
                      connectLabel={t("connectAction")}
                      connectedLabel={t("connectedLabel")}
                      onConnect={() => connectSearchConsole("onboarding")}
                    />
                  </div>

                  <BrandButton
                    type="button"
                    size="full"
                    className="mt-1"
                    disabled={isPending}
                    onClick={companyForm.handleSubmit(onCompanySubmit)}
                  >
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                    {t("startAnalyzing")}
                  </BrandButton>
                </>
              ) : null}

              {step === 3 ? <ExtractingIntake showHeading={false} onReady={() => goToStep(4)} /> : null}

              {step === 4 ? (
                <IntakeQuestions
                  onComplete={handleIntakeComplete}
                  isCompleting={isRunningIntelligence}
                  completeLabel={t("submit")}
                />
              ) : null}

              {step === 5 && intelligenceJobId ? (
                <IntelligenceProgress
                  jobId={intelligenceJobId}
                  showHeading={false}
                  onReady={() => router.push(PAGE_ROUTES.DASHBOARD)}
                  onFailed={() => goToStep(4)}
                />
              ) : null}
            </form>
          </Form>
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <Suspense fallback={null}>
      <OnboardingContent />
    </Suspense>
  );
}
