import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  user_id: string;
  company_name: string;
  company_user_id: string;
  role: string;

  setUserId: (user_id: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setCompanyName: (company_name: string) => void;
  setCompanyUserId: (company_user_id: string) => void;
  setRole: (role: string) => void;
  clearAuth: () => void;
  getField: (field: keyof AuthStore) => AuthStore[keyof AuthStore];
  setField: (field: keyof AuthStore, value: AuthStore[keyof AuthStore]) => void;
}

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        isAuthenticated: false,
        user_id: '',
        company_name: '',
        company_user_id: '',
        role: '',

        setUserId: (user_id: string) => set({ user_id }),
        setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
        setCompanyName: (company_name: string) => set({ company_name }),
        setCompanyUserId: (company_user_id: string) => set({ company_user_id }),
        setRole: (role: string) => set({ role }),
        // refresh_token: "",
        // setRefreshToken: (refresh_token: string) => set({ refresh_token }),
        getField: (field: keyof AuthStore) => get()[field],
        setField: (field: keyof AuthStore, value: AuthStore[keyof AuthStore]) =>
          set({ [field]: value }),
        clearAuth: () =>
          set({
            isAuthenticated: false,
            user_id: '',
            company_name: '',
            company_user_id: '',
            role: '',
          }),
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
