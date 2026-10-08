import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const onboardingCompleted =
        request.cookies.get('onboarding_completed')?.value === 'true';
    const role = request.cookies.get('role')?.value?.toLowerCase() ?? '';
    const path = request.nextUrl.pathname;
    if (
        path.startsWith('/verify-dna') ||
        path.startsWith('/onboarding') ||
        path.startsWith('/company-detail') ||
        path.startsWith('/analyzing') ||
        path.startsWith('/questions')
    ) {
        return NextResponse.next();
    }

    if (accessToken) {
        if (path.startsWith('/login') || path.startsWith('/signup')) {
            const isSuperAdmin =
                role === 'super_admin' || role === 'superadmin' || role === 'admin';
            const destination = isSuperAdmin
                ? '/superadmin'
                : onboardingCompleted
                  ? '/dashboard'
                  : '/onboarding';
            return NextResponse.redirect(new URL(destination, request.url));
        }
    } else {
        if (
            path.startsWith('/dashboard') ||
            path.startsWith('/dna') ||
            path.startsWith('/trends') ||
            path.startsWith('/company-overview') ||
            path.startsWith('/profile') ||
            path.startsWith('/superadmin')
        ) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/signup',
        '/onboarding/:path*',
        '/verify-dna/:path*',
        '/company-detail/:path*',
        '/analyzing/:path*',
        '/questions/:path*',
        '/dashboard/:path*',
        '/dna/:path*',
        '/trends/:path*',
        '/company-overview/:path*',
        '/profile/:path*',
        '/superadmin/:path*',
    ],
};
