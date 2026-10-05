
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
    ANALYZE_COMPANY_RESULTS:(company_id: string) => `/analyzeCompany/results/${company_id}`,
    GROWTH: '/social-growth',

    ANALYSIS:{
    COMPETITOR_ANALYSIS: '/competitorAnalysis',
    COMPETITOR_ANALYSIS_ASYNC: '/competitorAnalysis/async',

    COMPETITOR_ANALYSIS_AI: '/competitorAnalysis/ai',
    COMPETITOR_ANALYSIS_AI_VERSIONS: (company_id: string) => `/competitorAnalysis/ai/${company_id}/versions`,
    COMPETITOR_ANALYSIS_AI_SPECIFIC_VERSIONS: (company_id: string,version: string) => `/competitorAnalysis/ai/${company_id}/versions/${version}`,
    COMPETITOR_ANALYSIS_LATEST_AI_RESPONSE: (company_id: string) => `/competitorAnalysis/ai/${company_id}`,

    COMPETITOR_ANALYSIS_MANUAL: '/competitorAnalysis/manual',
    COMPETITOR_ANALYSIS_MANUAL_VERSIONS: (company_id: string) => `/competitorAnalysis/manual/${company_id}/versions`,
    COMPETITOR_ANALYSIS_MANUAL_SPECIFIC_VERSIONS: (company_id: string, version: string) => `/competitorAnalysis/manual/${company_id}/versions/${version}`,
    COMPETITOR_ANALYSIS_LATEST_MANUAL_RESPONSE: (company_id: string) => `/competitorAnalysis/manual/${company_id}`,
    
    COMPETITOR_ANALYSIS_FIND_COMPETITORS: '/competitorAnalysis/find-competitors',
    COMPETITOR_ANALYSIS_JOB: (job_id: string) => `/competitorAnalysis/jobs/${job_id}`,  
    COMPETITOR_ANALYSIS_COMPETITOR: (company_id: string) => `/competitorAnalysis/results/${company_id}`,
    },

    TRENDS:{
    GOOGLE_TRENDS_NOW: '/google-trends/now',
    GOOGLE_TRENDS_TRENDING: '/google-trends/trending',
    GOOGLE_TRENDS_EXPLORE: '/google-trends/explore',
    GOOGLE_TRENDS_FILTERS: '/google-trends/filters',
    },

    RECOMMENDATION:{
        CONTENT_RECOMMENDATION: '/contentRecommendation/recommend',
        RECOMMENDATION_RESULT:(company_id: string) => `/contentRecommendation/results/${company_id}`,
    },

    GENERATION:{
    SCRIPT_GENERATION: '/scriptGeneration/script',
    SCRIPT_GENERATION_RESULTS:(company_id: string) => `/scriptGeneration/results/${company_id}`,
    DELETE_SCRIPT:(script_id: string) => `/scriptGeneration/script/${script_id}`,

    IMAGE_GENERATION: '/generation/image-generation',
    COMPANY_IMAGE_GENERATION:(company_id: string) => `/generation/image-generation/${company_id}`,
    LATEST_GENERATED_IMAGE:(company_id: string) => `/generation/image-generation/${company_id}/latest`,
    },

    MESSAGES: '/chatbot/messages',
    ATTACHMENTS: '/chatbot/attachments',
    CONVERSATIONS: '/chatbot/conversations',
    conversation: (conversationId: string) => `/chatbot/conversations/${conversationId}`,
    conversationMessages: (conversationId: string) => `/chatbot/conversations/${conversationId}/messages`,
}
