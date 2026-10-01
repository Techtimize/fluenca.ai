'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, Dna, Loader2 } from 'lucide-react';
import { PAGE_ROUTES } from '@/constant/page-routes';
import { DnaQuery } from '@/routes/bussiness/Bussiness-Query';
import { RetryDnaMutation } from '@/routes/bussiness/Bussiness-Mutation';

export default function VerifyDna() {
    const { data: dna, isLoading } = DnaQuery();
    const { mutate: retryDna, isPending: isRetrying } = RetryDnaMutation();

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

            <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-16 pt-6">
                {/* Heading */}
                <div className="flex flex-col items-center text-center">
                    <div className="grid size-12 place-items-center rounded-2xl bg-[#EEF0FB] text-[#5B5BD6]">
                        <Dna className="size-6" />
                    </div>
                    <h1 className="mt-4 text-2xl font-semibold text-gray-900 sm:text-[28px]">Your Company DNA</h1>
                    <p className="mt-2 max-w-md text-sm text-gray-500">
                        Everything our AI agents learned about your company, in one place. Verify it before we build your workspace.
                    </p>
                    {isReady && dna.version && (
                        <span className="mt-3 rounded-full bg-[#EEF0FB] px-3 py-1 text-xs font-medium text-[#5B5BD6]">
                            Version {dna.version}
                        </span>
                    )}
                </div>

                {/* Building */}
                {(isLoading || dna?.status === 'generating' || dna?.status === 'not_started') && (
                    <div className="mt-10 flex flex-col items-center gap-3 text-sm text-gray-500">
                        <Loader2 className="size-6 animate-spin text-[#5B5BD6]" />
                        Building your company DNA...
                    </div>
                )}

                {/* Failed */}
                {isFailed && (
                    <div className="mx-auto mt-10 max-w-md rounded-3xl border border-red-100 bg-white p-6 text-center">
                        <p className="text-sm text-red-500">{dna.error || 'We could not build your company DNA.'}</p>
                        <button
                            type="button"
                            onClick={() => retryDna()}
                            disabled={isRetrying}
                            className="mt-4 h-9 rounded-full bg-[#5B5BD6] px-6 text-sm font-semibold text-white hover:bg-[#4a4ac5] disabled:opacity-60"
                        >
                            {isRetrying ? 'Retrying...' : 'Retry'}
                        </button>
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
