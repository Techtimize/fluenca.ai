"use client";

import type { ReactNode } from "react";
import { Clock3, Globe, LayoutGrid, Search } from "lucide-react";
import type { NormalizedFilterOption } from "@/types/bussiness/google-trends-type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fieldClass =
  "h-11 w-full rounded-xl border border-[#E6E8F5] bg-white px-4 text-sm text-neutral-900 data-[size=default]:h-11";

function FieldLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400 [&>svg]:size-3.5">
      {icon}
      {children}
    </span>
  );
}

type FilterFieldProps = {
  label: string;
  icon: ReactNode;
  options: NormalizedFilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function FilterDropdown({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder,
}: FilterFieldProps) {
  const items = Object.fromEntries(
    options.map((option) => [option.id, option.label]),
  );

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <Select
        value={value}
        items={items}
        onValueChange={(next) => {
          if (typeof next === "string") onChange(next);
        }}
      >
        <SelectTrigger aria-label={label} className={fieldClass}>
          <SelectValue
            placeholder={placeholder ?? `Select ${label.toLowerCase()}`}
          />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

type Props = {
  geos: NormalizedFilterOption[];
  categories: NormalizedFilterOption[];
  timeRanges: NormalizedFilterOption[];
  geo: string;
  category: string;
  time: string;
  keyword: string;
  onGeoChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
};

export default function TrendsFiltersBar({
  geos,
  categories,
  timeRanges,
  geo,
  category,
  time,
  keyword,
  onGeoChange,
  onCategoryChange,
  onTimeChange,
  onKeywordChange,
}: Props) {
  return (
    <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
      <FilterDropdown
        label="Region"
        icon={<Globe />}
        options={geos}
        value={geo}
        onChange={onGeoChange}
        placeholder="Select region"
      />
      <FilterDropdown
        label="Category"
        icon={<LayoutGrid />}
        options={categories}
        value={category}
        onChange={onCategoryChange}
        placeholder="Select category"
      />
      <FilterDropdown
        label="Time range"
        icon={<Clock3 />}
        options={timeRanges}
        value={time}
        onChange={onTimeChange}
        placeholder="Select time range"
      />
      <label className="flex min-w-0 flex-col gap-1.5">
        <FieldLabel icon={<Search />}>Filter keywords</FieldLabel>
        <span className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Filter topics in view..."
            className="h-11 w-full rounded-xl border border-[#E6E8F5] bg-[#FAFBFF] pl-10 pr-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#C9CCF5] focus:bg-white focus:ring-2 focus:ring-[#5B57E6]/20"
          />
        </span>
      </label>
    </div>
  );
}
