"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EmailCapture } from "@/components/EmailCapture";
import { track } from "@/lib/analytics";

const DISMISS_KEY = "lk_exit_dismissed_v1"; // timestamp; re-arms after 30 days
const DONE_KEY = "lk_exit_signed_up_v1"; // permanent
const REARM_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Exit-intent email capture. Armed only on content pages (guides, tools,
 * laws, reports), desktop pointer-leave at the top of the viewport, at most
 * once per 30 days, never again after a signup or on the same visit.
 * Deliberately gentle: small card, obvious dismiss, no scroll-jacking.
 */
export function ExitIntentCapture() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  const armed =
    /^\/(guides|tools|laws|reports)(\/|$)/.test(pathname ?? "") &&
    !/\/embed(\/|$)/.test(pathname ?? "");

  useEffect(() => {
    if (!armed || show) return;
    try {
      if (localStorage.getItem(DONE_KEY)) return;
      const dismissed = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (dismissed && Date.now() - dismissed < REARM_MS) return;
    } catch {
      return; // storage blocked — skip rather than risk nagging every visit
    }
    let fired = false;
    const onLeave = (e: MouseEvent) => {
      if (fired || e.clientY > 8 || e.relatedTarget) return;
      fired = true;
      setShow(true);
      track("exit_intent_shown", { path: pathname ?? "" });
    };
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => document.documentElement.removeEventListener("mouseleave", onLeave);
  }, [armed, show, pathname]);

  if (!show) return null;

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setShow(false);
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px]">
      <div className="rounded-card border border-line bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">
            Before you go — the free Tax Prep Checklist
          </h2>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="rounded p-1 text-ink/45 hover:bg-paper-2 hover:text-ink"
          >
            ✕
          </button>
        </div>
        <p className="mt-1 mb-3 text-sm text-ink/65">
          The deductions, depreciation items, and January deadlines small
          landlords miss — one page, instant download.
        </p>
        <EmailCapture source="exit-intent" />
      </div>
    </div>
  );
}
