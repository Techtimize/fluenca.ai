/** Flexible normalizers for Instagram account insight endpoints. */

export type InsightSeriesPoint = {
  label: string;
  value: number;
  endTime?: string | null;
};

export type InsightMetric = {
  id: string;
  name: string;
  title: string;
  description: string;
  period: string | null;
  total: number | null;
  series: InsightSeriesPoint[];
};

export type DemographicBucket = {
  key: string;
  label: string;
  value: number;
};

export type DemographicBreakdown = {
  id: string;
  title: string;
  dimension: string;
  buckets: DemographicBucket[];
};

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t || null;
}

function humanize(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function unwrapPayload(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const obj = raw as Record<string, unknown>;
  if (obj.data !== undefined) return obj.data;
  if (obj.insights !== undefined) return obj.insights;
  if (obj.result !== undefined) return obj.result;
  return raw;
}

function metricFromObject(item: Record<string, unknown>, index: number): InsightMetric {
  const name = asString(item.name) || asString(item.metric) || `metric_${index}`;
  const title =
    asString(item.title) || asString(item.label) || humanize(name);
  const description =
    asString(item.description) || asString(item.help) || "";
  const period = asString(item.period);

  const series: InsightSeriesPoint[] = [];
  const values = item.values;
  if (Array.isArray(values)) {
    values.forEach((entry, i) => {
      if (!entry || typeof entry !== "object") {
        const n = asNumber(entry);
        if (n != null) series.push({ label: `Day ${i + 1}`, value: n });
        return;
      }
      const row = entry as Record<string, unknown>;
      const value =
        asNumber(row.value) ??
        asNumber(row.count) ??
        asNumber(row.total) ??
        0;
      const endTime = asString(row.end_time) || asString(row.date);
      const label = endTime
        ? new Date(endTime).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        : `Point ${i + 1}`;
      series.push({ label, value, endTime });
    });
  }

  let total =
    asNumber(item.total_value) ??
    asNumber((item.total_value as { value?: unknown } | undefined)?.value) ??
    asNumber(item.value) ??
    asNumber(item.total) ??
    asNumber(item.count);

  if (total == null && series.length) {
    total = series.reduce((sum, p) => sum + p.value, 0);
  }

  // Meta sometimes nests total_value.value as number OR object with breakdowns only
  if (
    total == null &&
    item.total_value &&
    typeof item.total_value === "object" &&
    !Array.isArray(item.total_value)
  ) {
    total = asNumber((item.total_value as Record<string, unknown>).value);
  }

  return {
    id: `${name}-${index}`,
    name,
    title,
    description,
    period,
    total,
    series,
  };
}

/** Turn any insight response into a flat metric list. */
export function normalizeInsightMetrics(raw: unknown): InsightMetric[] {
  const payload = unwrapPayload(raw);
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload
      .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
      .map((item, i) => metricFromObject(item, i));
  }

  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    // { metrics: [...] } or { items: [...] }
    for (const key of ["metrics", "items", "results"]) {
      if (Array.isArray(obj[key])) {
        return normalizeInsightMetrics(obj[key]);
      }
    }

    // Flat map of name -> number
    const entries = Object.entries(obj).filter(
      ([k, v]) =>
        !["success", "message", "error", "account_id", "id"].includes(k) &&
        asNumber(v) != null,
    );
    if (entries.length) {
      return entries.map(([name, value], i) => ({
        id: `${name}-${i}`,
        name,
        title: humanize(name),
        description: "",
        period: null,
        total: asNumber(value),
        series: [],
      }));
    }

    return [metricFromObject(obj, 0)];
  }

  return [];
}

export function pickMetric(
  metrics: InsightMetric[],
  ...names: string[]
): InsightMetric | null {
  const wanted = names.map((n) => n.toLowerCase());
  return (
    metrics.find((m) => wanted.includes(m.name.toLowerCase())) ||
    metrics.find((m) =>
      wanted.some(
        (w) =>
          m.name.toLowerCase().includes(w) ||
          m.title.toLowerCase().includes(w),
      ),
    ) ||
    null
  );
}

export function metricTotal(
  metrics: InsightMetric[],
  ...names: string[]
): number | null {
  return pickMetric(metrics, ...names)?.total ?? null;
}

/** Parse demographic breakdowns (age, gender, city, country). */
export function normalizeDemographics(raw: unknown): DemographicBreakdown[] {
  const payload = unwrapPayload(raw);
  const breakdowns: DemographicBreakdown[] = [];

  const pushBuckets = (
    dimension: string,
    title: string,
    rows: Array<{ key: string; value: number }>,
  ) => {
    if (!rows.length) return;
    const sorted = [...rows].sort((a, b) => b.value - a.value);
    breakdowns.push({
      id: dimension,
      title,
      dimension,
      buckets: sorted.map((r) => ({
        key: r.key,
        label: humanize(r.key),
        value: r.value,
      })),
    });
  };

  const visitMetric = (item: Record<string, unknown>) => {
    const totalValue = item.total_value;
    if (totalValue && typeof totalValue === "object" && !Array.isArray(totalValue)) {
      const tv = totalValue as Record<string, unknown>;
      const list = Array.isArray(tv.breakdowns) ? tv.breakdowns : [];
      list.forEach((bd, bi) => {
        if (!bd || typeof bd !== "object") return;
        const block = bd as Record<string, unknown>;
        const keys = Array.isArray(block.dimension_keys)
          ? (block.dimension_keys as unknown[]).map(String)
          : ["segment"];
        const dimension = keys.join(" · ") || `breakdown_${bi}`;
        const results = Array.isArray(block.results) ? block.results : [];
        const rows: Array<{ key: string; value: number }> = [];
        results.forEach((res) => {
          if (!res || typeof res !== "object") return;
          const row = res as Record<string, unknown>;
          const dims = Array.isArray(row.dimension_values)
            ? (row.dimension_values as unknown[]).map(String)
            : [];
          const value = asNumber(row.value) ?? 0;
          const key = dims.join(" / ") || "Unknown";
          rows.push({ key, value });
        });
        pushBuckets(dimension, humanize(dimension), rows);
      });
    }

    // Flat { age: { "18-24": 10 }, gender: { F: 20 } }
    for (const [key, value] of Object.entries(item)) {
      if (
        ["name", "title", "description", "period", "id", "total_value", "values"].includes(
          key,
        )
      ) {
        continue;
      }
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const rows = Object.entries(value as Record<string, unknown>)
          .map(([k, v]) => ({ key: k, value: asNumber(v) ?? 0 }))
          .filter((r) => r.value > 0);
        if (rows.length) pushBuckets(key, humanize(key), rows);
      }
    }
  };

  if (Array.isArray(payload)) {
    payload.forEach((item) => {
      if (item && typeof item === "object") visitMetric(item as Record<string, unknown>);
    });
  } else if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) {
      return normalizeDemographics(obj.data);
    }
    visitMetric(obj);
  }

  return breakdowns;
}

export function sumSeries(metric: InsightMetric | null | undefined) {
  if (!metric) return null;
  if (metric.total != null) return metric.total;
  if (!metric.series.length) return null;
  return metric.series.reduce((s, p) => s + p.value, 0);
}

export function latestSeriesValue(metric: InsightMetric | null | undefined) {
  if (!metric?.series.length) return metric?.total ?? null;
  return metric.series[metric.series.length - 1]?.value ?? null;
}
