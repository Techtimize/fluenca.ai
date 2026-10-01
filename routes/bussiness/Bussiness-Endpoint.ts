
export const BUSSINESSENDPOINT = {
    WAITLIST: '/waitlist',
    ONBOARDING: '/onboarding',
    ONBOARDING_DETAILS: '/onboarding/details',
    INTAKE: '/intake',
    INTAKE_COMPLETE: '/intake/complete',
    INTAKE_QUESTION: (questionId: string) => `/intake/questions/${questionId}`,
    DNA: '/dna',
    DNA_RETRY: '/dna/retry',

    ANALYZE_COMPANY: '/analyzeCompany/analyzeCompany',
    GROWTH: '/social-growth',
    COMPETITOR_ANALYSIS: '/competitorAnalysis',
}
