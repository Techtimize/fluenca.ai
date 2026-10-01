import useAuthStore from '@/store/AuthsStore';


export const setAuthTokenProvider = (token: string, role: string, company_user_id: string,status: string) => {
    if (typeof window !== 'undefined') {
        const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
        const cookieFlags = `path=/; max-age=${60 * 60 * 24}; samesite=strict${isHttps ? '; secure' : ''}`;
        document.cookie = `access_token=${token}; ${cookieFlags}`;
        document.cookie = `role=${role}; ${cookieFlags}`;
        document.cookie = `company_user_id=${company_user_id}; ${cookieFlags}`;
        document.cookie = `status=${status}; ${cookieFlags}`;
    }
    useAuthStore.getState().setField('isAuthenticated', true);
};

export const getAuthTokenProvider = () => {
    if (typeof window !== 'undefined') {
        return (
            getAuthCookieProvider()
        );

    }
    return useAuthStore.getState().getField('isAuthenticated');
};

export const clearAuthTokenProvider = () => {
    if (typeof window !== 'undefined') {
        document.cookie = 'access_token=; path=/; max-age=0';
        document.cookie = 'role=; path=/; max-age=0';
    }
    useAuthStore.getState().clearAuth();
};

export const getAuthRoleProvider = () => {
    if (typeof window !== 'undefined') {
        return (
            useAuthStore.getState().getField('isAuthenticated') ||
            getAuthCookieProvider()
        );
    }
    return useAuthStore.getState().getField('isAuthenticated');
};

export const getAuthCookieProvider = () => {
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
        return match?.[1] ?? '';
    }
    return '';
};

export const getRoleProvider = () => {
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|;\s*)role=([^;]*)/);
        return match?.[1] ?? '';
    }
    return '';
};