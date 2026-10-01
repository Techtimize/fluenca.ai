'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingFormSchema, OnboardingFormValidator } from '@/validator/Auth/onboarding-validator';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { OnboardingMutation } from '@/routes/bussiness/Bussiness-Mutation';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import OnboardingSide from '@/components/onboardingside';
import { SelectContent, SelectGroup, SelectValue, SelectItem, SelectTrigger, Select } from '@/components/ui/select';
import { INDUSTRY_LIST } from '@/constant/industry';
import { LANGUAGE_LIST } from '@/constant/language';
import { COUNTRY_LIST } from '@/constant/country';
import { PAGE_ROUTES } from '@/constant/page-routes';

const fieldControlClass =
  'h-10 w-full border-gray-300 text-sm text-black placeholder:text-slate-500 rounded-full focus:ring-2 focus:ring-primarytext md:h-9 lg:h-10';

const selectTriggerClass =
  `${fieldControlClass} data-[size=default]:h-10 md:data-[size=default]:h-9 lg:data-[size=default]:h-10`;

export default function Onboarding() {
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
      {/* Form */}
      <div className="flex w-full justify-center overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-5 md:px-10 lg:h-full lg:overflow-hidden lg:px-12 lg:py-5">
        <div className="my-auto w-full max-w-md space-y-2.5 sm:space-y-3 lg:my-0 lg:space-y-2.5">
          <Link href={PAGE_ROUTES.HOME} className="flex justify-center">
            <Image
              src="/assets/Logo.svg"
              alt="Logo"
              loading="eager"
              width={64}
              height={64}
              className="h-10 w-10 sm:h-11 sm:w-11 lg:h-10 lg:w-10"
            />
          </Link>

          <div className="space-y-1 text-center">
            <h1 className="text-xl font-semibold tracking-[0.04em] text-neutral-950 sm:text-2xl lg:text-xl">
              Tell us about your company
            </h1>
            <p className="px-1 text-xs font-light tracking-[0.04em] text-gray-500 sm:text-sm lg:text-xs">
              Add a few details and let AI analyze your market opportunities.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2.5 sm:gap-3 lg:gap-2"
            >
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel className="text-sm font-light tracking-[0.04em] text-black">
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company name"
                        {...field}
                        className={fieldControlClass}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_product_or_service"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel className="text-sm font-light tracking-[0.04em] text-black">
                      Services
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Services"
                        {...field}
                        className={fieldControlClass}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2 md:gap-2 lg:gap-2">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1">
                      <FormLabel className="text-sm font-light tracking-[0.04em] text-black">
                        Industry
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Select Industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {INDUSTRY_LIST.map((item) => (
                              <SelectItem key={item.id} value={item.name}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1">
                      <FormLabel className="text-sm font-light tracking-[0.04em] text-black">
                        Preferred Language
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Select Language" />
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
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="target_country"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel className="text-sm font-light tracking-[0.04em] text-black">
                      Target Country
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue placeholder="Select Country" />
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
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website_url"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel className="text-sm font-light tracking-[0.04em] text-black">
                      Website Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        placeholder="Enter your website link"
                        {...field}
                        className={fieldControlClass}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2 md:gap-2 lg:gap-2">
                <FormField
                  control={form.control}
                  name="instagram_username"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1">
                      <FormLabel className="text-sm font-light tracking-[0.04em] text-black">
                        Instagram Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          autoComplete="username"
                          placeholder="Instagram username"
                          {...field}
                          className={fieldControlClass}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1">
                      <FormLabel className="text-sm font-light tracking-[0.04em] text-black">
                        LinkedIn URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          inputMode="url"
                          placeholder="LinkedIn URL"
                          {...field}
                          className={fieldControlClass}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="mt-1 h-11 w-full cursor-pointer rounded-full bg-brand font-semibold text-white shadow-[0_3px_0_#bfc1ff] transition-all hover:bg-brand-700 hover:opacity-90 sm:mt-2 sm:h-10 lg:mt-1 lg:h-10"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin text-white" />
                ) : (
                  'Generate Report'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Side panel — desktop only */}
      <div className="hidden h-full overflow-hidden lg:block">
        <OnboardingSide />
      </div>
    </div>
  );
}
