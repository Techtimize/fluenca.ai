import useAuthStore from '@/store/AuthsStore';

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const AUTH_COOKIE_NAMES = [
  'access_token',
  'role',
  'onboarding_completed',
  'company_id',
  'status',
] as const;

function isHttps() {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

function getCookieFlags(maxAge = AUTH_COOKIE_MAX_AGE) {
  return `path=/; max-age=${maxAge}; samesite=lax${isHttps() ? '; secure' : ''}`;
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${getCookieFlags()}`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  const expired = 'Thu, 01 Jan 1970 00:00:00 GMT';
  // Clear both secure and non-secure variants so logout works across environments.
  document.cookie = `${name}=; path=/; expires=${expired}; max-age=0; samesite=lax`;
  document.cookie = `${name}=; path=/; expires=${expired}; max-age=0; samesite=lax; secure`;
}

function syncAuthCookies(payload: {
  access_token: string;
  role: string;
  onboarding_completed: boolean;
  company_id?: string;
  status?: string;
}) {
  setCookie('access_token', payload.access_token);
  setCookie('role', payload.role);
  setCookie(
    'onboarding_completed',
    payload.onboarding_completed ? 'true' : 'false',
  );
  if (payload.company_id) {
    setCookie('company_id', payload.company_id);
  }
  if (payload.status) {
    setCookie('status', payload.status);
  }
}

export function clearAuthCookies() {
  AUTH_COOKIE_NAMES.forEach((name) => clearCookie(name));
}

export const setAuthTokenProvider = (
  token: string,
  role: string,
  userId: string,
  status: string,
  company_name?: string,
  onboarding_completed?: boolean,
  company_id?: string,
) => {
  useAuthStore.getState().setAuthSession({
    access_token: token,
    user_id: userId,
    company_id: company_id ?? '',
    role,
    status,
    company_name: company_name ?? '',
  });

  const completed =
    typeof onboarding_completed === 'boolean'
      ? onboarding_completed
      : useAuthStore.getState().onboarding_completed;

  if (typeof onboarding_completed === 'boolean') {
    useAuthStore.getState().setOnboardingCompleted(onboarding_completed);
  }

  syncAuthCookies({
    access_token: token,
    role,
    company_id,
    status,
    onboarding_completed: completed,
  });
};

export const setOnboardingCompletedProvider = (completed: boolean) => {
  useAuthStore.getState().setOnboardingCompleted(completed);
  setCookie('onboarding_completed', completed ? 'true' : 'false');
};

export const setCompanyIdProvider = (company_id: string) => {
  if (!company_id) return;
  useAuthStore.getState().setCompanyId(company_id);
  setCookie('company_id', company_id);
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

export const getCompanyIdProvider = (): string => {
  return useAuthStore.getState().company_id || '';
};
