'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { OnboardingFormSchema, OnboardingFormValidator } from '@/validator/Auth/onboarding-validator';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { OnboardingMutation } from '@/routes/bussiness/Bussiness-Mutation';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import OnboardingSide from '@/components/onboardingside';
import {
  SelectContent,
  SelectGroup,
  SelectValue,
  SelectItem,
  SelectTrigger,
  Select,
} from '@/components/ui/select';
import { INDUSTRY_LIST } from '@/constant/industry';
import { LANGUAGE_LIST } from '@/constant/language';
import { COUNTRY_LIST } from '@/constant/country';
import { PAGE_ROUTES } from '@/constant/page-routes';

const labelClass = 'text-sm font-light tracking-[0.04em] text-black';
const messageClass = 'text-xs text-red-400';

const fieldControlClass =
  'h-11 w-full rounded-full border-gray-300 text-sm text-black placeholder:text-slate-500 focus:ring-2 focus:ring-primarytext md:h-10 lg:h-10';

const selectTriggerClass =
  `${fieldControlClass} data-[size=default]:h-11 md:data-[size=default]:h-10 lg:data-[size=default]:h-10`;

export default function Onboarding() {
  const t = useTranslations('onboarding');
  const industrySearchPlaceholder = t.has('industrySearchPlaceholder')
    ? t('industrySearchPlaceholder')
    : 'Search industry...';
  const industryNotFound = t.has('industryNotFound')
    ? t('industryNotFound')
    : 'No industry found.';
  const [industryOpen, setIndustryOpen] = useState(false);
  const { mutate: onboardingMutation, isPending } = OnboardingMutation();
  const form = useForm<OnboardingFormValidator>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      company_name: '',
      industry: '',
      primary_product_or_service: '',
      language: '',
      website_url: '',
      target_country: '',
      instagram_username: '',
      linkedin_url: '',
    },
  });

  const onSubmit = (data: OnboardingFormValidator) => onboardingMutation(data);

  return (
    <div className="grid min-h-dvh w-full grid-cols-1 bg-white lg:h-dvh lg:grid-cols-2 lg:overflow-hidden">
      <div className="relative flex w-full justify-center overflow-y-auto overscroll-contain px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8 md:px-10 md:py-10 lg:h-full lg:items-center lg:overflow-y-auto lg:px-10 lg:py-6 xl:px-14">
        <div className="absolute end-4 top-4 z-10 sm:end-6 sm:top-6">
          <LanguageSwitcher variant="muted" />
        </div>
        <div className="w-full max-w-md space-y-4 sm:space-y-5 md:max-w-xl md:space-y-5 lg:max-w-md lg:space-y-3 xl:max-w-lg">
          <Link href={PAGE_ROUTES.HOME} className="flex justify-center">
            <Image
              src="/assets/Logo.svg"
              alt="Logo"
              loading="eager"
              width={64}
              height={64}
              className="h-11 w-11 sm:h-12 sm:w-12 md:h-12 md:w-12 lg:h-10 lg:w-10"
            />
          </Link>

          <div className="space-y-1.5 text-center sm:space-y-2 lg:space-y-1">
            <h1 className="text-2xl font-semibold tracking-[0.04em] text-neutral-950 sm:text-[1.65rem] md:text-3xl lg:text-xl xl:text-2xl">
              {t('title')}
            </h1>
            <p className="mx-auto max-w-sm px-1 text-sm font-light tracking-[0.04em] text-gray-500 sm:max-w-md sm:text-[0.95rem] md:max-w-lg md:text-base lg:max-w-sm lg:text-xs xl:text-sm">
              {t('subtitle')}
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3 sm:gap-3.5 md:gap-4 lg:gap-2.5"
            >
              {/* Full-width on all breakpoints */}
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem className="gap-1.5 lg:gap-1">
                    <FormLabel className={labelClass}>{t('companyName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('companyNamePlaceholder')} {...field} className={fieldControlClass} />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_product_or_service"
                render={({ field }) => (
                  <FormItem className="gap-1.5 lg:gap-1">
                    <FormLabel className={labelClass}>{t('services')}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t('servicesPlaceholder')}
                        {...field}
                        className={fieldControlClass}
                      />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />

              {/* sm: stacked · md+: 2 columns */}
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-2 md:gap-3 lg:gap-2.5">
                {/* Industry — searchable dropdown */}
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5 lg:gap-1">
                      <FormLabel className={labelClass}>{t('industry')}</FormLabel>
                      <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
                        <FormControl>
                          <PopoverTrigger
                            className={cn(
                              fieldControlClass,
                              'flex cursor-pointer items-center justify-between border bg-transparent px-3 text-start font-normal outline-none',
                              !field.value && 'text-slate-500'
                            )}
                          >
                            <span className="truncate">
                              {field.value || t('industryPlaceholder')}
                            </span>
                            <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent
                          align="start"
                          className="w-[var(--anchor-width)] min-w-56 p-0"
                        >
                          <Command>
                            <CommandInput placeholder={industrySearchPlaceholder} />
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
                                        'me-2 h-4 w-4',
                                        field.value === item.name ? 'opacity-100' : 'opacity-0'
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
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5 lg:gap-1">
                      <FormLabel className={labelClass}>{t('language')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder={t('languagePlaceholder')}>
                              {LANGUAGE_LIST.find((l) => l.code === field.value)?.name}
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
              </div>

              {/* sm: stacked · md+: country + website side by side */}
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-2 md:gap-3 lg:gap-2.5">
                <FormField
                  control={form.control}
                  name="target_country"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5 lg:gap-1">
                      <FormLabel className={labelClass}>{t('country')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder={t('countryPlaceholder')}>
                              {COUNTRY_LIST.find((c) => c.code === field.value)?.name}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {COUNTRY_LIST.map((item) => (
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
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5 lg:gap-1">
                      <FormLabel className={labelClass}>{t('website')}</FormLabel>
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
                                .replace(/^https?:\/\//i, '')
                                .replace(/\/+$/, '')
                            )
                          }
                          className={fieldControlClass}
                        />
                      </FormControl>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />
              </div>

              {/* sm: stacked · md+: Instagram + LinkedIn (both optional) */}
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-2 md:gap-3 lg:gap-2.5">
                <FormField
                  control={form.control}
                  name="instagram_username"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5 lg:gap-1">
                      <FormLabel className={labelClass}>{t('instagram')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          autoComplete="username"
                          placeholder="(optional)"
                          {...field}
                          className={fieldControlClass}
                        />
                      </FormControl>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5 lg:gap-1">
                      <FormLabel className={labelClass}>{t('linkedin')}</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          inputMode="url"
                          placeholder="(optional)"
                          {...field}
                          className={fieldControlClass}
                        />
                      </FormControl>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="mt-1 h-12 w-full cursor-pointer rounded-full bg-brand font-semibold text-white shadow-[0_3px_0_#bfc1ff] transition-all hover:bg-brand-700 hover:opacity-90 sm:mt-2 sm:h-11 md:h-11 lg:mt-1 lg:h-10"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin text-white" />
                ) : (
                  t('submit')
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Side panel — large screens only */}
      <div className="hidden h-full min-h-0 overflow-hidden lg:block">
        <OnboardingSide />
      </div>
    </div>
  );
}