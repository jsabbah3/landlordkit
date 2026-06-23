"use client";

import Link from "next/link";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { useProStatus } from "@/lib/useProStatus";
import { SITE } from "@/lib/site";

/**
 * Contextual upgrade prompt. Shown at NATURAL moments (after a document is
 * generated, when info is re-entered) — never as a blocking paywall. Mounting
 * it fires `upgrade_prompt_shown`; clicking fires `upgrade_clicked`, so the
 * free->Pro funnel is measurable.
 *
 * Never shown to existing Pro members — they've already upgraded, so nagging
 * them to "Go Pro" is just noise.
 */
export function UpgradeNudge({
  reason,
  feature,
}: {
  reason: string;
  feature: string;
}) {
  const { isPro, loading } = useProStatus();

  useEffect(() => {
    if (!loading && !isPro) track("upgrade_prompt_shown", { feature });
  }, [feature, isPro, loading]);

  // Hide for Pro members (and during the status check, to avoid a flash).
  if (loading || isPro) return null;

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
