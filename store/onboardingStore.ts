import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import type { OnboardingStep } from '@/components/onboarding/stepper';

export interface OnboardingDetails {
  company_name: string;
  industry: string;
  primary_product_or_service: string;
  language: string;
  website_url: string;
  instagram_username: string;
  linkedin_url: string;
}

interface OnboardingStore extends OnboardingDetails {
  step: OnboardingStep;
  maxStepReached: OnboardingStep;
  setOnboardingDetails: (payload: Partial<OnboardingDetails>) => void;
  setStep: (step: OnboardingStep) => void;
  clearOnboardingDetails: () => void;
}

const initialOnboardingState: OnboardingDetails = {
  company_name: '',
  industry: '',
  primary_product_or_service: '',
  language: '',
  website_url: '',
  instagram_username: '',
  linkedin_url: '',
};

const useOnboardingStore = create<OnboardingStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialOnboardingState,
        step: 1,
        maxStepReached: 1,

        setOnboardingDetails: (payload) =>
          set((state) => ({ ...state, ...payload })),
        setStep: (step) =>
          set((state) => ({
            step,
            maxStepReached: step > state.maxStepReached ? step : state.maxStepReached,
          })),
        clearOnboardingDetails: () =>
          set({ ...initialOnboardingState, step: 1, maxStepReached: 1 }),
      }),

      {
        name: 'OnboardingStorage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'OnboardingStore' },
  ),
);

export default useOnboardingStore;
