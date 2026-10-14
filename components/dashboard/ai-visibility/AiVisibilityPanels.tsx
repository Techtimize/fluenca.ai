import { ArrowRight, Globe2, Target } from "lucide-react";
import type { AiVisibilityOverview, AiVisibilitySummary } from "@/routes/ai-visibility/ai-visibility.routes";

export const ENGINE_NAMES: Record<string, string> = {
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  google_ai: "Google AI",
  google_search: "Google search",
};

function scoreTone(score: number) {
  if (score >= 60) return "text-emerald-600";
  if (score >= 30) return "text-amber-600";
  return "text-rose-600";
}

export function ScoreCards({ overview, brand }: { overview: AiVisibilityOverview; brand: string }) {
  const latest = overview.latest;
  const summary = latest?.summary;
  const previous = overview.trend.length > 1 ? overview.trend[overview.trend.length - 2].score : null;
  const score = latest?.score ?? 0;
  const ours = summary?.share_of_voice.find((s) => s.brand.toLowerCase() === brand.toLowerCase());
  const cards = [
    {
      label: "Visibility score",
      value: `${score}`,
      suffix: "/ 100",
      note: previous !== null ? `${score - previous >= 0 ? "+" : ""}${score - previous} since last check` : "First check",
      tone: scoreTone(score),
    },
    {
      label: "Mentioned by AI",
      value: `${summary?.mentioned ?? 0}`,
      suffix: `of ${summary?.answers ?? 0} answers`,
      note: `${summary?.questions ?? 0} questions tracked`,
      tone: "text-neutral-900",
    },
    {
      label: "Your site cited",
      value: `${summary?.cited ?? 0}`,
      suffix: "times",
      note: "As a source link in an answer",
      tone: "text-neutral-900",
    },
    {
      label: "Share of voice",
      value: `${ours?.share ?? 0}%`,
      suffix: "",
      note: "Of all brand mentions in AI answers",
      tone: "text-neutral-900",
    },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl bg-white p-4 ring-1 ring-[#E6E8F5]">
          <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-neutral-500">{card.label}</p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-3xl font-semibold tracking-tight ${card.tone}`}>{card.value}</span>
            <span className="text-[13px] text-neutral-500">{card.suffix}</span>
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">{card.note}</p>
        </div>
      ))}
    </div>
  );
}

export function TrendLine({ points }: { points: { date: string; score: number }[] }) {
  if (points.length < 2) {
    return <p className="text-[13px] text-neutral-500">The trend appears after your second check.</p>;
  }
  const width = 600;
  const height = 120;
  const step = width / (points.length - 1);
  const path = points.map((p, i) => `${i ? "L" : "M"}${i * step},${height - (p.score / 100) * height}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height + 4}`} className="h-32 w-full" role="img" aria-label="Visibility score over time">
      <path d={path} fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={p.date} cx={i * step} cy={height - (p.score / 100) * height} r="4" fill="#4F46E5">
          <title>{`${new Date(p.date).toLocaleDateString()}: ${p.score}`}</title>
        </circle>
      ))}
    </svg>
  );
}

export function EngineTable({ summary }: { summary: AiVisibilitySummary }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-105 text-left text-[14px]">
        <thead>
          <tr className="text-[12px] uppercase tracking-[0.06em] text-neutral-500">
            <th className="py-2 font-medium">Engine</th>
            <th className="py-2 font-medium">Mentioned you</th>
            <th className="py-2 font-medium">Cited your site</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary.engines).map(([engine, row]) => (
            <tr key={engine} className="border-t border-[#EEF0F7]">
              <td className="py-2.5 font-medium text-neutral-900">{ENGINE_NAMES[engine] ?? engine}</td>
              <td className="py-2.5 text-neutral-700">
                {row.mentioned} of {row.asked}
              </td>
              <td className="py-2.5 text-neutral-700">{row.cited}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ShareOfVoice({ summary, brand }: { summary: AiVisibilitySummary; brand: string }) {
  if (!summary.share_of_voice.length) return <p className="text-[13px] text-neutral-500">No brands were named yet.</p>;
  return (
    <ul className="space-y-2.5">
      {summary.share_of_voice.map((item) => {
        const ours = item.brand.toLowerCase() === brand.toLowerCase();
        return (
          <li key={item.brand}>
            <div className="flex justify-between text-[13px]">
              <span className={ours ? "font-semibold text-[#4F46E5]" : "text-neutral-800"}>
                {item.brand}
                {ours ? " (you)" : ""}
              </span>
              <span className="text-neutral-500">{item.share}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[#EEF0F7]">
              <div
                className={`h-2 rounded-full ${ours ? "bg-[#4F46E5]" : "bg-[#A5B4FC]"}`}
                style={{ width: `${Math.max(item.share, 2)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function TrustedSources({ summary }: { summary: AiVisibilitySummary }) {
  if (!summary.top_sources.length) return <p className="text-[13px] text-neutral-500">No sources were cited.</p>;
  return (
    <ul className="space-y-2">
      {summary.top_sources.map((source) => (
        <li key={source.domain} className="flex items-center gap-2 text-[14px]">
          <Globe2 className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
          <a
            href={`https://${source.domain}`}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 flex-1 truncate text-neutral-800 hover:text-[#4F46E5]"
          >
            {source.domain}
          </a>
          <span className="shrink-0 text-[12px] text-neutral-500">cited {source.count}×</span>
        </li>
      ))}
    </ul>
  );
}

export function Gaps({ summary, onFix }: { summary: AiVisibilitySummary; onFix: (question: string) => void }) {
  if (!summary.gaps.length) {
    return <p className="text-[13px] text-emerald-700">No gaps: you are named for every tracked question.</p>;
  }
  return (
    <ul className="space-y-2">
      {summary.gaps.map((gap) => (
        <li key={gap.question} className="rounded-xl bg-white p-3 ring-1 ring-[#E6E8F5]">
          <p className="flex items-start gap-2 text-[14px] font-medium text-neutral-900">
            <Target className="mt-0.5 size-4 shrink-0 text-rose-500" aria-hidden="true" />
            {gap.question}
          </p>
          {gap.named_instead.length ? (
            <p className="mt-1 ps-6 text-[12px] text-neutral-500">AI names instead: {gap.named_instead.join(", ")}</p>
          ) : null}
          <button
            type="button"
            onClick={() => onFix(gap.question)}
            className="mt-2 ms-6 inline-flex items-center gap-1 text-[13px] font-medium text-[#4F46E5] hover:underline"
          >
            Write a post that answers this
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
