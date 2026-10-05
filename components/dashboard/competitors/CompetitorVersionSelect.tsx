"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompetitorAnalysisVersionItem } from "@/types/bussiness/competitoranalysis-type";
import { LATEST_VERSION_VALUE } from "./versionUtils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  versions: CompetitorAnalysisVersionItem[];
  isLoading?: boolean;
  disabled?: boolean;
};

export default function CompetitorVersionSelect({
  value,
  onChange,
  versions,
  isLoading = false,
  disabled = false,
}: Props) {
  return (
    <div className="flex min-w-[220px] flex-col gap-1.5">
      <label className="text-[12px] font-medium text-neutral-500">Analysis version</label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (typeof next === "string") onChange(next);
        }}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="h-10 w-full rounded-full border-[#E6E8F5] bg-white px-4">
          <SelectValue placeholder={isLoading ? "Loading versions…" : "Select version"} />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectItem value={LATEST_VERSION_VALUE}>Latest version</SelectItem>
            {versions.map((item) => (
              <SelectItem key={item.version} value={item.version}>
                {item.label || `Version ${item.version}`}
                {item.created_at ? ` · ${new Date(item.created_at).toLocaleDateString()}` : ""}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
