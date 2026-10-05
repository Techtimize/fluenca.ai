'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, House } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/constant/page-routes';

export default function NotFound() {
  const router = useRouter();
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(PAGE_ROUTES.HOME);
  };

  return (
    <div className="flex min-h-dvh flex-col overflow-hidden bg-[radial-gradient(ellipse_at_15%_100%,rgba(219,224,255,0.68)_0%,rgba(255,255,255,0)_46%)]">
      <header className="mx-auto flex w-full max-w-360 items-center justify-between px-6 py-5 md:px-10">
        <Link href={PAGE_ROUTES.HOME} aria-label="FLUENCA home" className="flex items-center gap-2">
          <Image src="/assets/Logo.png" alt="" width={34} height={40} priority className="h-9 w-auto" />
          <span className="font-display text-2xl font-medium tracking-[0.04em] text-ink">FLUENCA</span>
        </Link>
        <Link
          href={PAGE_ROUTES.HOME}
          className="rounded-full px-4 py-2 font-body text-caption font-medium text-brand transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Back to home
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-360 flex-1 items-center gap-8 px-6 pb-12 pt-6 md:px-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:py-10">
        <section aria-labelledby="not-found-title" className="relative z-10 max-w-2xl">
          <p className="font-mono text-sm font-medium text-brand">ERROR / 404</p>
          <p aria-hidden="true" className="mt-3 font-display text-[6rem] leading-none font-semibold text-brand-100 sm:text-[8rem]">
            404
          </p>
          <h1 id="not-found-title" className="mt-3 font-display text-heading-2 font-semibold text-ink sm:text-heading-1">
            We couldn&apos;t find that page.
          </h1>
          <p className="mt-4 max-w-lg font-body text-body text-copy-muted">
            The link may be out of date, or the page may have moved. Let&apos;s get you back to your plan.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={PAGE_ROUTES.HOME}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 font-body text-caption font-medium text-white shadow-[0_3px_0_#bfc1ff] transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <House aria-hidden="true" className="size-4" />
              Go to FLUENCA
            </Link>
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-5 font-body text-caption font-medium text-ink transition-colors hover:border-brand hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Go back
            </button>
          </div>
        </section>

        <div className="mx-auto w-full max-w-135">
          <Image
            src="/assets/flowcircle.png"
            alt="FLUENCA agents coordinate research, planning, publishing, and analytics around one goal."
            width={640}
            height={640}
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </main>
      </div>
  );
}
