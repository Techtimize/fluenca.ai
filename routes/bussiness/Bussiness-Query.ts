import { useQuery } from "@tanstack/react-query";
import { DnaApi, OnboardingDetailsApi } from "./bussiness.routes";



export const OnboardingDetailsQuery = () => {
    return useQuery({
        queryKey: ['onboarding-details'],
        queryFn: () => OnboardingDetailsApi(),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

// Polls every 3s while the DNA is being built; stops once it is ready or has failed.
export const DnaQuery = () => {
    return useQuery({
        queryKey: ['dna'],
        queryFn: () => DnaApi(),
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status === 'ready' || status === 'failed' ? false : 3000;
        },
        refetchOnWindowFocus: false,
    });
}
