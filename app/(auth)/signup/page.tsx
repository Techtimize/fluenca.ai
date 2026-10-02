'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SignupMutation } from '@/routes/auth/Auth-Mutation';
import { PAGE_ROUTES } from '@/constant/page-routes';

export default function SignUpPage() {
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
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePasswordMatch = (value: string) => {
    if (value && value !== password) {
      setPasswordMismatchError('Passwords do not match');
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
      setEmailError('Please enter a valid email address');
      return;
    }
    if (confirmPassword !== password) {
      setPasswordMismatchError('Passwords do not match');
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
      <div className="mx-auto flex flex-col lg:flex-row h-screen overflow-hidden lg:overflow-hidden bg-white">
        {/* Left Side - Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center min-h-screen lg:min-h-0 bg-[radial-gradient(circle_at_top_left,#E3E6FB,transparent_55%)] overflow-y-auto">
          <div className="w-full max-w-[420px] sm:max-w-[460px] md:max-w-[500px] space-y-3 py-5 sm:py-4 px-6 sm:px-8 md:px-12 lg:px-16">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/assets/Logo.svg"
                alt="Influ.ai Logo"
                width={100}
                height={100}
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
            </div>

            {/* Heading */}
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Create Your Account
              </h1>
              <p className="text-[13px] text-gray-500">
                Set up your account and start building smarter with AI.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => validateEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white rounded-full h-10 sm:h-11 px-4 sm:px-5 border border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B5BD6] focus:border-transparent text-sm"
                />
                {emailError && (
                  <p className="text-xs text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Set Your Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter New Password"
                    className="w-full bg-white rounded-full h-10 sm:h-11 px-4 sm:px-5 pr-10 sm:pr-12 border border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B5BD6] focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={(e) => validatePasswordMatch(e.target.value)}
                    placeholder="Enter Confirm Password"
                    className="w-full bg-white rounded-full h-10 sm:h-11 px-4 sm:px-5 pr-10 sm:pr-12 border border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B5BD6] focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
                {passwordMismatchError && (
                  <p className="text-xs text-red-500 mt-1">{passwordMismatchError}</p>
                )}
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#5B5BD6] focus:ring-[#5B5BD6]"
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

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full h-10 sm:h-11 rounded-full bg-[#5B5BD6] text-white text-sm sm:text-base font-semibold shadow-lg hover:bg-[#4a4ac5] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {signupMutation.isPending ? 'Signing up...' : 'Sign up'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center mt-2">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-xs text-gray-400 uppercase">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid w-full grid-cols-1 gap-2 mt-1">
              <button
                type="button"
                className="flex w-full h-12 min-w-0 items-center justify-center gap-2 rounded-full bg-[#EEF0FB] text-sm font-medium whitespace-nowrap overflow-hidden hover:bg-[#E3E6F8]"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
                  <path fill="#FBBC05" d="M10.5 28.7c-.5-1.500-.8-3.100-.8-4.700s.3-3.200.8-4.700l-7.900-6.100C.9 16.500 0 20.100 0 24s.9 7.500 2.600 10.800l7.900-6.100z"/>
                  <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.500-5.800c-2.100 1.400-4.800 2.300-8.400 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/>
                </svg>
                Continue With Google
              </button>
            </div>
          </div>
        </section>

        {/* Right Side - Image Panel */}
        <section className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen m-4 overflow-hidden rounded-3xl bg-[#4F52D9] p-6 items-center justify-center">
          {/* Background image */}
          <Image
            src="/assets/signup-bg.png"
            alt=""
            width={100}
            height={100}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dashboard preview image */}
          <Image
            src="/assets/Main Screen (1).svg"
            alt="Dashboard preview"
            width={100}
            height={100}
            className="relative z-10 w-full h-full object-contain"
          />
        </section>
      </div>
    </div>
  );
}