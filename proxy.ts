import { NextRequest, NextResponse } from 'next/server';
import { PAGE_ROUTES } from '@/constant/page-routes';

const AUTH_ROUTES = [
  PAGE_ROUTES.LOGIN,
  PAGE_ROUTES.SIGNUP,
  PAGE_ROUTES.FORGOT_PASSWORD,
  PAGE_ROUTES.VERIFY_EMAIL,
  PAGE_ROUTES.VERIFY_OTP,
  PAGE_ROUTES.CHANGE_PASSWORD,
] as const;

const ONBOARDING_ROUTES = [
  PAGE_ROUTES.ONBOARDING,
  PAGE_ROUTES.COMPANY_DETAIL,
  PAGE_ROUTES.QUESTIONS,
  PAGE_ROUTES.ANALYZING,
] as const;

const PROTECTED_ROUTES = [
  PAGE_ROUTES.DASHBOARD,
  PAGE_ROUTES.COMPANY_OVERVIEW,
  PAGE_ROUTES.TRENDS,
  PAGE_ROUTES.DNA,
  ...ONBOARDING_ROUTES,
] as const;

function matchesRoute(path: string, routes: readonly string[]) {
  return routes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;
  const onboardingCompleted =
    request.cookies.get('onboarding_completed')?.value === 'true';

  const isAuthenticated = Boolean(accessToken);
  const isAuthRoute = matchesRoute(pathname, AUTH_ROUTES);
  const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTES);
  const isOnboardingRoute = matchesRoute(pathname, ONBOARDING_ROUTES);

  if (isAuthenticated && isAuthRoute) {
    const destination = onboardingCompleted
      ? PAGE_ROUTES.DASHBOARD
      : PAGE_ROUTES.ONBOARDING;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL(PAGE_ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isAuthenticated &&
    !onboardingCompleted &&
    isProtectedRoute &&
    !isOnboardingRoute
  ) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.ONBOARDING, request.url));
  }

  if (isAuthenticated && onboardingCompleted && isOnboardingRoute) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/forgot-password',
    '/change-password',
    '/verify-email',
    '/verify-otp',
    '/onboarding',
    '/company-detail',
    '/questions',
    '/analyzing',
    '/dashboard/:path*',
    '/company-overview/:path*',
    '/trends/:path*',
    '/dna/:path*',
  ],
};
