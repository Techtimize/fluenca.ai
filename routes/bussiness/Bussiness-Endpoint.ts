
export const BUSSINESSENDPOINT = {
    WAITLIST: '/waitlist',
    ONBOARDING: '/onboarding',
    ONBOARDING_DETAILS: '/onboarding/details',
    INTAKE: '/intake',
    INTAKE_COMPLETE: '/intake/complete',
    INTAKE_QUESTION: (questionId: string) => `/intake/questions/${questionId}`,

    ANALYZE_COMPANY: '/analyzeCompany/analyzeCompany',
    ANALYZE_COMPANY_RESULTS:(company_id: string) => `/analyzeCompany/results/${company_id}`,
    GROWTH: '/social-growth',
    COMPETITOR_ANALYSIS: '/competitorAnalysis',

    TRENDS:{
    GOOGLE_TRENDS_NOW: '/google-trends/now',
    GOOGLE_TRENDS_TRENDING: '/google-trends/trending',
    GOOGLE_TRENDS_EXPLORE: '/google-trends/explore',
    GOOGLE_TRENDS_FILTERS: '/google-trends/filters',
    }
}
