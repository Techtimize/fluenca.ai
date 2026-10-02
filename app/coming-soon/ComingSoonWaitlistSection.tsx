"use client";

import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { Input } from "@/components/ui/input";
import {
  joinWaitlistSchema,
  type JoinWaitlistFormValues,
} from "@/types/joinWaitlistSchema";
import { WaitlistMutation } from "@/routes/bussiness/Bussiness-Mutation";

import { fadeUp } from "./ComingSoonMotion";

const CONFETTI_COLORS = ["#4D5EFF", "#6560F2", "#3E5DFF", "#94FFFA", "#ffffff"];

type ComingSoonWaitlistSectionProps = {
  appearance?: string;
};

export function ComingSoonWaitlistSection(
  _props: ComingSoonWaitlistSectionProps = {},
): ReactElement {
  const t = useTranslations("comingSoon");
  const confettiRef = useRef<ConfettiRef>(null);
  const [mounted, setMounted] = useState(false);
  const { mutate: waitlistMutation, isPending: waitlistIsPending } =
    WaitlistMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JoinWaitlistFormValues>({
    resolver: zodResolver(joinWaitlistSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const fireWaitlistConfetti = async () => {
    const options = [
      {
        particleCount: 140,
        spread: 90,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.55 },
        colors: CONFETTI_COLORS,
      },
      {
        particleCount: 70,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: CONFETTI_COLORS,
      },
      {
        particleCount: 70,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: CONFETTI_COLORS,
      },
    ] as const;

    const fire = confettiRef.current?.fire;
    if (fire) {
      for (const opts of options) {
        void fire(opts);
      }
      return;
    }

    const mod = await import("canvas-confetti");
    const confetti = mod.default;
    if (typeof confetti !== "function") return;
    for (const opts of options) {
      void confetti({ ...opts, zIndex: 10000 });
    }
  };

  const onSubmit = (values: JoinWaitlistFormValues) => {
    waitlistMutation(values.email, {
      onSuccess: () => {
        void fireWaitlistConfetti();
        reset();
      },
    });
  };

  return (
    <>
      {mounted
        ? createPortal(
            <Confetti
              ref={confettiRef}
              manualstart
              className="pointer-events-none fixed inset-0 z-[10000] h-screen w-screen"
            />,
            document.body,
          )
        : null}

      <motion.div {...fadeUp(0.74)} className="mt-10 w-full max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
          noValidate
        >
          <div className="flex w-full flex-col gap-2 rounded-xl border border-white/15 bg-[#00051E]/70 p-1.5 transition-colors focus-within:border-primary/50 sm:flex-row sm:items-center">
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-label={t("emailPlaceholder")}
              placeholder={t("emailPlaceholder")}
              aria-invalid={Boolean(errors.email)}
              dir="ltr"
              className="coming-soon-email-input min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-left text-sm shadow-none scheme-dark focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
              style={{
                color: "#fff",
                WebkitTextFillColor: "#fff",
                caretColor: "#fff",
              }}
              {...register("email")}
            />
            <Button
              type="submit"
              disabled={waitlistIsPending}
              className="h-11 shrink-0 cursor-pointer rounded-full bg-white px-5 text-sm font-semibold whitespace-normal text-black hover:bg-white/90 disabled:cursor-not-allowed sm:h-10 sm:px-6"
            >
              {waitlistIsPending ? t("submitting") : t("submit")}
            </Button>
          </div>

          {errors.email?.message ? (
            <p
              role="alert"
              className="mt-2 text-left text-xs text-destructive sm:text-sm"
            >
              {errors.email.message}
            </p>
          ) : null}
        </form>
      </motion.div>
    </>
  );
}
