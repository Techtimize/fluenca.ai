import useAuthStore from '@/store/AuthsStore';

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
};

export const getAuthTokenProvider = (): string => {
  return useAuthStore.getState().access_token || '';
};

export const clearAuthTokenProvider = () => {
  useAuthStore.getState().clearAuth();
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
