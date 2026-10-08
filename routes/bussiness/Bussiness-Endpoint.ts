
export const BUSSINESSENDPOINT = {
    WAITLIST: '/waitlist',
    ONBOARDING: '/onboarding',
    
    INTELLIGENCE_RUN: '/intelligence/run',
    INTELLIGENCE_JOB: (job_id: string) => `/intelligence/jobs/${job_id}`,

    ONBOARDING_DETAILS: '/onboarding/details',
    USER_PROFILE: '/user-profile',

    INTAKE: '/intake',
    INTAKE_QUESTION: (questionId: string) => `/intake/questions/${questionId}`,
    DNA: '/dna',
    DNA_RETRY: '/dna/retry',

    ANALYZE_COMPANY: '/analyzeCompany/analyzeCompany',
    ANALYZE_COMPANY_RESULTS:(company_id: string) => `/analyzeCompany/results/${company_id}`,
    ANALYZE_COMPANY_DASHBOARD:(company_id: string) => `/analyzeCompany/dashboard/${company_id}`,
    ANALYZE_COMPANY_DASHBOARD_DOCUMENTATION:(company_id: string) => `/analyzeCompany/dashboard/${company_id}/documentation`,
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
    COMPETITOR_ANALYSIS_DISCOVERED: (company_id: string) => `/competitorAnalysis/discovered/${company_id}`,

    COMPETITOR_ANALYSIS_CONTENT: (company_id: string) => `/competitorAnalysis/content/${company_id}`,
    COMPETITOR_ANALYSIS_COMPETITORS: (company_id: string) => `/competitorAnalysis/competitors/${company_id}`,
    COMPETITOR_ANALYSIS_ANALYTICS: (company_id: string) => `/competitorAnalysis/analytics/${company_id}`,
    COMPETITOR_ANALYSIS_HASHTAGS: (company_id: string) => `/competitorAnalysis/hashtags/${company_id}`,
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
    SCRIPT_GENERATION_RESULTS: '/scriptGeneration/results',
    SCRIPT_GENERATION_RESULTS_BY_COMPANY_ID:(company_id: string) => `/scriptGeneration/results/${company_id}`,
    DELETE_SCRIPT:(script_id: string) => `/scriptGeneration/script/${script_id}`,

    IMAGE_GENERATION: '/generation/image-generation',
    COMPANY_IMAGE_GENERATION:(company_id: string) => `/generation/image-generation/${company_id}`,
    LATEST_GENERATED_IMAGE:(company_id: string) => `/generation/image-generation/${company_id}/latest`,
    DELETE_IMAGE: (company_id: string, image_id: string) => `/generation/image-generation/${company_id}/images/${image_id}`,
    DELETE_IMAGE_BY_NAME: (company_id: string, image_name: string) => `/generation/image-generation/${company_id}/images/${image_name}`,
    },

    PLANNER:{
        PLANNER_VERSIONS:(company_id: string) => `/planner/results/${company_id}/versions`,
        PLANNER_SPECIFIC_VERSIONS:(company_id: string, version: string) => `/planner/results/${company_id}/versions/${version}`,
        PLANNER_LATEST_RESPONSE:(company_id: string) => `/planner/results/${company_id}`,
    },

    MESSAGES: '/chatbot/messages',
    ATTACHMENTS: '/chatbot/attachments',
    CONVERSATIONS: '/chatbot/conversations',
    conversation: (conversationId: string) => `/chatbot/conversations/${conversationId}`,
    conversationMessages: (conversationId: string) => `/chatbot/conversations/${conversationId}/messages`,

    BLOG_POST: '/blog-posts',
    BLOG_POST_DETAILS: (blog_post_id: string) => `/blog-posts/${blog_post_id}`,

    CONNECTORS:{
        INSTAGRAM_LOGIN: '/connector/instagram/login',
        SOCIAL_ACCOUNTS: '/social-accounts',
        SOCIAL_ACCOUNTS_CONNECT: (platform: string) => `/social-accounts/${platform}/connect`,
        SOCIAL_ACCOUNTS_DISCONNECT: (platform: string) => `/social-accounts/${platform}`,
        FACEBOOK_CONNECT: '/integrations/facebook/connect',
        FACEBOOK_CALLBACK: '/integrations/facebook/callback',
    },

    PRIVACY:{
        FACEBOOK_DEAUTHORIZE: '/integrations/facebook/deauthorize',
        FACEBOOK_DATA_DELETION: '/integrations/facebook/data-deletion',
    }
}


