"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Building2,
  Check,
  ChevronsUpDown,
  Info,
  Loader2,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { OnboardingMutation } from "@/routes/bussiness/Bussiness-Mutation";
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
import { COUNTRY_LIST } from "@/constant/country";
import { PAGE_ROUTES } from "@/constant/page-routes";
import {
  IndividualOnboardingFormSchema,
  IndividualOnboardingFormValidator,
  OnboardingFormSchema,
  OnboardingFormValidator,
} from "@/validator/Auth/onboarding-validator";
import type { OnboardingRequestProps } from "@/types/bussiness/onboarding-type";

type OnboardingMode = "individual" | "company";

const labelClass = "text-sm font-semibold tracking-[0.02em] text-neutral-900";
const messageClass = "text-xs text-red-400";
const fieldControlClass =
  "h-11 w-full rounded-full border-gray-300 text-sm text-black placeholder:text-slate-500 focus:ring-2 focus:ring-primarytext md:h-10";
const selectTriggerClass = `${fieldControlClass} data-[size=default]:h-11 md:data-[size=default]:h-10`;

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

export default function Onboarding() {
  const t = useTranslations("onboarding");
  const [mode, setMode] = useState<OnboardingMode>("individual");
  const [industryOpen, setIndustryOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const { mutate: onboardingMutation, isPending } = OnboardingMutation();

  const industrySearchPlaceholder = t.has("industrySearchPlaceholder")
    ? t("industrySearchPlaceholder")
    : "Search industry...";
  const industryNotFound = t.has("industryNotFound")
    ? t("industryNotFound")
    : "No industry found.";
  const countrySearchPlaceholder = t.has("countrySearchPlaceholder")
    ? t("countrySearchPlaceholder")
    : "Search country...";
  const countryNotFound = t.has("countryNotFound")
    ? t("countryNotFound")
    : "No country found.";

  const companyForm = useForm<OnboardingFormValidator>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      company_name: "",
      industry: "",
      primary_product_or_service: "",
      language: "",
      website_url: "",
      target_country: "",
      instagram_username: "",
      linkedin_url: "",
    },
  });

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

  const onCompanySubmit = (data: OnboardingFormValidator) =>
    onboardingMutation(data);

  const onIndividualSubmit = (data: IndividualOnboardingFormValidator) =>
    onboardingMutation(mapIndividualToRequest(data));

  const CountryField = ({
    control,
    name,
  }: {
    control: typeof companyForm.control | typeof individualForm.control;
    name: "target_country";
  }) => (
    <FormField
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      control={control as any}
      name={name}
      render={({ field }) => (
        <FormItem className="min-w-0 gap-1.5">
          <FormLabel className={labelClass}>{t("country")}</FormLabel>
          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
            <FormControl>
              <PopoverTrigger
                className={cn(
                  fieldControlClass,
                  "flex cursor-pointer items-center justify-between border bg-transparent px-3 text-start font-normal outline-none",
                  !field.value && "text-slate-500",
                )}
              >
                <span className="truncate">
                  {COUNTRY_LIST.find((c) => c.code === field.value)?.name ||
                    t("countryPlaceholder")}
                </span>
                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
              </PopoverTrigger>
            </FormControl>
            <PopoverContent
              align="start"
              className="w-[var(--anchor-width)] min-w-56 p-0"
            >
              <Command>
                <CommandInput placeholder={countrySearchPlaceholder} />
                <CommandList>
                  <CommandEmpty>{countryNotFound}</CommandEmpty>
                  <CommandGroup>
                    {COUNTRY_LIST.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => {
                          field.onChange(item.code);
                          setCountryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "me-2 h-4 w-4",
                            field.value === item.code
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
  );

  return (
    <div className="relative flex min-h-dvh w-full items-start justify-center overflow-y-auto bg-white px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10 md:items-center">
      <div className="absolute end-4 top-4 z-10 sm:end-6 sm:top-6">
        <LanguageSwitcher variant="muted" />
      </div>

      <div className="w-full max-w-xl space-y-5 sm:space-y-6">
        <Link href={PAGE_ROUTES.HOME} className="flex justify-center">
          <Image
            src="/assets/Logo.svg"
            alt="Fluenca"
            loading="eager"
            width={64}
            height={64}
            className="h-11 w-11 sm:h-12 sm:w-12"
          />
        </Link>

        {/* Individual / Company switch */}
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
        </div>

        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            {mode === "individual" ? t("individualTitle") : t("title")}
          </h1>
          <p className="mx-auto max-w-md text-sm font-light text-neutral-500 sm:text-base">
            {mode === "individual" ? t("individualSubtitle") : t("subtitle")}
          </p>
        </div>

        {mode === "individual" ? (
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
        ) : (
          <Form {...companyForm}>
            <form
              onSubmit={companyForm.handleSubmit(onCompanySubmit)}
              className="flex flex-col gap-3.5 sm:gap-4"
            >
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
                          className="w-[var(--anchor-width)] min-w-56 p-0"
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

                <CountryField
                  control={companyForm.control}
                  name="target_country"
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
                  name="instagram_username"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5">
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

                <FormField
                  control={companyForm.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5">
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
                  t("submit")
                )}
              </BrandButton>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
