'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Sparkles } from 'lucide-react';
import { PAGE_ROUTES } from '@/constant/page-routes';
import { IntakeStep } from '@/types/company-details-type';
import { truncateWords } from '@/utils/text-utils';
import { IntakeQuery } from '@/routes/bussiness/Bussiness-Query';

const STEPS: Record<IntakeStep, string> = {
    queued: 'Getting ready...',
    reading_website: 'Reading your website...',
    writing_questions: 'Writing questions...',
    drafting_answers: 'Drafting answers...',
    searching_web: 'Searching the web...',
    saving: 'Saving results...',
    done: 'Done',
};
const STEP_KEYS = Object.keys(STEPS) as IntakeStep[];
const VISIBLE_LINES = 4; // answered questions kept above the one being typed
const CHARS_PER_TICK = 3;
const TYPE_TICK_MS = 18;
const LINE_PAUSE_MS = 260;
const ANSWER_WORDS = 14;
const RING_RADIUS = 24;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export default function CompanyDetail() {
    const router = useRouter();
    const { data: intake } = IntakeQuery();
    const isReady = intake?.status === 'review' || intake?.status === 'completed';
    const questions = (intake?.sections ?? []).flatMap((section) => section.questions);

    // Typewriter: `done` questions are fully shown, the next one types out `typed` characters.
    const [done, setDone] = useState(0);
    const [typed, setTyped] = useState(0);
    const current = isReady ? questions[done] : undefined;
    const label = current?.question ?? '';
    const answer = current ? (current.answer ? truncateWords(current.answer, ANSWER_WORDS) : 'Needs your input') : '';
    const fullLength = label.length + 1 + answer.length;

    useEffect(() => {
        if (!isReady) return;
        if (!current) {
            const timer = setTimeout(() => router.push(PAGE_ROUTES.DNA), 800);
            return () => clearTimeout(timer);
        }
        const timer =
            typed < fullLength
                ? setTimeout(() => setTyped((n) => n + CHARS_PER_TICK), TYPE_TICK_MS)
                : setTimeout(() => {
                      setDone((n) => n + 1);
                      setTyped(0);
                  }, LINE_PAUSE_MS);
        return () => clearTimeout(timer);
    }, [isReady, current, typed, fullLength, router]);

    const step = intake?.step ?? 'queued';
    // Analysis fills the first 60% of the bar, typing out the questions fills the rest.
    const progress = isReady
        ? 60 + (done / Math.max(questions.length, 1)) * 40
        : ((STEP_KEYS.indexOf(step) + 1) / STEP_KEYS.length) * 60;
    const percent = Math.round(progress);
    const answered = isReady ? questions.slice(Math.max(0, done - VISIBLE_LINES), done) : [];

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-white">
            <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[720px] rounded-full bg-[#DCE1FB] opacity-70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[620px] rounded-full bg-[#E6E9FB] opacity-70 blur-3xl" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
                <Link href={PAGE_ROUTES.HOME} className="flex items-center gap-2">
                    <Image src="/assets/Logo.svg" alt="Fluenca.ai" width={24} height={24} className="h-6 w-6" />
                    <span className="text-base font-semibold text-[#2B2F8F]">
                        fluenca<span className="text-[#5B5BD6]">.ai</span>
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="grid size-10 place-items-center rounded-full border border-[#E6E8F5] bg-white text-neutral-700 hover:bg-neutral-50"
                    >
                        <Bell className="size-4" />
                    </button>
                    <div className="grid size-10 place-items-center rounded-full bg-[#5B5BD6] text-sm font-semibold text-white">
                        U
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 flex flex-col items-center px-4 pb-16 pt-10 sm:pt-16">
                <Image src="/assets/Logo.svg" alt="" width={48} height={48} className="h-12 w-12" />

                <h1 className="mt-4 max-w-xs text-center text-2xl font-semibold leading-snug text-gray-900 sm:text-[28px]">
                    Our AI agents are analyzing your company
                </h1>
                <p className="mt-2 text-center text-sm text-gray-500">
                    Reading your site, positioning and market. This takes about 20 seconds.
                </p>
                {intake?.status === 'failed' && (
                    <p className="mt-2 text-center text-sm text-red-500">
                        {intake.error || 'Something went wrong while analyzing your company.'}
                    </p>
                )}

                {/* Live report */}
                <div className="mt-8 w-full max-w-2xl rounded-3xl border border-[#E6E8F5] bg-white/90 p-6 shadow-[0_20px_50px_-24px_rgba(79,70,229,0.45)] backdrop-blur sm:p-8">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#4F46E5] to-[#8B5CF6] text-white">
                            <Sparkles className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-gray-900">Your company — report</p>
                            <p className="flex items-center gap-1.5 text-xs text-gray-500">
                                <span className="size-1.5 animate-pulse rounded-full bg-[#22C55E]" />
                                {isReady ? 'Building live...' : STEPS[step]}
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                            {isReady ? (
                                <p className="hidden text-right text-[11px] leading-tight text-gray-500 sm:block">
                                    {done} / {questions.length}
                                    <br />
                                    questions
                                </p>
                            ) : null}
                            {/* Circular progress ring, same as the analysis progress page */}
                            <div
                                className="relative size-14"
                                role="progressbar"
                                aria-valuenow={percent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <svg viewBox="0 0 56 56" className="size-full -rotate-90">
                                    <defs>
                                        <linearGradient id="intake-progress-ring" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#4F46E5" />
                                            <stop offset="100%" stopColor="#8B5CF6" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="28" cy="28" r={RING_RADIUS} fill="none" stroke="#EEF0F6" strokeWidth="5" />
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r={RING_RADIUS}
                                        fill="none"
                                        stroke="url(#intake-progress-ring)"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                        strokeDasharray={RING_LENGTH}
                                        strokeDashoffset={RING_LENGTH * (1 - Math.max(percent, 3) / 100)}
                                        className="transition-[stroke-dashoffset] duration-700 ease-out"
                                    />
                                </svg>
                                <span className="absolute inset-0 grid place-items-center text-[13px] font-bold text-gray-900">
                                    {percent}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <dl className="min-h-56 space-y-3 pt-4 text-sm leading-6">
                        {answered.map((item) => (
                            <div key={item.question_id} className="animate-in fade-in duration-300">
                                <dt className="inline font-semibold text-gray-900">{item.question}:</dt>{' '}
                                <dd className="inline text-gray-500">
                                    {item.answer ? truncateWords(item.answer, ANSWER_WORDS) : 'Needs your input'}
                                </dd>
                            </div>
                        ))}

                        {current ? (
                            <div>
                                <dt className="inline font-semibold text-gray-900">
                                    {label.slice(0, typed)}
                                    {typed > label.length ? ':' : ''}
                                </dt>{' '}
                                <dd className="inline text-gray-500">{answer.slice(0, Math.max(0, typed - label.length - 1))}</dd>
                                <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-[#5B5BD6]" />
                            </div>
                        ) : null}

                        {/* placeholder bars for what's still coming */}
                        {['w-3/5', 'w-4/5', 'w-1/2', 'w-3/5'].map((width, index) => (
                            <div key={index} className={`h-2.5 animate-pulse rounded-full bg-[#EEF0F8] ${width}`} />
                        ))}
                    </dl>
                </div>
            </main>
        </div>
    );
}
