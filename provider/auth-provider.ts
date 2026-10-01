import useAuthStore from '@/store/AuthsStore';

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getCookieFlags() {
  const isHttps =
    typeof window !== 'undefined' && window.location.protocol === 'https:';
  return `path=/; max-age=${AUTH_COOKIE_MAX_AGE}; samesite=lax${isHttps ? '; secure' : ''}`;
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${getCookieFlags()}`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

function syncAuthCookies(payload: {
  access_token: string;
  role: string;
  onboarding_completed: boolean;
}) {
  setCookie('access_token', payload.access_token);
  setCookie('role', payload.role);
  setCookie(
    'onboarding_completed',
    payload.onboarding_completed ? 'true' : 'false',
  );
}

function clearAuthCookies() {
  clearCookie('access_token');
  clearCookie('role');
  clearCookie('onboarding_completed');
  clearCookie('company_user_id');
  clearCookie('status');
}

export const setAuthTokenProvider = (
  token: string,
  role: string,
  company_user_id: string,
  status: string,
  company_name?: string,
) => {
  useAuthStore.getState().setAuthSession({
    access_token: token,
    user_id: company_user_id,
    company_user_id,
    role,
    status,
    company_name: company_name ?? '',
  });

  syncAuthCookies({
    access_token: token,
    role,
    onboarding_completed: useAuthStore.getState().onboarding_completed,
  });
};

export const setOnboardingCompletedProvider = (completed: boolean) => {
  useAuthStore.getState().setOnboardingCompleted(completed);
  setCookie('onboarding_completed', completed ? 'true' : 'false');
};

export const getAuthTokenProvider = (): string => {
  return useAuthStore.getState().access_token || '';
};

export const clearAuthTokenProvider = () => {
  useAuthStore.getState().clearAuth();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('AuthStorage');
  }
  clearAuthCookies();
};

export const getAuthRoleProvider = (): string => {
  return useAuthStore.getState().role || '';
};

export const getRoleProvider = (): string => {
  return useAuthStore.getState().role || '';
};

export const getAuthStatusProvider = (): string => {
  return useAuthStore.getState().status || '';
};

export const getAuthUserIdProvider = (): string => {
  return useAuthStore.getState().user_id || '';
};
