'use client';

import { useRef, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PAGE_ROUTES } from '@/constant/page-routes';
import { LoginMutation } from '@/routes/auth/Auth-Mutation';
import {
  LoginFormSchema,
  LoginFormValidator,
} from '@/validator/Auth/login-validator';
import useAuthStore from '@/store/AuthsStore';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { onboarding_completed }: { onboarding_completed: boolean } = useAuthStore();
  const form = useForm<LoginFormValidator>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const SignInMutation = LoginMutation();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const onSubmit = (data: LoginFormValidator) => {
    SignInMutation.mutate(data, {
      onSuccess: () => router.push(PAGE_ROUTES.ONBOARDING),
    });
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto flex h-screen flex-col overflow-hidden bg-white lg:flex-row lg:overflow-hidden">
        {/* Left Side - Form */}
        <section className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[radial-gradient(circle_at_top_left,#E3E6FB,transparent_55%)] lg:min-h-0 lg:w-1/2">
          <div className="w-full max-w-[420px] space-y-3 px-6 py-5 sm:max-w-[460px] sm:px-8 sm:py-4 md:max-w-[500px] md:px-12 lg:px-16">
            <div className="flex justify-center">
              <Link href={PAGE_ROUTES.HOME}>
                <Image
                  src="/assets/Logo.svg"
                  alt="Fluenca.ai Logo"
                  width={100}
                  height={100}
                  className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                />
              </Link>
            </div>

            <div className="space-y-1 text-center">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Welcome back
              </h1>
              <p className="text-[13px] text-gray-500">
                Sign in to continue to your dashboard
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                ref={ref}
                className="space-y-2 sm:space-y-3"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@company.com"
                          className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#5B5BD6] focus-visible:ring-[#5B5BD6] sm:h-11 sm:px-5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 pr-10 text-sm placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#5B5BD6] focus-visible:ring-[#5B5BD6] sm:h-11 sm:px-5 sm:pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 sm:right-4"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-[#5B5BD6] focus:ring-[#5B5BD6]"
                    />
                    <span>Remember Me</span>
                  </label>
                  <Link
                    href={PAGE_ROUTES.FORGOT_PASSWORD}
                    className="hover:text-gray-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="flex h-10 w-full items-center justify-center rounded-full bg-[#5B5BD6] text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#4a4ac5] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:text-base"
                  disabled={SignInMutation.isPending}
                >
                  {SignInMutation.isPending ? (
                    <Loader2 className="animate-spin text-white" />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </Form>

            <div className="relative mt-2 flex items-center">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-xs text-gray-400 uppercase">or</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* <div className="mt-1 grid w-full grid-cols-1 gap-2">
              <button
                type="button"
                className="flex h-12 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#EEF0FB] text-sm font-medium whitespace-nowrap hover:bg-[#E3E6F8]"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
                  />
                </svg>
                Continue With Google
              </button>
            </div> */}

            <p className="pt-1 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href={PAGE_ROUTES.SIGNUP}
                className="font-medium text-gray-900 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </section>

        {/* Right Side - Image Panel */}
        <section className="relative m-4 hidden h-[calc(100vh-2rem)] items-center justify-center overflow-hidden rounded-3xl bg-[#4F52D9] lg:flex lg:w-1/2">
          <Image
            src="/assets/signup-bg.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="50vw"
          />
          <div className="relative z-10 flex h-full w-full items-center justify-end pl-10 pr-0">
            <Image
              src="/assets/signup-preview.svg"
              alt="Dashboard preview"
              width={900}
              height={1100}
              priority
              className="h-[92%] w-auto max-w-none translate-x-6 object-contain object-right drop-shadow-xl sm:translate-x-8 lg:translate-x-10"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
