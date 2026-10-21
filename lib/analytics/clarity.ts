/** Microsoft Clarity project; override per environment with NEXT_PUBLIC_CLARITY_PROJECT_ID. */
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "z01rgoz9fx";

const PROJECT_URL = `https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}`;

export const CLARITY_LINKS = {
  dashboard: `${PROJECT_URL}/dashboard`,
  recordings: `${PROJECT_URL}/impressions`,
  heatmaps: `${PROJECT_URL}/heatmaps`,
} as const;

/** Clarity's official tag, as an inline script body. */
export const CLARITY_TAG = `(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`;

type ClarityFn = ((command: string, ...args: unknown[]) => void) & { q?: unknown[] };

/**
 * Calls the Clarity API. Before the tag has loaded, installs the same queue stub the tag uses,
 * so early calls (like identify) are replayed once Clarity starts instead of being dropped.
 */
export function clarity(command: string, ...args: unknown[]) {
  const w = window as unknown as { clarity?: ClarityFn };
  if (!w.clarity) {
    const stub: ClarityFn = (...callArgs: unknown[]) => {
      (stub.q = stub.q || []).push(callArgs);
    };
    w.clarity = stub;
  }
  w.clarity(command, ...args);
}
