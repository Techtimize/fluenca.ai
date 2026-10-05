"use client";
import { useMemo } from "react";
import { toast } from "sonner";
import { ContentRecommendationMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type { ContentRecommendationResultResponse } from "@/types/bussiness/content-recommendation-type";
import Section from "./section";
import { EmptyState } from "./Emptystate";

const HIDDEN_KEYS = new Set([
  "meta",
  "success",
  "error",
  "warnings",
  "company_id",
  "prompt_id",
  "created_at",
  "status",
  "message",
]);

type Props = {
  data?: ContentRecommendationResultResponse | null;
  companyId: string;
  empty?: boolean;
};

export default function ContentRecommendations({ data, companyId, empty = false }: Props) {
  const { mutate: recommend, isPending } = ContentRecommendationMutation();

  const entries = useMemo(() => {
    if (!data) return [];
    const content = (
      data.result && typeof data.result === "object" ? data.result : data
    ) as Record<string, unknown>;
    return Object.entries(content).filter(([key, value]) => {
      if (HIDDEN_KEYS.has(key)) return false;
      if (value == null || value === "") return false;
      if (Array.isArray(value) && !value.length) return false;
      return true;
    });
  }, [data]);

  const handleGenerate = () => {
    if (!companyId) {
      toast.error("Company ID is missing. Please log in again.");
      return;
    }
    recommend({ company_id: companyId });
  };

  if (empty || !entries.length) {
    return <EmptyState onGenerate={handleGenerate} isPending={isPending} />;
  }

  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => (
        <Section key={key} label={key} value={value} companyId={companyId} />
      ))}
    </div>
  );
}
