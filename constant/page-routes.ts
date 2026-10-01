// All app page paths. Use these instead of hardcoding paths in router.push / Link.
export const PAGE_ROUTES = {
    HOME: '/',
    COMING_SOON: '/coming-soon',

    // Auth
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    CHANGE_PASSWORD: '/change-password',
    VERIFY_EMAIL: '/verify-email',
    VERIFY_OTP: '/verify-otp',

    // Onboarding
    ONBOARDING: '/onboarding',
    COMPANY_DETAIL: '/company-detail',
    QUESTIONS: '/questions',
    ANALYZING: '/analyzing',
    VERIFY_DNA: '/verify-dna',

    // Dashboard
    DASHBOARD: '/dashboard',
    COMPANY_OVERVIEW: '/company-overview',
    TRENDS: '/trends',
} as const;
