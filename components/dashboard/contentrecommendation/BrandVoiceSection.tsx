import SharedCard from "@/components/shared/card";
import type { BrandVoice } from "@/types/bussiness/content-recommendation-type";
import { Chip } from "./chipsandsection";
import SectionHeader from "./sectionHeader";

export default function BrandVoiceSection({
  brandVoice,
}: {
  brandVoice?: BrandVoice | null;
}) {
  if (!brandVoice) return null;

  const hasContent =
    brandVoice.brand_name ||
    brandVoice.tone_guide ||
    brandVoice.positioning ||
    brandVoice.do?.length ||
    brandVoice.dont?.length ||
    brandVoice.audience?.length ||
    brandVoice.content_themes?.length ||
    brandVoice.differentiators?.length;

  if (!hasContent) return null;

  return (
    <SharedCard className="p-4">
      <SectionHeader label="brand_voice" />
      <div className="space-y-4">
        {(brandVoice.brand_name || brandVoice.tone_guide) && (
          <div>
            {brandVoice.brand_name ? (
              <p className="text-[14px] font-semibold text-neutral-900">
                {brandVoice.brand_name}
              </p>
            ) : null}
            {brandVoice.tone_guide ? (
              <p className="mt-1 text-[13px] leading-5 text-neutral-600">
                {brandVoice.tone_guide}
              </p>
            ) : null}
          </div>
        )}

        {brandVoice.positioning ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
              Positioning
            </p>
            <p className="mt-1 text-[13px] leading-5 text-neutral-700">
              {brandVoice.positioning}
            </p>
          </div>
        ) : null}

        {brandVoice.do?.length ? (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-emerald-700">
              Do
            </p>
            <ul className="space-y-1">
              {brandVoice.do.map((item) => (
                <li key={item} className="text-[12px] text-neutral-700">
                  · {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {brandVoice.dont?.length ? (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-rose-700">
              Don&apos;t
            </p>
            <ul className="space-y-1">
              {brandVoice.dont.map((item) => (
                <li key={item} className="text-[12px] text-neutral-700">
                  · {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {(brandVoice.audience?.length ||
          brandVoice.content_themes?.length ||
          brandVoice.differentiators?.length) && (
          <div className="space-y-3">
            {brandVoice.audience?.length ? (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
                  Audience
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {brandVoice.audience.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {brandVoice.content_themes?.length ? (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
                  Themes
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {brandVoice.content_themes.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {brandVoice.differentiators?.length ? (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-400">
                  Differentiators
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {brandVoice.differentiators.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </SharedCard>
  );
}
