'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bell,
  Building2,
  Crosshair,
  Dna,
  Layers3,
  Loader2,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PAGE_ROUTES } from '@/constant/page-routes';
import { DnaQuery } from '@/routes/bussiness/Bussiness-Query';
import { AnalyzeCompanyMutation, RetryDnaMutation } from '@/routes/bussiness/Bussiness-Mutation';
import useAuthStore from '@/store/AuthsStore';

export default function VerifyDna() {
    const { data: dna, isLoading } = DnaQuery();
    const { mutate: retryDna, isPending: isRetrying } = RetryDnaMutation();
    const { mutate: analyzeCompany } = AnalyzeCompanyMutation();
    const companyUserId = useAuthStore((state) => state.company_user_id);

    const isReady = dna?.status === 'ready';
    const isFailed = dna?.status === 'failed';

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-white">
            {/* Soft background glow */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-130 w-180 rounded-full bg-[#DCE1FB] opacity-70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-105 w-155 rounded-full bg-[#E6E9FB] opacity-70 blur-3xl" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
                <Link href={PAGE_ROUTES.HOME} className="flex items-center gap-2">
                    <Image src="/assets/Logo.svg" alt="Fluenca.ai" width={24} height={24} className="h-6 w-6" />
                    <span className="text-base font-semibold text-[#2B2F8F]">
                        fluenca<span className="text-[#5B5BD6]">.ai</span>
                    </span>
                </Link>

  const isReady = dna?.status === 'ready';
  const isFailed = dna?.status === 'failed';
  const isBuilding =
    isLoading || dna?.status === 'generating' || dna?.status === 'not_started';

  const HIDDEN_SECTION_TITLES = new Set([
    'voice & tone',
    'voice and tone',
    'things to avoid',
    'company & team',
    'company and team',
  ]);

  const sections = useMemo(
    () =>
      (dna?.sections ?? [])
        .filter((section) => {
          const title = section.title
            .replace(/^#+\s*/, '')
            .trim()
            .toLowerCase();
          const key = section.key.trim().toLowerCase().replace(/[_-]+/g, ' ');
          return !HIDDEN_SECTION_TITLES.has(title) && !HIDDEN_SECTION_TITLES.has(key);
        })
        .map((section) => ({
          ...section,
          id: section.key || section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          Icon: getSectionIcon(section.key, section.title),
        })),
    [dna?.sections],
  );

  useEffect(() => {
    if (!sections.length) return;
    setActiveId((current) => current || sections[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#E9ECFF_0%,#FFFFFF_45%)]">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link href={PAGE_ROUTES.HOME} className="flex items-center gap-2">
          <Image
            src="/assets/Logo.svg"
            alt="Fluenca.ai"
            width={28}
            height={28}
            className="size-7"
          />
          <span className="text-lg font-semibold tracking-wide text-neutral-900">
            fluenca<span className="text-[#5B57E6]">.ai</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className={`grid size-10 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-700 hover:bg-neutral-50 ${FOCUS_RING}`}
          >
            <Bell className="size-4" />
          </button>
          <div className="grid size-10 place-items-center rounded-full bg-[#5B57E6] text-sm font-semibold text-white">
            U
          </div>
        </div>
      </header>

      <div className="w-full px-4 pb-16 pt-2 sm:px-6 lg:px-10">
        <div className="mb-8 mx-auto max-w-3xl text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#5B57E6]">
            Company DNA
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Verify what we learned
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-[15px]">
            Everything our AI agents gathered about your company, laid out by section.
            Review each part before we build your workspace.
          </p>
        </div>

        {isBuilding && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-neutral-500">
            <Loader2 className="size-7 animate-spin text-[#5B57E6]" />
            <p className="font-medium text-neutral-700">Building your company DNA...</p>
            <p className="max-w-sm text-center text-xs text-neutral-500">
              Reading positioning, audience, and offer signals from your public presence.
            </p>
          </div>
        )}

        {isFailed && (
          <div className="flex min-h-[40vh] flex-col items-start justify-center gap-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              We couldn&apos;t finish your DNA
            </h2>
            <p className="max-w-lg text-sm leading-6 text-[#B42318]">
              {dna?.error || 'Something went wrong while generating your company DNA.'}
            </p>
            <button
              type="button"
              onClick={() => retryDna()}
              disabled={isRetrying}
              className={`h-11 rounded-full bg-[#5B57E6] px-6 text-sm font-semibold text-white hover:bg-[#4A46D0] disabled:opacity-60 ${FOCUS_RING}`}
            >
              {isRetrying ? 'Retrying...' : 'Try again'}
            </button>
          </div>
        )}

        {isReady && sections.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                Sections
              </p>
              <nav aria-label="DNA sections">
                <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
                  {sections.map((section, index) => {
                    const active = section.id === activeId;
                    const Icon = section.Icon;
                    return (
                      <li key={section.id} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => scrollTo(section.id)}
                          aria-current={active ? 'true' : undefined}
                          className={`flex w-full items-center gap-2.5 rounded-full px-3 py-2.5 text-left text-[13px] transition-colors lg:rounded-none lg:border-l-2 lg:px-2.5 ${FOCUS_RING} ${
                            active
                              ? 'bg-[#ECEBFF] font-medium text-[#5B57E6] lg:border-[#5B57E6] lg:bg-transparent'
                              : 'bg-white/70 text-neutral-700 hover:text-neutral-950 lg:border-transparent lg:bg-transparent'
                          }`}
                        >
                          <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">
                            {index + 1}. {section.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            <div className="min-w-0">
              {sections.map((section, index) => {
                const Icon = section.Icon;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-8 border-t border-[#E6E8F5] py-10 first:border-t-0 first:pt-0"
                  >
                    <div className="mb-5 flex items-start gap-3">
                      <span className="mt-0.5 grid size-10 place-items-center rounded-2xl bg-[#ECEBFF] text-[#5B57E6]">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5B57E6]">
                          Part {String(index + 1).padStart(2, '0')}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-neutral-900 sm:text-2xl">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                )}

                {/* Sections */}
                {isReady && (
                    <>
                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {dna.sections.map((section) => (
                                <section
                                    key={section.key}
                                    className="overflow-hidden rounded-2xl border border-[#E6E8F5] bg-white shadow-[0_8px_30px_rgba(91,91,214,0.06)]"
                                >
                                    <h2 className="bg-[#F1F4FF] px-4 py-3 text-sm font-semibold text-gray-900">{section.title}</h2>
                                    <p className="whitespace-pre-line px-4 py-3.5 text-xs leading-5 text-gray-600">{section.text}</p>
                                </section>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Link
                                href={PAGE_ROUTES.DASHBOARD}
                                onClick={() => analyzeCompany({ company_id: companyUserId, company_data: JSON.stringify(dna) })}
                                className="flex h-11 items-center rounded-full bg-[#5B5BD6] px-8 text-sm font-semibold text-white shadow-lg hover:bg-[#4a4ac5]"
                            >
                                Looks good, continue
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
