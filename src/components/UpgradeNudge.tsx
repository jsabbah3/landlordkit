"use client";

import Link from "next/link";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";

/**
 * Contextual upgrade prompt. Shown at NATURAL moments (after a document is
 * generated, when info is re-entered) — never as a blocking paywall. Mounting
 * it fires `upgrade_prompt_shown`; clicking fires `upgrade_clicked`, so the
 * free->Pro funnel is measurable.
 */
export function UpgradeNudge({
  reason,
  feature,
}: {
  reason: string;
  feature: string;
}) {
  useEffect(() => {
    track("upgrade_prompt_shown", { feature });
  }, [feature]);

  return (
    <div className="rounded-lg border border-accent-400 bg-accent-400/10 p-4">
      <p className="text-sm text-ink">
        <span className="font-semibold">LandlordKit Pro · </span>
        {reason}
      </p>
      <Link
        href="/pricing"
        onClick={() => track("upgrade_clicked", { feature })}
        className="mt-2 inline-block text-sm font-semibold text-brand-700 underline underline-offset-2"
      >
        See Pro — ${SITE.proMonthly}/mo →
      </Link>
    </div>
  );
}
