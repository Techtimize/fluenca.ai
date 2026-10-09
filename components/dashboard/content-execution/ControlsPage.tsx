"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Play,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { AgentModeToggle } from "@/components/dashboard/content-execution/AgentModeToggle";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { getApiErrorMessage } from "@/errors/error-utils";
import {
  ContentExecutionRunMutation,
  UpdateContentExecutionSettingsMutation,
} from "@/routes/bussiness/Bussiness-Mutation";
import {
  ContentExecutionItemsQuery,
  ContentExecutionRunsQuery,
  ContentExecutionSettingsQuery,
} from "@/routes/bussiness/Bussiness-Query";
import {
  normalizeContentExecutionItems,
  normalizeContentExecutionRuns,
  type ContentExecutionItem,
  type ContentExecutionRun,
  type ContentExecutionSettings,
} from "@/types/bussiness/content-execution-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import { cn } from "cn";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function resolveSettings(
  data: unknown,
): ContentExecutionSettings {
  if (!data || typeof data !== "object") return {};
  const record = data as Record<string, unknown>;
  const nested = record.settings;
  if (nested && typeof nested === "object") {
    return nested as ContentExecutionSettings;
  }
  return {
    auto_publish_enabled:
      typeof record.auto_publish_enabled === "boolean"
        ? record.auto_publish_enabled
        : undefined,
    agent_mode_enabled:
      typeof record.agent_mode_enabled === "boolean"
        ? record.agent_mode_enabled
        : undefined,
    require_approval:
      typeof record.require_approval === "boolean"
        ? record.require_approval
        : undefined,
    timezone:
      typeof record.timezone === "string" ? record.timezone : undefined,
  };
}

function statusTone(status?: string) {
  const value = String(status || "").toLowerCase();
  if (value.includes("publish") || value === "completed" || value === "scripted" || value === "imaged") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }
  if (value.includes("fail") || value.includes("error")) {
    return "bg-rose-50 text-rose-700 ring-rose-100";
  }
  if (value.includes("skip") || value.includes("disabled")) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }
  if (value.includes("run") || value.includes("queue") || value.includes("pending")) {
    return "bg-[#ECEBFF] text-[#5B57E6] ring-[#D8D6F5]";
  }
  return "bg-[#F6F7FD] text-neutral-600 ring-[#E6E8F5]";
}

function formatWhen(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function SettingRow({
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#E6E8F5] bg-[#FBFBFE] px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-neutral-900">{title}</p>
        <p className="mt-1 text-[12px] leading-5 text-neutral-500">{description}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        className="mt-0.5 data-checked:bg-[#5B57E6]"
        onCheckedChange={(next) => onCheckedChange(Boolean(next))}
      />
    </div>
  );
}

function ItemRow({ item }: { item: ContentExecutionItem }) {
  const title =
    item.title || item.topic || item.hook || item.caption || "Untitled item";
  return (
    <li className="rounded-2xl border border-[#E6E8F5] bg-white px-3.5 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-neutral-900">
            {title}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {[item.platform, item.date, item.format].filter(Boolean).join(" · ") ||
              "No meta"}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ring-1",
            statusTone(item.status),
          )}
        >
          {item.status || "planned"}
        </span>
      </div>
      {item.error ? (
        <p className="mt-2 text-[12px] text-rose-600">{item.error}</p>
      ) : null}
    </li>
  );
}

function RunRow({ run }: { run: ContentExecutionRun }) {
  const id = run.run_id || run.job_id || run.id || "run";
  return (
    <li className="rounded-2xl border border-[#E6E8F5] bg-white px-3.5 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-neutral-900">
            {String(id).slice(0, 18)}
            {String(id).length > 18 ? "…" : ""}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {[run.trigger, run.date, formatWhen(run.started_at || run.created_at)]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ring-1",
            statusTone(run.status),
          )}
        >
          {run.status || "pending"}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-neutral-500">
        <span>Total {run.items_total ?? "—"}</span>
        <span>Published {run.items_published ?? "—"}</span>
        <span>Failed {run.items_failed ?? "—"}</span>
        <span>Skipped {run.items_skipped ?? "—"}</span>
      </div>
      {run.error ? (
        <p className="mt-2 text-[12px] text-rose-600">{run.error}</p>
      ) : null}
    </li>
  );
}

