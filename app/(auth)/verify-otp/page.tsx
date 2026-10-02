'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { VerifyOtpMutation, ResendOtpMutation } from '@/routes/auth/Auth-Mutation';
import { PAGE_ROUTES } from '@/constant/page-routes';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const verifyMutation = VerifyOtpMutation();
  const resendMutation = ResendOtpMutation();

  useEffect(() => {
    if (!email) {
      router.replace(PAGE_ROUTES.SIGNUP);
    }
  }, [email, router]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    verifyMutation.mutate(
      { email, code },
      {
        onSuccess: (response) => {
          const nextRole = response.user.role?.toLowerCase() ?? '';
          const onboardingComplete =
            response.user.onboarded_complete === true ||
            response.user.onboarding_completed === true;
          const isSuperAdmin =
            nextRole === 'super_admin' || nextRole === 'superadmin' || nextRole === 'admin';

          if (isSuperAdmin) {
            router.push(PAGE_ROUTES.SUPERADMIN);
            return;
          }
          router.push(onboardingComplete ? PAGE_ROUTES.DASHBOARD : PAGE_ROUTES.ONBOARDING);
        },
      },
    );
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    resendMutation.mutate({ email }, { onSuccess: () => setSecondsLeft(RESEND_COOLDOWN_SECONDS) });
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="absolute end-4 top-4 z-20 sm:end-6 sm:top-6">
        <LanguageSwitcher variant="muted" />
      </div>
      <div className="mx-auto flex h-screen flex-col overflow-hidden bg-white lg:flex-row lg:overflow-hidden">
        <section className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[radial-gradient(circle_at_top_left,#E3E6FB,transparent_55%)] lg:min-h-0 lg:w-1/2">
          <div className="w-full max-w-[420px] space-y-3 px-6 py-5 sm:max-w-[460px] sm:px-8 sm:py-4 md:max-w-[500px] md:px-12 lg:px-16">
            <div className="flex justify-center">
              <Image
                src="/assets/Logo.svg"
                alt="Fluenca.ai Logo"
                width={100}
                height={100}
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
            </div>

            <div className="space-y-1 text-center">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {t('verifyOtp.title')}
              </h1>
              <p className="text-[13px] text-gray-500">
                {email ? t('verifyOtp.subtitleWithEmail', { email }) : t('verifyOtp.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={t('verifyOtp.codePlaceholder')}
                  className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 text-center text-lg tracking-[0.3em] placeholder:text-sm placeholder:tracking-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#5B5BD6] sm:h-11"
                />
              </div>

              <button
                type="submit"
                disabled={verifyMutation.isPending || code.length !== 6}
                className="h-10 w-full cursor-pointer rounded-full bg-[#5B5BD6] text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#4a4ac5] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:text-base"
              >
                {verifyMutation.isPending ? tCommon('loading') : t('verifyOtp.submit')}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>{t('verifyOtp.noCode')}</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={secondsLeft > 0 || resendMutation.isPending}
                className="font-medium text-gray-900 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
              >
                {secondsLeft > 0
                  ? t('verifyOtp.resendIn', { seconds: secondsLeft })
                  : t('verifyOtp.resend')}
              </button>
            </div>

            <p className="pt-1 text-center text-sm text-gray-500">
              <Link href={PAGE_ROUTES.LOGIN} className="font-medium text-gray-900 hover:underline">
                {t('login.title')}
              </Link>
            </p>
          </div>
        </section>

        <section className="relative m-4 hidden h-[calc(100vh-2rem)] items-center justify-center overflow-hidden rounded-3xl bg-[#4F52D9] lg:flex lg:w-1/2">
          <Image src="/assets/signup-bg.png" alt="" fill className="object-cover" sizes="50vw" />
          <Image
            src="/assets/signup-preview.svg"
            alt="Dashboard preview"
            width={900}
            height={1100}
            className="relative z-10 h-full w-full object-contain"
          />
        </section>
      </div>
    </div>
  );
}
