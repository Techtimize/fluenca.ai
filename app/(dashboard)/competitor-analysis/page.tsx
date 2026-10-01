"use client";

import { useState } from "react";
import { AtSign, Link2, Loader2, Plus, Sparkles, Trash2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import CompetitorResults from "@/components/dashboard/competitors/CompetitorResults";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApiErrorMessage } from "@/errors/error-utils";
import { CompetitorAnalysisAsyncMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { CompetitorAnalysisCompetitorQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import { FOCUS_RING } from "@/utils/ui-classes";

type AnalysisMode = "ai" | "manual";

function normalizeInstagram(value: string) {
  const trimmed = value.trim().replace(/^@+/, "");
  if (!trimmed) return "";
  return `@${trimmed}`;
}

function normalizeLinkedIn(value: string) {
  return value.trim();
}

function isLikelyLinkedIn(value: string) {
  return /linkedin\.com/i.test(value) || value.startsWith("http");
}

export default function CompetitorAnalysisPage() {
  const t = useTranslations("competitors");
  const tTop = useTranslations("topBar");
  const companyId = useAuthStore((s) => s.company_id);
  const companyName = useAuthStore((s) => s.company_name);
  const [mode, setMode] = useState<AnalysisMode>("ai");
  const [instagramInput, setInstagramInput] = useState("");
  const [linkedinInput, setLinkedinInput] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);

  const {
    data: competitorResults,
    isLoading,
    isError,
    error,
    refetch,
  } = CompetitorAnalysisCompetitorQuery(companyId);
  const { mutate: runAnalysis, isPending } = CompetitorAnalysisAsyncMutation();

  const handleRunAi = () => {
    if (!companyId) return;
    runAnalysis(
      {
        company_id: companyId,
        mode: "ai",
      },
      {
        onSuccess: () => {
          void refetch();
        },
      },
    );
  };

  const addCompetitor = (raw: string, kind: "instagram" | "linkedin") => {
    const value =
      kind === "instagram" ? normalizeInstagram(raw) : normalizeLinkedIn(raw);

    if (!value) {
      toast.error(
        kind === "instagram"
          ? "Enter an Instagram username"
          : "Enter a LinkedIn URL",
      );
      return;
    }

    if (kind === "linkedin" && !isLikelyLinkedIn(value)) {
      toast.error("Enter a valid LinkedIn URL");
      return;
    }

    if (competitors.some((item) => item.toLowerCase() === value.toLowerCase())) {
      toast.error("This competitor is already added");
      return;
    }

    setCompetitors((prev) => [...prev, value]);
    if (kind === "instagram") setInstagramInput("");
    else setLinkedinInput("");
  };

  const removeCompetitor = (value: string) => {
    setCompetitors((prev) => prev.filter((item) => item !== value));
  };

  const handleRunManual = () => {
    if (!companyId) return;
    if (!competitors.length) {
      toast.error("Add at least one Instagram username or LinkedIn URL");
      return;
    }

    runAnalysis(
      {
        company_id: companyId,
        mode: "manual",
        competitors,
      },
      {
        onSuccess: () => {
          void refetch();
        },
      },
    );
  };

  return (
    <main className="min-w-0 space-y-4">
          <TopBar
            user={{ name: companyName || "User" }}
            placeholder={tTop("searchCompetitors")}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">{t("title")}</h1>
              <p className="mt-1 text-sm text-neutral-500">
                {t("subtitle")}
              </p>
            </div>

            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as AnalysisMode)}
              className="w-full sm:w-auto"
            >
              <TabsList className="ms-auto h-10 w-full rounded-full bg-[#ECEBFF]/p-1 sm:w-auto">
                <TabsTrigger
                  value="ai"
                  className="h-8 flex-1 gap-1.5 rounded-full px-4 data-active:bg-white data-active:text-[#5B57E6] data-active:shadow-sm sm:flex-none"
                >
                  <Sparkles className="size-3.5" />
                  {t("ai")}
                </TabsTrigger>
                <TabsTrigger
                  value="manual"
                  className="h-8 flex-1 gap-1.5 rounded-full px-4 data-active:bg-white data-active:text-[#5B57E6] data-active:shadow-sm sm:flex-none"
                >
                  <Users className="size-3.5" />
                  {t("manual")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {!companyId ? (
            <Card className="border-amber-200 bg-amber-50/80 p-5">
              <p className="text-sm text-amber-800">
                Company ID is missing. Complete company analysis first, then return here.
              </p>
            </Card>
          ) : null}

          {mode === "ai" ? (
            <Card className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
                    <Sparkles className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-neutral-900">Run AI discovery</h3>
                    <p className="mt-1 text-[13px] leading-5 text-neutral-500">
                      Auto-discover competitors from your company profile using AI mode.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleRunAi}
                  disabled={!companyId || isPending}
                  className="h-11 shrink-0 gap-2 rounded-full bg-[#5B57E6] px-5 text-white hover:bg-[#4A46D0]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Running…
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Run competitor analysis
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-5 sm:p-6">
              <h3 className="text-[15px] font-semibold text-neutral-900">Add competitors</h3>
              <p className="mt-1 text-[13px] text-neutral-500">
                Provide Instagram usernames and LinkedIn company URLs, then run analysis.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <AtSign className="size-4 text-[#5B57E6]" />
                    Instagram username
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={instagramInput}
                      onChange={(e) => setInstagramInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCompetitor(instagramInput, "instagram");
                        }
                      }}
                      placeholder="@confiz"
                      className="h-11 rounded-full border-[#E6E8F5] bg-white px-4"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addCompetitor(instagramInput, "instagram")}
                      className="h-11 shrink-0 rounded-full px-4"
                    >
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <Link2 className="size-4 text-[#5B57E6]" />
                    LinkedIn URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={linkedinInput}
                      onChange={(e) => setLinkedinInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCompetitor(linkedinInput, "linkedin");
                        }
                      }}
                      placeholder="https://www.linkedin.com/company"
                      className="h-11 rounded-full border-[#E6E8F5] bg-white px-4"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addCompetitor(linkedinInput, "linkedin")}
                      className="h-11 shrink-0 rounded-full px-4"
                    >
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {competitors.length ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {competitors.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-[#E6E8F5] bg-[#F8F9FF] px-3 py-1.5 text-[13px] text-neutral-700"
                    >
                      <span className="max-w-[240px] truncate">{item}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${item}`}
                        onClick={() => removeCompetitor(item)}
                        className={`rounded-full p-0.5 text-neutral-500 hover:bg-white hover:text-rose-600 ${FOCUS_RING}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-[13px] text-neutral-500">
                  No competitors added yet. Example: @confiz or a LinkedIn company URL.
                </p>
              )}

              <div className="mt-5 flex justify-end">
                <Button
                  type="button"
                  onClick={handleRunManual}
                  disabled={!companyId || isPending || competitors.length === 0}
                  className="h-11 gap-2 rounded-full bg-[#5B57E6] px-5 text-white hover:bg-[#4A46D0]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Running…
                    </>
                  ) : (
                    <>
                      <Users className="size-4" />
                      Run manual analysis
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          <CompetitorResults
            data={competitorResults}
            isLoading={Boolean(companyId) && isLoading && !competitorResults}
            isError={isError}
            errorMessage={
              isError ? getApiErrorMessage(error, "Failed to load competitors") : undefined
            }
            onRunAnalysis={() => {
              setMode("ai");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </main>
  );
}
