import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  access_token: string;
  user_id: string;
  company_name: string;
  company_id: string;
  role: string;
  status: string;
  onboarding_completed: boolean;

  setAuthSession: (payload: {
    access_token: string;
    user_id: string;
    role: string;
    status?: string;
    company_name?: string;
    company_id?: string;
  }) => void;
  setUserId: (user_id: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setCompanyName: (company_name: string) => void;
  setCompanyId: (company_id: string) => void;
  setRole: (role: string) => void;
  setStatus: (status: string) => void;
  setAccessToken: (access_token: string) => void;
  setOnboardingCompleted: (onboarding_completed: boolean) => void;
  clearAuth: () => void;
  getField: (field: keyof AuthStore) => AuthStore[keyof AuthStore];
  setField: (field: keyof AuthStore, value: AuthStore[keyof AuthStore]) => void;
}

const initialAuthState = {
  isAuthenticated: false,
  access_token: '',
  user_id: '',
  company_name: '',
  company_id: '',
  role: '',
  status: '',
  onboarding_completed: false,
};

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialAuthState,

        setAuthSession: ({
          access_token,
          user_id,
          role,
          status = '',
          company_name = '',
          company_id = '',
        }) =>
          set({
            isAuthenticated: Boolean(access_token),
            access_token,
            user_id,
            role,
            status,
            company_name,
            company_id,
          }),
        setUserId: (user_id: string) => set({ user_id }),
        setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
        setCompanyName: (company_name: string) => set({ company_name }),
        setCompanyId: (company_id: string) => set({ company_id }),
        setRole: (role: string) => set({ role }),
        setStatus: (status: string) => set({ status }),
        setAccessToken: (access_token: string) => set({ access_token }),
        setOnboardingCompleted: (onboarding_completed: boolean) =>
          set({ onboarding_completed }),

        getField: (field: keyof AuthStore) => get()[field],
        setField: (field: keyof AuthStore, value: AuthStore[keyof AuthStore]) =>
          set({ [field]: value }),
        clearAuth: () => set({ ...initialAuthState }),
      }),

      {
        name: 'AuthStorage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'AuthStore' },
  ),
);

export default useAuthStore;
