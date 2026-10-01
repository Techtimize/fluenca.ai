"use client";

import type { NormalizedFilterOption } from "@/types/bussiness/google-trends-type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterFieldProps = {
  label: string;
  options: NormalizedFilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function FilterDropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
}: FilterFieldProps) {
  const items = Object.fromEntries(
    options.map((option) => [option.id, option.label]),
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-[12px] font-medium text-neutral-500">{label}</span>
      <Select
        value={value}
        items={items}
        onValueChange={(next) => {
          if (typeof next === "string") onChange(next);
        }}
      >
        <SelectTrigger
          aria-label={label}
          className="h-11 w-full rounded-full border-[#E6E8F5] bg-white px-4 data-[size=default]:h-11"
        >
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
  onGeoChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTimeChange: (value: string) => void;
};

export default function TrendsFiltersBar({
  geos,
  categories,
  timeRanges,
  geo,
  category,
  time,
  onGeoChange,
  onCategoryChange,
  onTimeChange,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <FilterDropdown
        label="Region"
        options={geos}
        value={geo}
        onChange={onGeoChange}
        placeholder="Select region"
      />
      <FilterDropdown
        label="Category"
        options={categories}
        value={category}
        onChange={onCategoryChange}
        placeholder="Select category"
      />
      <FilterDropdown
        label="Time range"
        options={timeRanges}
        value={time}
        onChange={onTimeChange}
        placeholder="Select time range"
      />
    </div>
  );
}
