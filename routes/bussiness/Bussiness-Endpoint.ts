
export const BUSSINESSENDPOINT = {
    WAITLIST: '/waitlist',
    CONTACT_US: '/contact-us',
    ONBOARDING: '/onboarding',
    
    INTELLIGENCE_RUN: '/intelligence/run',
    INTELLIGENCE_JOB: (job_id: string) => `/intelligence/jobs/${job_id}`,

    ONBOARDING_DETAILS: '/onboarding/details',
    USER_PROFILE: '/user-profile',
    EDIT_USER_PROFILE: (user_id: string) => `/user-profile/editprofile/${user_id}`,

    INTAKE: '/intake',
    INTAKE_QUESTION: (questionId: string) => `/intake/questions/${questionId}`,
    DNA: '/dna',
    DNA_RETRY: '/dna/retry',

    ANALYZE_COMPANY: '/analyzeCompany/analyzeCompany',
    ANALYZE_COMPANY_RESULTS:(company_id: string) => `/analyzeCompany/results/${company_id}`,
    ANALYZE_COMPANY_DASHBOARD:(company_id: string) => `/analyzeCompany/dashboard/${company_id}`,
    ANALYZE_COMPANY_DASHBOARD_DOCUMENTATION:(company_id: string) => `/analyzeCompany/dashboard/${company_id}/documentation`,

    ANALYSIS:{
    FIND_COMPETITORS: '/competitorAnalysis/find-competitors',
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
    GET_COMPETITORS_BY_ID: (company_id: string) => `/competitorAnalysis/find-competitors/${company_id}`,
    TRACKED_COMPETITORS: '/competitorAnalysis/tracked',
    CONFIRM_TRACKED_COMPETITOR:(competitor_id: string) => `/competitorAnalysis/tracked/${competitor_id}/confirm`,
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
    TEXT_POST: '/generation/text-post',
    COMPANY_TEXT_POSTS: (company_id: string) => `/generation/text-post/${company_id}`,
    IMAGE_GENERATION_SCHEDULE: '/generation/image-generation/schedule',
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

    KEYWORDS: '/keywords',
    KEYWORDS_RETRY: '/keywords/retry',
    BRIEFS: '/briefs',
    BLOG_POST: '/blog-posts',
    BLOG_POST_DETAILS: (blog_post_id: string) => `/blog-posts/${blog_post_id}`,
    BLOG_POST_IMAGES: (blog_post_id: string) => `/blog-posts/${blog_post_id}/images`,

    CONNECTORS:{
        INSTAGRAM_LOGIN: '/connector/instagram/login',
        LINKEDIN_LOGIN: '/connector/linkedin/login',
        SOCIAL_ACCOUNTS: '/social-accounts',
        SOCIAL_ACCOUNTS_CONNECT: (platform: string) => `/social-accounts/${platform}/connect`,
        SOCIAL_ACCOUNTS_DISCONNECT: (platform: string) => `/social-accounts/${platform}`,
        FACEBOOK_CONNECT: '/connector/facebook/connect',
        X_LOGIN: '/connector/x/login',
    },

    PUBLISH:{
        INSTAGRAM_PUBLISH: '/connector/instagram/publish',
        FACEBOOK_PUBLISH: '/connector/facebook/publish',
        LINKEDIN_PUBLISH: '/connector/linkedin/publish',
        X_PUBLISH: '/connector/x/publish',
    },

    INSTAGRAM:{
        PROFILE_ID: '/connector/instagram/profile-id',
        PROFILE_INFO: '/connector/instagram/profile-info',
        POST_ENGAGEMENT: '/connector/instagram/post-engagement',
        PROFILE_CONTENT: '/connector/instagram/profile-content',
        PROFILE_REACH: (account_id: string) => `/instagram/accounts/${account_id}/insights/reach`,
        PROFILE_INTERACTIONS: (account_id: string) => `/instagram/accounts/${account_id}/insights/interactions`,
        PROFILE_DEMOGRAPHICS: (
          account_id: string,
          audience: "followers" | "engaged-audience" = "followers",
        ) => `/instagram/accounts/${account_id}/insights/demographics/${audience}`,
        PROFILE_FOLLOWS: (account_id: string) => `/instagram/accounts/${account_id}/insights/follows`,
        PROFILE_VIEWS: (account_id: string) => `/instagram/accounts/${account_id}/insights/views`,
        PROFILE_ACTIONS: (account_id: string) => `/instagram/accounts/${account_id}/insights/profile-actions`,
        PROFILE_STORIES: (account_id: string) => `/instagram/accounts/${account_id}/stories`,
        LIVE_STREAM: (account_id: string) => `/instagram/accounts/${account_id}/live`,
    },

    FACEBOOK:{
        PROFILE_CONTENT: '/connector/facebook/profile-content',
    },

    LINKEDIN:{
        PROFILE_CONTENT: '/connector/linkedin/profile-content',
    },

    LINKEDIN_GROWTH:{
        PROFILE_SCORE: '/linkedin/growth/profile-score',
        PROFILE_SCORE_HISTORY: '/linkedin/growth/profile-score/history',
        PROFILE_REWRITE: '/linkedin/growth/profile-rewrite',
        VOICE: '/linkedin/growth/voice',
        WEEK_POSTS: '/linkedin/growth/week-posts',
        WEEK_POST_SCHEDULE: (post_id: string) => `/linkedin/growth/week-posts/${post_id}/schedule`,
        WEEK_POST_CANCEL: (post_id: string) => `/linkedin/growth/week-posts/${post_id}/cancel`,
        SCORE: '/linkedin/growth/score',
        SCORE_HISTORY: '/linkedin/growth/score/history',
    },

    LINKEDIN_COACH:{
        TODAY: '/linkedin/coach/today',
        TASK_DONE: (task_id: string) => `/linkedin/coach/today/tasks/${task_id}/done`,
        TASK_UNDO: (task_id: string) => `/linkedin/coach/today/tasks/${task_id}/undo`,
        FOLLOW_UPS: '/linkedin/coach/follow-ups',
        FOLLOW_UP_DONE: (follow_up_id: string) => `/linkedin/coach/follow-ups/${follow_up_id}/done`,
        WEEKLY_REPORT: '/linkedin/coach/weekly-report',
        WEEKLY_REPORT_HISTORY: '/linkedin/coach/weekly-report/history',
        CONTENT_PLAN: '/linkedin/coach/content-plan',
        CAROUSEL: '/linkedin/coach/carousel',
        REPURPOSE: '/linkedin/coach/repurpose',
        POST_CHECK: '/linkedin/coach/post-check',
        WRITE_POST: '/linkedin/coach/write-post',
        HOOK_FORMULAS: '/linkedin/tools/hook-formulas',
        PUBLISH_CAROUSEL: '/connector/linkedin/publish-carousel',
    },

    PROSPECTS:{
        ICP: '/prospects/icp',
        RUNS: '/prospects/runs',
        RUN_BY_ID: (run_id: string) => `/prospects/runs/${run_id}`,
        RUN_CANDIDATES: (run_id: string) => `/prospects/runs/${run_id}/candidates`,
        LIST: '/prospects',
        BY_ID: (prospect_id: string) => `/prospects/${prospect_id}`,
        SAVE: (prospect_id: string) => `/prospects/${prospect_id}/save`,
        STATUS: (prospect_id: string) => `/prospects/${prospect_id}/status`,
        DRAFTS: (prospect_id: string) => `/prospects/${prospect_id}/drafts`,
        EXPORT_CSV: '/prospects/export.csv',
    },

    SITE_VISIBILITY:{
        CHECK: '/site-visibility',
        LLMS_TXT: '/site-visibility/llms-txt',
        SCHEMA_MARKUP: '/site-visibility/schema-markup',
    },

    ORGANIC_TRAFFIC:{
        CHECK: '/organic-traffic',
    },

    LINKEDIN_PEOPLE:{
        SEARCH: '/linkedin/people/search',
        DETAIL: '/linkedin/people/detail',
        COMPANIES_SEARCH: '/linkedin/people/companies/search',
    },

    CONTENT_EXECUTION:{
        SETTINGS: '/content-execution/settings',
        AGENT_MODE: '/content-execution/agent-mode',
        DAILY: '/content-execution/daily',
        RUN: '/content-execution/run',
        ITEMS: '/content-execution/items',
        RUNS: '/content-execution/runs',
    },

    PRIVACY:{
        FACEBOOK_DEAUTHORIZE: '/integrations/facebook/deauthorize',
        FACEBOOK_DATA_DELETION: '/integrations/facebook/data-deletion',
    },

    GOAL:{
        CREATE_GOAL: '/goal',
        COMPANY_GOALS: '/goal',
        GOALS_BY_COMPANY: (company_id: string) => `/goal/company/${company_id}`,
        GOAL_BY_ID: (goal_id: string) => `/goal/${goal_id}`,
        DIAGNOSE: (goal_id: string) => `/goal/${goal_id}/diagnose`,
        APPROVE: (goal_id: string) => `/goal/${goal_id}/approve`,
        TASK: (goal_id: string, task_id: string) => `/goal/${goal_id}/tasks/${task_id}`,
        PROGRESS: (goal_id: string) => `/goal/${goal_id}/progress`,
        PLAN: (goal_id: string) => `/goal/${goal_id}/plan`,
        LESSONS: '/lessons',
        PAUSE: (goal_id: string) => `/goal/${goal_id}/pause`,
        RESUME: (goal_id: string) => `/goal/${goal_id}/resume`,
        CANCEL: (goal_id: string) => `/goal/${goal_id}/cancel`,
    },

    GOOGLE_ANALYTICS: {
        CONNECTION: '/google-analytics',
        CONNECT: '/google-analytics/connect',
        CALLBACK: '/google-analytics/callback',
        PROPERTIES: '/google-analytics/properties',
        PROPERTY: '/google-analytics/property',
        OVERVIEW: '/google-analytics/overview',
        DISCONNECT: '/google-analytics',
    },

    SEARCH_CONSOLE: {
        CONNECTION: '/search-console',
        CONNECT: '/search-console/connect',
        CALLBACK: '/search-console/callback',
        SITES: '/search-console/sites',
        SITE: '/search-console/site',
        OVERVIEW: '/search-console/overview',
        SITEMAPS: '/search-console/sitemaps',
        INSPECT: '/search-console/inspect',
        INDEX_CHECK: '/search-console/index-check',
        DISCONNECT: '/search-console',
    },

    NEWS: '/news',

    SCHEDULED_POSTS: {
        LIST: '/scheduled-posts',
        CREATE: '/scheduled-posts',
        BY_ID: (post_id: string) => `/scheduled-posts/${post_id}`,
        CANCEL: (post_id: string) => `/scheduled-posts/${post_id}/cancel`,
    },
}


