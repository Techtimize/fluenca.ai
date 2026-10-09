"use client";

import { Bot, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { UpdateContentExecutionAgentModeMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { ContentExecutionAgentModeQuery } from "@/routes/bussiness/Bussiness-Query";
import { cn } from "cn";

function resolveAgentModeEnabled(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  if (typeof record.enabled === "boolean") return record.enabled;
  if (typeof record.agent_mode_enabled === "boolean") {
    return record.agent_mode_enabled;
  }
  const settings = record.settings;
  if (settings && typeof settings === "object") {
    const value = (settings as Record<string, unknown>).agent_mode_enabled;
    if (typeof value === "boolean") return value;
  }
  return false;
}

export function AgentModeToggle({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { data, isLoading, isError } = ContentExecutionAgentModeQuery();
  const { mutate, isPending } = UpdateContentExecutionAgentModeMutation();
  const enabled = resolveAgentModeEnabled(data);
  const busy = isLoading || isPending;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-[#E6E8F5] bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(17,24,39,0.03)]",
        enabled
          ? "ring-1 ring-[#C8C6F5]"
          : "ring-1 ring-transparent",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl",
          enabled ? "bg-[#ECEBFF] text-[#5B57E6]" : "bg-[#F6F7FD] text-neutral-400",
        )}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Bot className="size-4" aria-hidden="true" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-neutral-900">Agent mode</p>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
              enabled
                ? "bg-[#ECEBFF] text-[#5B57E6]"
                : "bg-[#F6F7FD] text-neutral-500",
            )}
          >
            {busy ? "…" : enabled ? "On" : "Off"}
          </span>
        </div>
        {!compact ? (
          <p className="mt-0.5 text-[11px] leading-4 text-neutral-500">
            {isError
              ? "Couldn’t load agent mode"
              : enabled
                ? "Orchestrator can run today’s calendar posts"
                : "Orchestrator skips this company until enabled"}
          </p>
        ) : null}
      </div>

      <Switch
        checked={enabled}
        disabled={busy || isError}
        size="default"
        className="data-checked:bg-[#5B57E6]"
        aria-label="Toggle agent mode"
        onCheckedChange={(checked) => {
          mutate({ enabled: Boolean(checked) });
        }}
      />
    </div>
  );
}
