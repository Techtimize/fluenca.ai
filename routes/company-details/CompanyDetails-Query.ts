import { useQuery } from "@tanstack/react-query";
import { IntakeApi } from "./companyDetails.routes";

const POLL_INTERVAL_MS = 3000;

// Polls while the AI is still analyzing; stops once the intake is ready or has failed.
export const IntakeQuery = () => {
    return useQuery({
        queryKey: ['intake'],
        queryFn: () => IntakeApi(),
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return !status || status === 'not_started' || status === 'running' ? POLL_INTERVAL_MS : false;
        },
        refetchOnWindowFocus: false,
    });
}
