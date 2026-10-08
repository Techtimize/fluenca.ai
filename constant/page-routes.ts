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
    DNA: '/dna',

    // Dashboard
    DASHBOARD: '/dashboard',
    INTEGRATIONS: '/dashboard/integrations',
    COMPANY_OVERVIEW: '/company-overview',
    TRENDS: '/trends',
    COMPETITOR_ANALYSIS: '/competitor-analysis',
    COMPETITOR_ANALYSIS_AI: '/competitor-analysis/ai',
    COMPETITOR_ANALYSIS_MANUAL: '/competitor-analysis/mannual',
    COMPETITORS: '/competitors',
    CALENDAR: '/calendar',
    CONTENT_RECOMMENDATION: '/content-recommendation',
    SCRIPT: '/script',
    SCRIPT_DETAIL: (id: string) => `/script/${id}`,
    CONTENT: '/content',
    BLOGS: '/blogs',

    // Super admin
    SUPERADMIN: '/superadmin',
    SUPERADMIN_USERS: '/superadmin',
} as const;