export function ControlsPageContent({ companyId }: { companyId?: string | null }) {
  const today = todayIsoDate();
  const {
    data: settingsData,
    isLoading: isSettingsLoading,
    isError: isSettingsError,
    error: settingsError,
    refetch: refetchSettings,
    isFetching: isSettingsFetching,
  } = ContentExecutionSettingsQuery(Boolean(companyId));

  const {
    data: itemsData,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
    refetch: refetchItems,
    isFetching: isItemsFetching,
  } = ContentExecutionItemsQuery({ date: today }, Boolean(companyId));

  const {
    data: runsData,
    isLoading: isRunsLoading,
    isError: isRunsError,
    error: runsError,
    refetch: refetchRuns,
    isFetching: isRunsFetching,
  } = ContentExecutionRunsQuery({ limit: 12 }, Boolean(companyId));

  const { mutate: updateSettings, isPending: isUpdatingSettings } =
    UpdateContentExecutionSettingsMutation();
  const { mutate: runNow, isPending: isRunning } = ContentExecutionRunMutation();

  const settings = resolveSettings(settingsData);
  const items = useMemo(
    () => normalizeContentExecutionItems(itemsData),
    [itemsData],
  );
  const runs = useMemo(
    () => normalizeContentExecutionRuns(runsData),
    [runsData],
  );

  const autoPublish = Boolean(settings.auto_publish_enabled);
  const requireApproval = Boolean(settings.require_approval);

  const publishedCount = items.filter((item) =>
    String(item.status || "").toLowerCase().includes("publish"),
  ).length;
  const failedCount = items.filter((item) =>
    String(item.status || "").toLowerCase().includes("fail"),
  ).length;
  const pendingCount = items.length - publishedCount - failedCount;

  const refreshAll = () => {
    void refetchSettings();
    void refetchItems();
    void refetchRuns();
  };

  if (!companyId) {
    return (
      <Card className="p-6">
        <p className="text-sm text-neutral-600">
          Sign in with a company to control the content orchestrator.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-[#E6E8F5] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B57E6] ring-1 ring-[#E6E8F5]">
              <Settings2 className="size-3.5" aria-hidden="true" />
              Content orchestrator
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
              Controls
            </h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-600">
              Gate agent mode, auto-publish, and manually queue today’s calendar
              pipeline: script → image → publish.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refreshAll}
              disabled={isSettingsFetching || isItemsFetching || isRunsFetching}
              className="rounded-full border-[#E6E8F5] bg-white"
            >
              <RefreshCw
                className={cn(
                  "size-3.5",
                  (isSettingsFetching || isItemsFetching || isRunsFetching) &&
                    "animate-spin",
                )}
              />
              Refresh
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isRunning}
              onClick={() => runNow({ date: today })}
              className="rounded-full bg-[#5B57E6] text-white hover:bg-[#4A46D4]"
            >
              {isRunning ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5" data-icon="inline-start" />
              )}
              {isRunning ? "Queuing…" : "Run today"}
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
            <CalendarDays className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400">
              Today’s items
            </p>
            <p className="text-xl font-semibold text-neutral-900">{items.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <span className="grid size-10 place-items-center rounded-2xl bg-amber-50 text-amber-700">
            <Clock3 className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400">
              Pending
            </p>
            <p className="text-xl font-semibold text-neutral-900">
              {Math.max(pendingCount, 0)}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <span className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400">
              Published
            </p>
            <p className="text-xl font-semibold text-neutral-900">{publishedCount}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <Bot className="size-4 text-[#5B57E6]" aria-hidden="true" />
            <h2 className="text-[15px] font-semibold text-neutral-900">
              Orchestrator gates
            </h2>
          </div>

          <AgentModeToggle />

          {isSettingsLoading ? (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Loader2 className="size-4 animate-spin text-[#5B57E6]" />
              Loading settings…
            </div>
          ) : null}

          {isSettingsError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-3 py-2.5 text-[13px] text-rose-700">
              {getApiErrorMessage(settingsError, "Failed to load settings")}
            </div>
          ) : null}

          <SettingRow
            title="Auto-publish"
            description="When on, ready posts publish to the target platform after generation."
            checked={autoPublish}
            disabled={isUpdatingSettings || isSettingsLoading || isSettingsError}
            onCheckedChange={(checked) =>
              updateSettings({ auto_publish_enabled: checked })
            }
          />

          <SettingRow
            title="Require approval"
            description="Pause after content is ready so someone can review before publish."
            checked={requireApproval}
            disabled={isUpdatingSettings || isSettingsLoading || isSettingsError}
            onCheckedChange={(checked) =>
              updateSettings({ require_approval: checked })
            }
          />

          <div className="rounded-2xl border border-dashed border-[#D8D6F5] bg-[#F8F8FF] px-4 py-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 text-[#5B57E6]" />
              <div>
                <p className="text-[13px] font-semibold text-neutral-900">
                  How it runs
                </p>
                <p className="mt-1 text-[12px] leading-5 text-neutral-500">
                  Agent mode must be ON. Daily cron and “Run today” queue this
                  company; OFF skips with <code>agent_mode_disabled</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href={PAGE_ROUTES.CALENDAR}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E6E8F5] bg-white px-3 text-[12px] font-medium text-neutral-700 hover:bg-[#F6F7FD] ${FOCUS_RING}`}
            >
              <CalendarDays className="size-3.5" />
              Open calendar
            </Link>
            <Link
              href={PAGE_ROUTES.CONTENT}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E6E8F5] bg-white px-3 text-[12px] font-medium text-neutral-700 hover:bg-[#F6F7FD] ${FOCUS_RING}`}
            >
              <Zap className="size-3.5" />
              Open content
            </Link>
            <Link
              href={PAGE_ROUTES.INTEGRATIONS}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E6E8F5] bg-white px-3 text-[12px] font-medium text-neutral-700 hover:bg-[#F6F7FD] ${FOCUS_RING}`}
            >
              Connected accounts
            </Link>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold text-neutral-900">
                Today’s queue
              </h2>
              <span className="text-[11px] text-neutral-400">{today}</span>
            </div>

            {isItemsLoading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-neutral-500">
                <Loader2 className="size-4 animate-spin text-[#5B57E6]" />
                Loading items…
              </div>
            ) : null}

            {isItemsError ? (
              <p className="text-[13px] text-rose-700">
                {getApiErrorMessage(itemsError, "Failed to load items")}
              </p>
            ) : null}

            {!isItemsLoading && !isItemsError && items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E6E8F5] bg-[#FBFBFE] px-4 py-8 text-center">
                <AlertCircle className="mx-auto size-5 text-neutral-400" />
                <p className="mt-2 text-[13px] font-medium text-neutral-700">
                  No items for today
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Scheduled calendar posts for today will show up here.
                </p>
              </div>
            ) : null}

            {items.length > 0 ? (
              <ul className="max-h-[22rem] space-y-2 overflow-y-auto pr-1">
                {items.map((item, index) => (
                  <ItemRow
                    key={item.id || item.calendar_item_id || `item-${index}`}
                    item={item}
                  />
                ))}
              </ul>
            ) : null}
          </Card>

          <Card className="space-y-3 p-5">
            <h2 className="text-[15px] font-semibold text-neutral-900">
              Recent runs
            </h2>

            {isRunsLoading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-neutral-500">
                <Loader2 className="size-4 animate-spin text-[#5B57E6]" />
                Loading runs…
              </div>
            ) : null}

            {isRunsError ? (
              <p className="text-[13px] text-rose-700">
                {getApiErrorMessage(runsError, "Failed to load runs")}
              </p>
            ) : null}

            {!isRunsLoading && !isRunsError && runs.length === 0 ? (
              <p className="text-[13px] text-neutral-500">
                No execution runs yet. Queue one with “Run today”.
              </p>
            ) : null}

            {runs.length > 0 ? (
              <ul className="max-h-[18rem] space-y-2 overflow-y-auto pr-1">
                {runs.map((run, index) => (
                  <RunRow
                    key={run.id || run.run_id || run.job_id || `run-${index}`}
                    run={run}
                  />
                ))}
              </ul>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
