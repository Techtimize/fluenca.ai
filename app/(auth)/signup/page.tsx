'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { SignupMutation } from '@/routes/auth/Auth-Mutation';
import { PAGE_ROUTES } from '@/constant/page-routes';

export default function SignUpPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState('');
  const signupMutation = SignupMutation();
  const router = useRouter();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError(t('signup.invalidEmail'));
    } else {
      setEmailError('');
    }
  };

  const validatePasswordMatch = (value: string) => {
    if (value && value !== password) {
      setPasswordMismatchError(t('signup.passwordMismatch'));
    } else {
      setPasswordMismatchError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateEmail(email);
    if (confirmPassword) {
      validatePasswordMatch(confirmPassword);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t('signup.invalidEmail'));
      return;
    }
    if (confirmPassword !== password) {
      setPasswordMismatchError(t('signup.passwordMismatch'));
      return;
    }

    signupMutation.mutate(
      {
        email,
        password,
        confirm_password: confirmPassword,
      },
      {
        onSuccess: () => router.push(PAGE_ROUTES.LOGIN),
      },
    );
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
                {t('signup.title')}
              </h1>
              <p className="text-[13px] text-gray-500">
                {t('signup.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => validateEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#5B5BD6] sm:h-11 sm:px-5"
                />
                {emailError ? <p className="mt-1 text-xs text-red-500">{emailError}</p> : null}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('signup.setPassword')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('signup.newPasswordPlaceholder')}
                    className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 pe-10 text-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#5B5BD6] sm:h-11 sm:px-5 sm:pe-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 sm:end-4"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('signup.confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={(e) => validatePasswordMatch(e.target.value)}
                    placeholder={t('signup.confirmPasswordPlaceholder')}
                    className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 pe-10 text-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#5B5BD6] sm:h-11 sm:px-5 sm:pe-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 sm:end-4"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
                {passwordMismatchError ? (
                  <p className="mt-1 text-xs text-red-500">{passwordMismatchError}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-[#5B5BD6] focus:ring-[#5B5BD6]"
                  />
                  <span>{t('rememberMe')}</span>
                </label>
                <Link href={PAGE_ROUTES.FORGOT_PASSWORD} className="hover:text-gray-700">
                  {t('forgotPassword')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="h-10 cursor-pointer w-full rounded-full bg-[#5B5BD6] text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#4a4ac5] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:text-base"
              >
                {signupMutation.isPending ? tCommon('loading') : t('signup.submit')}
              </button>
            </form>

            <div className="relative mt-2 flex items-center">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-xs uppercase text-gray-400">{tCommon('or')}</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            <p className="pt-1 text-center text-sm text-gray-500">
              {t('signup.haveAccount')}{' '}
              <Link href={PAGE_ROUTES.LOGIN} className="font-medium text-gray-900 hover:underline">
                {t('signup.signIn')}
              </Link>
            </p>
          </div>
        </section>

        <section className="relative m-4 hidden h-[calc(100vh-2rem)] items-center justify-center overflow-hidden rounded-3xl bg-[#4F52D9] lg:flex lg:w-1/2">
          <Image
            src="/assets/signup-bg.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="50vw"
          />
          <div className="relative z-10 flex h-full w-full items-center justify-end ps-10 pe-0">
            <Image
              src="/assets/signup-preview.svg"
              alt="Dashboard preview"
              width={900}
              height={1100}
              priority
              className="h-[92%] w-auto max-w-none translate-x-6 object-contain object-right drop-shadow-xl sm:translate-x-8 lg:translate-x-10 rtl:-translate-x-6 rtl:object-left sm:rtl:-translate-x-8 lg:rtl:-translate-x-10"
            />
          </div>
        </section>
      </div>
    </div>
  );
}