import { Loader2 } from "lucide-react";

// Instant feedback on navigation while the demo page loads
export default function DemoLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-8 animate-spin text-[#5452F6]" />
    </div>
  );
}
